# Animation: tweens & clips

## Tweens

Tween any numeric properties — positions, rotations, scales, material
opacity, camera FOV. Create one `Tweens` group and update it each frame:

```ts
import { Tweens, easing } from 'gama3d';

const tweens = new Tweens();
game.onUpdate((time) => tweens.update(time.delta));

tweens.to(door.position, { y: 4 }, { duration: 0.6, easing: easing.cubicInOut });
tweens.to(pickup.scale, { x: 1, y: 1, z: 1 }, {
  duration: 0.4,
  easing: easing.backOut,
  delay: 0.1,
  onComplete: () => sparkle(pickup),
});
```

Notes:

- Start values are captured **when the tween begins** (after `delay`), so
  delayed tweens animate from live state, not stale state.
- The returned `Tween` has `.cancel()`.
- Easings: `linear`, `quadIn/Out/InOut`, `cubicIn/Out/InOut`,
  `sineIn/Out/InOut`, `backOut`, `elasticOut`, `bounceOut`. Any
  `(t: number) => number` works.

## Skinned characters: Animator

`Animator` wraps `THREE.AnimationMixer` with named clips and cross-fades:

```ts
const gltf = await assets.gltf('models/hero.glb');
hero.add(gltf.scene);
const animator = hero.addComponent(new Animator(gltf.animations, gltf.scene));

animator.play('idle');
animator.play('run', 0.2);   // cross-fade over 0.2s; no-op if already playing
```

A common pattern — drive animation from agent speed:

```ts
class Locomotion extends Component {
  constructor(private agent: MotionAgent, private animator: Animator) { super(); }
  update() {
    const speed = this.agent.velocity.length();
    this.animator.play(speed < 0.2 ? 'idle' : speed < 4 ? 'walk' : 'run');
  }
}
```
