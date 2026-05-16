import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { PlayerRow } from '../types/db';

export function usePlayers(sessionId: string): PlayerRow[] {
  const [players, setPlayers] = useState<PlayerRow[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function snapshot() {
      const { data } = await supabase
        .from('players')
        .select('*')
        .eq('session_id', sessionId)
        .order('joined_at', { ascending: true });
      if (!cancelled && data) setPlayers(data as PlayerRow[]);
    }

    void snapshot();

    const channel = supabase
      .channel(`players:${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'players',
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          const row = payload.new as PlayerRow;
          setPlayers((prev) => (prev.some((p) => p.id === row.id) ? prev : [...prev, row]));
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      void supabase.removeChannel(channel);
    };
  }, [sessionId]);

  return players;
}
