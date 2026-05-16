import { supabase } from './supabase';
import type { SessionRow, PlayerRow, DiceRollPayload } from '../types/db';

export type Role = 'host' | 'player';

export type SessionContext = {
  session: SessionRow;
  role: Role;
};

function isUniqueViolation(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    (err as { code: string }).code === '23505'
  );
}

async function fetchActiveSession(boardId: string): Promise<SessionRow | null> {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('board_id', boardId)
    .eq('status', 'active')
    .maybeSingle();
  if (error) throw error;
  return (data as SessionRow | null) ?? null;
}

async function expireStale(boardId: string): Promise<void> {
  await supabase
    .from('sessions')
    .update({ status: 'expired' })
    .eq('board_id', boardId)
    .eq('status', 'active')
    .lt('expires_at', new Date().toISOString());
}

export async function createOrJoinSession(
  boardId: string,
  deviceId: string
): Promise<SessionContext> {
  let existing = await fetchActiveSession(boardId);

  if (existing && new Date(existing.expires_at).getTime() < Date.now()) {
    await expireStale(boardId);
    existing = null;
  }

  if (existing) {
    return {
      session: existing,
      role: existing.host_device_id === deviceId ? 'host' : 'player',
    };
  }

  const insert = await supabase
    .from('sessions')
    .insert({ board_id: boardId, host_device_id: deviceId })
    .select()
    .single();

  if (insert.data) {
    return { session: insert.data as SessionRow, role: 'host' };
  }

  if (isUniqueViolation(insert.error)) {
    const winner = await fetchActiveSession(boardId);
    if (!winner) throw new Error('Race resolved but no active session found');
    return {
      session: winner,
      role: winner.host_device_id === deviceId ? 'host' : 'player',
    };
  }

  throw insert.error;
}

export async function joinAsPlayer(
  sessionId: string,
  deviceId: string,
  name: string
): Promise<PlayerRow> {
  const { data, error } = await supabase
    .from('players')
    .upsert(
      { session_id: sessionId, device_id: deviceId, name },
      { onConflict: 'session_id,device_id' }
    )
    .select()
    .single();
  if (error) throw error;
  return data as PlayerRow;
}

export async function rollDice(
  sessionId: string,
  deviceId: string,
  playerName: string,
  sides = 6
): Promise<void> {
  const value = Math.floor(Math.random() * sides) + 1;
  const payload: DiceRollPayload = { device_id: deviceId, player_name: playerName, sides, value };
  const { error } = await supabase.from('events').insert({
    session_id: sessionId,
    type: 'dice_roll',
    payload,
  });
  if (error) throw error;
}

export async function endSession(sessionId: string): Promise<void> {
  const { error } = await supabase
    .from('sessions')
    .update({ status: 'ended' })
    .eq('id', sessionId)
    .eq('status', 'active');
  if (error) throw error;
}
