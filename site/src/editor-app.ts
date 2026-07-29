/**
 * The docs-site editor.
 *
 * There used to be four hundred lines here. They are now `gama3d/editor`,
 * because a game that wants a level editor should get one by pointing
 * `mountEditor` at its catalog — not by copying somebody's DOM. What is
 * left is the part that is genuinely this page's: which kit to load, and a
 * hook for the headless verifier.
 */
import { mountEditor } from 'gama3d/editor';
import { STARTER, kit } from './editor-kit';

const session = mountEditor({
  catalog: kit,
  container: document.getElementById('app')!,
  level: STARTER,
  storageKey: 'gama.editor.level',
  subtitle: 'Level editor',
  snap: 0.5,
  snapAngle: 15,
});

// ------------------------------------------------- headless verification hook

declare global {
  interface Window {
    editorDebug: () => Record<string, unknown>;
    editorSelfTest: () => Record<string, unknown>;
  }
}

window.editorDebug = () => {
  const { editor, level, game } = session;
  return {
    entities: editor.toJSON().entities.length,
    built: level.objects.length,
    editable: editor.editable.length,
    kinds: kit.kinds.length,
    selection: editor.selection,
    undo: editor.undoLabel,
    historyLength: editor.historyLength,
    paletteButtons: document.querySelectorAll('.ed-palette button').length,
    inspectorRows: document.querySelectorAll('.ed-inspector .ed-row').length,
    draws: game.renderer.info.render.calls,
    triangles: game.renderer.info.render.triangles,
  };
};

/**
 * The check that matters: drive the real editor through a real edit and see
 * whether the file comes back. A screenshot proves it renders; this proves
 * the round trip survives a session.
 */
window.editorSelfTest = () => {
  const { editor } = session;
  // Only this test's own steps are undone. Walking the WHOLE stack would
  // also undo whatever the session did before it was called.
  const depth = editor.historyLength;
  const before = JSON.stringify(editor.toJSON());

  editor.select(editor.editable[0].id);
  editor.move(3, 0, -2);
  editor.commit();
  editor.rotate(0.4);
  editor.commit();
  const placed = editor.place({ kind: 'barrel', at: [2, 0, 2] });
  const duplicated = editor.duplicate();
  editor.remove();
  const dirty = JSON.stringify(editor.toJSON());

  let steps = 0;
  while (editor.historyLength > depth && editor.undo()) steps++;
  return {
    placed: !!placed,
    duplicated: duplicated.length,
    changed: dirty !== before,
    steps,
    restored: JSON.stringify(editor.toJSON()) === before,
    entities: editor.toJSON().entities.length,
  };
};
