/**
 * The workloads.
 *
 * Every case runs against `dist/` — the built bundle, not the source — so
 * what is measured is what ships, including whatever the bundler did to it.
 *
 * Each case has two kinds of result and they are treated very differently:
 *
 *   **time** is compared against a baseline with a wide band, because a
 *   wall clock on a shared machine is noise with a signal in it. It catches
 *   the thing worth catching — an O(n) that quietly became O(n²) — and
 *   nothing subtler than that, and pretending otherwise is how a perf gate
 *   becomes something everybody reruns until it passes.
 *
 *   **counters** are exact and compared exactly. How many neighbour
 *   candidates a flock examined, how many entities a level built, how many
 *   bytes a snapshot put on the wire. These are the real gate: they do not
 *   move unless behaviour moved.
 */
import {
  Alignment,
  Arrive,
  BehaviorTree,
  Catalog,
  Cohesion,
  Editor,
  Level,
  MotionAgent,
  NavMesh,
  Path,
  Pool,
  Seek,
  Separation,
  SpatialGrid,
  Tweens,
  World,
  action,
  condition,
  reactiveSelector,
  sequence,
} from '../dist/index.js';
import { Link, NetClient, NetServer } from '../dist/net.js';
import { BoxGeometry, Group, Mesh, MeshBasicMaterial, Vector3 } from 'three';

/**
 * A fixed-step clock for `World.update`, which takes a `Time` and not a
 * number. Advancing `elapsed` and `frame` too, because anything reading them
 * (behavior-tree intervals, wander noise) would otherwise run on a stopped
 * clock and the benchmark would measure the wrong thing.
 */
function stepper(dt = 1 / 60) {
  const time = { delta: dt, rawDelta: dt, elapsed: 0, frame: 0, scale: 1 };
  return {
    time,
    tick() {
      time.elapsed += dt;
      time.frame += 1;
      return time;
    },
  };
}

/**
 * Sums a SpatialGrid's work counters across frames.
 *
 * `grid.rebuild()` zeroes `grid.stats` — the counters describe one frame,
 * which is what a profiling user wants — so a benchmark spanning many frames
 * has to bank each frame before the next rebuild wipes it.
 */
function gridWork() {
  const total = { cellsVisited: 0, tested: 0, found: 0 };
  return {
    bank(grid) {
      total.cellsVisited += grid.stats.cellsVisited;
      total.tested += grid.stats.tested;
      total.found += grid.stats.found;
    },
    counters: () => ({ ...total }),
  };
}

