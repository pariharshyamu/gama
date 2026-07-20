// GAMA — Gaming And Motion Agent
// A 3D game development library built on top of three.js.

// Core
export { Game, type GameOptions } from './core/Game';
export { World } from './core/World';
export { GameObject, type GameObjectEvents } from './core/GameObject';
export { Component } from './core/Component';
export { Time } from './core/Time';
export { EventEmitter } from './core/EventEmitter';
export { FixedStepper } from './core/FixedStepper';
export { Pool, type PoolOptions } from './core/Pool';

// Input
export { Input } from './input/Input';
export {
  ActionMap,
  GamepadButton,
  type ActionBinding,
  type ActionInput,
} from './input/ActionMap';

// Motion agents & steering
export { MotionAgent, type MotionAgentOptions } from './motion/MotionAgent';
export {
  Seek,
  Flee,
  Arrive,
  Pursue,
  Evade,
  Wander,
  Separation,
  Alignment,
  Cohesion,
  FollowPath,
  type SteeringBehavior,
  type Target,
  type Neighbors,
} from './motion/steering';
export { Path } from './motion/Path';
export { StateMachine, type State } from './motion/StateMachine';
export { SpatialGrid } from './motion/SpatialGrid';
export { ObstacleAvoidance, Containment, type Obstacle } from './motion/avoidance';

// Navigation
export { NavMesh, type NavMeshOptions, type NavTriangle } from './nav/NavMesh';
export { NavMeshAgent, type NavMeshAgentOptions } from './nav/NavMeshAgent';

// AI: behavior trees
export {
  BehaviorTree,
  BTNode,
  Action,
  Condition,
  Wait,
  Sequence,
  Selector,
  ReactiveSequence,
  ReactiveSelector,
  Parallel,
  Inverter,
  Succeeder,
  Repeat,
  UntilFail,
  Cooldown,
  sequence,
  selector,
  reactiveSequence,
  reactiveSelector,
  parallel,
  action,
  condition,
  wait,
  invert,
  succeed,
  repeat,
  untilFail,
  cooldown,
  type BTStatus,
  type BehaviorTreeOptions,
  type ParallelOptions,
} from './ai/behaviorTree';

// Animation
export { Tween, Tweens, type TweenOptions } from './animation/Tween';
export * as easing from './animation/easing';
export { Animator } from './animation/Animator';

// Controllers & camera
export {
  CharacterController,
  type CharacterControllerOptions,
} from './controllers/CharacterController';
export { FollowCamera, type FollowCameraOptions } from './camera/FollowCamera';

// Physics-lite
export {
  SphereCollider,
  BoxCollider,
  checkCollisions,
  type CollisionPair,
} from './physics/Collider';
export { CollisionSystem } from './physics/CollisionSystem';

// Assets & audio
export { Assets } from './assets/Assets';
export {
  AudioManager,
  type PlayOptions,
  type PositionalPlayOptions,
} from './audio/AudioManager';

// Debug
export { DebugOverlay, type DebugOverlayOptions } from './debug/DebugOverlay';
