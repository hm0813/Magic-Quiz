// super tiny pub/sub for decoupling UI effects & achievements
export type Handler<T = any> = (payload: T) => void;

const channels = new Map<string, Set<Handler>>();

export function on<T = any>(evt: string, fn: Handler<T>) {
  if (!channels.has(evt)) channels.set(evt, new Set());
  channels.get(evt)!.add(fn as Handler);
  return () => off(evt, fn);
}

export function off<T = any>(evt: string, fn: Handler<T>) {
  channels.get(evt)?.delete(fn as Handler);
}

export function emit<T = any>(evt: string, payload?: T) {
  channels.get(evt)?.forEach((fn) => {
    try { fn(payload as T); } catch {}
  });
}

// common events we’ll use:
// 'answer:correct'  { category, index }
// 'answer:wrong'    { category, index }
// 'spell:used'      { type: 'accio'|'expelliarmus'|'lumos'|'patronus' }
// 'horcrux:part'    { partIndex, total }
// 'horcrux:destroy' { id }
// 'achievement:unlock' { id }
