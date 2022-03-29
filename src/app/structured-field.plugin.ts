import {Decoration, DecorationSet, EditorState, EditorView, Plugin, Transaction,} from "@progress/kendo-angular-editor";
import {ReportingSchema} from "./custom-schema";
import {Selection, TextSelection, NodeSelection} from "prosemirror-state";
import {Slice, Fragment} from "prosemirror-model";
import {ReplaceStep} from "prosemirror-transform"


interface IStructuredFieldMeta {
  guid: string;
  'start': number;
  'end': number;

}
interface StructuredFieldPluginState {
  debug:Decoration[];
  decorationSet:DecorationSet;

}
export class StructuredFieldPlugin extends Plugin<StructuredFieldPluginState, typeof ReportingSchema> {
  static instance: StructuredFieldPlugin;

  view!: EditorView;
  constructor() {
    super({
      state: {
        init(_, {schema, doc}) {
          let initDecorationSet :any[] = [];

          doc.nodesBetween(0, doc.content.size, (node, pos, parent, index) => {
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
          return {debug:initDecorationSet,decorationSet:DecorationSet.create(doc,initDecorationSet)};
        },
        apply(tr, oldState: StructuredFieldPluginState) {
          // @ts-ignore
          let newSet = oldState.decorationSet;
          if(tr.getMeta(StructuredFieldPlugin.instance)?.addToState){
            const newGuid = StructuredFieldPlugin.newGuid();
            const decoration = Decoration.inline<IStructuredFieldMeta>(tr.selection.from , tr.selection.to  , {style: 'color: blue'},
                {'start': tr.selection.from, 'end': tr.selection.to, guid: newGuid});//--------
             newSet = oldState.decorationSet.add(tr.doc,[decoration])
             //StructuredFieldPlugin.instance.isInsideSF(tr.doc)
            //---------
          }
          else{
             newSet = oldState.decorationSet.map(tr.mapping, tr.doc);
          }
          return  {...oldState,debug:newSet.find(),decorationSet:newSet};
        },
        toJSON(decorationSet: StructuredFieldPluginState) {
          return   decorationSet.debug.reduce((acc,dec,index) =>{
            dec.spec.from = dec.from;
            dec.spec.to = dec.to;
            acc[index] = dec.spec;
            return acc;
          },{} as any)
        },
      },
      view(view){
        StructuredFieldPlugin.instance.view = view;

        return {update: (view, prevState) => {
          const state = view.state;
            if(prevState && prevState.doc.eq(state.doc) && prevState.selection.eq(state.selection)){
              // TODO fire selectinChanged
            }
          }};
      },
      props: {
        handleTextInput(view, from, to): boolean {
          console.log(StructuredFieldPlugin.instance.getState(view.state)/*.find(from, to)*/);
          return false;
        },
        decorations: getDecorations,
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

    function getDecorations(this:StructuredFieldPlugin,state:EditorState<typeof ReportingSchema>) {
      return this.getState(state).decorationSet;
    }

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
    const newFieldStart = state.schema.nodes.PhilipsStructuredFieldStart.create( null, null);
    const newFieldEnd = state.schema.nodes.PhilipsStructuredFieldEnd.create(null, null);
    if (pos.empty) {
      const textNode = state.schema.text('…');
      //tr = tr.insert(pos.from, textNode);// replaceSelectionWith(textNode);
      tr = tr.insert(from,[ textNode]);
      to+= textNode.text.length;
      tr = tr.setSelection(TextSelection.create(tr.doc, from, to));
    }
    tr = tr.insert(to, newFieldEnd);
    tr = tr.insert(from, newFieldStart);

    tr =  tr.setMeta(StructuredFieldPlugin.instance,{addToState:true});

    return tr;
  }

  print(state: EditorState){
    this.getState(state).debug.forEach((dec, index) => {
      const doc = state.doc;
      //const startElem = doc.child(dec.from);
      let att = undefined;
      //doc.firstChild
      // doc.nodesBetween(dec.from, dec.to, (node, position) => {
      //   if (node.type.name === "PhilipsStructuredFieldStart"){
      //     att = node.attrs;
      //     //return false;
      //   }
      //   return true;
      // });
      //startElem.attrs;
      // @ts-ignore

      let guid = dec.spec.guid;
      console.log("decoration:" + index+ ", from: " +dec.from+", to: " + dec.to +`, guid: ${guid}`);
    })
  }
  // rangeFromTransform(tr: Transaction): object {
  //   let from, to
  //   for (let i = 0; i < tr.steps.length; i++) {
  //     if(tr.steps[i] instanceof ReplaceStep){
  //       //let step: ReplaceStep = tr.steps[i];
  //       let map = tr.steps[i].getMap();
  //       let stepFrom = map.map(tr.steps[i].from || tr.steps[i].pos, -1);
  //       let stepTo = map.map(step.to || step.pos, 1);
  //       from = from ? map.map(from, -1).pos.min(stepFrom) : stepFrom
  //       to = to ? map.map(to, 1).pos.max(stepTo) : stepTo
  //     }
  //
  //   }
  //   return { from, to }
  // }
  // todo : remove()

  // isInsideSF(state: EditorState, from: number, to: number) {
  //   const decs = this.getState(state);
  //   const set = decs.find(from, to);
  //   let closest = -1;
  //   set.forEach((dec) => {
  //     //id(dec.to) //TODO intersection logic should be apply here - consider implement using reduce()
  //   })
  // }



}


