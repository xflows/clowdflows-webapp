import {NgModule}           from '@angular/core';
import {CommonModule}       from '@angular/common';
import {FormsModule}        from '@angular/forms';
import {EditorComponent}   from './editor.component';
import {TreeViewComponent} from "./widget-tree/tree-view.component";
import {ContextMenuComponent, ContextMenuService} from "angular2-contextmenu/angular2-contextmenu";
import {Draggable} from "../../directives/draggable.directive";
import {WidgetDialogComponent} from "./widget-dialogs/widget-dialog.component";
import {LoggingComponent} from "./logging/logging.component";
import {WidgetCanvasComponent} from "./widget-canvas/widget-canvas.component";
import {WidgetTreeComponent} from "./widget-tree/widget-tree.component";
import {ToolbarComponent} from "./toolbar/toolbar.component";
import {ModalModule, TabsModule} from "ng2-bootstrap/ng2-bootstrap";
import {HttpModule} from "@angular/http";
import {routing} from "../../app.routing";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        ModalModule,
        TabsModule,
        routing
    ],
    declarations: [
        EditorComponent,
        TreeViewComponent,
        TreeViewComponent,
        WidgetDialogComponent,
        Draggable,
        ContextMenuComponent,
        ToolbarComponent,
        WidgetTreeComponent,
        WidgetCanvasComponent,
        LoggingComponent
    ],
    providers: [
        ContextMenuService
    ],
    exports: [
        EditorComponent
    ]
})
export class EditorModule {
}
