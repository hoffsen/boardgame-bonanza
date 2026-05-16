import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { EventRow } from '../types/db';

export function useEvents(sessionId: string, type?: string): EventRow[] {
  const [events, setEvents] = useState<EventRow[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function snapshot() {
      let query = supabase
        .from('events')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false })
        .limit(50);
      if (type) query = query.eq('type', type);
      const { data } = await query;
      if (!cancelled && data) setEvents(data as EventRow[]);
    }

    void snapshot();

    const channel = supabase
      .channel(`events:${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'events',
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          const row = payload.new as EventRow;
          if (type && row.type !== type) return;
          setEvents((prev) => (prev.some((e) => e.id === row.id) ? prev : [row, ...prev]));
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      void supabase.removeChannel(channel);
    };
  }, [sessionId, type]);

  return events;
}
