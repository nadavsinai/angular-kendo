import {Directive, Host, OnInit} from '@angular/core';
import {EditorComponent} from "@progress/kendo-angular-editor";
import {ToolBarButtonComponent} from "@progress/kendo-angular-toolbar";
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {StructuredFieldPlugin} from "./structured-field.plugin";

@UntilDestroy()
@Directive({
  selector: 'kendo-toolbar-button[sfPrintButtonComponent]'
})

export class StructuredFieldPrintButtonComponent implements OnInit {


  constructor(@Host() private editor: EditorComponent, private button: ToolBarButtonComponent,) {
  }

  ngOnInit() {
    this.button.text = "Log print SFs";
    this.button.click.pipe(untilDestroyed(this)).subscribe(this.onClick.bind(this));
  }

  onClick() {
    const {state} = this.editor.view;
    //const {selection} = state;
    StructuredFieldPlugin.instance.print(state);
  }
}
