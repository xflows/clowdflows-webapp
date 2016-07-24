import {Component, Input} from '@angular/core';
import {UI} from "../services/ui-constants";

@Component({
    selector: 'widget-canvas',
    templateUrl: 'app/components/widget-canvas.component.html',
    styleUrls: ['app/components/widget-canvas.component.css'],
    directives: []
})
export class WidgetCanvasComponent {
    @Input() workflow:any;
    ui_constants = UI;
}
