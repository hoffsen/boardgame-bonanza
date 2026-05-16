export type SessionRow = {
  id: string;
  board_id: string;
  host_device_id: string;
  status: 'active' | 'ended' | 'expired';
  created_at: string;
  expires_at: string;
};

export type PlayerRow = {
  id: string;
  session_id: string;
  name: string;
  device_id: string;
  joined_at: string;
};

export type EventRow = {
  id: string;
  session_id: string;
  type: string;
  payload: Record<string, unknown>;
  created_at: string;
};

export type DiceRollPayload = {
  device_id: string;
  player_name: string;
  sides: number;
  value: number;
};
