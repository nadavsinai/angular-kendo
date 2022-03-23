import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {EditorComponent, Plugin, Schema} from "@progress/kendo-angular-editor";
import {inputRule} from "./input-rule";
import {StructuredFieldPlugin} from "src/app/structured-field.plugin";
import {ReportingSchema} from "src/app/custom-schema";
// @ts-ignore
import applyDevTools from "prosemirror-dev-tools";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit{
  title = 'angular-kendo';
  stateAsString:any = JSON.stringify({});
  public value = `<p><philips-sf-start start=1 end=15 guid="xxxxx"></philips-sf-start>Demo  <b>content</b><philips-sf-end></philips-sf-end></p>`;
  schema: Schema = ReportingSchema
  @ViewChild(EditorComponent) editor!: EditorComponent;
  constructor() {

  }
  serialize(){
    this.stateAsString = this.editor.view.state.toJSON({sf:StructuredFieldPlugin.instance});
  }
  public myPlugins = (defaultPlugins: Plugin[]): Plugin[] => [
    ...defaultPlugins,
    inputRule(),
    StructuredFieldPlugin.create()
  ];
  doc!: string;

  ngAfterViewInit(): void {
    applyDevTools(this.editor.view);
  }

}
