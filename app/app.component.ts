import {Component} from '@angular/core';
import {EditorComponent} from "./editor.component";

@Component({
  selector: 'clowdflows-app',
  templateUrl: 'app/app.component.html',
  directives: [EditorComponent]
})
export class AppComponent { }
