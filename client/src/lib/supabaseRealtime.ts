import { getSupabaseClient } from './supabaseClient';
import type { RealtimeChannel } from '@supabase/supabase-js';

export function subscribeToChannel(
  channel: string,
  onInsert?: (payload: any) => void,
  onUpdate?: (payload: any) => void,
  onDelete?: (payload: any) => void
): RealtimeChannel | null {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  
  const subscription = supabase
    .channel(channel)
    .on('postgres_changes', { event: 'INSERT', schema: 'public' }, (payload) => {
      if (onInsert) onInsert(payload);
    })
    .on('postgres_changes', { event: 'UPDATE', schema: 'public' }, (payload) => {
      if (onUpdate) onUpdate(payload);
    })
    .on('postgres_changes', { event: 'DELETE', schema: 'public' }, (payload) => {
      if (onDelete) onDelete(payload);
    })
    .subscribe();
  
  return subscription;
}

export function unsubscribeFromChannel(channel: RealtimeChannel) {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  
  supabase.removeChannel(channel);
}
