import type { Condition, DialogueValue, Effect, Vars } from './conditions';

/**
 * Bump when the shape changes in a way an old file cannot survive, and add a
 * migration. Same contract as `LEVEL_VERSION`: a conversation somebody wrote is
 * work, and work is migrated rather than refused.
 */
export const DIALOGUE_VERSION = 1;

/** One thing said, and what can be said back. */
export interface DialogueNode {
  /**
   * Who is talking. A key, not a display name — the caller maps it to a
   * portrait, a voice, an ANIMA rig to point a `LookAt` at. Omitted for
   * narration.
   */
  speaker?: string;
  text: string;
  /** Effects applied on ENTERING this line. */
  do?: Effect[];
  /** Where to go with no choice offered. Omitted and choice-less ends the talk. */
  to?: string;
  choices?: DialogueChoice[];
  /** Free-form label for the caller: an emotion, a camera, a sound cue. */
  tag?: string;
}

export interface DialogueChoice {
  text: string;
  /** Where taking it leads. Omitted ends the conversation — a walk-away. */
  to?: string;
  /** When absent, always offered. */
  if?: Condition;
  /** Effects applied when TAKEN, before the destination's own. */
  do?: Effect[];
  /**
   * Show it greyed rather than hiding it when `if` fails.
   *
   * Not cosmetic. A hidden choice keeps a secret; a locked one teaches — "[You
   * need the seal]" tells the player what to go and get. Both are wanted, and
   * a system offering only one of them forces authors to fake the other.
   */
  locked?: boolean;
  tag?: string;
}

export interface DialogueScript {
  version: number;
  /** The node the conversation opens on. */
  start: string;
  nodes: Record<string, DialogueNode>;
  /**
   * Starting values, and — just as importantly — the DECLARED set.
   *
   * A variable read but never declared and never written is almost always a
   * typo, and the linter says so. Declaring `{ coins: 0 }` is how you tell it
   * the name is deliberate.
   */
  vars?: Vars;
  meta?: Record<string, unknown>;
}

export interface ParseOptions {
  /** From-version → transform, exactly like `Level`'s. */
  migrations?: Record<number, (data: DialogueScript) => DialogueScript>;
}

/**
 * Identity, with types.
 *
 * There is no runtime work here on purpose — it exists so a script written
 * inline is checked by TypeScript at the point of authorship rather than at
 * the point of use, and so the export list has an obvious front door.
 */
export function defineDialogue(script: DialogueScript): DialogueScript {
  return script;
}

/**
 * Read a script from parsed JSON: check the marker, migrate, and refuse the
 * shapes that cannot work.
 *
 * The refusals are deliberately few. Everything else a script can get wrong —
 * a dangling link, an unreachable line, a stranding choice list — is reported
 * by `lintDialogue`, which returns a LIST rather than throwing on the first
 * one. A parser that dies on problem one makes you fix a hundred problems in a
 * hundred runs.
 */
export function parseDialogue(input: unknown, options: ParseOptions = {}): DialogueScript {
  if (typeof input !== 'object' || input === null) {
    throw new Error('parseDialogue: expected an object');
  }
  const data = input as Partial<DialogueScript>;
  const version = typeof data.version === 'number' ? data.version : 0;
  if (version > DIALOGUE_VERSION) {
    throw new Error(
      `parseDialogue: script is version ${version}, this build understands ${DIALOGUE_VERSION}`
    );
  }
  let migrated = data as DialogueScript;
  let at = version;
  while (at < DIALOGUE_VERSION) {
    const step = options.migrations?.[at];
    if (!step) throw new Error(`parseDialogue: no migration from version ${at}`);
    migrated = step(migrated);
    at += 1;
  }
  if (typeof migrated.start !== 'string' || !migrated.start) {
    throw new Error('parseDialogue: `start` must name a node');
  }
  if (typeof migrated.nodes !== 'object' || migrated.nodes === null) {
    throw new Error('parseDialogue: `nodes` must be an object');
  }
  if (!migrated.nodes[migrated.start]) {
    throw new Error(`parseDialogue: start node "${migrated.start}" is not in \`nodes\``);
  }
  return { ...migrated, version: DIALOGUE_VERSION };
}

export type { Condition, DialogueValue, Effect, Vars };
