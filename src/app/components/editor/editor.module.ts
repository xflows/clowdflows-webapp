import {NgModule}           from '@angular/core';
import {CommonModule}       from '@angular/common';
import {FormsModule}        from '@angular/forms';
import {EditorComponent}   from './editor.component';
import {TreeViewComponent} from "./widget-tree/tree-view.component";
import {ContextMenuModule, ContextMenuService} from "ngx-contextmenu";
import {DraggableWidget} from "../../directives/draggable-widget.directive";
import {WidgetDialogComponent} from "./widget-dialogs/widget-dialog.component";
import {LoggingComponent} from "./logging/logging.component";
import {WidgetCanvasComponent} from "./widget-canvas/widget-canvas.component";
import {WidgetTreeComponent} from "./widget-tree/widget-tree.component";
import {ToolbarComponent} from "./toolbar/toolbar.component";
import {ModalModule, PopoverModule, TabsModule} from "ngx-bootstrap";
import {HttpClientModule} from "@angular/common/http";
import {routing} from "../../app.routing";
import {DndModule} from 'ng2-dnd';
import {DraggableWindow} from "../../directives/draggable-window.directive";
import {FocusOnVisible} from "../../directives/focus.directive";
import {Ng2UploaderModule} from 'ng2-uploader/ng2-uploader'
import {RecommenderService} from "../../services/recommender.service";
import {WidgetLibraryService} from "../../services/widget-library.service";
import {Sanitize} from "../../pipes/sanitizejs.pipe";
import {SanitizeModule} from "../../pipes/sanitize.module";
import {TutorialComponent} from "./tutorial/tutorial.component";
import {CutPipe} from "../../pipes/cut.pipe";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ContextMenuWidgetComponent } from './widget-canvas/context-menu-widget/context-menu-widget.component';
import { ContextMenuConnectionComponent } from './widget-canvas/context-menu-connection/context-menu-connection.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        ModalModule.forRoot(),
        TabsModule.forRoot(),
        ContextMenuModule.forRoot(),
        routing,
        Ng2UploaderModule,
        DndModule.forRoot(),
        SanitizeModule,
        PopoverModule.forRoot(),
        FontAwesomeModule
    ],
    declarations: [
        EditorComponent,
        TreeViewComponent,
        TreeViewComponent,
        WidgetDialogComponent,
        DraggableWidget,
        DraggableWindow,
        FocusOnVisible,
        ToolbarComponent,
        WidgetTreeComponent,
        WidgetCanvasComponent,
        LoggingComponent,
        TutorialComponent,
        CutPipe,
        ContextMenuWidgetComponent,
        ContextMenuConnectionComponent
    ],
    providers: [
        WidgetLibraryService,
        ContextMenuService,
        RecommenderService
    ],
    exports: [
        EditorComponent
    ]
})
export class EditorModule {
}
