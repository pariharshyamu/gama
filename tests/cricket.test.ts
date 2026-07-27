import { describe, it, expect } from 'vitest';
import { Vector3 } from 'three';
import { CricketMatch, type BallOutcome, type Shot } from '../src/templates';

/** Bowl one ball, optionally swinging `lead` seconds after release. */
const bowlOne = (
  m: CricketMatch,
  shot: Shot | null = null,
  lead = 0.345,
  step = 1 / 240
): BallOutcome => {
  let out: BallOutcome | null = null;
  const off = m.onBall((o) => { out ??= o; });
  const innings = m.innings;
  m.bowl();
  let t = 0;
  let swung = false;
  while (m.phase !== 'dead' && !out && t < 30) {
    if (shot && !swung && t >= lead) swung = m.swing(shot);
    m.update(step);
    t += step;
  }
  off();
  if (!out) throw new Error(`ball never resolved (innings ${innings})`);
  m.next();
  return out;
};

/** Play out a whole innings at a fixed rhythm. */
const playInnings = (m: CricketMatch, leads: number[], shots: Shot[]): void => {
  const was = m.innings;
  let i = 0;
  while (!m.over && m.innings === was) {
    bowlOne(m, shots[i % shots.length], leads[i % leads.length]);
    i++;
    if (i > 40) throw new Error('innings would not end');
  }
};

describe('the ball', () => {
  it('is released high, PITCHES once, and arrives at stump height', () => {
    const m = new CricketMatch({ seed: 3 });
    m.bowl();
    expect(m.phase).toBe('flight');
    expect(m.ball.y).toBeCloseTo(2.15, 2);

    let pitchedAt = -1;
    let t = 0;
    let lowest = Infinity;
    while (m.phase === 'flight' || m.phase === 'onto') {
      m.update(1 / 240);
      t += 1 / 240;
      if (pitchedAt < 0 && m.phase === 'onto') pitchedAt = m.ball.z;
      lowest = Math.min(lowest, m.ball.y);
    }
    // It bounced, short of a length, and it bounced only once.
    expect(pitchedAt).toBeGreaterThan(-10.06);
    expect(pitchedAt).toBeLessThan(-3.9);
    expect(lowest).toBeCloseTo(0.036, 3);
    // And it took about the time a 26 m/s delivery actually takes.
    expect(t).toBeGreaterThan(0.6);
    expect(t).toBeLessThan(1.1);
  });

  it('rises off the deck: it reaches the batter above where it pitched', () => {
    const m = new CricketMatch({ seed: 8 });
    m.bowl();
    while (m.phase === 'flight') m.update(1 / 240);
    const offTheDeck = m.ball.y;
    while (m.phase === 'onto') m.update(1 / 240);
    expect(m.ball.y).toBeGreaterThan(offTheDeck + 0.3);
  });

  it('no two deliveries are the same', () => {
    const m = new CricketMatch({ seed: 5, overs: 5, wickets: 10 });
    const lines: number[] = [];
    for (let i = 0; i < 6; i++) lines.push(bowlOne(m).where.x);
    expect(new Set(lines.map((v) => v.toFixed(4))).size).toBe(6);
  });
});

