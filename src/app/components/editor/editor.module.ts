import {NgModule}           from '@angular/core';
import {CommonModule}       from '@angular/common';
import {FormsModule}        from '@angular/forms';
import {EditorComponent}   from './editor.component';
import {TreeViewComponent} from "./widget-tree/tree-view.component";
import {ContextMenuComponent, ContextMenuService} from "angular2-contextmenu";
import {DraggableWidget} from "../../directives/draggable-widget.directive";
import {WidgetDialogComponent} from "./widget-dialogs/widget-dialog.component";
import {LoggingComponent} from "./logging/logging.component";
import {WidgetCanvasComponent} from "./widget-canvas/widget-canvas.component";
import {WidgetTreeComponent} from "./widget-tree/widget-tree.component";
import {ToolbarComponent} from "./toolbar/toolbar.component";
import {ModalModule, PopoverModule, TabsModule} from "ng2-bootstrap";
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

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        ModalModule.forRoot(),
        TabsModule.forRoot(),
        routing,
        Ng2UploaderModule,
        DndModule.forRoot(),
        SanitizeModule,
        PopoverModule.forRoot()
    ],
    declarations: [
        EditorComponent,
        TreeViewComponent,
        TreeViewComponent,
        WidgetDialogComponent,
        DraggableWidget,
        DraggableWindow,
        FocusOnVisible,
        ContextMenuComponent,
        ToolbarComponent,
        WidgetTreeComponent,
        WidgetCanvasComponent,
        LoggingComponent,
        TutorialComponent,
        CutPipe
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
