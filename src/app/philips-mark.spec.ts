import {Node} from "@progress/kendo-angular-editor";
import {AttributeSpec, NodeSpec} from "prosemirror-model";
import {hole} from "@progress/kendo-angular-editor/dist/es2015/config/utils";
import {ReportingSchema} from "./custom-schema";

export class PhilipsStructuredField implements NodeSpec {
  attrs: { [p: string]: AttributeSpec } | null | undefined = null;
  group = 'block';
  defining = true;
  content = "block*";
  // content = "text*";
  isolating = false;
  parseDOM = [{
    tag: 'philips-sf',
    getAttrs: (dom: any) => ({
      // src: dom.getAttribute(),
      // style: dom.getAttribute()
    })
  }]

  toDOM(node: Node<typeof ReportingSchema>): any {
    return ['philips-sf', {}, hole]; //middle object is for rendering the attributes out of the node, hole is where to put the content (first child)
  }


}
