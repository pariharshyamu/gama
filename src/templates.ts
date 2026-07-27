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
export {
  Circuit,
  LapTracker,
  Race,
  createRace,
  type Point2,
  type LapTrackerOptions,
  type LapState,
  type RaceEntrant,
  type RaceOptions,
  type RaceState,
  type RaceResult,
  type RacerStanding,
} from './templates/racing';
export {
  CricketMatch,
  type CricketMatchOptions,
  type BallOutcome,
  type BallPhase,
  type Shot,
  type Timing,
} from './templates/cricket';
