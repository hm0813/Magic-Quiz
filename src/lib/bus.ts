// Tiny pub/sub. Import { emit, on } anywhere.
export type Handler<T = any> = (payload: T) => void;

const channels = new Map<string, Set<Handler>>();

export function on<T = any>(evt: string, fn: Handler<T>) {
  if (!channels.has(evt)) channels.set(evt, new Set());
  channels.get(evt)!.add(fn);
  return () => off(evt, fn);
}

export function off<T = any>(evt: string, fn: Handler<T>) {
  channels.get(evt)?.delete(fn);
}

export function emit<T = any>(evt: string, payload?: T) {
  channels.get(evt)?.forEach((fn) => {
    try { fn(payload as T); } catch {}
  });
}

/*
Emits we use:

emit('answer:correct', { category?: string, index?: number })
emit('answer:wrong',   { category?: string, index?: number })
emit('spell:used',     { type: 'accio'|'expelliarmus'|'lumos'|'patronus'|'patronus-triggered' })
emit('horcrux:partComplete', { ok: boolean, partIndex: number })
emit('achievement:unlock', { id: string })
*/
