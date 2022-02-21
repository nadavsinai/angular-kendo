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
    const tr: Transaction = state.tr;
    const newFieldStart = state.schema.nodes.PhilipsStructuredFieldStart.create(null, null);
    const newFieldEnd = state.schema.nodes.PhilipsStructuredFieldEnd.create(null, null);
    let content = state.schema.text('--');
    if (this.editor.selectionText.length) {
      content = state.selection.content();
      tr.replaceSelection(content);
      tr.insert(state.selection.to, newFieldEnd);
      tr.insert(state.selection.from, newFieldStart);
    } else {
      let startPos = state.selection.from;
      const text = '--';
      const textNode = state.schema.text(text);
      tr.insert(startPos, [newFieldStart, newFieldEnd]);
      tr.insert(startPos+1,textNode);
    }
    dispatch(tr);

  }
}
