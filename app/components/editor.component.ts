import {Component} from '@angular/core';
import {ToolbarComponent} from "./toolbar.component";
import {WidgetTreeComponent} from "./widget-tree.component";
import {WidgetCanvasComponent} from "./widget-canvas.component";
import {LoggingComponent} from "./logging.component";
import {ConfigService} from "../services/config.service";
import {AbstractWidget} from "../models/abstract-widget";
import {ClowdFlowsDataService} from "../services/clowdflows-data.service";


@Component({
    selector: 'editor',
    templateUrl: 'app/components/editor.component.html',
    directives: [ToolbarComponent,WidgetTreeComponent,WidgetCanvasComponent,LoggingComponent]
})
export class EditorComponent {

    canvasWidgets = [];

    constructor(
        private config:ConfigService,
        private clowdflowsDataService:ClowdFlowsDataService
    ) {}

    addWidgetToCanvas(abstractWidget:AbstractWidget)
    {
        // TODO: construct actual Widget from AbstractWidget here and call data service to save.
        this.canvasWidgets.push(abstractWidget.name);
    }
}
