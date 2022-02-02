import {Decoration, DecorationSet, Plugin} from "@progress/kendo-angular-editor";
import {PluginSpec} from "prosemirror-state";

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
