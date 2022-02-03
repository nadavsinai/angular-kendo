import {Directive, Host, OnInit} from '@angular/core';
import {EditorComponent, Transaction} from "@progress/kendo-angular-editor";
import {ToolBarButtonComponent} from "@progress/kendo-angular-toolbar";
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';

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
    let tr: Transaction;
    if (this.editor.selectionText.length) {
      let content = state.selection.content();
      const newField = state.schema.nodes.PhilipsStructuredField.create(null, content.content)
      tr = state.tr.replaceSelectionWith(newField);
    } else {
      let startPos = state.selection.from;
      // create a text node
      const text = '--';
      const textNode = state.schema.text(text);
      const newField = state.schema.nodes.PhilipsStructuredField.create(null, textNode)
      tr = state.tr.insert(startPos, newField);

    }
    dispatch(tr);

  }
}