/** Deterministic pseudo-random, so every run builds the same world. */
const rng = (seed) => {
  let s = seed >>> 0 || 1;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

// ---------------------------------------------------------------- the cases

export const cases = [
  {
    name: 'calibrate',
    note: 'the machine, not the library — every other time is divided by this',
    /**
     * A fixed lump of arithmetic with no library in it.
     *
     * This is what makes a committed timing baseline mean anything across
     * machines: the numbers stored are RATIOS to this, so a laptop that is
     * half the speed of the CI box scores the same. It is not perfect —
     * cache and branch behaviour do not scale together — but it turns "this
     * baseline is useless anywhere but where it was recorded" into "this
     * baseline is roughly portable".
     */
    run() {
      // Four million, not two hundred thousand. The first version took 2.2 ms
      // and its own run-to-run variance was the largest term in every ratio
      // it was supposed to normalise — the `noise` column said 2.5× on the
      // calibration itself. A measuring stick has to be longer than the
      // wobble in it.
      let total = 0;
      for (let i = 0; i < 4000000; i++) {
        total += Math.sqrt(i) * Math.sin(i * 0.001);
      }
      return { checksum: Math.round(total) };
    },
  },

  {
    name: 'flock-200',
    note: '200 agents, separation + alignment + cohesion, 60 steps',
    setup() {
      const random = rng(7);
      const world = new World();
      const grid = new SpatialGrid(4);
      const agents = [];
      for (let i = 0; i < 200; i++) {
        const object = world.spawn(`a${i}`);
        object.position.set((random() - 0.5) * 60, 0, (random() - 0.5) * 60);
        const agent = object.addComponent(new MotionAgent({ maxSpeed: 6, planar: true }));
        const near = grid.near(agent, 6);
        agent.addBehavior(new Separation(near, 3), 1.6);
        agent.addBehavior(new Alignment(near, 6), 1);
        agent.addBehavior(new Cohesion(near, 6), 0.8);
        agents.push(agent);
      }
      return { world, grid, agents };
    },
    run({ world, grid, agents }) {
      const clock = stepper();
      const work = gridWork();
      for (let step = 0; step < 60; step++) {
        grid.rebuild(agents);
        world.update(clock.tick());
        // `rebuild` zeroes the counters, so bank the frame before the next one.
        work.bank(grid);
      }
      // A checksum, not a counter: it makes a silent behaviour change during
      // an "optimisation" impossible to miss.
      let sum = 0;
      for (const object of world.objects) sum += object.position.x + object.position.z;
      return { checksum: Number(sum.toFixed(3)), counters: work.counters() };
    },
  },

  {
    name: 'spatial-grid',
    note: '2000 agents rebuilt and queried',
    setup() {
      const random = rng(11);
      const world = new World();
      const grid = new SpatialGrid(5);
      const agents = [];
      for (let i = 0; i < 2000; i++) {
        const object = world.spawn();
        object.position.set((random() - 0.5) * 200, 0, (random() - 0.5) * 200);
        agents.push(object.addComponent(new MotionAgent()));
      }
      return { grid, agents };
    },
    run({ grid, agents }) {
      const out = [];
      const work = gridWork();
      for (let pass = 0; pass < 10; pass++) {
        grid.rebuild(agents);
        for (const agent of agents) grid.neighbors(agent.owner.position, 8, out);
        work.bank(grid);
      }
      // EXACT, and deliberately WORK rather than results.
      //
      // This case used to report only the neighbour count, which was useless:
      // a broadphase that scans an extra ring of cells returns exactly the
      // same neighbours, so a deliberate regression sailed straight through
      // the gate. `cellsVisited` and `tested` are the cost. `found` stays
      // because it pins the answer while the others pin the effort.
      return { counters: work.counters() };
    },
  },

  {
    name: 'navmesh-path',
    note: '400 A* + funnel queries across a 40x40 quad mesh',
    setup() {
      // A flat grid of quads, split into triangles. Big enough that a
      // pathfinding regression shows up, small enough to stay under a second.
      const size = 40;
      const positions = [];
      const indices = [];
      for (let z = 0; z <= size; z++) {
        for (let x = 0; x <= size; x++) positions.push(x - size / 2, 0, z - size / 2);
      }
      const at = (x, z) => z * (size + 1) + x;
      for (let z = 0; z < size; z++) {
        for (let x = 0; x < size; x++) {
          indices.push(at(x, z), at(x + 1, z), at(x + 1, z + 1));
          indices.push(at(x, z), at(x + 1, z + 1), at(x, z + 1));
        }
      }
      return { mesh: new NavMesh(positions, indices) };
    },
    run({ mesh }) {
      const random = rng(3);
      let waypoints = 0;
      let length = 0;
      for (let i = 0; i < 400; i++) {
        const from = new Vector3((random() - 0.5) * 38, 0, (random() - 0.5) * 38);
        const to = new Vector3((random() - 0.5) * 38, 0, (random() - 0.5) * 38);
        const path = mesh.findPath(from, to);
        waypoints += path.length;
        for (let p = 1; p < path.length; p++) length += path[p].distanceTo(path[p - 1]);
      }
      return { counters: { waypoints }, checksum: Number(length.toFixed(2)) };
    },
  },

  {
    name: 'path-follow',
    note: '500 agents following a path with arrive, 900 steps',
    setup() {
      const world = new World();
      const path = new Path([
        new Vector3(-20, 0, -20),
        new Vector3(20, 0, -20),
        new Vector3(20, 0, 20),
        new Vector3(-20, 0, 20),
      ], true);
      const random = rng(19);
      for (let i = 0; i < 500; i++) {
        const object = world.spawn();
        object.position.set((random() - 0.5) * 40, 0, (random() - 0.5) * 40);
        object
          .addComponent(new MotionAgent({ maxSpeed: 8, planar: true }))
          .addBehavior(new Arrive(path.waypoints[i % 4], 4));
      }
      return { world };
    },
    run({ world }) {
      const clock = stepper();
      for (let step = 0; step < 900; step++) world.update(clock.tick());
      let sum = 0;
      for (const object of world.objects) sum += object.position.length();
      return { checksum: Number(sum.toFixed(3)) };
    },
  },

  {
    name: 'behavior-tree',
    note: '400 reactive trees, 3000 ticks',
    setup() {
      const world = new World();
      for (let i = 0; i < 400; i++) {
        const object = world.spawn();
        const context = { alert: false, ticks: 0, distance: 10 };
        const tree = reactiveSelector(
          sequence(
            condition((c) => c.distance < 5),
            action((c) => {
              c.ticks += 1;
              return 'running';
            })
          ),
          action((c) => {
            c.distance -= 0.05;
            c.ticks += 1;
            return 'running';
          })
        );
        object.addComponent(new BehaviorTree(tree, context, { interval: 0 }));
      }
      return { world };
    },
    run({ world }) {
      const clock = stepper();
      for (let step = 0; step < 3000; step++) world.update(clock.tick());
      let ticks = 0;
      for (const object of world.objects) {
        ticks += object.getComponent(BehaviorTree).context.ticks;
      }
      // Exact: a tree that stops reacting, or reacts twice, changes this.
      return { counters: { actionTicks: ticks } };
    },
  },

  {
    name: 'tweens',
    note: '2000 long tweens, 600 updates',
    setup() {
      const tweens = new Tweens();
      const targets = [];
      for (let i = 0; i < 2000; i++) {
        const target = { x: 0, y: 0, alpha: 0 };
        targets.push(target);
        // Long enough that they are all still ACTIVE at the end: a bench
        // whose tweens finish halfway measures an empty list for the rest.
        tweens.to(target, { x: 10, y: -4, alpha: 1 }, { duration: 30 });
      }
      return { tweens, targets };
    },
    run({ tweens, targets }) {
      for (let step = 0; step < 600; step++) tweens.update(1 / 60);
      let sum = 0;
      for (const target of targets) sum += target.x + target.alpha;
      return { checksum: Number(sum.toFixed(3)), counters: { active: tweens.active } };
    },
  },

  {
    name: 'pool',
    note: '600k acquire/release cycles',
    setup() {
      const world = new World();
      const pool = new Pool(world, { create: () => world.spawn('shot') });
      pool.warm(64);
      return { pool };
    },
    run({ pool }) {
      const live = [];
      for (let i = 0; i < 600000; i++) {
        live.push(pool.acquire());
        if (live.length > 64) pool.release(live.shift());
      }
      // Exact: a pool that leaks allocates instead of reusing, and this is
      // the number that says so.
      return { counters: { live: live.length, active: pool.active.size } };
    },
  },

  {
    name: 'level-roundtrip',
    note: 'instantiate 300 entities and serialize, 20 times',
    setup() {
      const catalog = new Catalog()
        .define('box', () => new Mesh(new BoxGeometry(), new MeshBasicMaterial()))
        .define('group', () => ({ object: new Group() }));
      const entities = [];
      const random = rng(23);
      for (let i = 0; i < 300; i++) {
        entities.push({
          id: `e${i}`,
          kind: i % 3 === 0 ? 'group' : 'box',
          at: [Number((random() * 40).toFixed(2)), 0, Number((random() * 40).toFixed(2))],
          rot: Number((random() * 3).toFixed(3)),
          ...(i % 5 === 0 ? { tags: ['spawn'] } : {}),
        });
      }
      return { catalog, data: { format: 'gama.level', version: 1, seed: 5, entities } };
    },
    run({ catalog, data }) {
      let bytes = 0;
      let built = 0;
      for (let pass = 0; pass < 20; pass++) {
        const live = Level.parse(structuredClone(data)).instantiate(catalog, new Group());
        built += live.objects.length;
        bytes += JSON.stringify(live.serialize()).length;
        live.dispose();
      }
      // Exact, and the one that matters: the round trip must not grow the
      // file, and every entity must build.
      return { counters: { built, bytes } };
    },
  },

  {
    name: 'editor-edits',
    note: '2000 nudges with undo/redo over a 300-entity level',
    setup() {
      const catalog = new Catalog().define('box', () => new Mesh(new BoxGeometry()));
      const entities = Array.from({ length: 300 }, (_, i) => ({
        id: `e${i}`,
        kind: 'box',
        at: [i % 20, 0, Math.floor(i / 20)],
      }));
      const live = Level.parse({ format: 'gama.level', version: 1, entities }).instantiate(
        catalog,
        new Group()
      );
      return { editor: new Editor(live, { snap: 0.5 }) };
    },
    run({ editor }) {
      for (let i = 0; i < 2000; i++) {
        editor.select(`e${i % 300}`);
        editor.move(0.5, 0, 0);
        editor.commit();
      }
      let undone = 0;
      while (editor.undo()) undone += 1;
      // Exact: the history ceiling and the undo path are both behaviour.
      return { counters: { undone, entities: editor.toJSON().entities.length } };
    },
  },

  {
    name: 'net-8-clients',
    note: 'authoritative server, 8 clients over simulated links, 1800 frames',
    setup() {
      const move = (state, input, dt) => {
        state.x += (input?.x ?? 0) * 6 * dt;
        state.z += (input?.z ?? 0) * 6 * dt;
      };
      const server = new NetServer({ apply: move, tickRate: 30, sendRate: 15 });
      server.onJoin = (client) => server.spawn(client.id, { x: 0, z: 0 }, { owner: client.id });
      const links = [];
      const clients = [];
      for (let i = 0; i < 8; i++) {
        const link = new Link({ latency: 40 + i * 8, jitter: 10, seed: 5 + i });
        server.accept(link.server, `p${i}`);
        links.push(link);
        clients.push(new NetClient(link.client, { apply: move }));
      }
      return { server, links, clients };
    },
    run({ server, links, clients }) {
      const dt = 1 / 60;
      for (let step = 0; step < 1800; step++) {
        const angle = step * 0.05;
        for (let i = 0; i < clients.length; i++) {
          clients[i].setInput({ x: Math.cos(angle + i), z: Math.sin(angle + i) });
        }
        for (const link of links) link.advance(dt);
        server.update(dt);
        for (const client of clients) client.update(dt);
      }
      const bytes = links.reduce((sum, link) => sum + link.bytes, 0);
      const packets = links.reduce((sum, link) => sum + link.sent, 0);
      let corrections = 0;
      for (const client of clients) corrections += client.corrections;
      // Exact, and the most valuable counters in the file: bytes on the wire
      // per player-second, and whether prediction held. A change that starts
      // mispredicting shows up here and nowhere else.
      return {
        counters: { bytes, packets, corrections, tick: server.tick },
      };
    },
  },
];
