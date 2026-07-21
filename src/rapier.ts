// gama/rapier — optional physics adapter built on @dimforge/rapier3d-compat.
// Import from 'gama/rapier'; requires the optional peer dependency:
//   npm install @dimforge/rapier3d-compat

export { PhysicsWorld, type PhysicsWorldOptions } from './rapier/PhysicsWorld';
export {
  RigidBody,
  type RigidBodyOptions,
  type RigidBodyType,
  type ColliderOptions,
  type ColliderShape,
} from './rapier/RigidBody';
export {
  PhysicsCharacterController,
  type PhysicsCharacterOptions,
} from './rapier/PhysicsCharacterController';
export {
  createPhysicsThirdPersonCharacter,
  type PhysicsThirdPersonOptions,
  type PhysicsThirdPersonCharacter,
} from './rapier/thirdPerson';
