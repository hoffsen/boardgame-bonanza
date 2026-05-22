export type Phase = 'lobby' | 'playing' | 'finished' | 'ended' | 'expired';
export type Theme = 'goofy' | 'spicy' | 'heavy';
export const THEMES: Theme[] = ['goofy', 'spicy', 'heavy'];
export type DealMode = 'fixed' | 'random';
export const DEAL_MODES: DealMode[] = ['fixed', 'random'];

export type SessionRow = {
  id: string;
  host_device_id: string;
  phase: Phase;
  theme: Theme;
  deal_mode: DealMode;
  current_player_id: string | null;
  winner_player_id: string | null;
  dice_sides: number;
  last_turn: LastTurn | null;
  created_at: string;
  expires_at: string;
};

export type PlayerRow = {
  id: string;
  session_id: string;
  name: string;
  device_id: string;
  position: number;
  turn_order: number | null;
  joined_at: string;
  finished_at: string | null;
  skip_next_turn: boolean;
};

export type TurnOutcome = 'did_it' | 'skip';

export type ChallengeCard = {
  prompt: string;
  space: number;
  move_back: number;
  kind: 'standard' | 'dojo';
  opponent_id: string | null;
  opponent_name: string | null;
  inspiration_category: string | null;
};

export type LastTurn = {
  by_player_id: string;
  by_player_name: string;
  roll: number;
  cards: ChallengeCard[];
  new_position: number;
  outcome: 'continue' | 'win';
  drawn_inspiration: string | null;
};

export type TakeTurnResult = {
  roll: number;
  cards: ChallengeCard[];
  new_position: number;
  outcome: 'continue' | 'win';
};
