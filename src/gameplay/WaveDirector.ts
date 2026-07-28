/**
 * WaveDirector — the opposition's pacing, separated from its bodies.
 *
 * The director never touches an enemy. It decides WHEN the next wave
 * starts, HOW MANY of WHAT it contains, and how hard the next one
 * should push — then asks the game to spawn each one through a
 * callback and waits to be told about deaths. That split keeps it pure
 * and testable: enemies are pooled meshes, agents, anything.
 *
 * ```ts
 * const director = new WaveDirector({
 *   kinds: ['chaser', 'harasser'],
 *   baseCount: 3,
 *   spawn: (kind, wave) => spawnEnemy(kind, wave),  // your pool, your bodies
 *   onWave: (wave, count) => hud.banner(`WAVE ${wave}`),
 *   onCleared: (wave) => sounds.success(),
 * });
 * director.start();
 * game.onUpdate((t) => director.update(t.delta));
 * enemyHealth.onDeath = () => director.enemyDown();
 * hero.onDamage = () => director.playerHurt();
 * ```
 *
 * RUBBER-BANDING is the quiet feature: the director watches how the
 * last wave went — cleared fast and unhurt, or slow and bloody — and
 * leans the next one accordingly. `pressure` (0..1, start 0.5) drifts
 * up when the player dominates and down when they bleed, and scales the
 * escalation. The player at the edge of their ability never notices;
 * that is the point.
 */

export type WaveSpawner<K> = (kind: K, wave: number) => void;

export interface WaveDirectorOptions<K> {
  /** The enemy kinds this director can ask for. */
  kinds: readonly K[];
  /** Called once per enemy the director wants alive. */
  spawn: WaveSpawner<K>;
  /** Enemies in wave 1. Default 3. */
  baseCount?: number;
  /** Extra enemies per wave (before pressure). Default 1.5. */
  growth?: number;
  /** Hard ceiling per wave. Default 12. */
  maxCount?: number;
  /** Seconds of rest between a cleared wave and the next. Default 4. */
  rest?: number;
  /** Seconds between spawns WITHIN a wave — a trickle, not a dump. Default 0.8. */
  stagger?: number;
  /** Seed for kind selection. Default 1. */
  seed?: number;
  onWave?: (wave: number, count: number) => void;
  onSpawn?: (kind: K, wave: number) => void;
  onCleared?: (wave: number) => void;
}

const clamp01 = (x: number): number => (x > 0 ? (x < 1 ? x : 1) : 0);

export class WaveDirector<K = string> {
  private readonly options: WaveDirectorOptions<K>;
  private readonly baseCount: number;
  private readonly growth: number;
  private readonly maxCount: number;
  private readonly rest: number;
  private readonly stagger: number;
  private state: number;

  private waveNumber = 0;
  private aliveCount = 0;
  private queue: K[] = [];
  private spawnTimer = 0;
  private restTimer = 0;
  private running = false;
  private resting = false;

  // Rubber-band bookkeeping for the wave in progress.
  private pressureLevel = 0.5;
  private waveClock = 0;
  private hurtThisWave = 0;

  constructor(options: WaveDirectorOptions<K>) {
    if (options.kinds.length === 0) throw new Error('WaveDirector: no kinds');
    this.options = options;
    this.baseCount = Math.max(options.baseCount ?? 3, 1);
    this.growth = Math.max(options.growth ?? 1.5, 0);
    this.maxCount = Math.max(options.maxCount ?? 12, 1);
    this.rest = Math.max(options.rest ?? 4, 0);
    this.stagger = Math.max(options.stagger ?? 0.8, 0);
    this.state = (options.seed ?? 1) >>> 0 || 1;
  }

  /** The wave in progress (1-based); 0 before start(). */
  get wave(): number {
    return this.waveNumber;
  }

  /** Enemies the director believes are alive right now. */
  get alive(): number {
    return this.aliveCount;
  }

  /** How hard the director is leaning, 0 (mercy) .. 1 (full send). */
  get pressure(): number {
    return this.pressureLevel;
  }

  /** True during the breather between waves. */
  get isResting(): boolean {
    return this.resting;
  }

  private rand(): number {
    this.state = (this.state + 0x6d2b79f5) >>> 0;
    let t = this.state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /** Begin (or resume after stop). The first wave launches immediately. */
  start(): void {
    if (this.running) return;
    this.running = true;
    this.resting = false;
    if (this.aliveCount === 0 && this.queue.length === 0) this.launch();
  }

  /** Freeze the director (waves in flight keep their enemies). */
  stop(): void {
    this.running = false;
  }

  /** Report one enemy down. When the last falls, the rest begins. */
  enemyDown(): void {
    if (this.aliveCount === 0) return;
    this.aliveCount--;
    if (this.aliveCount === 0 && this.queue.length === 0 && this.running) {
      this.settle();
    }
  }

  /** Report the player taking a hit — the band leans merciful. */
  playerHurt(amount = 1): void {
    this.hurtThisWave += Math.max(Number.isFinite(amount) ? amount : 1, 0);
  }

  update(dt: number): void {
    if (!this.running) return;
    const step = Number.isFinite(dt) ? Math.max(dt, 0) : 0;
    this.waveClock += step;

    if (this.resting) {
      this.restTimer -= step;
      if (this.restTimer <= 0) this.launch();
      return;
    }
    if (this.queue.length > 0) {
      this.spawnTimer -= step;
      if (this.spawnTimer <= 0) {
        this.spawnTimer = this.stagger;
        const kind = this.queue.shift() as K;
        this.aliveCount++;
        this.options.spawn(kind, this.waveNumber);
        this.options.onSpawn?.(kind, this.waveNumber);
        // The dump edge case: everything spawned and already dead.
        if (this.queue.length === 0 && this.aliveCount === 0) this.settle();
      }
    }
  }

  /** A cleared wave: judge it, adjust pressure, schedule the rest. */
  private settle(): void {
    // Fast and unhurt = dominate = push harder. Slow or bloody = ease off.
    // The clock baseline is ~9 s a wave plus 2 s an enemy — crude, but the
    // band only needs a direction, not a simulation.
    const expected = 9 + this.currentCount() * 2;
    const speedScore = clamp01(1 - this.waveClock / (expected * 2)); // 1 fast … 0 slow
    const bloodScore = clamp01(1 - this.hurtThisWave / 3); // 1 clean … 0 bloody
    const verdict = speedScore * 0.5 + bloodScore * 0.5;
    // Drift a third of the way toward the verdict: banding is a lean,
    // never a lurch the player could feel and resent.
    this.pressureLevel = clamp01(this.pressureLevel + (verdict - this.pressureLevel) / 3);

    this.resting = true;
    this.restTimer = this.rest;
    this.options.onCleared?.(this.waveNumber);
  }

  private currentCount(): number {
    // Pressure scales the ESCALATION, not the base: wave 1 is wave 1 for
    // everyone; by wave 5 a dominating player faces half again more.
    const escalation = (this.waveNumber - 1) * this.growth * (0.5 + this.pressureLevel);
    return Math.min(Math.round(this.baseCount + escalation), this.maxCount);
  }

  private launch(): void {
    this.waveNumber++;
    this.resting = false;
    this.waveClock = 0;
    this.hurtThisWave = 0;
    const count = this.currentCount();
    this.queue = Array.from(
      { length: count },
      () => this.options.kinds[Math.floor(this.rand() * this.options.kinds.length)]
    );
    this.spawnTimer = 0;
    this.options.onWave?.(this.waveNumber, count);
  }
}