describe('timing is the game', () => {
  it('THE BAT ARRIVES LATER: the swing is judged where the ball WILL be', () => {
    const m = new CricketMatch({ seed: 4 });
    // Committed the instant the ball leaves the hand — miles too early.
    const err = bowlOne(m, 'drive', 0).error;
    expect(err).toBeLessThan(-0.2);
  });

  it('walks early → good → middled → good → late → missed as you wait', () => {
    const seen: string[] = [];
    for (const lead of [0.06, 0.18, 0.345, 0.46, 0.52, 0.62]) {
      const m = new CricketMatch({ seed: 7 });
      seen.push(bowlOne(m, 'drive', lead).timing);
    }
    expect(seen).toEqual(['early', 'early', 'middled', 'good', 'late', 'missed']);
  });

  it('error is signed: negative early, positive late, and it grows', () => {
    const at = (lead: number): number => {
      const m = new CricketMatch({ seed: 7 });
      return bowlOne(m, 'drive', lead).error;
    };
    expect(at(0.20)).toBeLessThan(0);
    expect(at(0.50)).toBeGreaterThan(0);
    expect(at(0.10)).toBeLessThan(at(0.20));
  });

  it('previewError agrees with what the swing actually gets', () => {
    const m = new CricketMatch({ seed: 9 });
    m.bowl();
    let t = 0;
    let predicted = NaN;
    let out: BallOutcome | null = null;
    m.onBall((o) => { out ??= o; });
    while (m.phase !== 'dead' && t < 20) {
      if (t >= 0.30 && Number.isNaN(predicted)) {
        predicted = m.previewError();
        m.swing('drive');
      }
      m.update(1 / 480);
      t += 1 / 480;
    }
    // The preview flies the ball forward for real, bounce and all, so it
    // agrees with the swing to within a frame.
    expect(out!.error).toBeCloseTo(predicted, 2);
  });

  it('one stroke per delivery, and only while the ball is live', () => {
    const m = new CricketMatch({ seed: 2 });
    expect(m.swing('drive')).toBe(false);       // nothing has been bowled
    m.bowl();
    expect(m.swing('drive')).toBe(true);
    expect(m.swing('loft')).toBe(false);        // committed is committed
    expect(m.stroke).toBe('drive');
  });
});

describe('the strokes', () => {
  const middled = (shot: Shot, seeds = 40): BallOutcome[] =>
    Array.from({ length: seeds }, (_, i) => {
      const m = new CricketMatch({ seed: i + 1 });
      return bowlOne(m, shot, 0.345);
    });

  it('a MIDDLED DRIVE beats the rope; a defensive push goes nowhere', () => {
    const drives = middled('drive');
    // Length and pace both move, so one fixed press time cannot middle every
    // ball — but it middles most of them, and they go to the rope.
    // Length moves every ball, so one fixed press time cannot middle them
    // all — but it middles most, and those go to the rope.
    expect(drives.filter((o) => o.timing === 'middled').length).toBeGreaterThan(20);
    expect(drives.filter((o) => o.timing === 'missed').length).toBeLessThan(4);
    expect(drives.filter((o) => o.runs >= 4).length).toBeGreaterThan(20);

    const blocks = middled('defend', 8);
    expect(blocks.every((o) => o.runs === 0)).toBe(true);
    expect(blocks.every((o) => o.wicket === null)).toBe(true);
  });

  it('a MIDDLED LOFT clears it: sixes, not fours', () => {
    const lofts = middled('loft');
    const drives = middled('drive');
    expect(lofts.filter((o) => o.runs === 6).length).toBeGreaterThan(20);
    // Sixes, where the same timing off a drive is a four along the ground.
    expect(drives.filter((o) => o.runs === 6).length).toBe(0);
  });

  it('EVERY STROKE GOES ITS OWN WAY: cut off, pull and sweep to leg', () => {
    const side = (shot: Shot) =>
      middled(shot, 30).reduce((a, o) => a + o.where.x, 0) / 30;
    // A cut and a pull are not one shot with the sign thrown away.
    expect(side('cut')).toBeGreaterThan(20);
    expect(side('pull')).toBeLessThan(-20);
    expect(side('sweep')).toBeLessThan(-20);
    expect(side('flick')).toBeLessThan(-20);
    expect(Math.abs(side('drive'))).toBeLessThan(Math.abs(side('cut')));
  });

  it('a PULL is square; a drive is straight', () => {
    const square = (shot: Shot) =>
      middled(shot).reduce((a, o) => a + Math.abs(o.where.x), 0) / 40;
    expect(square('pull')).toBeGreaterThan(square('drive') * 2);
  });

  it('THE RISK IS THE SHOT: a mistimed loft is caught, a block never is', () => {
    let caught = 0;
    let blocked = 0;
    for (let s = 1; s <= 40; s++) {
      if (bowlOne(new CricketMatch({ seed: s }), 'loft', 0.12).wicket === 'caught') caught++;
      if (bowlOne(new CricketMatch({ seed: s }), 'defend', 0.12).wicket === 'caught') blocked++;
    }
    expect(caught).toBeGreaterThan(15);
    expect(blocked).toBe(0);
  });

  it('scores the ladder: 6, 4, and the ones and twos in between', () => {
    const runs = new Set<number>();
    for (let s = 1; s <= 60; s++) {
      for (const lead of [0.10, 0.14, 0.24, 0.30, 0.345, 0.44]) {
        runs.add(bowlOne(new CricketMatch({ seed: s }), 'drive', lead).runs);
      }
    }
    expect([...runs].sort((a, b) => a - b)).toEqual([0, 1, 2, 3, 4]);
  });
});

