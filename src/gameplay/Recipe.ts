import { EventEmitter } from '../core/EventEmitter';

/**
 * Recipe — what to do next.
 *
 * The kitchen tracks in SCENA built every *thing*: a stove that publishes
 * heat as a field, a cold store that publishes preservation, prep benches
 * that yield, a sink with a queue of dishes, ingredients that go off. What
 * none of them answer is the only question an agent actually has, which is
 * **what should I do now** — and that is not a list, it is a graph.
 *
 * A `Recipe` is a set of steps with dependencies and inputs. It never moves
 * anybody and never touches a mesh; it answers three questions:
 *
 * ```ts
 * recipe.ready(pantry)     // what could be started right now
 * recipe.missing(pantry)   // what to go and fetch, if nothing could
 * recipe.progress          // how far through we are
 * ```
 *
 * The distinction that makes it a graph rather than a checklist is that
 * **ready is computed, never stored**. A step is ready when its dependencies
 * are done *and* its inputs are in the stockpile — so putting an onion on
 * the counter can unblock a step nobody touched, and burning the stock can
 * re-block one that was ready a second ago. Nothing has to be told.
 *
 * It pairs with `Stockpile` (which already counts things) and with SCENA's
 * `WorkStation.onYield` (which already produces them), and it imports
 * neither: the pantry is anything with `count`, `remove` and `add`.
 *
 * ```ts
 * const stew = new Recipe({
 *   steps: [
 *     { id: 'chop',  station: 'board', takes: { onion: 1, carrot: 2 }, makes: 'mirepoix' },
 *     { id: 'brown', station: 'stove', takes: { meat: 1 }, makes: 'browned' },
 *     { id: 'simmer', station: 'stove', needs: ['chop', 'brown'],
 *       takes: { mirepoix: 1, browned: 1, stock: 1 }, makes: 'stew', seconds: 30 },
 *   ],
 * });
 *
 * const next = stew.ready(pantry)[0];
 * if (next && stew.begin(next.id, cook)) walkTo(stations[next.station]);
 * ```
 */

/** Anything that counts things. `Stockpile` is one; so is a plain Map wrapper. */
export interface Pantry {
  count(resource: string): number;
  add(resource: string, n?: number): number;
  remove(resource: string, n?: number): number;
}

export interface RecipeStep {
  /** Unique within the recipe. */
  id: string;
  /** Free label naming the kind of place this happens at: 'board', 'stove'. */
  station?: string;
  /** Step ids that must be done first. */
  needs?: string[];
  /** What it consumes, by resource name. Taken at `begin`, not at `finish`. */
  takes?: Record<string, number>;
  /** What it produces. Added at `finish`. */
  makes?: string;
  /** How many of `makes` it produces. Default 1. */
  yields?: number;
  /** How long it takes, if the caller wants the recipe to time it. Default 0. */
  seconds?: number;
}

export type StepState = 'blocked' | 'ready' | 'running' | 'done';

export interface StepStatus {
  id: string;
  station: string | undefined;
  state: StepState;
  /** Who claimed it, if anybody. */
  by: unknown;
  /** 0–1 while running, if the step has a duration. */
  progress: number;
  /** What is stopping it: unfinished dependencies. */
  waitingOn: string[];
  /** What is stopping it: resources not in the pantry, and how many short. */
  short: Record<string, number>;
}

export interface RecipeEvents extends Record<string, unknown> {
  /** A step was claimed and its inputs consumed. */
  begin: { id: string; by: unknown };
  /** A step finished and its output was added. */
  finish: { id: string; makes: string | undefined; count: number };
  /** A step was given up; its inputs are NOT returned. */
  abandon: { id: string; by: unknown };
  /** Every step is done. Fires once. */
  complete: { name: string };
}

export interface RecipeOptions {
  name?: string;
  steps: RecipeStep[];
  /**
   * Return a step's inputs to the pantry when it is abandoned. Default
   * false — a half-chopped onion is not an onion, and the safe default for
   * a cooking graph is that work in progress is lost.
   */
  refundOnAbandon?: boolean;
}

interface Node {
  step: RecipeStep;
  needs: string[];
  takes: Array<[string, number]>;
  state: StepState;
  by: unknown;
  elapsed: number;
}

/**
 * Depth-first cycle check.
 *
 * At **construction**, not at run time. A recipe whose step A needs B needs
 * A is not a recipe that runs badly, it is a recipe where `ready` returns an
 * empty list forever and `progress` sticks — which looks exactly like an
 * agent that has decided to stand still, and is very hard to find from
 * there. Better to refuse to build it.
 */
