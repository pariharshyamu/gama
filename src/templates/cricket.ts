import { Vector3 } from 'three';

/**
 * A cricket match, as rules and a ball — no scene, no meshes, no three.js
 * beyond a vector.
 *
 * The whole point of a short-format match is that every ball matters, so
 * this models the ball honestly and the bookkeeping exactly:
 *
 * - **the ball flies**: released from a hand at a real height, it drops
 *   under gravity, PITCHES once (losing pace and standing up off the
 *   seam), and arrives at the batter — so the timing window is a
 *   consequence of the flight rather than a number invented beside it;
 * - **the bat takes time to come down**: you commit a stroke and the bat
 *   arrives a beat later, exactly as the animation swings it. Timing is
 *   the gap between when the bat got there and when the ball did, in
 *   seconds, which is what a batter is actually judging;
 * - **the scoring is the laws**: runs off the bat, boundaries at the
 *   rope, wickets bowled and caught, six balls to an over, and a chase
 *   that ends the instant the target is passed.
 *
 * ```ts
 * const match = new CricketMatch({ overs: 2 });
 * match.bowl();                       // the ball is on its way
 * match.swing('drive');               // commit a stroke; the bat lands later
 * game.onUpdate((t) => match.update(t.delta));
 * match.onBall((o) => console.log(o.runs, o.wicket, o.timing));
 * ```
 */

export type Shot =
  | 'drive'
  | 'flick'
  | 'cut'
  | 'pull'
  | 'sweep'
  | 'defend'
  | 'loft';

/** How well the ball was struck. */
export type Timing = 'early' | 'good' | 'middled' | 'late' | 'missed';

export type BallPhase =
  /** Nothing happening; waiting for `bowl()`. */
  | 'ready'
  /** In the air between the hand and the pitch. */
  | 'flight'
  /** Pitched, and coming on to the bat. */
  | 'onto'
  /** Struck, and travelling. */
  | 'struck'
  /** The ball is dead; the outcome has been reported. */
  | 'dead';

export interface BallOutcome {
  runs: number;
  wicket: 'bowled' | 'caught' | null;
  timing: Timing;
  /** How many seconds the bat was late (positive) or early (negative). */
  error: number;
  /** How cleanly it was struck, 0 to 1. */
  quality: number;
  /**
   * How far the middle of the bat was off the ball's line and height,
   * metres — or −1 when no bat probe is wired up. Timing is *when*; this
   * is *where*, and it is the other way to miss.
   */
  miss: number;
  shot: Shot | null;
  /** Ball number within the innings, 1-based. */
  ball: number;
  /** True if this ball ended the innings. */
  innings: boolean;
  /** Where the ball finished, for a commentary line or a camera. */
  where: Vector3;
}

export interface CricketMatchOptions {
  /** Overs per innings. Default 2. */
  overs?: number;
  /** Wickets available. Default 2 — a short game needs short patience. */
  wickets?: number;
  /** Boundary distance, metres. Default 62. */
  boundary?: number;
  /** Delivery speed, m/s. Default 26 (~94 km/h — club quick). */
  pace?: number;
  /** Pitch length, metres. Default 20.12 (22 yards). */
  pitch?: number;
  /**
   * Seconds between committing a stroke and the bat reaching the ball.
   * Default 0.42 — match this to your swing animation's contact phase.
   */
  swingLead?: number;
  /**
   * How far in front of the striker's stumps the bat meets the ball,
   * metres. Default 1.6 — a batter on the popping crease playing a
   * comfortable arm's length in front of it. If you are driving this from
   * a rig, set it to where that rig's bat actually is.
   */
  contact?: number;
  /**
   * Where the middle of the bat is right now, in the same space as
   * `match.ball`. Supply it and contact becomes a real COLLISION rather
   * than a timing coincidence: sweep at a bouncer and the bat goes under
   * it, pull a half-volley and it goes over. ANIMA's
   * `Cricketer.batPoint` drops straight in.
   */
  bat?: () => Vector3;
  /** How far the bat can be from the ball and still hit it. Default 0.45. */
  reach?: number;
  seed?: number;
}

const G = 9.8;
/** Stumps: 28 inches tall, 9 inches wide, plus the ball's own radius. */
const OVER_STUMPS = 0.711 + 0.036;
const OUTSIDE_STUMPS = 0.114 + 0.036;
const BALL_R = 0.036;
/** The simulation's own tick. */
const STEP = 1 / 240;

