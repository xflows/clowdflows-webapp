import {Component, ViewContainerRef} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {EditorComponent} from "./editor.component";
import {ClowdFlowsDataService} from '../services/clowdflows-data.service';

@Component({
    selector: 'clowdflows-app',
    templateUrl: 'app/components/app.component.html',
    directives: [EditorComponent, ROUTER_DIRECTIVES],
    providers: [ClowdFlowsDataService],
    precompile: [EditorComponent]
})
export class AppComponent {
    public constructor(private viewContainerRef:ViewContainerRef) {  }
}
