import {PhilipsStructuredField} from "src/app/philips-mark.spec";
import {Schema, schema} from "@progress/kendo-angular-editor";
import OrderedMap from 'orderedmap';
import {NodeSpec} from "prosemirror-model";

const nodes = (schema.spec.nodes as OrderedMap<NodeSpec>).append({
  PhilipsStructuredField: new PhilipsStructuredField()
});

export const ReportingSchema = new Schema({
  nodes: nodes,
  marks: schema.spec.marks
});
