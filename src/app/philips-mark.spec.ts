import {Mark} from "@progress/kendo-angular-editor";
import {getAttributes, getAttrs} from "@progress/kendo-angular-editor/dist/es2015/config/utils";
import {AttributeSpec, MarkSpec} from "prosemirror-model";

export class PhilipsMarkSpec implements MarkSpec {
  attrs: { [p: string]: AttributeSpec } | null | undefined = {"sf-data": {default: ""}}
  excludes: string | null | undefined = '';

  // group: string | null | undefined;
  // inclusive: boolean | null | undefined;
  // spanning: boolean | null | undefined;

  parseDOM = [{tag: 'span', attrs: {'sf-data': true}, getAttrs: getAttributes}]

  toDOM(mark: Mark<any>, inline: boolean): any {
    return ['span', getAttrs(mark.attrs)];
  }


}