describe('the bat has to actually be there', () => {
  /** A stand-in bat parked at a fixed height in front of the stumps. */
  const batAt = (y: number, x = 0) => {
    const at = new Vector3(x, y, -20.12 / 2 + 1.6);
    return () => at;
  };

  it('a bat swung a metre over the ball MISSES it', () => {
    const high = new CricketMatch({ seed: 4, bat: batAt(1.9) });
    const o = bowlOne(high, 'pull', 0.345);
    expect(o.timing).toBe('missed');
    expect(o.runs).toBe(0);
    expect(o.miss).toBeGreaterThan(0.34);
  });

  it('…and a bat in the right place hits it', () => {
    // Where the ball actually is when it gets to the crease.
    const m = new CricketMatch({ seed: 4 });
    m.bowl();
    while (m.phase === 'flight' || m.phase === 'onto') {
      m.update(1 / 480);
      if (m.ball.z <= -20.12 / 2 + 1.6) break;
    }
    const there = new CricketMatch({ seed: 4, bat: batAt(m.ball.y, m.ball.x) });
    const o = bowlOne(there, 'drive', 0.345);
    expect(o.timing).not.toBe('missed');
    expect(o.miss).toBeLessThan(0.34);
    expect(o.runs).toBeGreaterThan(0);
  });

  it('off the middle scores more than off the edge', () => {
    const runs = (dy: number) => {
      const m = new CricketMatch({ seed: 4 });
      m.bowl();
      while (m.phase === 'flight' || m.phase === 'onto') {
        m.update(1 / 480);
        if (m.ball.z <= -20.12 / 2 + 1.6) break;
      }
      const at = new CricketMatch({ seed: 4, bat: batAt(m.ball.y + dy, m.ball.x) });
      return bowlOne(at, 'drive', 0.345);
    };
    const middle = runs(0);
    const edge = runs(0.3);
    expect(edge.miss).toBeGreaterThan(middle.miss);
    expect(edge.quality).toBeLessThan(middle.quality);
  });

  it('with no bat probe it is pure timing, and `miss` says so', () => {
    const o = bowlOne(new CricketMatch({ seed: 4 }), 'drive', 0.345);
    expect(o.miss).toBe(-1);
    expect(o.runs).toBeGreaterThan(0);
  });
});

describe('the wicket', () => {
  it('leave it and it hits the stumps often enough to hurt', () => {
    let bowled = 0;
    for (let s = 1; s <= 60; s++) {
      if (bowlOne(new CricketMatch({ seed: s })).wicket === 'bowled') bowled++;
    }
    expect(bowled).toBeGreaterThan(20);
    expect(bowled).toBeLessThan(58);
  });

  it('swing too late and the ball is already through the gate', () => {
    let bowled = 0;
    for (let s = 1; s <= 40; s++) {
      if (bowlOne(new CricketMatch({ seed: s }), 'loft', 0.55).wicket === 'bowled') bowled++;
    }
    expect(bowled).toBeGreaterThan(14);
  });
});

