import {Component} from '@angular/core';
import {keymap, Plugin, Schema} from "@progress/kendo-angular-editor";
import {inputRule} from "./input-rule";
import {buildKeymap, StructuredFieldPlugin} from "src/app/structured-field.plugin";
import {ReportingSchema} from "src/app/custom-schema";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-kendo';
  public value = `<philips-sf>Demo content</philips-sf>`;
  schema: Schema = ReportingSchema

  constructor() {

  }

  public myPlugins = (defaultPlugins: Plugin[]): Plugin[] => [
    ...defaultPlugins,
    inputRule(),
    keymap(buildKeymap(ReportingSchema)),
    StructuredFieldPlugin.create()
  ];

}
