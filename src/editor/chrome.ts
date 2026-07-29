/**
 * The editor's chrome: markup and styles, kept away from the logic.
 *
 * It is scoped under `.gama-ed` and injected once, so mounting an editor
 * into somebody's game does not need a stylesheet link, a build step, or a
 * fight with whatever CSS the host page already has.
 */

export const EDITOR_CSS = `
.gama-ed {
  --ed-bg: #0b0e14; --ed-panel: #12161f; --ed-panel-2: #171c27;
  --ed-line: #262d3b; --ed-ink: #dbe4f0; --ed-dim: #8593a8;
  --ed-accent: #4d8dff; --ed-warn: #ffb454;
  position: absolute; inset: 0; display: grid;
  grid-template-rows: 44px 1fr 26px;
  background: var(--ed-bg); color: var(--ed-ink);
  font: 13px/1.45 ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}
.gama-ed *, .gama-ed *::before, .gama-ed *::after { box-sizing: border-box; }
.gama-ed button, .gama-ed select, .gama-ed input { font: inherit; color: inherit; }

.gama-ed .ed-bar {
  display: flex; align-items: center; gap: 10px; padding: 0 12px;
  background: var(--ed-panel); border-bottom: 1px solid var(--ed-line);
}
.gama-ed .ed-title { color: var(--ed-dim); margin-right: 8px; white-space: nowrap; }
.gama-ed .ed-title b { color: var(--ed-ink); font-weight: 700; letter-spacing: .04em; }
.gama-ed .ed-tools {
  display: flex; align-items: center; gap: 6px; flex: 1; min-width: 0;
  overflow-x: auto; scrollbar-width: thin;
}
.gama-ed .ed-tools button, .gama-ed .ed-palette button {
  background: var(--ed-panel-2); border: 1px solid var(--ed-line); border-radius: 6px;
  padding: 5px 10px; cursor: pointer; white-space: nowrap;
}
.gama-ed .ed-tools button:hover:not(:disabled),
.gama-ed .ed-palette button:hover { border-color: var(--ed-accent); }
.gama-ed .ed-tools button:disabled { opacity: .4; cursor: default; }
.gama-ed .ed-tools label {
  color: var(--ed-dim); display: flex; align-items: center; gap: 5px; white-space: nowrap;
}
.gama-ed .ed-tools select {
  background: var(--ed-panel-2); border: 1px solid var(--ed-line);
  border-radius: 6px; padding: 4px 6px;
}
.gama-ed .ed-sep { width: 1px; height: 22px; background: var(--ed-line); margin: 0 2px; }
.gama-ed .ed-spacer { flex: 1; }

.gama-ed .ed-body { display: grid; grid-template-columns: 176px 1fr 250px; min-height: 0; }
.gama-ed .ed-palette, .gama-ed .ed-inspector {
  background: var(--ed-panel); overflow-y: auto; padding: 10px;
}
.gama-ed .ed-palette { border-right: 1px solid var(--ed-line); }
.gama-ed .ed-inspector { border-left: 1px solid var(--ed-line); }
.gama-ed .ed-palette h4, .gama-ed .ed-inspector h4 {
  margin: 12px 0 6px; font-size: 10px; letter-spacing: .12em; text-transform: uppercase;
  color: var(--ed-dim); font-weight: 600;
}
.gama-ed .ed-palette h4:first-child, .gama-ed .ed-inspector h4:first-child { margin-top: 0; }
.gama-ed .ed-palette button { display: block; width: 100%; text-align: left; margin-bottom: 4px; }
.gama-ed .ed-palette button[aria-pressed='true'] {
  border-color: var(--ed-accent); background: #4d8dff22; color: #fff;
}

.gama-ed .ed-stage { position: relative; min-width: 0; }
.gama-ed .ed-viewport { position: absolute; inset: 0; }
.gama-ed .ed-viewport canvas { display: block; touch-action: none; }
.gama-ed .ed-hint {
  position: absolute; left: 12px; bottom: 12px; padding: 6px 10px; border-radius: 6px;
  background: #0b0e14cc; border: 1px solid var(--ed-line); color: var(--ed-dim);
  pointer-events: none; max-width: 62%;
}
.gama-ed .ed-hint b { color: var(--ed-ink); }
.gama-ed .ed-hint.armed { color: var(--ed-ink); border-color: var(--ed-accent); }

.gama-ed .ed-row {
  display: grid; grid-template-columns: 62px 1fr; align-items: center;
  gap: 6px; margin-bottom: 5px;
}
.gama-ed .ed-row > label { color: var(--ed-dim); overflow: hidden; text-overflow: ellipsis; }
.gama-ed .ed-row input, .gama-ed .ed-row select {
  width: 100%; background: var(--ed-panel-2); border: 1px solid var(--ed-line);
  border-radius: 5px; padding: 4px 6px; min-width: 0;
}
.gama-ed .ed-row input[type='color'] { padding: 2px; height: 26px; }
.gama-ed .ed-triple { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; }
.gama-ed .ed-readonly {
  color: var(--ed-ink); font-family: ui-monospace, Menlo, monospace;
  font-size: 12px; word-break: break-all;
}
.gama-ed .ed-empty { color: var(--ed-dim); padding: 6px 0; }

.gama-ed .ed-status {
  display: flex; align-items: center; gap: 14px; padding: 0 12px;
  background: var(--ed-panel); border-top: 1px solid var(--ed-line);
  color: var(--ed-dim); font-size: 12px; white-space: nowrap; overflow: hidden;
}
.gama-ed .ed-status b { color: var(--ed-ink); font-weight: 600; }

.gama-ed dialog {
  background: var(--ed-panel); color: var(--ed-ink); border: 1px solid var(--ed-line);
  border-radius: 10px; padding: 18px 22px; max-width: 460px;
}
.gama-ed dialog::backdrop { background: #0008; }
.gama-ed kbd {
  background: var(--ed-panel-2); border: 1px solid var(--ed-line); border-bottom-width: 2px;
  border-radius: 4px; padding: 1px 5px; font: 11px ui-monospace, Menlo, monospace;
}
.gama-ed dialog dl {
  display: grid; grid-template-columns: auto 1fr; gap: 6px 14px; margin: 10px 0 0;
}
.gama-ed dialog dd { margin: 0; color: var(--ed-dim); }

@media (max-width: 900px) {
  .gama-ed .ed-body { grid-template-columns: 132px 1fr 200px; }
}
`;

