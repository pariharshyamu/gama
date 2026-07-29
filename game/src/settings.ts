import { SaveSlot } from 'gama3d';

export type Quality = 'low' | 'medium' | 'high';

export interface Settings {
  quality: Quality;
  sound: boolean;
  /** Round length in seconds. */
  length: number;
}

export interface Best {
  score: number;
  delivered: number;
  seed: number;
}

const DEFAULTS: Settings = { quality: 'medium', sound: true, length: 120 };

/**
 * Persistence, such as it is: two small records in localStorage.
 *
 * GAMA's `SaveSlot` is versioned and returns null for absent, corrupt AND
 * stale saves alike, which is the whole reason it is worth using here —
 * a game that ships has to survive its own next release changing shape,
 * and "there is no usable save" is one branch, not three.
 */
const settingsSlot = new SaveSlot<Settings>('havenbrook.settings', { version: 1 });
const bestSlot = new SaveSlot<Best>('havenbrook.best', { version: 1 });

export function loadSettings(): Settings {
  return { ...DEFAULTS, ...(settingsSlot.load() ?? {}) };
}

export function saveSettings(s: Settings): void {
  settingsSlot.save(s);
}

export function loadBest(): Best | null {
  return bestSlot.load();
}

/**
 * Records a finished round, and says whether it was a new best.
 *
 * A round worth nothing is not a personal best, however empty the save file
 * is. The first version congratulated a player who never left the depot on
 * "a new best round" of zero — technically true, and exactly the kind of
 * thing that tells someone the game is not paying attention.
 */
export function recordRun(run: Best): boolean {
  if (run.score <= 0) return false;
  const best = bestSlot.load();
  if (best && best.score >= run.score) return false;
  bestSlot.save(run);
  return true;
}
