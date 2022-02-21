import {Directive, Host, OnInit} from '@angular/core';
import {EditorComponent} from "@progress/kendo-angular-editor";
import {ToolBarButtonComponent} from "@progress/kendo-angular-toolbar";
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {StructuredFieldPlugin} from "./structured-field.plugin";

@UntilDestroy()
@Directive({
  selector: 'kendo-toolbar-button[sfButtonComponent]'
})

export class StructuredFieldButtonComponent implements OnInit {


  constructor(@Host() private editor: EditorComponent, private button: ToolBarButtonComponent,) {
  }

  ngOnInit() {
    this.button.text = "Insert Structured Field";
    this.button.click.pipe(untilDestroyed(this)).subscribe(this.onClick.bind(this));
  }

  onClick() {
    const {dispatch, state} = this.editor.view;
    const {selection} = state;
    dispatch(StructuredFieldPlugin.instance.add(selection,state));
    // if (this.editor.selectionText.length) {
    // } else {
    //   let startPos = state.selection.from;
    //
    //   // create a text node
    //   const text = '--';
    //   const textNode = state.schema.text(text,[ReportingSchema.mark('algotecSf')]);
    //   // create a new node with the text node as a child
    //   const paragraphNode: Node = state.schema.nodes.paragraph.create(null, textNode);
    //   let tr = state.tr.insert(startPos, paragraphNode);
    //   // const resolvedPos = tr.doc.resolve(tr.selection.anchor);
    //   // tr = tr.setSelection(new NodeSelection(resolvedPos));
    //   dispatch(tr);
    // }

  }
}
