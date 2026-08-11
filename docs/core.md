# Core: loop, entities, events, pooling

## Game

`Game` owns the renderer, canvas, camera, input and the frame loop.

```ts
const game = new Game({
  antialias: true,
  maxPixelRatio: 2,
  fixedDelta: 1 / 50,   // fixed-step rate, see below
});
game.start();           // begins requestAnimationFrame loop
game.stop();
game.step(time);        // manual stepping (tests, replays)
```

### Variable vs fixed update

Two update streams run every frame, in this order:

- **Fixed** — `game.onFixedUpdate(cb)` and `Component.fixedUpdate` run zero
  or more times per frame at exactly `fixedDelta` seconds per step. Use for
  logic that must be framerate-independent and deterministic (custom physics,
  networking-sensitive simulation). A sub-step cap prevents the spiral of
  death after a stall; `game.fixedAlpha` gives the interpolation factor if
  you want to smooth rendering between fixed states.
- **Variable** — `game.onUpdate(cb)` and `Component.update` run once per
  frame with the real (clamped) delta. Use for cameras, tweens, input
  response, and most gameplay.

`Time` carries `delta` (clamped by `maxDelta` so background tabs don't
explode the simulation), `rawDelta`, `elapsed`, `frame`, and a `scale`
multiplier for slow-motion or pause (`time.scale = 0`).

## World, GameObject, Component

```ts
const world = game.world;          // owns THREE.Scene + object registry
const thing = world.spawn('name'); // create + add a GameObject
world.findByName('name');
world.findByTag('enemy');
```

`GameObject` extends `THREE.Object3D` — position it, parent meshes to it,
raycast against it, exactly like any three.js object. Behaviour comes from
components:

```ts
class Spin extends Component {
  update(time: Time) { this.owner.rotation.y += time.delta; }
}
thing.addComponent(new Spin());
thing.getComponent(Spin);          // instance or undefined
thing.requireComponent(Spin);      // instance or throw
```

Lifecycle: `onAttach` → `update`/`fixedUpdate` while enabled → `onDetach`.

Destruction is deferred: `thing.destroy()` flags the object; the world reaps
it *after* the current update pass, so destroying anything mid-frame is safe.

## Events

Every `GameObject` has a typed emitter:

```ts
enemy.events.on('destroyed', () => dropLoot(enemy.position));
player.events.on('collision-enter', (other) => { ... });  // via CollisionSystem
player.events.emit('leveled-up', 5);                       // custom events
```

`on` returns an unsubscribe function. `once` auto-removes after one call.
A standalone `EventEmitter<Events>` class is exported for game-wide buses.

## Pooling

Creating and destroying objects every frame causes GC hitches — the classic
web-game stutter. Pool anything spawned in volume (bullets, particles,
pickups):

```ts
const bullets = new Pool(game.world, {
  create: makeBulletObject,                       // called only when pool is empty
  onAcquire: (b) => b.position.copy(muzzle),      // reset state on reuse
});
bullets.warm(64);                                 // pre-create during loading

const b = bullets.acquire();   // in world, visible
bullets.release(b);            // detached, hidden, kept for reuse
```

Released objects keep their components. Use `release()`, never `destroy()`,
for pooled objects — destroy disposes components and defeats reuse.