/**
 * How cleanly the bat struck it, from a timing error in seconds. Bands are
 * for the scorecard; THIS is what the ball actually feels, which is why two
 * middled drives are never quite the same shot.
 */
const strikeQuality = (error: number): number => {
  const q = 1 - Math.abs(error) / 0.34;
  return q < 0 ? 0 : q > 1 ? 1 : q;
};

/**
 * Each stroke's launch: how hard, how high, how square — and WHICH WAY.
 *
 * `side` is signed, because a cut and a pull are not the same shot with
 * the sign thrown away: +1 sends it to the off, −1 to the leg, and a game
 * that randomises it has a batter with no idea where the ball went.
 * `height` is where the bat has to meet the ball for the stroke to be the
 * right one, which is what makes the collision below mean something.
 */
interface ShotSpec {
  power: number;
  loft: number;
  side: number;
  spread: number;
  risk: number;
}

const SHOTS: Record<Shot, ShotSpec> = {
  // Straight, hard, along the ground: the safest way to four.
  drive: { power: 27, loft: 0.16, side: 0.3, spread: 0.35, risk: 0.12 },
  // The same bat, wrists rolled, worked away off the pads.
  flick: { power: 23, loft: 0.18, side: -0.75, spread: 0.4, risk: 0.16 },
  // Late, square, and past point before anybody moves.
  cut: { power: 24, loft: 0.14, side: 0.95, spread: 0.35, risk: 0.22 },
  // Square and flat, and it beats the ring if it is middled.
  pull: { power: 25, loft: 0.24, side: -0.95, spread: 0.35, risk: 0.3 },
  // Round the corner, off the deck, and nobody is behind square.
  sweep: { power: 21, loft: 0.2, side: -0.85, spread: 0.45, risk: 0.26 },
  // No power at all. You cannot be caught off a shot you did not play.
  defend: { power: 7, loft: 0.05, side: 0.1, spread: 0.3, risk: 0.02 },
  // The six, or the catch. There is no third outcome that matters.
  loft: { power: 30, loft: 0.62, side: 0.25, spread: 0.5, risk: 0.62 },
};

export class CricketMatch {
  readonly overs: number;
  readonly wicketsInHand: number;
  readonly boundary: number;
  readonly swingLead: number;

  /** Runs scored in the innings so far. */
  runs = 0;
  /** Wickets fallen. */
  wickets = 0;
  /** Legal balls bowled this innings. */
  balls = 0;
  /** Which innings: 1 setting a target, 2 chasing. */
  innings: 1 | 2 = 1;
  /** The score to beat in the second innings, or null in the first. */
  target: number | null = null;
  /** First-innings total, once it is in. */
  firstInnings: number | null = null;
  /** The result line, once there is one. */
  result: string | null = null;

  phase: BallPhase = 'ready';
  /** Where the ball is right now. */
  readonly ball = new Vector3();

  private pace: number;
  private speed: number;
  private pitchLen: number;
  private contactZ: number;
  private vel = new Vector3();
  private bounced = false;
  private shot: Shot | null = null;
  /** Seconds until the bat arrives, or -1 when no stroke is coming. */
  private batIn = -1;
  private timing: Timing = 'missed';
  private error = 0;
  private quality = 0;
  private caught = false;
  private batAt: (() => Vector3) | null;
  private reach: number;
  /** How far the bat was from the ball, or -1 if nothing measured. */
  private miss = -1;
  private acc = 0;
  private rand: () => number;
  private ballCbs = new Set<(o: BallOutcome) => void>();
  private overCbs = new Set<(over: number) => void>();
  private endCbs = new Set<(result: string) => void>();

