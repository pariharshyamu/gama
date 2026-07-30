import { apply, evaluate, type Predicates, type Vars } from './conditions';
import type { DialogueChoice, DialogueScript } from './script';

/**
 * Dialogue — a conversation as data, walked one line at a time.
 *
 * ```ts
 * const talk = new Dialogue(script, {
 *   vars: { hasParcel: true },
 *   onLine: (line) => hud.caption(`${line.speaker}: ${line.text}`),
 *   onEvent: (name) => name === 'delivered' && goals.advance('parcels'),
 * });
 * talk.start();
 * // …player picks option 1
 * talk.choose(1);
 * ```
 *
 * It renders nothing and knows about no other library. `line` says who speaks
 * and what they say; `choices` says what can be said back. Drawing that is the
 * caller's — `Hud`'s caption line, a DOM list, an ANIMA `Gesture` on the
 * speaker's rig. This is the same seam `Catalog` uses: the library owns the
 * structure, the game owns the presentation.
 *
 * Two things here that most dialogue systems lack, both because they were
 * cheap once the state was plain data:
 *
 * **It saves mid-conversation.** `toJSON()` is `{ at, vars, visited }`, so a
 * `SaveSlot` written while somebody is halfway through a negotiation restores
 * into the same line with the same flags.
 *
 * **It counts.** `counts` is exact integers — lines shown, choices taken,
 * events emitted — which makes a conversation testable as a walk rather than
 * as a screenshot, and gate-able the way the perf counters are.
 */
export interface DialogueLine {
  /** The node id, so a caller can key camera or portrait choices off it. */
  id: string;
  speaker?: string;
  text: string;
  tag?: string;
}

/** A choice as the player should see it — filtering already applied. */
export interface PresentedChoice {
  /** Index to pass back to `choose`. Stable for this presentation only. */
  index: number;
  text: string;
  /** False only for a `locked` choice whose condition fails. */
  enabled: boolean;
  tag?: string;
}

export interface DialogueOptions {
  /** Overrides and additions to the script's declared `vars`. */
  vars?: Vars;
  /** Named predicates for `{ pred: … }` conditions. */
  predicates?: Predicates;
  onLine?: (line: DialogueLine) => void;
  /** Emitted by `{ emit: name }` effects, in order, after the vars are updated. */
  onEvent?: (name: string, vars: Readonly<Vars>) => void;
  onEnd?: (vars: Readonly<Vars>) => void;
}

export interface DialogueCounts {
  lines: number;
  choices: number;
  events: number;
}

/** What `toJSON` produces — plain, versionless, and belongs inside a save. */
export interface DialogueState {
  at: string | null;
  vars: Vars;
  visited: string[];
}

export class Dialogue {
  readonly script: DialogueScript;
  private readonly predicates: Predicates;
  private readonly options: DialogueOptions;

  private state: Vars;
  private at: string | null = null;
  private ended = false;
  private seen = new Set<string>();
  private presented: DialogueChoice[] = [];
  private tally: DialogueCounts = { lines: 0, choices: 0, events: 0 };

  constructor(script: DialogueScript, options: DialogueOptions = {}) {
    this.script = script;
    this.options = options;
    this.predicates = options.predicates ?? {};
    this.state = { ...(script.vars ?? {}), ...(options.vars ?? {}) };
  }

  /** The line on screen, or null before `start()` and after the end. */
  get line(): DialogueLine | null {
    if (this.at === null) return null;
    const node = this.script.nodes[this.at];
    if (!node) return null;
    return { id: this.at, speaker: node.speaker, text: node.text, tag: node.tag };
  }

  /**
   * What the player may say. Empty means this line just needs `advance()`.
   *
   * A choice with no `if` is offered. One whose `if` fails is omitted, unless
   * it is `locked`, in which case it appears with `enabled: false` — telling
   * the player what they are missing rather than hiding it.
   */
  get choices(): PresentedChoice[] {
    if (this.at === null || this.ended) return [];
    const node = this.script.nodes[this.at];
    const out: PresentedChoice[] = [];
    this.presented = [];
    for (const choice of node?.choices ?? []) {
      const ok = evaluate(choice.if, this.state, this.predicates);
      if (!ok && !choice.locked) continue;
      out.push({ index: this.presented.length, text: choice.text, enabled: ok, tag: choice.tag });
      this.presented.push(choice);
    }
    return out;
  }

  get done(): boolean {
    return this.ended;
  }

  get vars(): Readonly<Vars> {
    return this.state;
  }

  get counts(): Readonly<DialogueCounts> {
    return this.tally;
  }

  /** Has this line been shown in this conversation? For "you already asked". */
  visited(id: string): boolean {
    return this.seen.has(id);
  }

  /** Open the conversation, at `start` or wherever you say. */
  start(at: string = this.script.start): this {
    this.ended = false;
    this.enter(at);
    return this;
  }

  /**
   * Take a choice by its presented index.
   *
   * Indices come from the most recent `choices` read, which is why that getter
   * records what it returned: a script author's array order and the player's
   * visible order are not the same once conditions filter it, and resolving an
   * index against the raw array would take the wrong branch. Choosing a
   * disabled (locked) option does nothing — it is furniture.
   */
  choose(index: number): this {
    if (this.ended || this.at === null) return this;
    // Re-read so `presented` matches the current vars, not a stale render.
    const shown = this.choices;
    const chosen = shown[index];
    if (!chosen || !chosen.enabled) return this;
    const choice = this.presented[index];
    this.tally.choices += 1;
    this.fire(apply(choice.do, this.state));
    if (choice.to) this.enter(choice.to);
    else this.end();
    return this;
  }

  /**
   * Move on from a line that offers no choice.
   *
   * A line WITH choices ignores this: silently advancing past a decision the
   * player has not made is how a conversation skips its own content.
   */
  advance(): this {
    if (this.ended || this.at === null) return this;
    const node = this.script.nodes[this.at];
    if (this.choices.length > 0) return this;
    if (node?.to) this.enter(node.to);
    else this.end();
    return this;
  }

  /** For a save. Pair with `restore`. */
  toJSON(): DialogueState {
    return { at: this.at, vars: { ...this.state }, visited: [...this.seen] };
  }

  /**
   * Resume from `toJSON`, without re-firing anything.
   *
   * Deliberately silent: the entering effects for this line already ran before
   * the save, and replaying them would double every `inc` a load away from the
   * checkpoint. `onLine` is called so a HUD can redraw, because that is
   * presentation rather than state.
   */
  restore(state: DialogueState): this {
    this.at = state.at;
    this.state = { ...state.vars };
    this.seen = new Set(state.visited);
    this.ended = state.at === null;
    const line = this.line;
    if (line) this.options.onLine?.(line);
    return this;
  }

  private enter(id: string): void {
    const node = this.script.nodes[id];
    if (!node) {
      // A dangling link at play time. `lintDialogue` catches these before
      // shipping; here, ending is the only honest option — better a
      // conversation that stops than one stuck on a line that does not exist.
      this.end();
      return;
    }
    this.at = id;
    this.seen.add(id);
    this.tally.lines += 1;
    this.fire(apply(node.do, this.state));
    const line = this.line;
    if (line) this.options.onLine?.(line);
  }

  private fire(events: string[]): void {
    for (const name of events) {
      this.tally.events += 1;
      this.options.onEvent?.(name, this.state);
    }
  }

  private end(): void {
    if (this.ended) return;
    this.ended = true;
    this.at = null;
    this.options.onEnd?.(this.state);
  }
}
