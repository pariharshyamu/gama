type Listener<T> = (payload: T) => void;

/**
 * A tiny typed event emitter. `on` returns an unsubscribe function.
 *
 * ```ts
 * interface DoorEvents extends Record<string, unknown> { opened: GameObject }
 * const events = new EventEmitter<DoorEvents>();
 * const off = events.on('opened', (who) => ...);
 * ```
 */
export class EventEmitter<Events extends Record<string, unknown> = Record<string, unknown>> {
  private listeners = new Map<string, Set<Listener<never>>>();

  on<K extends keyof Events & string>(event: K, listener: Listener<Events[K]>): () => void {
    let set = this.listeners.get(event);
    if (!set) {
      set = new Set();
      this.listeners.set(event, set);
    }
    set.add(listener as Listener<never>);
    return () => this.off(event, listener);
  }

  once<K extends keyof Events & string>(event: K, listener: Listener<Events[K]>): () => void {
    const off = this.on(event, (payload) => {
      off();
      listener(payload);
    });
    return off;
  }

  off<K extends keyof Events & string>(event: K, listener: Listener<Events[K]>): void {
    this.listeners.get(event)?.delete(listener as Listener<never>);
  }

  emit<K extends keyof Events & string>(event: K, payload: Events[K]): void {
    const set = this.listeners.get(event);
    if (!set) return;
    for (const listener of [...set]) (listener as Listener<Events[K]>)(payload);
  }

  clear(): void {
    this.listeners.clear();
  }
}
