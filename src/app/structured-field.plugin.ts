import {Decoration, DecorationSet, EditorState, Plugin, Transaction} from "@progress/kendo-angular-editor";
import {ReportingSchema} from "./custom-schema";
import {Selection} from "prosemirror-state";
import {ReplaceStep} from "prosemirror-transform"


interface IStructuredFieldMeta {
  isEmpty: boolean;
}

export class StructuredFieldPlugin extends Plugin<DecorationSet<typeof ReportingSchema>, typeof ReportingSchema> {
  static instance: StructuredFieldPlugin;

  constructor() {
    super({
      state: {
        init(_, {doc}) {
          return DecorationSet.create(doc, [] as Decoration<IStructuredFieldMeta>[]);
        },
        apply(tr, set: DecorationSet<typeof ReportingSchema>) {
          return (tr.getMeta(StructuredFieldPlugin.instance) || set).map(tr.mapping, tr.doc);
        }
      },
      props: {
        handleTextInput(view, from, to): boolean {
          //console.log(StructuredFieldPlugin.instance.getState(view.state).find(from, to));
          return false;
        },
        decorations(state) {
          return StructuredFieldPlugin.instance.getState(state)
        }


      },
      appendTransaction: function (tr: Array<Transaction<typeof ReportingSchema>>,
                                   oldState: EditorState<typeof ReportingSchema>, newState: EditorState<typeof ReportingSchema>) {
        //console.log(tr);
      },
      filterTransaction(tr: Transaction<typeof ReportingSchema>, state) : boolean{
        let res = true;
        //const selection = state.selection;
        let hasStart = false;
        let hasEnd = false;
        const steps = tr.steps;
        if(steps && steps[0] && steps[0] instanceof ReplaceStep && steps[0].to !== steps[0].from) { // real implementation should probably iterates over all steps
          const firstStep: ReplaceStep = steps[0];
          state.doc.nodesBetween(firstStep.from, firstStep.to, (node, position) => {
            if (node.type.name === "PhilipsStructuredFieldStart") {// TODO: this is just for simplifying. real implementation should be based on ids
              hasStart = true;
            }
            if (node.type.name === "PhilipsStructuredFieldEnd") {
              hasEnd = true;
            }
          });
          //console.log((hasStart && hasEnd) || (!hasStart && !hasEnd));
          res = (hasStart && hasEnd) || (!hasStart && !hasEnd);
        }
        return res;
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
