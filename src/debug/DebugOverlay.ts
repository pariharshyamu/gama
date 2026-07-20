import {
  ArrowHelper,
  Group,
  Mesh,
  MeshBasicMaterial,
  SphereGeometry,
  Vector3,
} from 'three';
import type { Game } from '../core/Game';
import type { GameObject } from '../core/GameObject';
import { MotionAgent } from '../motion/MotionAgent';
import { SphereCollider } from '../physics/Collider';

export interface DebugOverlayOptions {
  /** Key that toggles the overlay (KeyboardEvent.code). Pass null to disable. Default 'F3'. */
  hotkey?: string | null;
  /** Show the stats panel (FPS, entities, draw calls). Default true. */
  stats?: boolean;
}

const VELOCITY_COLOR = 0x22d3ee; // cyan
const STEERING_COLOR = 0xe879f9; // magenta
const COLLIDER_COLOR = 0x4ade80; // green

/**
 * Visual debugging for a running game: velocity and steering-force arrows
 * on every MotionAgent, wireframes for sphere colliders, and a stats panel.
 * Steering bugs are invisible without force visualization — this makes
 * "why is my agent doing that?" a thing you can see.
 *
 * ```ts
 * const debug = new DebugOverlay(game); // press F3 in-game to toggle
 * ```
 */
export class DebugOverlay {
  enabled = false;

  private readonly group = new Group();
  private velocityArrows = new Map<GameObject, ArrowHelper>();
  private steeringArrows = new Map<GameObject, ArrowHelper>();
  private colliderMeshes = new Map<GameObject, Mesh>();
  private panel: HTMLDivElement | null = null;
  private fps = 60;
  private hotkey: string | null;
  private showStats: boolean;
  private unsubscribe: () => void;
  private readonly scratch = new Vector3();
  private readonly seen = new Set<GameObject>();
  private readonly wireMaterial = new MeshBasicMaterial({
    color: COLLIDER_COLOR,
    wireframe: true,
  });
  private readonly sphereGeometry = new SphereGeometry(1, 12, 8);

  constructor(private game: Game, options: DebugOverlayOptions = {}) {
    this.hotkey = options.hotkey === undefined ? 'F3' : options.hotkey;
    this.showStats = options.stats ?? true;
    this.group.name = '__gama_debug';
    this.group.visible = false;
    game.world.scene.add(this.group);
    this.unsubscribe = game.onUpdate(() => this.update());
  }

  toggle(): void {
    this.setEnabled(!this.enabled);
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    this.group.visible = enabled;
    if (this.panel) this.panel.style.display = enabled ? 'block' : 'none';
  }

  private update(): void {
    const { time, input } = this.game;
    if (this.hotkey && input.wasPressed(this.hotkey)) this.toggle();
    if (time.rawDelta > 0) {
      this.fps += (1 / time.rawDelta - this.fps) * 0.05;
    }
    if (!this.enabled) return;

    this.seen.clear();
    for (const object of this.game.world.objects) {
      this.seen.add(object);
      const agent = object.getComponent(MotionAgent);
      if (agent) this.updateAgentArrows(object, agent);
      const collider = object.getComponent(SphereCollider);
      if (collider) this.updateColliderMesh(object, collider);
    }
    this.prune(this.velocityArrows);
    this.prune(this.steeringArrows);
    this.prune(this.colliderMeshes);
    if (this.showStats) this.updatePanel();
  }

  private updateAgentArrows(object: GameObject, agent: MotionAgent): void {
    this.updateArrow(this.velocityArrows, object, agent.velocity, VELOCITY_COLOR, 0.4);
    this.updateArrow(this.steeringArrows, object, agent.lastSteering, STEERING_COLOR, 0.15);
  }

  private updateArrow(
    map: Map<GameObject, ArrowHelper>,
    object: GameObject,
    vector: Vector3,
    color: number,
    scale: number
  ): void {
    let arrow = map.get(object);
    if (!arrow) {
      arrow = new ArrowHelper(new Vector3(0, 0, 1), object.position, 1, color, 0.25, 0.15);
      map.set(object, arrow);
      this.group.add(arrow);
    }
    const length = vector.length() * scale;
    if (length < 0.05) {
      arrow.visible = false;
      return;
    }
    arrow.visible = true;
    arrow.position.copy(object.position);
    arrow.setDirection(this.scratch.copy(vector).normalize());
    arrow.setLength(length, Math.min(0.25, length * 0.4), 0.15);
  }

  private updateColliderMesh(object: GameObject, collider: SphereCollider): void {
    let mesh = this.colliderMeshes.get(object);
    if (!mesh) {
      mesh = new Mesh(this.sphereGeometry, this.wireMaterial);
      this.colliderMeshes.set(object, mesh);
      this.group.add(mesh);
    }
    object.getWorldPosition(mesh.position);
    mesh.scale.setScalar(collider.radius);
  }

  private prune(map: Map<GameObject, { removeFromParent(): void }>): void {
    for (const [object, helper] of map) {
      if (!this.seen.has(object)) {
        helper.removeFromParent();
        map.delete(object);
      }
    }
  }

  private updatePanel(): void {
    if (typeof document === 'undefined') return;
    if (!this.panel) {
      this.panel = document.createElement('div');
      this.panel.style.cssText =
        'position:fixed;bottom:12px;left:12px;padding:8px 12px;' +
        'background:rgba(11,14,20,0.85);color:#7dd3fc;border:1px solid #1e293b;' +
        'border-radius:6px;font:12px/1.6 ui-monospace,monospace;pointer-events:none;z-index:9999;' +
        'white-space:pre';
      document.body.appendChild(this.panel);
    }
    const info = this.game.renderer.info.render;
    this.panel.style.display = 'block';
    this.panel.textContent =
      `fps       ${this.fps.toFixed(0)}\n` +
      `entities  ${this.game.world.objects.length}\n` +
      `draws     ${info.calls}  tris ${info.triangles}`;
  }

  dispose(): void {
    this.unsubscribe();
    this.group.removeFromParent();
    this.panel?.remove();
    this.velocityArrows.clear();
    this.steeringArrows.clear();
    this.colliderMeshes.clear();
  }
}
