import {Component} from '@angular/core';
import {Plugin, Schema,EditorComponent} from "@progress/kendo-angular-editor";
import {inputRule} from "./input-rule";
import {StructuredFieldPlugin} from "src/app/structured-field.plugin";
import {ReportingSchema} from "src/app/custom-schema";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-kendo';
  public value = `Demo content<philips-sf-start></philips-sf-start>sf-content<philips-sf-end></philips-sf-end>`;
  schema: Schema = ReportingSchema

  constructor() {

  }

  public myPlugins = (defaultPlugins: Plugin[]): Plugin[] => [
    ...defaultPlugins,
    inputRule(),
    StructuredFieldPlugin.create()
  ];

}
