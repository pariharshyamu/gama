// gama3d/templates — character templates: pre-wired assemblies over GAMA's
// public APIs. Thin, readable, and eject-able: when a template's options
// run out, copy its source into your project and edit.

export {
  createCapsulePerson,
  attachVisual,
  type GameContext,
  type CharacterModel,
} from './templates/common';
export {
  createThirdPersonCharacter,
  ThirdPersonMovement,
  type ThirdPersonOptions,
  type ThirdPersonCharacter,
  type ThirdPersonMovementOptions,
} from './templates/thirdPerson';
export {
  createTopDownCharacter,
  type TopDownOptions,
  type TopDownCharacter,
} from './templates/topDown';
export {
  createGuard,
  createCompanion,
  createFlock,
  type Guard,
  type GuardOptions,
  type GuardMode,
  type Companion,
  type CompanionOptions,
  type Flock,
  type FlockOptions,
} from './templates/npcs';
