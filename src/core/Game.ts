import { PerspectiveCamera, WebGLRenderer, type Camera } from 'three';
import { Time } from './Time';
import { World } from './World';
import { Input } from '../input/Input';

export interface GameOptions {
  /** Canvas to render into; one is created and appended to `parent` if omitted. */
  canvas?: HTMLCanvasElement;
  /** Element the auto-created canvas is appended to. Defaults to document.body. */
  parent?: HTMLElement;
  antialias?: boolean;
  /** Automatically resize renderer and camera with the window. Default true. */
  autoResize?: boolean;
  /** Cap on devicePixelRatio. Default 2. */
  maxPixelRatio?: number;
}

/**
 * The engine entry point: owns the renderer, world, camera, input and the
 * requestAnimationFrame loop. Wire game logic in with `onUpdate`, or attach
 * Components to GameObjects in `game.world`.
 */
export class Game {
  readonly renderer: WebGLRenderer;
  readonly world = new World();
  readonly time = new Time();
  readonly input: Input;
  camera: Camera;

  private updateCallbacks: Array<(time: Time) => void> = [];
  private running = false;
  private frameHandle = 0;

  constructor(options: GameOptions = {}) {
    const { canvas, parent, antialias = true, autoResize = true, maxPixelRatio = 2 } = options;

    this.renderer = new WebGLRenderer({ canvas, antialias });
    if (!canvas) (parent ?? document.body).appendChild(this.renderer.domElement);

    this.camera = new PerspectiveCamera(60, 1, 0.1, 1000);
    this.input = new Input(this.renderer.domElement);

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));
      this.renderer.setSize(width, height);
      if (this.camera instanceof PerspectiveCamera) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
      }
    };
    if (autoResize) {
      resize();
      window.addEventListener('resize', resize);
    }
  }

  /** Register a callback run every frame before rendering. Returns an unsubscribe. */
  onUpdate(callback: (time: Time) => void): () => void {
    this.updateCallbacks.push(callback);
    return () => {
      const i = this.updateCallbacks.indexOf(callback);
      if (i >= 0) this.updateCallbacks.splice(i, 1);
    };
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    const frame = (now: number) => {
      if (!this.running) return;
      this.time.tick(now);
      this.step(this.time);
      this.frameHandle = requestAnimationFrame(frame);
    };
    this.frameHandle = requestAnimationFrame(frame);
  }

  stop(): void {
    this.running = false;
    cancelAnimationFrame(this.frameHandle);
  }

  /** One simulation + render step. Exposed for testing and manual stepping. */
  step(time: Time): void {
    for (const callback of this.updateCallbacks) callback(time);
    this.world.update(time);
    this.input.lateUpdate();
    this.renderer.render(this.world.scene, this.camera);
  }

  dispose(): void {
    this.stop();
    this.input.dispose();
    this.world.clear();
    this.renderer.dispose();
  }
}
