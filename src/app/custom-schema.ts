import {PhilipsMarkSpec} from "src/app/philips-mark.spec";
import {Schema, schema} from "@progress/kendo-angular-editor";

// @ts-ignore
const marks = schema.spec.marks.append({
  algotecSf: new PhilipsMarkSpec()
});
export const ReportingSchema = new Schema({
  nodes: schema.spec.nodes,
  marks: marks
});
