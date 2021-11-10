import * as ui from "./ui"
export * from "./ui"
import DATA from "./employees-json"
export function runUI() {
    ui.runUI();
    console.log(DATA);
}
