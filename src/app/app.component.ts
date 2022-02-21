import {Component} from '@angular/core';
import {Plugin, Schema} from "@progress/kendo-angular-editor";
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
  public value = `<p><philips-sf-start sf-data="123"></philips-sf-start>Demo  <b>content</b><philips-sf-end></philips-sf-end></p>`;
  schema: Schema = ReportingSchema

  constructor() {

  }

  public myPlugins = (defaultPlugins: Plugin[]): Plugin[] => [
    ...defaultPlugins,
    inputRule(),
    StructuredFieldPlugin.create()
  ];

}
