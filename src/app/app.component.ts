import {Component} from '@angular/core';
import {Plugin, Schema} from "@progress/kendo-angular-editor";
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
export class AppComponent {
  title = 'angular-kendo';
  public value = `<p><philips-sf-start start=1 end=15 guid="xxxxx"></philips-sf-start>Demo  <b>content</b><philips-sf-end></philips-sf-end></p>`;
  schema: Schema = ReportingSchema

  constructor() {

  }

  public myPlugins = (defaultPlugins: Plugin[]): Plugin[] => [
    ...defaultPlugins,
    inputRule(),
    StructuredFieldPlugin.create()
  ];
  ngAfterViewInit(): void {
    applyDevTools(this.editor.view);
  }

}
