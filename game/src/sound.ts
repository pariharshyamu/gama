import { Soundboard } from 'gama3d';

/**
 * Every sound in this game is synthesized at runtime — there is not one
 * audio file in the build. That is GAMA's `Soundboard` doing what it was
 * built for, and for a game distributed as a web page it is the difference
 * between a 40 KB download and a 4 MB one.
 */
export interface Sound {
  enabled: boolean;
  step(fast: boolean): void;
  collect(): void;
  deliver(streak: number): void;
  bump(): void;
  over(): void;
  tick(): void;
  unlock(): void;
}

export function createSound(seed: number, enabled: boolean): Sound {
  const board = new Soundboard({ seed });
  let stepClock = 0;
  let on = enabled;

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

    /** Footfalls are throttled here rather than driven by the gait's own
     *  events, because the courier's feet are moving faster than the ear
     *  wants at a sprint. */
    step(fast: boolean) {
      const now = performance.now();
      const gap = fast ? 260 : 400;
      if (now - stepClock < gap) return;
      stepClock = now;
      board.footstep('dirt', { volume: 0.32 });
    },

    collect() {
      board.pop({ volume: 0.5 });
    },

    deliver(streak: number) {
      board.coin({ volume: 0.55 });
      // The chime climbs with the streak: the sound tells you the
      // multiplier is alive without you reading the number.
      board.chime(Math.min(7, streak), { volume: 0.4 });
    },

    bump() {
      board.impact('soft', 0.5, { volume: 0.5 });
    },

    over() {
      board.fail({ volume: 0.5 });
    },

    tick() {
      board.pop({ volume: 0.18 });
    },
  };
}
