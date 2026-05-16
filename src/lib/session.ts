import { supabase } from './supabase';
import type { SessionRow, PlayerRow, TakeTurnResult } from '../types/db';

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

export async function endSession(sessionId: string): Promise<void> {
  const { error } = await supabase
    .from('sessions')
    .update({ phase: 'ended' })
    .eq('id', sessionId)
    .in('phase', ['lobby', 'playing']);
  if (error) throw error;
}
