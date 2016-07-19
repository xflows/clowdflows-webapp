import {Component} from '@angular/core';
import {EditorComponent} from "./editor.component";
import {ClowdFlowsService} from './clowdflows.service';

@Component({
    selector: 'clowdflows-app',
    templateUrl: 'app/app.component.html',
    directives: [EditorComponent],
    providers: [ClowdFlowsService]
})
export class AppComponent {
}
