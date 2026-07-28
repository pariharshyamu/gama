/**
 * GameFlow — the shell every game copies from the last one, written once.
 *
 * Title → playing → paused → results → back again: a tiny state machine
 * with guarded transitions and one job that matters more than it looks —
 * `gate(dt)` returns the frame delta only while playing, so feeding the
 * whole update chain through it pauses gameplay, HUD timers, respawn
 * clocks and wave directors in one move. The screens themselves are
 * yours (HUD banners, DOM, whatever); the flow only keeps the truth.
 *
 * ```ts
 * const flow = new GameFlow({
 *   onEnter: { playing: () => hud.banner('GO!'), results: showResults },
 * });
 * addEventListener('pointerdown', () => flow.state === 'title' && flow.to('playing'));
 * addEventListener('keydown', (e) => e.key === 'p' && flow.togglePause());
 * game.onUpdate((t) => {
 *   const dt = flow.gate(feel.update(t.delta));
 *   world.step(dt);           // frozen on the title, in pause, at results
 * });
 * ```
 */

export type FlowState = 'title' | 'playing' | 'paused' | 'results';

/** Which moves are legal. Anything else is refused (and reported false). */
const LEGAL: Record<FlowState, FlowState[]> = {
  title: ['playing'],
  playing: ['paused', 'results', 'title'],
  paused: ['playing', 'title'],
  results: ['title', 'playing'],
};

export interface GameFlowOptions {
  /** Starting state. Default 'title'. */
  initial?: FlowState;
  onEnter?: Partial<Record<FlowState, () => void>>;
  onExit?: Partial<Record<FlowState, () => void>>;
}

export class GameFlow {
  private current: FlowState;
  private readonly options: GameFlowOptions;

  constructor(options: GameFlowOptions = {}) {
    this.options = options;
    this.current = options.initial ?? 'title';
  }

  get state(): FlowState {
    return this.current;
  }

  get playing(): boolean {
    return this.current === 'playing';
  }

  /**
   * Attempt a transition. Returns whether it happened — an illegal move
   * (results → paused, say) is refused rather than smeared over.
   */
  to(next: FlowState): boolean {
    if (next === this.current) return false;
    if (!LEGAL[this.current].includes(next)) return false;
    this.options.onExit?.[this.current]?.();
    this.current = next;
    this.options.onEnter?.[next]?.();
    return true;
  }

  /** playing ⇄ paused; does nothing from other states. */
  togglePause(): boolean {
    if (this.current === 'playing') return this.to('paused');
    if (this.current === 'paused') return this.to('playing');
    return false;
  }

  /** The one-line pause: dt while playing, 0 anywhere else. */
  gate(dt: number): number {
    return this.playing && Number.isFinite(dt) ? Math.max(dt, 0) : 0;
  }
}
