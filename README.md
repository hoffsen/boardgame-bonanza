# boardgame-bonanza

A realtime web companion for an 18+ board / drinking game. Players visit a
shared URL on their phones, roll dice on their turn, and a random challenge
card is revealed for the space they land on. Includes head-to-head "Fight
Dojo" cards, ranked finish placements, and a skip-with-penalty mechanic.

**Live**: <https://hoffsen.github.io/boardgame-bonanza/>

---

## How to play

### Starting a game

1. Open the home URL on any device.
2. Enter a display name (stored in `localStorage` so you don't re-type it).
3. Tap **New game**. You land on `/s/<sessionId>` — that's the lobby URL.
4. Share that URL (copy button in the lobby) so the rest of the table can
   join. Everyone joins by opening the link and picking a name.

Rate limit: **3 active sessions per hour per device** to keep the free-tier
Supabase project healthy.

### The lobby

Anyone can change these settings; they propagate in realtime:

- **Theme**: `Goofy` (silly party prompts), `Spicy` (dares, embarrassing
  stories), or `Heavy` (drink-focused).
- **Card mode**:
  - *Same card per space* — 40 cards are dealt to the 40 spaces at game
    start. Whoever lands on space 7 gets the same card every time.
  - *Random every roll* — fresh random card from the theme on every
    landing.
- **Dice**: any die between d2 and d24. Anyone can change it, even
  mid-game.

Host-only:

- **Randomize turn order**: shuffles `players.turn_order`. Tapping it a
  second time after a shuffle requires an explicit confirm (an inline
  "tap again to confirm" state) so you don't accidentally reroll your
  table mid-discussion.
- **Start game**: locks in the theme/mode/dice/turn order and flips the
  phase to `playing`.
- **End session**: kills the session for everyone.

### The game

Each turn:

1. The active player taps **Roll d{N}**.
2. Their position advances by the rolled value.
3. The card on the space they landed on is revealed to everyone, with
   a clear "roll value" header so it's obvious what came from the dice
   vs. what came from the card.
4. If the card has a `move_back` value (e.g. *"You took a wrong turn,
   move back 3"*), the player is sent back and the new space's card is
   also revealed. Up to **3 hops** per turn (no infinite loops).
5. The active player now sees two buttons:
   - **Did it** — turn advances.
   - **Nope — drink penalty (lose next turn)** — turn advances AND the
     player's `skip_next_turn` flag is set. Next time it would be their
     turn, the rotation passes over them silently.

### Fight Dojo

Each game has between **3 and 8** dojo cards mixed in. When a player lands
on a dojo card:

- The server picks a **random opponent** from the other active (not
  finished) players.
- The card renders with a distinct red-rose treatment and the headline
  becomes "**You vs Them**" instead of "Landed on space N".
- The prompt describes the duel ("Staring contest. First to blink takes
  2 sips.") and is its own resolution — no extra winner tracking, no
  position changes.

In *Random every roll* mode, dojo cards appear at their natural ratio in
the theme pool.

### Winning

- Cross space **41** to win (positions are clamped at 1 so move-back
  cards near the start can't dump you off the board).
- The first player to win is recorded as `winner_player_id`, **but the
  game doesn't end**. Everyone else keeps playing for 2nd, 3rd, etc.
- Finished players are removed from the rotation automatically.
- The game ends when only **one unfinished player** remains; they get
  *"didn't finish"* in the final leaderboard.
- The Finished screen shows the full ranked leaderboard plus a
  **New game** button.

### Late joiners

Joining a URL while the game is `playing` is allowed:

- You're added as a real player with `turn_order = max + 1` (you go
  last in the rotation).
- Your starting position is the **median** of currently-unfinished
  players (handicap so you have a real shot at not coming last).
- If the session is already `finished`, `ended`, or `expired`, joining
  is refused.

### Reconnecting

Closing the tab and coming back works — your `device_id` is stored in
`localStorage`, so you re-attach to your existing player row. If it's
your turn when you come back, the game just resumes there. The game
**does not** auto-skip absent players; this is intentional.

---

## Stack

- **Vite + React + TypeScript** (strict mode, `noUncheckedIndexedAccess`).
- **Tailwind CSS**, no component libraries.
- **React Router** with `HashRouter` (for GitHub Pages SPA routing).
- **Supabase**: Postgres + Realtime + Row-Level Security + plpgsql
  RPCs on the free tier.
- **GitHub Pages** for hosting, deployed via Actions workflow.

No backend code — everything not in the browser lives as Postgres
functions in Supabase.

---

## Architecture

### Identity model

No accounts. Each browser generates a UUID on first visit, stored as
`bgb.device_id` in `localStorage`. Every API call takes the
`device_id` as an explicit parameter; RPCs verify the caller's
identity by matching against the row they're trying to act on
(host, current player, etc.).

This is **trust-the-client** at the boundary — someone can fake a
`device_id` if they really want to grief a session. The mitigation
is that all state-mutating actions go through `security definer`
RPCs rather than direct table writes, which limits what a malicious
client can do.

### Schema (in Supabase, not committed)

```
sessions
  id uuid pk
  host_device_id text
  phase            text  -- lobby | playing | finished | ended | expired
  theme            text  -- goofy | spicy | heavy
  deal_mode        text  -- fixed | random
  current_player_id uuid -> players.id
  winner_player_id  uuid -> players.id
  dice_sides       smallint (2..24)
  last_turn        jsonb   -- snapshot of the latest roll for all clients
  created_at, expires_at  timestamptz

players
  id uuid pk
  session_id uuid -> sessions.id
  name        text
  device_id   text
  position    smallint (0..41)
  turn_order  smallint  -- null = spectator
  joined_at, finished_at  timestamptz
  skip_next_turn boolean

challenges
  id uuid pk
  prompt    text
  move_back smallint (0..10)
  theme     text  -- goofy | spicy | heavy
  kind      text  -- standard | dojo

session_spaces
  session_id, space_number (1..40), challenge_id  -- the per-game deal
```

### State-mutating RPCs

All `security definer`, `granted to anon`, validate the caller's
device_id against the relevant row:

- `create_session(device_id, name)` — atomic session + host-player
  insert. Rate-limited to 3 / hour / device.
- `join_session(session_id, device_id, name)` — lobby join, or
  late-join with handicap (turn_order = max+1, position = median).
- `set_theme(session_id, device_id, theme)` — lobby only.
- `set_deal_mode(session_id, device_id, mode)` — lobby only.
- `set_dice(session_id, device_id, sides)` — anytime, 2..24.
- `randomize_turns(session_id, device_id)` — host only, lobby only.
- `start_game(session_id, device_id)` — host only. Reserves
  3..8 (random) spaces for dojo cards in `fixed` mode, deals the rest
  from `standard` cards in the chosen theme, assigns turn_order if
  none has been set.
- `take_turn(session_id, device_id)` — server rolls the die, walks
  up to 3 move-back hops, picks dojo opponents, writes the result
  to `sessions.last_turn` (so every client sees the same reveal),
  updates the rolling player's position. Does **not** advance the
  turn — that waits for `finish_turn`. Auto-advances on win.
- `finish_turn(session_id, device_id, outcome)` — advances
  `current_player_id` to the next non-finished player, consuming
  any `skip_next_turn` flags along the way. Outcome `'skip'` sets
  the caller's own `skip_next_turn = true`.

The "turn pending" state isn't a separate column; it's derived from
`sessions.last_turn.by_player_id === sessions.current_player_id`.
When that's true, the active player sees Did it/Skip buttons. After
`finish_turn`, `current_player_id` moves on and the condition is
false again.

### Realtime

Two channels per session, both via `postgres_changes`:

- `session:{id}` — UPDATE on `sessions` (phase, current_player_id,
  last_turn, theme, dice, etc.).
- `players:{id}` — `*` on `players` (insert, update, delete) so
  position changes and rank badges update everywhere.

`session_spaces` and `challenges` are immutable per session, so
they're never subscribed — `take_turn` already returns whatever
the client needs in its jsonb response.

Hooks (`useSession`, `usePlayers`) do a one-shot fetch on mount,
then merge realtime deltas. Reconnects are handled by the
Supabase client; on resubscribe we don't re-snapshot because the
deltas we missed during the gap are usually trivial state updates
that the next `take_turn` UPDATE will overwrite anyway.

### Phase routing

`SessionView` is a phase router:

- `lobby` → `<Lobby>` (pickers + share link + start)
- `playing` → `<Game>` (position track, turn banner, roll/actions,
  card chain)
- `finished | ended | expired` → `<Finished>` (leaderboard + new
  game)

Each phase owns its layout; state lives in hooks higher up.

---

## Setup

This repo is the front-end only. The Supabase schema is applied
manually via the SQL editor (intentionally not in the repo for
this public-repo POC). Slice-by-slice migration SQL lives in the
project's chat history during development.

1. Create a Supabase project, grab the URL + anon key.
2. Apply the schema SQL (latest dev snapshot, ask if you need it).
3. `cp .env.example .env` and fill in:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. `npm install`
5. `npm run dev` → `http://localhost:5173/#/`

## Deploy

Push to `main`. The GitHub Actions workflow builds and publishes to
Pages. Required repo secrets:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Page source must be set to **GitHub Actions** under repo
Settings → Pages (not "Deploy from a branch" — the built artifact
only lives in the Actions upload).

## Known gaps

- **Trust-the-client** identity. An attacker who knows the URL
  could end a session, change the theme mid-lobby, etc. Acceptable
  for a single-table party game. Real fix needs auth.
- **Player who closes their tab on their turn parks the game**
  until they reopen it. Intentional per product call ("it'll
  happen all the time, picking up where they left off is the
  right behavior"). A host-skip-current-player would unblock if
  the player never returns.
- **No content authoring UI yet.** Adding new challenges or
  themes means running SQL inserts directly. Slice candidate.
- **Expired sessions are not GC'd.** `expires_at` is set 6h after
  creation but nothing flips them to `'expired'` automatically.
  A scheduled `pg_cron` job is the obvious fix.
