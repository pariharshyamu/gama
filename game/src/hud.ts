import { Camera, Vector3 } from 'three';

/**
 * The in-play HUD: clock, score, streak, the current job, and a compass.
 *
 * Plain DOM rather than anything clever, for the reason most shipped games
 * use plain DOM — it is crisp at every pixel ratio, it reflows on a phone
 * for free, and it costs no draw calls in a scene that already has plenty.
 *
 * The compass is the part that earns its place. A beacon is only visible
 * when you are looking at it, and half of this game is spent with the
 * address behind you; the chevron pins to the screen edge and rotates, so
 * "where is No. 7" is answerable without turning the camera.
 */

export interface Hud {
  show(on: boolean): void;
  set(clock: number, score: number, streak: number): void;
  task(text: string): void;
  toast(text: string): void;
  aim(camera: Camera, target: Vector3 | null): void;
  onPause(fn: () => void): void;
  dispose(): void;
}

export function createHud(): Hud {
  const root = document.createElement('div');
  root.id = 'play-hud';
  root.innerHTML = `
    <div class="hud-bar">
      <div><div class="lab">Time</div><div class="clock" id="hud-clock">0</div></div>
      <div><div class="lab">Score</div><div class="val" id="hud-score">0</div></div>
      <div><div class="lab">Streak</div><div class="val streak" id="hud-streak">—</div></div>
    </div>
    <div class="task" id="hud-task"></div>
    <div id="compass"><svg class="arrow" viewBox="0 0 24 24" fill="currentColor" id="hud-arrow">
      <path d="M12 2 L20 20 L12 15.5 L4 20 Z"/></svg></div>
    <div class="toast" id="hud-toast"></div>
    <button id="pause-btn" aria-label="Pause">II</button>`;
  document.body.appendChild(root);

  const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
  const clockEl = $('hud-clock');
  const scoreEl = $('hud-score');
  const streakEl = $('hud-streak');
  const taskEl = $('hud-task');
  const arrow = $<HTMLElement>('hud-arrow');
  const toastEl = $('hud-toast');

  const screen = new Vector3();
  let toastTimer: number | undefined;

  return {
    show(on: boolean) {
      root.classList.toggle('on', on);
    },

    set(clock: number, score: number, streak: number) {
      const s = Math.max(0, clock);
      clockEl.textContent = s < 10 ? s.toFixed(1) : Math.ceil(s).toString();
      clockEl.classList.toggle('low', s <= 10);
      scoreEl.textContent = score.toLocaleString();
      streakEl.textContent = streak > 1 ? `×${streak}` : '—';
    },

    task(text: string) {
      taskEl.textContent = text;
    },

    toast(text: string) {
      toastEl.textContent = text;
      toastEl.classList.remove('show');
      // Force a reflow so the animation restarts even on back-to-back
      // deliveries — without this the second toast never plays.
      void toastEl.offsetWidth;
      toastEl.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = window.setTimeout(() => toastEl.classList.remove('show'), 1000);
    },

    aim(camera: Camera, target: Vector3 | null) {
      if (!target) {
        arrow.style.display = 'none';
        return;
      }
      screen.copy(target).project(camera);
      const behind = screen.z > 1;
      const x = behind ? -screen.x : screen.x;
      const y = behind ? -screen.y : screen.y;
      // On screen and in front: the beacon is doing the job, so get out of
      // the way. Otherwise pin the chevron to the edge of an ellipse.
      const inside = !behind && Math.abs(x) < 0.72 && Math.abs(y) < 0.72;
      if (inside) {
        arrow.style.display = 'none';
        return;
      }
      const w = window.innerWidth / 2 - 46;
      const h = window.innerHeight / 2 - 46;
      const len = Math.max(Math.abs(x), Math.abs(y)) || 1;
      const px = (x / len) * w;
      const py = (-y / len) * h;
      arrow.style.display = 'block';
      arrow.style.transform = `translate(${px}px, ${py}px) rotate(${Math.atan2(px, -py)}rad)`;
    },

    onPause(fn: () => void) {
      $('pause-btn').addEventListener('click', fn);
    },

    dispose() {
      root.remove();
    },
  };
}
