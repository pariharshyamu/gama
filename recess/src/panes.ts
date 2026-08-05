import {
  BoxGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  Scene,
  Vector3,
} from 'three';
import { Rng } from 'gama3d';
import { createGlass } from 'scena3d';
import { PALETTE, type Arena } from './arena';
import { createContestant, type Contestant } from './contestant';

/**
 * ROUND TWO — Panes.
 *
 * Two panes at every step. One is tempered and one is not, they are cut from
 * the same sheet, and there is no way to tell them apart by looking. That is
 * not a puzzle with a trick answer: the round is honestly a coin, and the only
 * thing you can do about a coin is let somebody else flip it first.
 *
 * So the actual mechanic is INFORMATION, and the cost of information is time.
 * The contestants ahead of you are scouts who do not know they are scouts.
 * Every one of them that falls tells you a row for free, and the clock is what
 * stops "wait for everyone else" from being the answer.
 */

/**
 * How high the bridge is slung above the hall floor, metres.
 *
 * The first version laid the panes a metre off the same floor everybody walks
 * on, which made a shattered pane a step down rather than a drop, and the round
 * about nerve had nothing under it to be nervous about. Six metres is enough to
 * read as a fall from the camera and still fit under a nine-metre wall.
 */
export const DECK_Y = 6;

export const ROWS = 12;
export const ROW_GAP = 2.6;
export const SIDE_GAP = 1.5;
export const BRIDGE_Z = 8;
export const PANE = 1.25;

export interface Panes {
  readonly group: Group;
  /** Which row the player is standing on; −1 is the near platform. */
  readonly row: number;
  readonly side: -1 | 1;
  /** Rows whose answer is known because somebody found out. */
  readonly known: number;
  readonly alive: number;
  readonly won: boolean;
  /**
   * Which side holds on a given row.
   *
   * THIS IS THE ANSWER KEY and nothing in the game may call it. It exists so
   * the automated play-through can get past a round that is honestly a coin —
   * a bot that guesses reaches round three one time in four thousand, which
   * makes round three effectively unverifiable. `main.ts` exposes it only
   * behind `?probe=1`.
   */
  peek(row: number): -1 | 1;
  /** Why `choose` might be refusing. Diagnostics only. */
  readonly locks: { stepping: number; falling: number; won: boolean; lost: boolean };
  /** The last pane the player put a foot on, and whether it held. */
  readonly lastStep: { row: number; side: number; safe: number; held: boolean } | null;
  /** Nudge sideways. Refused mid-step, because you cannot change your mind. */
  choose(side: -1 | 1): void;
  /** Commit. Returns false if a step is already in flight. */
  advance(): boolean;
  update(dt: number, player: Contestant): void;
  dispose(): void;
}

export interface PanesOptions {
  seed: number;
  scouts: number;
  onShatter: (row: number, side: -1 | 1, wasPlayer: boolean) => void;
  onStep: (row: number) => void;
  onWin: () => void;
  onLose: () => void;
}

interface Pane {
  mesh: Mesh;
  broken: boolean;
}

interface Scout {
  body: Contestant;
  row: number;
  side: -1 | 1;
  /** Seconds until they work up the nerve for the next one. */
  wait: number;
  falling: number;
}

const rowZ = (row: number) => BRIDGE_Z + row * ROW_GAP;

/**
 * Where a side sits in the world — and it is NEGATED, which is the whole point.
 *
 * The camera looks down +z, so three.js puts world −x on the RIGHT of the
 * screen. Placing side −1 at x = −1.5 therefore drew "left" on the right, and
 * the HUD cheerfully labelled it ◀ LEFT while the player stood on the other
 * one. Sides are defined in SCREEN terms here because that is the only frame
 * the player has.
 */
const sideX = (side: -1 | 1) => -side * SIDE_GAP;

/** Where the player starts: the near platform, on the left-hand pane. */
export const START_AT = { x: sideX(-1), y: DECK_Y + 0.08, z: BRIDGE_Z - ROW_GAP - 1 };
const VEL = new Vector3();

