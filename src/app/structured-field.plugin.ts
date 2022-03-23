import {Decoration, DecorationSet, EditorState, Plugin, Transaction,} from "@progress/kendo-angular-editor";
import {ReportingSchema} from "./custom-schema";
import {Selection} from "prosemirror-state";
import {ReplaceStep} from "prosemirror-transform"


interface IStructuredFieldMeta {
  isEmpty: boolean;
  guid: string;
  'start': number;
  'end': number;

}

export class StructuredFieldPlugin extends Plugin<DecorationSet<typeof ReportingSchema>, typeof ReportingSchema> {
  static instance: StructuredFieldPlugin;

  constructor() {
    super({
      state: {
        init(_, {schema, doc}) {
          let initDecorationSet :any[] = [];
          let preInitArr :any[] = [];
          doc.nodesBetween(0, doc.nodeSize - 2, (node, pos, parent, index) => {
            if (node.type === schema.nodes.PhilipsStructuredFieldStart) {
              console.log('detected existing field, should add decoration')
              //preInitArr = [...preInitArr , {start: pos, end: -1, attr: node.attrs}];
              const decoration = Decoration.inline(Number(node.attrs['start']), Number(node.attrs['end']), {style: 'color: green'},
                {guid: node.attrs['guid'], 'start': node.attrs['start'], 'end': node.attrs['end']})
              initDecorationSet = [...initDecorationSet, decoration];
            }
            return true;
          });
          // console.log(initialFields);
          return DecorationSet.create(doc, [] as Decoration<IStructuredFieldMeta>[]);
          return DecorationSet.create(doc, initDecorationSet as Decoration<IStructuredFieldMeta>[]);
        },
        apply(tr, set: DecorationSet<typeof ReportingSchema>) {
          return (tr.getMeta(StructuredFieldPlugin.instance) || set).map(tr.mapping, tr.doc);
        apply(tr, oldSet: DecorationSet<typeof ReportingSchema>) {
          if(tr.getMeta(StructuredFieldPlugin.instance) && tr.docChanged){
            let set =  tr.getMeta(StructuredFieldPlugin.instance).map(tr.mapping, tr.doc);
            //--------
            set.find().forEach((d: any) =>{
              console.log(d);
            })
            if(tr.mapping){
              tr.mapping.maps.forEach((stepMap, ind) => {

              })
            }
            //StructuredFieldPlugin.instance.isInsideSF(tr.doc)
            //---------
            return set;
          }
          else{
            return oldSet.map(tr.mapping, tr.doc);
          }
          //return (tr.getMeta(StructuredFieldPlugin.instance) || oldSet).map(tr.mapping, tr.doc);
        },
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
        handlePaste(view: EditorView<typeof ReportingSchema>,event: ClipboardEvent,slice){
          return true;}, // TODO


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
          const firstStep: ReplaceStep = steps[0]; //TODO - we should iterate over all array
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

  private static newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  add(pos: Selection, state: EditorState, extraMeta?: Partial<IStructuredFieldMeta>): Transaction {
    let tr = state.tr;
    let from = pos.from;
    let to = pos.to;
    const newFieldStart = state.schema.nodes.PhilipsStructuredFieldStart.create(null, null);
    const newFieldStart = state.schema.nodes.PhilipsStructuredFieldStart.create( null, null);
    const newFieldEnd = state.schema.nodes.PhilipsStructuredFieldEnd.create(null, null);
    if (pos.to === pos.from) {
    if (pos.empty) {
      const textNode = state.schema.text('--');
      tr = tr.insert(from, [newFieldStart, textNode, newFieldEnd]);
      to = to + 2;
    } else {
      //let newNode = state.schema.nodes.heading.create({level: 1}, textNode);
      //tr = tr.replaceSelection(new Slice(Fragment.from(textNode), 0, 0));
      //tr = tr.replaceSelectionWith(textNode);
      //const resolved = tr.doc.resolve(textNode);
      //tr = tr.insert(from, textNode);//[newFieldStart, textNode, newFieldEnd]);
      //let resolved = textNode.resolve();
      from = tr.selection.from-2;
      tr = tr.setSelection(TextSelection.create(tr.doc, from, to));
      //tr = tr.setSelection(new NodeSelection(resolved));//( TextSelection.create(tr.doc, from, tr.selection.to ));//, from + newFieldStart.content.size + newFieldEnd.content.size + textNode.content.size));

    } //else {
      tr = tr.insert(to, newFieldEnd);
      tr = tr.insert(from, newFieldStart);
    }
    const decoration = Decoration.inline<IStructuredFieldMeta>(pos.from, to, {}, {isEmpty: true, ...extraMeta});
    //}
    const newGuid = StructuredFieldPlugin.newGuid();
    const fromNode = state.doc.resolve(from);
    const toNode = state.doc.resolve(to);
    const decoration = Decoration.inline<IStructuredFieldMeta>(from , to  , {style: 'color: blue'},
      {'start': from, 'end': to, guid: newGuid, ...extraMeta});
    const newState = this.getState(state).add(tr.doc, [decoration]);
    tr = tr.setMeta(StructuredFieldPlugin.instance, newState);
    //tr = tr.setSelection( TextSelection.create(tr.doc, fromNode.before(), newFieldEnd.after() ));//, from + newFieldStart.content.size + newFieldEnd.content.size + textNode.content.size));
    tr.setSelection(TextSelection.create(tr.doc, from, to));
    tr.setMeta(StructuredFieldPlugin.instance, newState);
    return tr;

  }

  // todo : remove()
  isInsideSF(state: EditorState, from: number, to: number) {
    const decs = this.getState(state);
    const set = decs.find(from, to);
    let closest = -1;
    set.forEach((dec) => {
      //id(dec.to) //TODO intersection logic should be apply here - consider implement using reduce()
    })
  }



}


