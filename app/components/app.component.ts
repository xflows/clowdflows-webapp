import {Component} from '@angular/core';
import {EditorComponent} from "./editor.component";
import {ClowdFlowsDataService} from '../services/clowdflows-data.service';

@Component({
    selector: 'clowdflows-app',
    templateUrl: 'app/components/app.component.html',
    directives: [EditorComponent],
    providers: [ClowdFlowsDataService]
})
export class AppComponent {
}
