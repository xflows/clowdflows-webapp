import {Component, ViewContainerRef} from '@angular/core';
import {Router, ROUTER_DIRECTIVES} from '@angular/router';
import {EditorComponent} from "./editor/editor.component";
import {ClowdFlowsDataService} from '../services/clowdflows-data.service';
import {UserService} from "../services/user.service";

@Component({
    selector: 'clowdflows-app',
    templateUrl: 'app/components/app.component.html',
    directives: [EditorComponent, ROUTER_DIRECTIVES],
    providers: [ClowdFlowsDataService],
    precompile: [EditorComponent]
})
export class AppComponent {
    public constructor(private viewContainerRef:ViewContainerRef, private userService: UserService, private router: Router) {  }
}
