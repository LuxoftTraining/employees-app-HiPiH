import * as ui from "./ui"
export * from "./ui"
import DATA from "./employees-json"
import {jsonToEmployees} from "./model/employee";

console.log(process.env.NODE_ENV);


export function runUI() {
    ui.runUI();
    console.log(DATA);
    console.log(jsonToEmployees(DATA));
}