export function buildPanes(scene: Scene, arena: Arena, options: PanesOptions): Panes {
  const group = new Group();
  const rng = new Rng(options.seed * 31 + 7);

  // THE ANSWER KEY. Drawn once, never consulted by anything that draws.
  const safe: (-1 | 1)[] = [];
  for (let r = 0; r < ROWS; r++) safe.push(rng.chance(0.5) ? -1 : 1);

  // Both panes get the SAME material instance. Not "the same settings" — the
  // same object, so there is no possible divergence in tint, roughness or
  // render order for a sharp-eyed player to read the answer off.
  const glass = createGlass({ tint: 0xbfe6f0, opacity: 0.42, reflect: 0.55 });
  const panes: Pane[][] = [];
  const paneGeo = new BoxGeometry(PANE, 0.08, PANE);

  for (let r = 0; r < ROWS; r++) {
    const pair: Pane[] = [];
    for (const side of [-1, 1] as const) {
      const mesh = new Mesh(paneGeo, glass);
      mesh.position.set(sideX(side), DECK_Y, rowZ(r));
      group.add(mesh);
      pair.push({ mesh, broken: false });
    }
    panes.push(pair);
  }

  // Platforms at both ends, and a frame you can read the span against.
  const deckMat = new MeshStandardMaterial({ color: PALETTE.wall, roughness: 0.9 });
  const near = new Mesh(new BoxGeometry(7, 1, 5), deckMat);
  near.position.set(0, DECK_Y - 0.5, BRIDGE_Z - ROW_GAP - 1.5);
  const far = new Mesh(new BoxGeometry(7, 1, 5), deckMat);
  far.position.set(0, DECK_Y - 0.5, rowZ(ROWS) + 1.5);
  group.add(near, far);

  const railMat = new MeshStandardMaterial({ color: PALETTE.trim, roughness: 0.7 });
  for (const side of [-1, 1]) {
    const rail = new Mesh(new BoxGeometry(0.14, 0.14, ROWS * ROW_GAP + 6), railMat);
    rail.position.set(side * 3.2, DECK_Y + 1.1, rowZ(ROWS / 2) - ROW_GAP / 2);
    group.add(rail);
  }

  const paneOf = (row: number, side: -1 | 1) => panes[row][side < 0 ? 0 : 1];

  /** Break a pane and drop whoever is on it. Returns true if it was the trap. */
  const tread = (row: number, side: -1 | 1): boolean => {
    if (side === safe[row]) return false;
    const p = paneOf(row, side);
    if (!p.broken) {
      p.broken = true;
      p.mesh.visible = false;
      arena.fx.burst('sparks', new Vector3(sideX(side), DECK_Y, rowZ(row)), {
        count: 24,
        color: 0xcfefff,
        size: 0.09,
        speed: 4.5,
      });
    }
    return true;
  };

  let row = -1;
  let side: -1 | 1 = -1;
  let lastStep: { row: number; side: number; safe: number; held: boolean } | null = null;
  let stepping = 0;
  let falling = 0;
  let won = false;
  let lost = false;
  const from = new Vector3();
  const to = new Vector3();

  // ---- The scouts. They start ahead of you and they are not brave.
  const scouts: Scout[] = [];
  for (let i = 0; i < options.scouts; i++) {
    const s: Scout = {
      body: createContestant({
        seed: 900 + i * 17,
        number: 30 + i,
        at: new Vector3(0, DECK_Y + 0.08, rowZ(-1)),
        facing: 0,
      }),
      row: -1,
      side: rng.chance(0.5) ? -1 : 1,
      wait: 1.2 + i * 1.6 + rng.range(0, 1.2),
      falling: 0,
    };
    group.add(s.body.object);
    scouts.push(s);
  }

  const knownRows = () => {
    let n = 0;
    for (let r = 0; r < ROWS; r++) if (panes[r][0].broken || panes[r][1].broken) n++;
    return n;
  };

  scene.add(group);

  return {
    group,
    get row() {
      return row;
    },
    get side() {
      return side;
    },
    get known() {
      return knownRows();
    },
    get alive() {
      return scouts.filter((s) => !s.body.out).length + (lost ? 0 : 1);
    },
    get won() {
      return won;
    },

    get lastStep() {
      return lastStep;
    },

    get locks() {
      return { stepping: +stepping.toFixed(2), falling: +falling.toFixed(2), won, lost };
    },

    peek(r: number): -1 | 1 {
      return safe[Math.max(0, Math.min(ROWS - 1, r))];
    },

    choose(next: -1 | 1): void {
      // Mid-step is committed. A round whose whole subject is commitment
      // cannot let you swap feet in the air.
      if (stepping > 0 || falling > 0 || won || lost) return;
      side = next;
    },

    advance(): boolean {
      if (stepping > 0 || falling > 0 || won || lost) return false;
      if (row >= ROWS - 1) {
        won = true;
        options.onWin();
        return true;
      }
      stepping = 0.34;
      return true;
    },

    update(dt: number, player: Contestant): void {
      if (dt <= 0) return;

      // ---- The player's step.
      if (stepping > 0) {
        const was = stepping;
        stepping = Math.max(0, stepping - dt);
        if (was > 0 && stepping === 0) {
          row++;
          const trap = tread(row, side);
          lastStep = { row, side, safe: safe[row], held: !trap };
          options.onStep(row);
          if (trap) {
            falling = 1.4;
            options.onShatter(row, side, true);
          } else if (row >= ROWS - 1) {
            won = true;
            options.onWin();
          }
        }
      }

      if (falling > 0) {
        falling = Math.max(0, falling - dt);
        player.object.position.y -= 9 * dt * (1.4 - falling);
        player.hold(dt);
        if (falling === 0 && !lost) {
          lost = true;
          player.eliminate();
          options.onLose();
        }
      } else if (!lost) {
        // Glide to the pane the player is standing on (or heading for).
        const targetRow = stepping > 0 ? row + 1 : row;
        to.set(sideX(side), DECK_Y + 0.08, targetRow < 0 ? rowZ(-1) : rowZ(targetRow));
        from.copy(player.object.position);
        const move = to.clone().sub(from);
        const dist = move.length();
        if (dist > 0.01) {
          VEL.copy(move).multiplyScalar(Math.min(1 / Math.max(dt, 1e-4), 6));
          player.step(dt, VEL);
          player.object.position.y = to.y;
        } else {
          player.hold(dt);
        }
        player.object.rotation.y = 0;
      }

      // ---- The scouts, who do not know they are scouts.
      for (const s of scouts) {
        const b = s.body;
        if (b.out) {
          b.update(dt);
          continue;
        }
        if (s.falling > 0) {
          s.falling = Math.max(0, s.falling - dt);
          b.object.position.y -= 9.8 * dt * (1.6 - s.falling) * 2;
          b.hold(dt);
          if (s.falling === 0) b.eliminate();
          b.update(dt);
          continue;
        }
        s.wait -= dt;
        if (s.wait <= 0 && s.row < ROWS - 1) {
          const next = s.row + 1;
          // They take the known answer when there is one, and guess otherwise
          // — which is exactly what the player is doing, and why they die at
          // the rows nobody has paid for yet.
          const opened = panes[next][0].broken ? 1 : panes[next][1].broken ? -1 : 0;
          s.side = opened !== 0 ? (opened as -1 | 1) : rng.chance(0.5) ? -1 : 1;
          s.row = next;
          b.object.position.set(sideX(s.side), DECK_Y + 0.08, rowZ(next));
          if (tread(next, s.side)) {
            s.falling = 1.4;
            options.onShatter(next, s.side, false);
          }
          s.wait = 1.4 + rng.range(0, 1.6);
        }
        b.hold(dt);
        b.update(dt);
      }
    },

    dispose(): void {
      for (const s of scouts) s.body.dispose();
      paneGeo.dispose();
      glass.dispose();
      group.removeFromParent();
    },
  };
}
