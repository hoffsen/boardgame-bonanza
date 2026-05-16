import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { SessionRow } from '../types/db';

export function useSession(initial: SessionRow): SessionRow {
  const [session, setSession] = useState<SessionRow>(initial);

  useEffect(() => {
    setSession(initial);

    const channel = supabase
      .channel(`session:${initial.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'sessions',
          filter: `id=eq.${initial.id}`,
        },
        (payload) => setSession(payload.new as SessionRow)
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial.id]);

  return session;
}
