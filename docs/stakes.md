# Stakes: Health & Projectiles

The trilogy's combat register is wholesome on purpose: bonk and
knockout, not gore. Death is a crumple and a respawn shimmer. What this
page adds is the *rules* — the three conventions every action game
relies on, and the shots that trigger them.

## Health

```ts
import { Health } from 'gama3d';

const health = new Health({
  max: 5,
  invulnerable: 1,
  onDamage: (e) => {
    hud.hearts(health.current, health.max);
    feel.shake(0.35);
    sounds.impact('soft', 0.8);
    if (e.knockback) agent.velocity.add(e.knockback);   // ready-made impulse
  },
  onDeath: () => hud.banner('KNOCKED OUT'),
  onRevive: () => hud.banner('BACK UP!'),
});

health.damage({ from: enemy.position, knockback: 6 }, hero.position);
game.onUpdate((t) => health.update(t.delta));
```

The three rules:

- **I-frames.** A successful hit opens an invulnerability window;
  damage inside it is *refused* (`damage()` returns null). This is the
  difference between a hazard and a blender — standing in fire costs
  one heart per window, not one per frame — and the classic visual is
  free: blink the mesh while `invulnerableFor > 0`.
- **Death is an edge.** `onDeath` fires exactly once, at the hit that
  did it (which also still reports through `onDamage` — the killing
  blow deserves its shake). Further damage is ignored.
- **The dead don't heal.** `heal()` on a knocked-out character does
  nothing; the way back is `revive()` — a deliberate act with its own
  event and a mercy window of i-frames.

Knockback comes back *computed*: away from `from`, planar with a pop of
lift, sized by the hit — one `velocity.add()` and the blow reads.

## Projectiles

```ts
import { Projectiles } from 'gama3d';

const shots = new Projectiles({
  gravity: 9.8,          // arcs; leave 0 for bolts
  floor: 0,              // ground kills shots (onExpire fires there)
  onHit: ({ target, at, velocity }) => {
    byTarget.get(target).damage({ from: at, knockback: 5 }, target.center);
  },
  onExpire: (at) => fx.burst('dust', at),   // a miss still lands somewhere
});
scene.add(shots.mesh);                       // one InstancedMesh, every tracer

shots.addTarget({ center: foe.position, radius: 0.7, team: 'foes' });
shots.fire(muzzle, aimVelocity, { team: 'player' });
game.onUpdate((t) => shots.update(t.delta));
```

Design notes:

- **Targets are structural** — the same `{center, radius}` every
  trigger in the trilogy speaks, with an optional `team`. Shots carry a
  team too, and matching teams pass through: no friendly fire unless
  you choose it by omitting teams.
- **Pooled, never allocating.** `fire()` costs a slot; a full pool
  recycles its *oldest* shot rather than refusing, because the newest
  shot is the one the player just made and it must exist.
- **Lag is sub-stepped**, the same discipline as effects: a slow frame
  advances shots honestly instead of teleporting them through targets.

## One hit, every sense

The whole point of phases B and C together:

```ts
onHit: ({ target, at }) => {
  const foe = byTarget.get(target);
  const e = foe.health.damage({ from: at, knockback: 5 }, target.center);
  if (!e) return;                       // i-frames said no
  sounds.impact('soft', 0.7, { at });   // ear
  fx.burst('sparks', at);               // eye (scena)
  feel.shake(0.2);                      // hand
  if (e.current === 0) {
    feel.hitStop(0.1);                  // the weight of the last one
    anima.knockOut();                   // the crumple — anima's release, next
  }
}
```
