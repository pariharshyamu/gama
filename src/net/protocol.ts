/**
 * The wire.
 *
 * ## What a state is
 *
 * `Record<string, number>` — positions, angles, speeds, health. That is a
 * real restriction and it buys three things that matter more than
 * generality: numbers **interpolate** (so a client can render between two
 * snapshots), they **compare** cheaply (so a delta is a one-line diff), and
 * they **quantise** (so a wire format can shrink them). Anything that is not
 * a number — a name, a skin, a team — goes in `meta`, which is sent when it
 * changes and never interpolated.
 *
 * Every game that tries to send arbitrary JSON per entity per tick arrives
 * at this restriction eventually, usually after writing a custom
 * interpolator for each field.
 *
 * ## Why JSON
 *
 * Because it is debuggable, and because the honest bottleneck for a small
 * game is round trips, not bytes. `Codec` is the hook for when that stops
 * being true: swap in a binary encoder and nothing above the transport
 * changes. The demo prints the byte count so the claim can be checked
 * rather than believed.
 */

export const NET_PROTOCOL = 1;

/** Numbers only — see the note above. */
export type NetState = Record<string, number>;

export interface NetEntitySnapshot {
  id: string;
  /** The client whose input drives this entity, if any. */
  owner?: string;
  state: NetState;
  meta?: Record<string, unknown>;
}

export type ClientMessage =
  | { t: 'join'; v: number; name?: string }
  /** An input: sequence number, the payload, and the step it covers. */
  | { t: 'in'; s: number; dt: number; d: unknown }
  | { t: 'ping'; c: number };

export type ServerMessage =
  | { t: 'welcome'; v: number; id: string; tickRate: number; sendRate: number }
  | {
      t: 'snap';
      /** Server tick this snapshot was taken at. */
      k: number;
      /** Server time in seconds — what a client interpolates against. */
      time: number;
      /** The highest input sequence from THIS client that has been applied. */
      ack: number;
      /** Entities that changed since this client's last snapshot. */
      e: NetEntitySnapshot[];
      /** Entities that have gone away. */
      gone?: string[];
      /**
       * How many of this client's inputs the server still has buffered.
       *
       * The client steers its own send rate to keep this near 1–2. Zero
       * means the server ran dry and had to guess; a growing number means
       * the client is running ahead and adding input lag for nothing.
       */
      q?: number;
    }
  | { t: 'pong'; c: number; s: number }
  /** A one-off the game cares about: a goal, a hit, a chat line. */
  | { t: 'ev'; name: string; d?: unknown }
  | { t: 'bye'; why: string };

export interface Codec {
  encode(message: unknown): string;
  decode(data: string): unknown;
}

/** The default: readable on the wire, and one line to replace. */
export const jsonCodec: Codec = {
  encode: (message) => JSON.stringify(message),
  decode: (data) => JSON.parse(data),
};

/**
 * The game's movement rules, as a plain function.
 *
 * The SAME function runs on the server (authoritatively) and on the client
 * (to predict). That is the whole trick, and it is why this is a function
 * rather than a method on something: it has to be trivially shareable
 * between a server bundle and a client bundle, and trivially testable
 * without either.
 */
export type NetApply<I = unknown> = (
  state: NetState,
  input: I,
  dt: number,
  context: { id: string; owner?: string }
) => void;

/** Fields that differ, or null when nothing does. */
export function diffState(from: NetState | undefined, to: NetState): NetState | null {
  if (!from) return { ...to };
  let changed = false;
  const out: NetState = {};
  for (const key of Object.keys(to)) {
    if (from[key] !== to[key]) {
      out[key] = to[key];
      changed = true;
    }
  }
  // A field that DISAPPEARED is a change too, and a client that keeps the
  // stale value renders a ghost limb forever.
  for (const key of Object.keys(from)) {
    if (!(key in to)) changed = true;
  }
  return changed ? { ...to } : null;
}

/** Linear blend, per field. Missing fields hold their `from` value. */
export function blendState(from: NetState, to: NetState, t: number): NetState {
  const out: NetState = { ...from };
  for (const key of Object.keys(to)) {
    const a = from[key];
    const b = to[key];
    out[key] = typeof a === 'number' ? a + (b - a) * t : b;
  }
  return out;
}

/**
 * Blend an ANGLE field the short way round.
 *
 * Without this a character spinning past π takes the long route home, which
 * is the single most recognisable networking bug in a browser game.
 */
export function blendAngle(a: number, b: number, t: number): number {
  let delta = (b - a) % (Math.PI * 2);
  if (delta > Math.PI) delta -= Math.PI * 2;
  if (delta < -Math.PI) delta += Math.PI * 2;
  return a + delta * t;
}