function assertAcyclic(nodes: Map<string, Node>, name: string): void {
  const seen = new Map<string, number>(); // 0 = visiting, 1 = done
  const walk = (id: string, trail: string[]): void => {
    const mark = seen.get(id);
    if (mark === 1) return;
    if (mark === 0) {
      const from = trail.indexOf(id);
      throw new Error(
        `Recipe "${name}" has a cycle: ${[...trail.slice(from), id].join(' → ')}`
      );
    }
    seen.set(id, 0);
    for (const dep of nodes.get(id)!.needs) walk(dep, [...trail, id]);
    seen.set(id, 1);
  };
  for (const id of nodes.keys()) walk(id, []);
}

export class Recipe {
  readonly events = new EventEmitter<RecipeEvents>();
  readonly name: string;
  private readonly nodes = new Map<string, Node>();
  private readonly refund: boolean;
  private announced = false;

  constructor(options: RecipeOptions) {
    this.name = options.name ?? 'recipe';
    this.refund = options.refundOnAbandon ?? false;

    for (const step of options.steps) {
      if (this.nodes.has(step.id)) {
        throw new Error(`Recipe "${this.name}" has two steps called "${step.id}"`);
      }
      this.nodes.set(step.id, {
        step,
        needs: step.needs ?? [],
        takes: Object.entries(step.takes ?? {}),
        state: 'blocked',
        by: null,
        elapsed: 0,
      });
    }
    // A dependency on a step that does not exist blocks it forever, silently.
    for (const node of this.nodes.values()) {
      for (const dep of node.needs) {
        if (!this.nodes.has(dep)) {
          throw new Error(
            `Recipe "${this.name}": step "${node.step.id}" needs "${dep}", which does not exist`
          );
        }
      }
    }
    assertAcyclic(this.nodes, this.name);
  }

  /** Every step, in the order it was declared. */
  get steps(): RecipeStep[] {
    return [...this.nodes.values()].map((n) => n.step);
  }

  /** How many steps are finished. */
  get done(): number {
    let n = 0;
    for (const node of this.nodes.values()) if (node.state === 'done') n += 1;
    return n;
  }

  /** 0–1 across the whole graph. */
  get progress(): number {
    return this.nodes.size === 0 ? 1 : this.done / this.nodes.size;
  }

  get complete(): boolean {
    return this.done === this.nodes.size;
  }

  /** Are this step's dependencies all finished? */
  private depsMet(node: Node): boolean {
    for (const dep of node.needs) {
      if (this.nodes.get(dep)!.state !== 'done') return false;
    }
    return true;
  }

  /** What a step is short of, given a pantry. Empty if it has everything. */
  private shortfall(node: Node, pantry: Pantry | undefined): Record<string, number> {
    const out: Record<string, number> = {};
    if (!pantry) return out;
    for (const [resource, want] of node.takes) {
      const have = pantry.count(resource);
      if (have < want) out[resource] = want - have;
    }
    return out;
  }

  /** The full picture, for a HUD or a debugger. */
  status(pantry?: Pantry): StepStatus[] {
    return [...this.nodes.values()].map((node) => {
      const waitingOn = node.needs.filter((d) => this.nodes.get(d)!.state !== 'done');
      const short = node.state === 'done' || node.state === 'running'
        ? {}
        : this.shortfall(node, pantry);
      let state: StepState = node.state;
      if (state === 'blocked' || state === 'ready') {
        state = waitingOn.length === 0 && Object.keys(short).length === 0 ? 'ready' : 'blocked';
      }
      const seconds = node.step.seconds ?? 0;
      return {
        id: node.step.id,
        station: node.step.station,
        state,
        by: node.by,
        progress: state === 'running' && seconds > 0 ? Math.min(1, node.elapsed / seconds) : 0,
        waitingOn,
        short,
      };
    });
  }

  /**
   * Steps that could be started right now.
   *
   * COMPUTED, never stored. Putting an onion on the counter unblocks a step
   * nobody touched, and taking one away re-blocks it — which is the whole
   * difference between a dependency graph and a checklist.
   */
  ready(pantry?: Pantry): RecipeStep[] {
    const out: RecipeStep[] = [];
    for (const node of this.nodes.values()) {
      if (node.state !== 'blocked' && node.state !== 'ready') continue;
      if (!this.depsMet(node)) continue;
      if (Object.keys(this.shortfall(node, pantry)).length > 0) continue;
      out.push(node.step);
    }
    return out;
  }

