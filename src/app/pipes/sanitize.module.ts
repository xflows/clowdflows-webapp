import {NgModule} from "@angular/core";
import {Sanitize} from "./sanitizejs.pipe";

@NgModule({
    declarations:[Sanitize],
    imports:[],
    exports:[Sanitize]
})
export class SanitizeModule{}