import { supabase } from './supabase';
import type { SessionRow, PlayerRow, TakeTurnResult, Theme, DealMode, TurnOutcome } from '../types/db';

export async function createSession(deviceId: string, hostName: string): Promise<string> {
  const { data, error } = await supabase.rpc('create_session', {
    p_device_id: deviceId,
    p_host_name: hostName,
  });
  if (error) throw error;
  return data as string;
}

export async function joinSession(
  sessionId: string,
  deviceId: string,
  name: string
): Promise<PlayerRow> {
  const { data, error } = await supabase.rpc('join_session', {
    p_session_id: sessionId,
    p_device_id: deviceId,
    p_name: name,
  });
  if (error) throw error;
  return data as PlayerRow;
}

export async function fetchSession(sessionId: string): Promise<SessionRow> {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', sessionId)
    .single();
  if (error) throw error;
  return data as SessionRow;
}

export async function fetchPlayer(
  sessionId: string,
  deviceId: string
): Promise<PlayerRow | null> {
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .eq('session_id', sessionId)
    .eq('device_id', deviceId)
    .maybeSingle();
  if (error) throw error;
  return (data as PlayerRow | null) ?? null;
}

export async function startGame(sessionId: string, deviceId: string): Promise<void> {
  const { error } = await supabase.rpc('start_game', {
    p_session_id: sessionId,
    p_device_id: deviceId,
  });
  if (error) throw error;
}

export async function takeTurn(
  sessionId: string,
  deviceId: string
): Promise<TakeTurnResult> {
  const { data, error } = await supabase.rpc('take_turn', {
    p_session_id: sessionId,
    p_device_id: deviceId,
  });
  if (error) throw error;
  return data as TakeTurnResult;
}

export async function finishTurn(
  sessionId: string,
  deviceId: string,
  outcome: TurnOutcome
): Promise<void> {
  const { error } = await supabase.rpc('finish_turn', {
    p_session_id: sessionId,
    p_device_id: deviceId,
    p_outcome: outcome,
  });
  if (error) throw error;
}

export async function hostForceAdvance(
  sessionId: string,
  deviceId: string
): Promise<void> {
  const { error } = await supabase.rpc('host_force_advance', {
    p_session_id: sessionId,
    p_device_id: deviceId,
  });
  if (error) throw error;
}

export async function setDice(
  sessionId: string,
  deviceId: string,
  sides: number
): Promise<void> {
  const { error } = await supabase.rpc('set_dice', {
    p_session_id: sessionId,
    p_device_id: deviceId,
    p_sides: sides,
  });
  if (error) throw error;
}

export async function setTheme(
  sessionId: string,
  deviceId: string,
  theme: Theme
): Promise<void> {
  const { error } = await supabase.rpc('set_theme', {
    p_session_id: sessionId,
    p_device_id: deviceId,
    p_theme: theme,
  });
  if (error) throw error;
}

export async function setDealMode(
  sessionId: string,
  deviceId: string,
  mode: DealMode
): Promise<void> {
  const { error } = await supabase.rpc('set_deal_mode', {
    p_session_id: sessionId,
    p_device_id: deviceId,
    p_mode: mode,
  });
  if (error) throw error;
}

export async function randomizeTurns(
  sessionId: string,
  deviceId: string
): Promise<void> {
  const { error } = await supabase.rpc('randomize_turns', {
    p_session_id: sessionId,
    p_device_id: deviceId,
  });
  if (error) throw error;
}

export async function endSession(sessionId: string): Promise<void> {
  const { error } = await supabase
    .from('sessions')
    .update({ phase: 'ended' })
    .eq('id', sessionId)
    .in('phase', ['lobby', 'playing']);
  if (error) throw error;
}
