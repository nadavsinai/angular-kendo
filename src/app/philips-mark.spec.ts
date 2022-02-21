import {Node} from "@progress/kendo-angular-editor";
import {AttributeSpec, NodeSpec} from "prosemirror-model";
import {hole} from "@progress/kendo-angular-editor/dist/es2015/config/utils";
import {ReportingSchema} from "./custom-schema";

export class PhilipsStructuredFieldStart implements NodeSpec {
  //attrs: { [p: string]: AttributeSpec } | null | undefined = null;
  group = 'inline';
  inline = true;
  //atom = true;
  //defining = true;
  //content = "text*";
  //isolating = false;
  parseDOM = [{
    tag: 'philips-sf-start',
    getAttrs: (dom: any) => ({
    })
  }]
  toDOM(node: Node<typeof ReportingSchema>): any {
    return ['philips-sf-start', {}]; //middle object is for rendering the attributes out of the node, hole is where to put the content (first child)
  }

}
export class PhilipsStructuredFieldEnd implements NodeSpec {
  attrs: { [p: string]: AttributeSpec } | null | undefined = null;
  inline = true;
  group = 'inline';
  //defining = true;
  //atom = true;
  //content = "text*";
  //isolating = false;
  parseDOM = [{
    tag: 'philips-sf-end',
    getAttrs: (dom: any) => ({
      // src: dom.getAttribute(),
      // style: dom.getAttribute()
    })
  }]
  toDOM(node: Node<typeof ReportingSchema>): any {
    return ['philips-sf-end', {}]; //middle object is for rendering the attributes out of the node, hole is where to put the content (first child)
  }

}
