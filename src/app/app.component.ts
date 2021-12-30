import { Component } from '@angular/core';
import { Plugin } from "@progress/kendo-angular-editor";
import {inputRule} from "./input-rule";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-kendo';
  public value = `<p> The Editor enables users to create rich textual content. </p>`;
  public myPlugins = (defaultPlugins: Plugin[]): Plugin[] => [
    ...defaultPlugins,
    inputRule(),
  ];
}
