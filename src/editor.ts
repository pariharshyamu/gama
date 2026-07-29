// gama3d/editor — the level editor as a mountable program.
//
// A separate entry point on purpose: `Editor` (the machinery) ships in the
// main bundle because games use it headlessly, while this is the DOM shell
// around it, and a game that never opens an editor should not pay for the
// palette, the inspector and the toolbar.
export {
  mountEditor,
  type MountEditorOptions,
  type EditorSession,
  type EditorAction,
} from './editor/mount';
export { EDITOR_CSS, EDITOR_HTML } from './editor/chrome';
