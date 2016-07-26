import {Component, Input} from '@angular/core';
import {UI} from "../services/ui-constants";
import {Draggable} from "../directives/draggable.directive";
import {ClowdFlowsDataService} from "../services/clowdflows-data.service";

@Component({
    selector: 'widget-canvas',
    templateUrl: 'app/components/widget-canvas.component.html',
    styleUrls: ['app/components/widget-canvas.component.css'],
    directives: [Draggable]
})
export class WidgetCanvasComponent {
    @Input() workflow:any;
    ui_constants = UI;

    constructor(private clowdflowsDataService:ClowdFlowsDataService) { }

    move(position, widget) {
        widget.x = position.x;
        widget.y = position.y;
    }

    saveWidget(widget) {
        this.clowdflowsDataService.saveWidget(widget);
    }
}
