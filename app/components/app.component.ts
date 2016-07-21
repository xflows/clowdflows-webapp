import {Component} from '@angular/core';
import {EditorComponent} from "./editor.component";
import {ClowdFlowsService} from '../services/clowdflows.service';

@Component({
    selector: 'clowdflows-app',
    templateUrl: 'app/components/app.component.html',
    directives: [EditorComponent],
    providers: [ClowdFlowsService]
})
export class AppComponent {
}
