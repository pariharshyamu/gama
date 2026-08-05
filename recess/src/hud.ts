/**
 * The HUD.
 *
 * Plain DOM, like the rest of these games: crisp at every pixel ratio, reflows
 * on a phone for free, and costs no draw calls in a scene that has plenty.
 *
 * The pupil gauge is the only unusual widget here, and it earns its place
 * because the round it serves is about a measurement. It shows the reading and
 * the baseline the light alone predicts, and it goes DEAD — greyed, no number
 * — whenever the light is moving, because a pupil measured under a swinging
 * lamp is not a reading of anything. Showing a number there would be the
 * decoration the gates in these libraries keep refusing to ship.
 */

export interface Hud {
  show(on: boolean): void;
  round(n: number, title: string): void;
  /** The big centre word: GREEN, RED, STEP. Pass null to clear. */
  signal(text: string | null, danger?: boolean): void;
  stat(left: string, right: string): void;
  task(text: string): void;
  toast(text: string): void;
  /** Round three only. `mm` null means "the light is moving, this is noise". */
  gauge(mm: number | null, baseline: number, holds: number): void;
  /** Rounds one and two have no pupil to read. */
  gaugeOff(): void;
  /** Show or hide the three call buttons. */
  choices(kind: 'none' | 'marbles'): void;
  onChoice(fn: (which: 'hold' | 'believe' | 'bluff') => void): void;
  onPause(fn: () => void): void;
  dispose(): void;
}

export function createHud(): Hud {
  const root = document.createElement('div');
  root.id = 'hud';
  root.innerHTML = `
    <div class="hud-top">
      <div class="pill" id="hud-round">Round 1</div>
      <div class="pill" id="hud-left">—</div>
      <div class="pill" id="hud-right">—</div>
      <button id="hud-pause" aria-label="Pause">II</button>
    </div>
    <div class="signal" id="hud-signal"></div>
    <div class="task" id="hud-task"></div>
    <div class="gauge" id="hud-gauge" hidden>
      <div class="g-row"><span class="g-lab">pupil</span>
        <b id="g-mm">—</b><span class="g-unit">mm</span></div>
      <div class="g-bar"><i id="g-fill"></i><u id="g-base"></u></div>
      <div class="g-note" id="g-note">the light is moving — this is noise</div>
      <div class="g-holds" id="g-holds"></div>
    </div>
    <div class="choices" id="hud-choices" hidden>
      <button data-pick="hold" class="ghost">Hold the lamp <kbd>H</kbd></button>
      <button data-pick="believe">Believe <kbd>B</kbd></button>
      <button data-pick="bluff" class="warn">Call the bluff <kbd>N</kbd></button>
    </div>
    <div class="toast" id="hud-toast"></div>`;
  document.body.appendChild(root);

  const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
  const roundEl = $('hud-round');
  const leftEl = $('hud-left');
  const rightEl = $('hud-right');
  const signalEl = $('hud-signal');
  const taskEl = $('hud-task');
  const gaugeEl = $('hud-gauge');
  const mmEl = $('g-mm');
  const fillEl = $('g-fill');
  const baseEl = $('g-base');
  const noteEl = $('g-note');
  const holdsEl = $('g-holds');
  const choicesEl = $('hud-choices');
  const toastEl = $('hud-toast');

  let toastTimer: number | undefined;
  // The gauge spans the anatomical range, so the bar means millimetres rather
  // than "a fraction of whatever the biggest one so far was".
  const MIN = 2;
  const MAX = 8;
  const pct = (mm: number) => `${((Math.min(MAX, Math.max(MIN, mm)) - MIN) / (MAX - MIN)) * 100}%`;

  return {
    show(on) {
      root.classList.toggle('on', on);
    },
    round(n, title) {
      roundEl.textContent = `Round ${n} · ${title}`;
    },
    signal(text, danger = false) {
      signalEl.textContent = text ?? '';
      signalEl.classList.toggle('on', !!text);
      signalEl.classList.toggle('danger', danger);
    },
    stat(left, right) {
      leftEl.textContent = left;
      rightEl.textContent = right;
    },
    task(text) {
      taskEl.textContent = text;
    },
    toast(text) {
      toastEl.textContent = text;
      toastEl.classList.add('on');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toastEl.classList.remove('on'), 1800) as unknown as number;
    },
    gauge(mm, baseline, holds) {
      gaugeEl.hidden = false;
      const live = mm !== null;
      gaugeEl.classList.toggle('dead', !live);
      mmEl.textContent = live ? mm.toFixed(2) : '—';
      fillEl.style.width = live ? pct(mm) : '0%';
      baseEl.style.left = pct(baseline);
      noteEl.textContent = live
        ? 'light held — half a millimetre over the baseline is effort'
        : 'the light is moving — this is noise';
      holdsEl.textContent = holds > 0 ? `${'●'.repeat(holds)} holds left` : 'no holds left';
    },
    gaugeOff() {
      gaugeEl.hidden = true;
    },
    choices(kind) {
      choicesEl.hidden = kind === 'none';
    },
    onChoice(fn) {
      choicesEl.addEventListener('click', (e) => {
        const el = (e.target as HTMLElement).closest('[data-pick]') as HTMLElement | null;
        if (el) fn(el.dataset.pick as 'hold' | 'believe' | 'bluff');
      });
    },
    onPause(fn) {
      $('hud-pause').addEventListener('click', fn);
    },
    dispose() {
      root.remove();
    },
  };
}