  constructor(options: CricketMatchOptions = {}) {
    this.overs = Math.max(1, options.overs ?? 2);
    this.wicketsInHand = Math.max(1, options.wickets ?? 2);
    this.boundary = options.boundary ?? 62;
    this.swingLead = options.swingLead ?? 0.42;
    this.batAt = options.bat ?? null;
    this.reach = options.reach ?? 0.45;
    this.pace = options.pace ?? 26;
    this.speed = this.pace;
    this.pitchLen = options.pitch ?? 20.12;
    // The bat meets the ball in front of the stumps, where it should.
    this.contactZ = -this.pitchLen / 2 + (options.contact ?? 1.6);
    let s = (options.seed ?? 1) >>> 0 || 1;
    this.rand = () => {
      s = (s + 0x6d2b79f5) >>> 0;
      let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /** Balls left in the innings. */
  get ballsLeft(): number {
    return this.overs * 6 - this.balls;
  }

  /** Overs bowled, in cricket's own notation: 1.3 is one over and three. */
  get oversBowled(): string {
    return `${Math.floor(this.balls / 6)}.${this.balls % 6}`;
  }

  /** Runs still needed to win, in the second innings. */
  get needed(): number | null {
    return this.target === null ? null : Math.max(0, this.target - this.runs);
  }

  /** The match is decided. */
  get over(): boolean {
    return this.result !== null;
  }

  /** The stroke committed for this ball, if any. */
  get stroke(): Shot | null {
    return this.shot;
  }

  onBall(cb: (o: BallOutcome) => void): () => void {
    this.ballCbs.add(cb);
    return () => this.ballCbs.delete(cb);
  }

  onOver(cb: (over: number) => void): () => void {
    this.overCbs.add(cb);
    return () => this.overCbs.delete(cb);
  }

  onEnd(cb: (result: string) => void): () => void {
    this.endCbs.add(cb);
    return () => this.endCbs.delete(cb);
  }

  /**
   * Release the ball. It starts high at the bowler's end and travels down
   * the pitch, pitching short of a length, so a shot played too soon or
   * too late is a shot played against a ball that is genuinely elsewhere.
   */
  bowl(from = new Vector3(0, 2.15, this.pitchLen / 2)): boolean {
    if (this.phase !== 'ready' || this.over) return false;
    this.ball.copy(from);
    // LENGTH IS THE BOWLER'S WHOLE ARGUMENT. A ball pitched up arrives at
    // the batter's ankles and a short one at their chest, so it is length
    // that decides which stroke is even available — sweep the full one,
    // pull the short one, and get it wrong and the bat passes over or
    // under the ball. A bowler who lands it in the same 1.5 m every time
    // is a bowling machine with one setting.
    const pitchAt = -this.pitchLen / 2 + 3.4 + this.rand() * 3.8;
    // Never the same ball twice: length and pace both move.
    this.speed = this.pace * (0.94 + this.rand() * 0.12);
    const flight = Math.abs(this.ball.z - pitchAt) / this.speed;
    // AIMED, not fired parallel. A bowler releases from wide of the stumps
    // and the ball still arrives ON them — so the sideways velocity is
    // whatever carries it from the hand to the LINE it is bowled at, not
    // a fixed drift. (Fired parallel, a hand 40 cm to one side puts every
    // delivery 40 cm wide of the bat, and nothing can ever be hit.)
    const line = (this.rand() - 0.5) * 0.7;
    const onward = (pitchAt - this.contactZ) / (this.speed * 0.86);
    this.vel.set(
      (line - this.ball.x) / (flight + onward),
      (BALL_R - this.ball.y) / flight + 0.5 * G * flight,
      -this.speed
    );
    this.bounced = false;
    this.caught = false;
    this.shot = null;
    this.batIn = -1;
    this.timing = 'missed';
    this.error = 0;
    this.quality = 0;
    this.miss = -1;
    this.acc = 0;
    this.phase = 'flight';
    return true;
  }

  /**
   * Commit a stroke. The bat comes down over `swingLead` seconds, and only
   * then does the game find out where the ball was — which is the whole
   * game. One stroke per delivery.
   */
  swing(shot: Shot): boolean {
    if (this.phase !== 'flight' && this.phase !== 'onto') return false;
    if (this.shot) return false;
    this.shot = shot;
    this.batIn = this.swingLead;
    return true;
  }

  /**
   * Seconds until the ball reaches the bat's contact point, flown forward
   * for real — through the bounce if it has not pitched yet, because a
   * straight-line guess is wrong by the exact amount the pitch changes.
   */
  timeToContact(): number {
    if (this.phase !== 'flight' && this.phase !== 'onto') return NaN;
    const z = this.ball.z;
    if (z <= this.contactZ) return 0;
    let y = this.ball.y;
    let vy = this.vel.y;
    let vz = this.vel.z;
    let pz = z;
    let bounced = this.bounced;
    const h = 1 / 960;
    for (let t = 0; t < 2; t += h) {
      vy -= G * h;
      y += vy * h;
      pz += vz * h;
      if (!bounced && y <= BALL_R) {
        bounced = true;
        y = BALL_R;
        vy = Math.abs(vy) * 0.55;
        vz *= 0.86;
      }
      if (pz <= this.contactZ) return t + h;
    }
    return 2;
  }

  /**
   * How far off a bat committed right now would be, in seconds — negative
   * for early, positive for late. Useful for a coaching overlay.
   */
  previewError(): number {
    const eta = this.timeToContact();
    return Number.isNaN(eta) ? NaN : this.swingLead - eta;
  }

  /** The timing band for a bat that arrived this many seconds off. */
  private bandFor(error: number): Timing {
    const e = Math.abs(error);
    if (e <= 0.05) return 'middled';
    if (e <= 0.13) return 'good';
    if (error < 0 && e <= 0.3) return 'early';
    if (error > 0 && e <= 0.22) return 'late';
    return 'missed';
  }

  update(dt: number): void {
    // A FIXED INTERNAL STEP. The flight is integrated explicitly, so a
    // 30 fps browser and a 240 fps one would otherwise fly the ball along
    // two different parabolas and disagree about the bounce — the game
    // would literally be easier on a fast machine. Slices of 1/240 s,
    // banked between frames, mean every device plays the same match.
    this.acc += dt;
    while (this.acc >= STEP) {
      this.acc -= STEP;
      this.step(STEP);
      if (this.phase === 'dead' || this.phase === 'ready') {
        this.acc = 0;
        return;
      }
    }
  }

  private step(dt: number): void {
    if (this.phase === 'flight' || this.phase === 'onto') {
      // The bat may land part-way through this step; step to it exactly so
      // the frame rate never decides the innings.
      if (this.batIn >= 0 && this.batIn <= dt) {
        this.flyBall(this.batIn);
        dt -= this.batIn;
        this.batIn = -1;
        this.contact();
        if (this.phase !== 'flight' && this.phase !== 'onto') {
          if (this.phase === 'struck') this.flyStruck(dt);
          return;
        }
      } else if (this.batIn > 0) {
        this.batIn -= dt;
      }
      this.flyBall(dt);
      this.pastTheStumps();
      return;
    }
    if (this.phase === 'struck') this.flyStruck(dt);
  }

  /** Gravity, and the one bounce that makes cricket cricket. */
  private flyBall(dt: number): void {
    if (dt <= 0) return;
    this.vel.y -= G * dt;
    this.ball.addScaledVector(this.vel, dt);
    if (!this.bounced && this.ball.y <= BALL_R) {
      // THE PITCH. The ball loses pace off the deck and stands up — the
      // whole reason a batter can play it at all.
      this.bounced = true;
      this.ball.y = BALL_R;
      this.vel.y = Math.abs(this.vel.y) * 0.55;
      this.vel.z *= 0.86;
      this.phase = 'onto';
    }
  }

  private flyStruck(dt: number): void {
    if (dt <= 0) return;
    this.vel.y -= G * dt;
    this.ball.addScaledVector(this.vel, dt);
    // A mistimed ball in the air is a catch: it is taken on the way down.
    if (this.caught && this.vel.y < 0 && this.ball.y <= 2.2) {
      this.report(0, 'caught', this.timing);
      return;
    }
    if (this.ball.y <= BALL_R) {
      this.ball.y = BALL_R;
      if (this.vel.y > -2.2) {
        // Down and running. An outfield takes the pace off slowly, which is
        // why a driven four beats the sweeper without ever leaving the turf.
        this.vel.y = 0;
        this.vel.multiplyScalar(Math.max(0, 1 - 0.36 * dt));
      } else {
        this.vel.y = -this.vel.y * 0.45;
        this.vel.multiplyScalar(0.8);
      }
      if (this.vel.length() < 1.4) {
        this.settle();
        return;
      }
    }
    if (Math.hypot(this.ball.x, this.ball.z) >= this.boundary) this.settle();
  }

  /** The bat arrived. Where was the ball? */
  private contact(): void {
    const speed = Math.abs(this.vel.z) || 1;
    // Positive: the ball had already gone past. Negative: it was not there yet.
    this.error = -(this.ball.z - this.contactZ) / speed;
    this.timing = this.bandFor(this.error);
    this.quality = strikeQuality(this.error);

    // THE BAT HAS TO BE THERE. Timing already asked whether the bat got
    // there in TIME; this asks whether it got there in SPACE — and only
    // in space, so the two are not the same question asked twice. The
    // ball is projected onto the contact PLANE and the bat is measured
    // against its line and its height, which is what makes the choice of
    // stroke matter: a sweep passes under a ball a pull would have hit
    // off the chest.
    if (this.batAt) {
      const bat = this.batAt();
      const t = (this.contactZ - this.ball.z) / this.vel.z;
      const px = this.ball.x + this.vel.x * t;
      const py = this.ball.y + this.vel.y * t - 0.5 * G * t * t;
      this.miss = Math.hypot(bat.x - px, bat.y - py);
      if (this.miss > this.reach) {
        this.timing = 'missed';
        this.quality = 0;
      } else {
        // Off the middle at nothing, off the edge at everything.
        this.quality *= 1 - (this.miss / this.reach) * 0.55;
      }
    }
    if (this.timing === 'missed') return;   // play on; the stumps decide

    const spec = SHOTS[this.shot as Shot];
    const power = spec.power * this.quality;
    // Launch: where the stroke sends it, with the spread a bat gives it.
    const square = spec.side + spec.spread * (this.rand() - 0.5) * 2;
    const loft = spec.loft * (this.timing === 'middled' ? 1.15 : 0.8);
    this.vel.set(square, loft, 1).normalize().multiplyScalar(power);
    this.ball.y = Math.max(this.ball.y, 0.4);
    this.phase = 'struck';
    // The risk IS the shot: a mistimed ball hit high goes to a fielder.
    this.caught =
      this.vel.y > 4 &&
      (this.timing === 'early' || this.timing === 'late') &&
      this.rand() < spec.risk;
  }

  /**
   * The ball reached the stumps. If it hits them, nothing the bat does
   * afterwards matters. If it misses, a bat still coming down can yet get
   * a late touch on it before the keeper does — that is what `late` is.
   */
  private pastTheStumps(): void {
    if (this.ball.z > -this.pitchLen / 2) return;
    const onStumps =
      Math.abs(this.ball.x) < OUTSIDE_STUMPS && this.ball.y < OVER_STUMPS;
    if (onStumps) {
      if (this.batIn > 0) this.error = this.batIn;
      this.report(0, 'bowled', 'missed');
      return;
    }
    // Still swinging, and the ball is still inside the keeper's reach.
    if (this.batIn > 0 && this.ball.z > -this.pitchLen / 2 - 5) return;
    if (this.batIn > 0) this.error = this.batIn;
    this.report(0, null, 'missed');
  }

  /** The ball stopped, or crossed the rope. */
  private settle(): void {
    if (this.phase !== 'struck') return;
    const dist = Math.hypot(this.ball.x, this.ball.z);
    // Six if it cleared the rope in the air, four if it beat it along the
    // ground, otherwise what the batters could run.
    let runs: number;
    if (dist >= this.boundary) runs = this.ball.y > 0.5 ? 6 : 4;
    else if (dist > 42) runs = 3;
    else if (dist > 26) runs = 2;
    else if (dist > 11) runs = 1;
    else runs = 0;
    this.report(runs, null, this.timing);
  }

  private report(
    runs: number,
    wicket: 'bowled' | 'caught' | null,
    timing: Timing
  ): void {
    if (this.phase === 'dead' || this.phase === 'ready') return;
    this.phase = 'dead';
    this.runs += runs;
    if (wicket) this.wickets += 1;
    this.balls += 1;

    const chaseWon = this.target !== null && this.runs >= this.target;
    const spent = this.balls >= this.overs * 6 || this.wickets >= this.wicketsInHand;
    const inningsOver = chaseWon || spent;
    const outcome: BallOutcome = {
      runs,
      wicket,
      timing,
      error: this.error,
      quality: this.quality,
      miss: this.miss,
      shot: this.shot,
      ball: this.balls,
      innings: inningsOver,
      where: this.ball.clone(),
    };
    for (const cb of this.ballCbs) cb(outcome);
    if (this.balls % 6 === 0 && !inningsOver) {
      for (const cb of this.overCbs) cb(this.balls / 6);
    }
    if (inningsOver) this.endInnings();
  }

  private endInnings(): void {
    if (this.innings === 1) {
      this.firstInnings = this.runs;
      this.target = this.runs + 1;
      this.innings = 2;
      this.runs = 0;
      this.wickets = 0;
      this.balls = 0;
      this.shot = null;
      this.phase = 'ready';
      return;
    }
    const short = (this.target ?? 0) - 1 - this.runs;
    this.result =
      short < 0
        ? `Chase won by ${this.wicketsInHand - this.wickets} wicket${
            this.wicketsInHand - this.wickets === 1 ? '' : 's'
          }`
        : short === 0
          ? 'Match tied'
          : `Defence won by ${short} run${short === 1 ? '' : 's'}`;
    for (const cb of this.endCbs) cb(this.result);
  }

  /** Ready the next delivery. Returns false once the match is over. */
  next(): boolean {
    if (this.over) return false;
    this.phase = 'ready';
    this.shot = null;
    this.batIn = -1;
    return true;
  }
}
