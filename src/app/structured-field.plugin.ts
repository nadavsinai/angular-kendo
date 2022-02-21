import {Decoration, DecorationSet, EditorState, Plugin, Transaction,} from "@progress/kendo-angular-editor";
import {ReportingSchema} from "./custom-schema";
import {Selection} from "prosemirror-state";

interface IStructuredFieldMeta {
  isEmpty: boolean;
}

export class StructuredFieldPlugin extends Plugin<DecorationSet<typeof ReportingSchema>, typeof ReportingSchema> {
  static instance: StructuredFieldPlugin;

  constructor() {
    super({
      state: {
        init(_, {schema, doc}) {
          doc.nodesBetween(0, doc.nodeSize - 2, (node, pos, parent, index) => {
            if (node.type === schema.nodes.PhilipsStructuredFieldStart) {
              console.log('detected existing field, should add decoration')
            }
            return true;
          });
          // console.log(initialFields);
          return DecorationSet.create(doc, [] as Decoration<IStructuredFieldMeta>[]);
        },
        apply(tr, set: DecorationSet<typeof ReportingSchema>) {
          return (tr.getMeta(StructuredFieldPlugin.instance) || set).map(tr.mapping, tr.doc);
        }
      },
      props: {
        handleTextInput(view, from, to): boolean {
          console.log(StructuredFieldPlugin.instance.getState(view.state).find(from, to));
          return false;
        },
        decorations(state) {
          return StructuredFieldPlugin.instance.getState(state)
        }
      }
    });
    StructuredFieldPlugin.instance = this;
  }

  static create() {
    return StructuredFieldPlugin.instance ? StructuredFieldPlugin.instance : new StructuredFieldPlugin();
  }

  add(pos: Selection, state: EditorState, extraMeta?: Partial<IStructuredFieldMeta>): Transaction {
    let tr = state.tr;
    let from = pos.from;
    let to = pos.to;
    const newFieldStart = state.schema.nodes.PhilipsStructuredFieldStart.create(null, null);
    const newFieldEnd = state.schema.nodes.PhilipsStructuredFieldEnd.create(null, null);
    if (pos.to === pos.from) {
      const textNode = state.schema.text('--');
      tr = tr.insert(from, [newFieldStart, textNode, newFieldEnd]);
      to = to + 2;
    } else {
      tr = tr.insert(to, newFieldEnd);
      tr = tr.insert(from, newFieldStart);
    }
    const decoration = Decoration.inline<IStructuredFieldMeta>(pos.from, to, {}, {isEmpty: true, ...extraMeta});
    const newState = this.getState(state).add(tr.doc, [decoration]);
    tr = tr.setMeta(StructuredFieldPlugin.instance, newState);
    return tr;

  }

  // todo : remove()
}
