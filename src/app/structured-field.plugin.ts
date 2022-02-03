import {EditorState, NodeType, Plugin, Schema} from "@progress/kendo-angular-editor";
import {PluginSpec} from "prosemirror-state";
import {chainCommands} from "prosemirror-commands";
import {DispatchFn} from "@progress/kendo-angular-editor/dist/es2015/common/commands";

export class StructuredFieldPlugin extends Plugin {
  constructor() {
    const pluginSpec: PluginSpec =
      {
        props: {
          // decorations(state) {
          //   // return DecorationSet.create(state.doc, [
          //   //   Decoration.inline(0, state.doc.content.size, {style: "background: blue"})
          //   // ])
          // }
        }

      }
    super(pluginSpec);
  }

  static create() {
    return new StructuredFieldPlugin();
  }
}

/**
 * Helper function to remove hard break and insert paragraph instead.
 * @param {Object} params
 * @param {import('prosemirror-model').NodeType} params.hardBreak
 * @param {import('prosemirror-model').NodeType} params.paragraph
 */
function removeHardBreakAndInsertParagraph(hardBreak: NodeType, paragraph: NodeType) {

  /**
   * @param {import('prosemirror-state').EditorState} state ProseMirror editor state.
   * @param {Function} dispatch Editor's dispatch function.
   */
  return (state: EditorState, dispatch?: DispatchFn) => {
    const {$from} = state.selection;

    if (!$from.parent.isBlock) {
      return false;
    }

    if ($from.parent.type !== paragraph) {
      return false;
    }

    if ($from.nodeBefore && $from.nodeBefore.type !== hardBreak) {
      return false;
    }

    if (dispatch) {
      dispatch(
        state.tr
          .delete($from.pos - ($from.nodeBefore as any).nodeSize, $from.pos)
          .replaceSelectionWith(paragraph.create())
          .scrollIntoView()
      );
    }

    return true;
  };
}

/**
 * Helper function to insert hard break.
 * @param {Object} params
 * @param {import('prosemirror-model').NodeType} params.hardBreak
 * @param {import('prosemirror-model').NodeType} params.paragraph
 */
function insertHardBreak(hardBreak: NodeType, paragraph: NodeType) {
  /**
   * @param {import('prosemirror-state').EditorState} state ProseMirror editor state.
   * @param {Function} dispatch Editor's dispatch function.
   */
  return (state: EditorState, dispatch?: DispatchFn) => {
    const {$from} = state.selection;

    if (!$from.parent.isBlock) {
      return false;
    }

    if ($from.parent.type !== paragraph) {
      return false;
    }

    if (dispatch) {
      dispatch(state.tr.replaceSelectionWith(hardBreak.create()).scrollIntoView());
    }

    return true;
  };
}

/**
 * Build keymap that binds keyboard combinations to editor actions.
 * @param {import('prosemirror-model').Schema} schema Prosemirror schema.
 * @return {Object}
 */
export function buildKeymap(schema: Schema) {
  const keys: any = {};
  const {hardBreak, paragraph} = schema.nodes;

  keys.Enter = chainCommands(
    removeHardBreakAndInsertParagraph(hardBreak, paragraph),
    insertHardBreak(hardBreak, paragraph)
  );

  return keys;
}


