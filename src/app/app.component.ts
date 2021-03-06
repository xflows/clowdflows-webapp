import {Component, ViewContainerRef} from '@angular/core';
import {Router} from '@angular/router';
import {EditorComponent} from "./components/editor/editor.component";

import {UserService} from "./services/user.service";

import '../../public/css/styles.css';
import {LoadingService} from "./services/loading.service";

@Component({
    selector: 'clowdflows-app',
    template: require('./app.component.html'),
    styles: [require('./app.component.css'),],
    entryComponents: [EditorComponent]
})
export class AppComponent {
    public constructor(private viewContainerRef:ViewContainerRef, private userService:UserService, private router:Router, private loadingService:LoadingService) {
    }
}