  /**
   * Everything the recipe still needs and cannot make for itself, totalled.
   *
   * The shopping list: resources that no remaining step produces, so no
   * amount of waiting will conjure them. This is what you send somebody to
   * the market for, and leaving out the "no step makes it" test turns the
   * list into a demand for the stew you are trying to cook.
   */
  missing(pantry?: Pantry): Record<string, number> {
    const producible = new Set<string>();
    for (const node of this.nodes.values()) {
      if (node.state !== 'done' && node.step.makes) producible.add(node.step.makes);
    }
    const want: Record<string, number> = {};
    for (const node of this.nodes.values()) {
      if (node.state === 'done' || node.state === 'running') continue;
      for (const [resource, n] of node.takes) {
        if (producible.has(resource)) continue;
        want[resource] = (want[resource] ?? 0) + n;
      }
    }
    const out: Record<string, number> = {};
    for (const [resource, n] of Object.entries(want)) {
      const have = pantry?.count(resource) ?? 0;
      if (have < n) out[resource] = n - have;
    }
    return out;
  }

  /**
   * Claim a step and consume its inputs. Returns false if it is not ready,
   * is already taken, or the pantry is short.
   *
   * The inputs go at **begin**, not at finish. Taking them at the end lets
   * two cooks both start the same step with one onion between them, and the
   * bug only shows up when a second agent exists — which is to say in the
   * demo, not in the tests.
   */
  begin(id: string, by: unknown = null, pantry?: Pantry): boolean {
    const node = this.nodes.get(id);
    if (!node || node.state === 'done' || node.state === 'running') return false;
    if (!this.depsMet(node)) return false;
    if (Object.keys(this.shortfall(node, pantry)).length > 0) return false;
    if (pantry) for (const [resource, n] of node.takes) pantry.remove(resource, n);
    node.state = 'running';
    node.by = by;
    node.elapsed = 0;
    this.events.emit('begin', { id, by });
    return true;
  }

  /** Finish a running step and add its output. Returns false if it was not running. */
  finish(id: string, pantry?: Pantry): boolean {
    const node = this.nodes.get(id);
    if (!node || node.state !== 'running') return false;
    const count = node.step.yields ?? 1;
    if (pantry && node.step.makes) pantry.add(node.step.makes, count);
    node.state = 'done';
    node.by = null;
    this.events.emit('finish', { id, makes: node.step.makes, count });
    if (this.complete && !this.announced) {
      this.announced = true;
      this.events.emit('complete', { name: this.name });
    }
    return true;
  }

  /**
   * Give up on a running step. Its inputs are gone unless `refundOnAbandon`
   * was set — a half-chopped onion is not an onion.
   */
  abandon(id: string, pantry?: Pantry): boolean {
    const node = this.nodes.get(id);
    if (!node || node.state !== 'running') return false;
    if (this.refund && pantry) for (const [resource, n] of node.takes) pantry.add(resource, n);
    const by = node.by;
    node.state = 'blocked';
    node.by = null;
    node.elapsed = 0;
    this.events.emit('abandon', { id, by });
    return true;
  }

  /** Who has claimed this step, or null. */
  claimant(id: string): unknown {
    return this.nodes.get(id)?.by ?? null;
  }

  /** Everything a given worker is currently on. */
  workOf(by: unknown): RecipeStep[] {
    return [...this.nodes.values()].filter((n) => n.state === 'running' && n.by === by).map((n) => n.step);
  }

  /**
   * Advance the clocks on running steps, finishing any that have served
   * their `seconds`. Optional — a game that drives steps off a SCENA
   * `WorkStation.onYield` never calls this and just uses `finish`.
   */
  update(dt: number, pantry?: Pantry): void {
    if (dt <= 0) return;
    for (const node of [...this.nodes.values()]) {
      if (node.state !== 'running') continue;
      const seconds = node.step.seconds ?? 0;
      if (seconds <= 0) continue;
      node.elapsed += dt;
      if (node.elapsed >= seconds) this.finish(node.step.id, pantry);
    }
  }

  /** Back to the beginning. The pantry is not touched. */
  reset(): void {
    for (const node of this.nodes.values()) {
      node.state = 'blocked';
      node.by = null;
      node.elapsed = 0;
    }
    this.announced = false;
  }
}
