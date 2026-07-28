/**
 * Objectives — "what does winning mean", kept as data.
 *
 * `Recipe` already answers "what do I do next" for crafting; this is the
 * same idea for the match itself: a small list of goals with progress,
 * events at the moments a HUD wants them, and one `onAllComplete` that
 * usually means `flow.to('results')`.
 *
 * ```ts
 * const goals = new Objectives([
 *   { id: 'coins', label: 'Collect coins', target: 10 },
 *   { id: 'laps', label: 'Finish laps', target: 3 },
 * ], {
 *   onProgress: (g) => hud.objective(goals.summary()),
 *   onComplete: (g) => sounds.success(),
 *   onAllComplete: () => flow.to('results'),
 * });
 * collector.onCollect = () => goals.advance('coins');
 * run.onLap = () => goals.advance('laps');
 * ```
 */

export interface ObjectiveSpec {
  id: string;
  label: string;
  /** Count needed. Default 1 — a "do the thing once" objective. */
  target?: number;
}

export interface Objective {
  id: string;
  label: string;
  target: number;
  progress: number;
  done: boolean;
}

export interface ObjectivesOptions {
  onProgress?: (objective: Objective) => void;
  onComplete?: (objective: Objective) => void;
  onAllComplete?: () => void;
}

export class Objectives {
  private readonly list: Objective[];
  private readonly options: ObjectivesOptions;
  private allDone = false;

  constructor(specs: readonly ObjectiveSpec[], options: ObjectivesOptions = {}) {
    if (specs.length === 0) throw new Error('Objectives: nothing to do');
    this.list = specs.map((spec) => ({
      id: spec.id,
      label: spec.label,
      target: Math.max(spec.target ?? 1, 1),
      progress: 0,
      done: false,
    }));
    this.options = options;
  }

  get all(): readonly Objective[] {
    return this.list;
  }

  get complete(): boolean {
    return this.allDone;
  }

  get(id: string): Objective | undefined {
    return this.list.find((o) => o.id === id);
  }

  /** Add progress (default 1). Completion fires exactly once per goal. */
  advance(id: string, amount = 1): void {
    const goal = this.get(id);
    if (!goal || goal.done) return;
    const step = Number.isFinite(amount) ? Math.max(amount, 0) : 0;
    if (step === 0) return;
    goal.progress = Math.min(goal.progress + step, goal.target);
    this.options.onProgress?.(goal);
    if (goal.progress >= goal.target) {
      goal.done = true;
      this.options.onComplete?.(goal);
      if (!this.allDone && this.list.every((o) => o.done)) {
        this.allDone = true;
        this.options.onAllComplete?.();
      }
    }
  }

  /** Jump a goal straight to done (a skip, a scripted beat). */
  finish(id: string): void {
    const goal = this.get(id);
    if (!goal || goal.done) return;
    this.advance(id, goal.target - goal.progress);
  }

  /** One line per goal, ✓-marked — drop it straight into `hud.objective`. */
  summary(): string {
    return this.list
      .map((o) => `${o.done ? '✓' : '·'} ${o.label} ${o.progress}/${o.target}`)
      .join('\n');
  }

  /** Everything back to zero — a restart. */
  reset(): void {
    for (const goal of this.list) {
      goal.progress = 0;
      goal.done = false;
    }
    this.allDone = false;
  }
}
