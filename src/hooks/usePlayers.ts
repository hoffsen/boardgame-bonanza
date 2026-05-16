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
          event: '*',
          schema: 'public',
          table: 'players',
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const row = payload.new as PlayerRow;
            setPlayers((prev) => (prev.some((p) => p.id === row.id) ? prev : [...prev, row]));
          } else if (payload.eventType === 'UPDATE') {
            const row = payload.new as PlayerRow;
            setPlayers((prev) => prev.map((p) => (p.id === row.id ? row : p)));
          } else if (payload.eventType === 'DELETE') {
            const oldRow = payload.old as { id?: string };
            setPlayers((prev) => prev.filter((p) => p.id !== oldRow.id));
          }
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
