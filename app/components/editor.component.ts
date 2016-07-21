import {Component} from '@angular/core';
import {ToolbarComponent} from "./toolbar.component";
import {WidgetTreeComponent} from "./widget-tree.component";
import {WidgetCanvasComponent} from "./widget-canvas.component";
import {LoggingComponent} from "./logging.component";

@Component({
    selector: 'editor',
    templateUrl: 'app/components/editor.component.html',
    directives: [ToolbarComponent,WidgetTreeComponent,WidgetCanvasComponent,LoggingComponent]
})
export class EditorComponent { }