export const EDITOR_HTML = `
<header class="ed-bar">
  <span class="ed-title"><b data-ed="brand"></b> <span data-ed="subtitle"></span></span>
  <div class="ed-tools">
    <button data-act="new">New</button>
    <button data-act="open">Open…</button>
    <button data-act="save">Save</button>
    <button data-act="copy">Copy</button>
    <span class="ed-sep"></span>
    <button data-act="undo" data-ed="undo">Undo</button>
    <button data-act="redo" data-ed="redo">Redo</button>
    <span class="ed-sep"></span>
    <label>Grid
      <select data-ed="snap">
        <option value="0">free</option><option value="0.25">0.25</option>
        <option value="0.5" selected>0.5</option><option value="1">1</option>
        <option value="2">2</option>
      </select>
    </label>
    <label>Angle
      <select data-ed="angle">
        <option value="0">free</option><option value="15" selected>15°</option>
        <option value="45">45°</option><option value="90">90°</option>
      </select>
    </label>
    <span class="ed-spacer"></span>
    <span data-ed="extras"></span>
    <button data-act="help">Keys</button>
  </div>
</header>
<div class="ed-body">
  <aside class="ed-palette" data-ed="palette"></aside>
  <section class="ed-stage">
    <div class="ed-viewport" data-ed="viewport"></div>
    <div class="ed-hint" data-ed="hint"></div>
  </section>
  <aside class="ed-inspector" data-ed="inspector"></aside>
</div>
<footer class="ed-status" data-ed="status"></footer>
<input type="file" data-ed="file" accept="application/json,.json" hidden />
<dialog data-ed="help">
  <h3 style="margin:0">Keys</h3>
  <dl>
    <dt><kbd>click</kbd></dt><dd>select · <kbd>shift</kbd> adds</dd>
    <dt><kbd>drag</kbd></dt><dd>move along the ground</dd>
    <dt><kbd>right-drag</kbd> / <kbd>wheel</kbd></dt><dd>orbit · zoom</dd>
    <dt><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd></dt><dd>pan the camera</dd>
    <dt><kbd>arrows</kbd></dt><dd>nudge · <kbd>shift</kbd> fine · <kbd>PgUp/PgDn</kbd> height</dd>
    <dt><kbd>Q</kbd> <kbd>E</kbd></dt><dd>rotate</dd>
    <dt><kbd>[</kbd> <kbd>]</kbd></dt><dd>scale</dd>
    <dt><kbd>G</kbd></dt><dd>drop to the ground</dd>
    <dt><kbd>Tab</kbd></dt><dd>cycle through the level</dd>
    <dt><kbd>Ctrl</kbd>+<kbd>D</kbd></dt><dd>duplicate</dd>
    <dt><kbd>Del</kbd></dt><dd>delete</dd>
    <dt><kbd>Ctrl</kbd>+<kbd>Z</kbd> / <kbd>Y</kbd></dt><dd>undo · redo</dd>
    <dt><kbd>Ctrl</kbd>+<kbd>S</kbd></dt><dd>save the level file</dd>
    <dt><kbd>Esc</kbd></dt><dd>put the palette down / deselect</dd>
  </dl>
  <p style="color:var(--ed-dim)">
    Everything you place is stored as a placement — a kind, a transform and a few
    props — never as geometry.
  </p>
  <form method="dialog"><button style="margin-top:6px">Close</button></form>
</dialog>
`;