describe('the bookkeeping', () => {
  it('six balls to an over, and it says so in cricket notation', () => {
    const m = new CricketMatch({ seed: 11, overs: 2, wickets: 10 });
    const overs: number[] = [];
    m.onOver((n) => overs.push(n));
    expect(m.oversBowled).toBe('0.0');
    for (let i = 0; i < 6; i++) bowlOne(m, 'defend', 0.345);
    expect(m.balls).toBe(6);
    expect(m.oversBowled).toBe('1.0');
    expect(overs).toEqual([1]);
    expect(m.ballsLeft).toBe(6);
  });

  it('the innings ends on overs — and the last ball says so', () => {
    const m = new CricketMatch({ seed: 12, overs: 1, wickets: 10 });
    const flags: boolean[] = [];
    m.onBall((o) => flags.push(o.innings));
    for (let i = 0; i < 6; i++) bowlOne(m, 'defend', 0.345);
    expect(flags).toEqual([false, false, false, false, false, true]);
    expect(m.innings).toBe(2);
    expect(m.balls).toBe(0);
  });

  it('the innings ends on wickets, mid-over', () => {
    const m = new CricketMatch({ seed: 1, overs: 2, wickets: 1 });
    let balls = 0;
    while (m.innings === 1 && balls < 12) {
      bowlOne(m, 'loft', 0.55);   // late every time: bowled sooner or later
      balls++;
    }
    expect(m.innings).toBe(2);
    expect(balls).toBeLessThan(12);
  });

  it('the second innings has a target, and the chase ends the instant it falls', () => {
    const m = new CricketMatch({ seed: 2, overs: 2, wickets: 2 });
    playInnings(m, [0.345], ['drive']);
    expect(m.innings).toBe(2);
    expect(m.firstInnings).toBeGreaterThan(0);
    expect(m.target).toBe(m.firstInnings! + 1);
    expect(m.needed).toBe(m.target);
    expect(m.runs).toBe(0);

    playInnings(m, [0.345], ['loft']);
    expect(m.over).toBe(true);
    // A chase that got there stopped there — it did not bat on.
    if (m.runs >= m.target!) {
      expect(m.needed).toBe(0);
      expect(m.result).toMatch(/^Chase won by \d wickets?$/);
    }
  });
});

describe('the result', () => {
  const finish = (seed: number): CricketMatch => {
    const m = new CricketMatch({ seed, overs: 2, wickets: 2 });
    const leads = [0.345, 0.30, 0.40, 0.26, 0.345, 0.36];
    const shots: Shot[] = ['drive', 'drive', 'loft', 'drive', 'drive', 'loft'];
    playInnings(m, leads, shots);
    if (!m.over) playInnings(m, leads, shots);
    return m;
  };

  it('reads the scorecard back correctly, all three ways it can end', () => {
    // Seeds picked because they land on each branch; the assertion is that
    // the words match the arithmetic, not that a given seed is special.
    const tied = finish(17);
    expect(tied.runs).toBe(tied.firstInnings);
    expect(tied.result).toBe('Match tied');

    const chased = finish(3);
    expect(chased.runs).toBeGreaterThan(chased.firstInnings!);
    expect(chased.result).toBe(
      `Chase won by ${chased.wicketsInHand - chased.wickets} wicket${
        chased.wicketsInHand - chased.wickets === 1 ? '' : 's'
      }`
    );

    const defended = finish(1);
    expect(defended.runs).toBeLessThan(defended.firstInnings!);
    const margin = defended.firstInnings! - defended.runs;
    expect(defended.result).toBe(
      `Defence won by ${margin} run${margin === 1 ? '' : 's'}`
    );
  });

  it('every match ends, and the words always match the numbers', () => {
    for (let s = 1; s <= 30; s++) {
      const m = finish(s);
      expect(m.over, `seed ${s}`).toBe(true);
      const margin = m.firstInnings! - m.runs;
      if (margin < 0) expect(m.result, `seed ${s}`).toMatch(/^Chase won/);
      else if (margin === 0) expect(m.result, `seed ${s}`).toBe('Match tied');
      else expect(m.result, `seed ${s}`).toBe(`Defence won by ${margin} run${margin === 1 ? '' : 's'}`);
      // And it is finished: nothing more can be bowled.
      expect(m.next()).toBe(false);
      expect(m.bowl()).toBe(false);
    }
  });
});

describe('it is a simulation, not a slideshow', () => {
  it('the same seed plays the same match', () => {
    const line = (): string => {
      const m = new CricketMatch({ seed: 21, overs: 2, wickets: 2 });
      const log: string[] = [];
      m.onBall((o) => log.push(`${o.runs}${o.wicket ?? ''}${o.timing}`));
      playInnings(m, [0.345, 0.28], ['drive', 'loft']);
      return log.join('|');
    };
    expect(line()).toBe(line());
  });

  it('the frame rate does not decide the innings', () => {
    const at = (step: number): string => {
      const m = new CricketMatch({ seed: 15 });
      const o = bowlOne(m, 'drive', 0.345, step);
      return `${o.timing}/${o.runs}`;
    };
    // 30 fps and 240 fps must agree: the bat lands at an exact instant.
    expect(at(1 / 30)).toBe(at(1 / 240));
    expect(at(1 / 60)).toBe(at(1 / 240));
  });
});
