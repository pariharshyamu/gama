import { Soundboard } from 'gama3d';

/**
 * Every sound here is synthesized at runtime — there is not one audio file in
 * the build. GAMA's `Soundboard` doing what it was built for, and for a game
 * that ships as a web page it is the difference between a 40 KB download and a
 * few megabytes.
 */
export interface Sound {
  enabled: boolean;
  unlock(): void;
  /** The metronome under Round One. Pitch rises as the turn approaches. */
  tick(urgency: number): void;
  turn(): void;
  caught(): void;
  step(): void;
  shatter(): void;
  win(): void;
  lose(): void;
  lamp(): void;
}

export function createSound(seed: number, enabled: boolean): Sound {
  const board = new Soundboard({ seed });
  let on = enabled;
  let lastTick = 0;

  return {
    get enabled() {
      return on;
    },
    set enabled(v: boolean) {
      on = v;
      board.setVolume(v ? 1 : 0);
    },
    unlock() {
      board.unlock();
      board.setVolume(on ? 1 : 0);
    },
    tick(urgency: number) {
      // Throttled here rather than driven per frame: the ear wants a beat, and
      // a tick every frame is a buzz.
      const now = performance.now();
      const gap = 620 - urgency * 380;
      if (now - lastTick < gap) return;
      lastTick = now;
      board.tick({ volume: 0.22 + urgency * 0.2 });
    },
    turn() {
      board.boing({ volume: 0.45 });
    },
    caught() {
      board.impact('stone', 0.7, { volume: 0.5 });
    },
    step() {
      board.footstep('stone', { volume: 0.3 });
    },
    shatter() {
      board.crack(0.8, { volume: 0.6 });
    },
    win() {
      board.success({ volume: 0.5 });
    },
    lose() {
      board.fail({ volume: 0.5 });
    },
    lamp() {
      board.blip({ volume: 0.35 });
    },
  };
}
