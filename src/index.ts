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
export {
  TouchControls,
  type TouchControlsOptions,
  type TouchButtonSpec,
} from './input/TouchControls';

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
export { Harass, type HarassOptions } from './motion/harass';
export { driveVehicle, type VehicleRunningGear } from './motion/driveVehicle';

// Navigation
export { NavMesh, type NavMeshOptions, type NavTriangle } from './nav/NavMesh';
export { NavMeshAgent, type NavMeshAgentOptions } from './nav/NavMeshAgent';
export { generateNavMesh, type NavMeshGenOptions } from './nav/generateNavMesh';

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
export {
  Locomotion,
  matchClips,
  type LocomotionClips,
  type LocomotionOptions,
  type LocomotionSource,
} from './animation/Locomotion';

// Controllers & camera
export {
  CharacterController,
  type CharacterControllerOptions,
} from './controllers/CharacterController';
export {
  VehicleController,
  type VehicleControllerOptions,
  type DriveIntent,
} from './controllers/VehicleController';
export {
  PlatformerController,
  type PlatformerOptions,
  type PlatformLike,
} from './controllers/PlatformerController';
export {
  FlightController,
  type FlightControllerOptions,
  type FlightControls,
} from './controllers/FlightController';
export {
  HoverController,
  type HoverControllerOptions,
  type HoverControls,
} from './controllers/HoverController';
export { FollowCamera, type FollowCameraOptions } from './camera/FollowCamera';
export { ChaseCamera, type ChaseCameraOptions } from './camera/ChaseCamera';
export { OrbitRig, type OrbitRigOptions, type PointerLookInput } from './camera/OrbitRig';
export { ShoulderRig, type ShoulderRigOptions } from './camera/ShoulderRig';

// Physics-lite
export {
  SphereCollider,
  BoxCollider,
  checkCollisions,
  type CollisionPair,
} from './physics/Collider';
export { CollisionSystem } from './physics/CollisionSystem';
export { resolveCircleCollisions, type ResolveOptions } from './physics/resolve';
export { throwObject, ballisticVelocity, type ThrowOptions } from './physics/ballistic';
export {
  Stockpile,
  type StockpileOptions,
  type StockpileEvents,
  type StockChange,
} from './gameplay/Stockpile';
export {
  Occupancy,
  stagger,
  type Seat,
  type SeatClaim,
  type OccupancyOptions,
  type OccupancyEvents,
  type StaggerOptions,
} from './gameplay/Occupancy';
export {
  Trigger,
  Interactable,
  linkMechanism,
  type Mechanism,
  type MechanismSource,
  type TriggerOptions,
  type InteractableOptions,
} from './interaction/mechanism';

// Assets & audio
export { Assets } from './assets/Assets';
export {
  AudioManager,
  type PlayOptions,
  type PositionalPlayOptions,
} from './audio/AudioManager';
export {
  Soundboard,
  EngineSound,
  RotorSound,
  AmbientBed,
  CrowdSound,
  type SoundboardOptions,
  type PlaySoundOptions,
  type SoundBus,
  type Caption,
  type Vec3Like,
} from './audio/Soundboard';
export {
  footstepSpec,
  impactSpec,
  crackSpec,
  whooshSpec,
  splashSpec,
  coinSpec,
  popSpec,
  boingSpec,
  chimeSpec,
  successSpec,
  failSpec,
  tickSpec,
  blipSpec,
  engineVoicing,
  rotorVoicing,
  windVoicing,
  rainVoicing,
  crowdVoicing,
  fillNoise,
  type SoundSpec,
  type SoundLayer,
  type OscLayer,
  type NoiseLayer,
  type CurvePoint,
  type FootstepSurface,
  type ImpactMaterial,
  type EngineVoicing,
  type RotorVoicing,
  type WindVoicing,
  type RainVoicing,
  type CrowdVoicing,
  type Rand,
} from './audio/recipes';

// Debug
export { DebugOverlay, type DebugOverlayOptions } from './debug/DebugOverlay';
export {
  RideController,
  type RideIntent,
  type RideControllerOptions,
  type RideEvents,
} from './controllers/RideController';
export {
  Device,
  type PowerState,
  type DisplayTarget,
  type DeviceOptions,
  type DeviceEvents,
} from './gameplay/Device';
export {
  Attention,
  broadcast,
  type Alert,
  type AttentionOptions,
  type BroadcastAlert,
} from './gameplay/Attention';
export { Queue, type QueueOptions } from './gameplay/Queue';
export {
  Recipe,
  type RecipeOptions,
  type RecipeStep,
  type RecipeEvents,
  type StepState,
  type StepStatus,
  type Pantry,
} from './gameplay/Recipe';
export {
  Automation,
  type AutomationOptions,
  type LinkOptions,
} from './gameplay/Automation';

// Retention: flow, goals, saves, ghosts
export { GameFlow, type FlowState, type GameFlowOptions } from './gameplay/GameFlow';
export {
  Objectives,
  type Objective,
  type ObjectiveSpec,
  type ObjectivesOptions,
} from './gameplay/Objectives';
export { SaveSlot, type SaveSlotOptions, type StorageLike } from './gameplay/SaveSlot';
export {
  Ghost,
  GhostRecorder,
  GhostTape,
  type GhostPose,
  type GhostTapeJSON,
  type GhostRecorderOptions,
} from './gameplay/ghosts';

// Light as gameplay: the illumination field, the torch, the mood
export {
  Illumination,
  type LightSourceLike,
  type IlluminationOptions,
} from './gameplay/Illumination';
export { Flashlight, type FlashlightOptions } from './gameplay/Flashlight';
export {
  MoodGrade,
  type MoodTargets,
  type MoodPreset,
} from './gameplay/MoodGrade';

// Opposition: the director of waves
export {
  WaveDirector,
  type WaveDirectorOptions,
  type WaveSpawner,
} from './gameplay/WaveDirector';

// Stakes: health, damage, projectiles
export {
  Health,
  type HealthOptions,
  type DamageInfo,
  type DamageEvent,
} from './gameplay/Health';
export {
  Missiles,
  LockOn,
  type MissilesOptions,
  type MissileTarget,
  type MissileHit,
  type LockOnOptions,
} from './physics/Missiles';
export {
  Projectiles,
  type ProjectilesOptions,
  type ProjectileHit,
  type FireOptions,
  type TargetLike,
} from './physics/Projectiles';

// The pickup loop (consumes SCENA pickups/markers structurally)
export {
  Collector,
  type CollectibleLike,
  type FieldLike,
  type CollectEvent,
  type CollectorOptions,
} from './gameplay/Collector';
export {
  CheckpointRun,
  type CheckpointLike,
  type CheckpointRunOptions,
} from './gameplay/CheckpointRun';

// The shell: the part of a game that is not the game
export {
  Shell,
  type ShellOptions,
  type ShellScreen,
} from './shell/Shell';

// Feel & HUD
export { GameFeel, type GameFeelOptions } from './gameplay/GameFeel';
export {
  Hud,
  type HudOptions,
  type Radar,
  type RadarBlip,
  type RadarOptions,
} from './hud/Hud';
