import {Component, Input, Output, EventEmitter} from '@angular/core';
import {ContextMenuComponent, ContextMenuService} from 'angular2-contextmenu/angular2-contextmenu';
import {UI} from "../../services/ui-constants";
import {Draggable} from "../../directives/draggable.directive";
import {WidgetDialogComponent} from "./widget-dialog.component";
import {Output as WorkflowOutput} from "../../models/output";
import {Input as WorkflowInput} from "../../models/input";
import {Connection} from "../../models/connection";
import {Widget} from "../../models/widget";

@Component({
    selector: 'widget-canvas',
    template: require('./widget-canvas.component.html'),
    styles: [require('./widget-canvas.component.css'),],
    directives: [WidgetDialogComponent, Draggable, ContextMenuComponent],
    providers: [ContextMenuService]
})
export class WidgetCanvasComponent {
    @Input() workflow:any;
    @Output() addConnectionRequest = new EventEmitter();
    @Output() deleteConnectionRequest = new EventEmitter<Connection>();
    @Output() saveWidgetRequest = new EventEmitter<Widget>();
    @Output() saveWidgetPositionRequest = new EventEmitter<Widget>();
    @Output() deleteWidgetRequest = new EventEmitter<Widget>();
    @Output() resetWidgetRequest = new EventEmitter<Widget>();
    @Output() resetWorkflowRequest = new EventEmitter();
    @Output() copyWidgetRequest = new EventEmitter<Widget>();
    @Output() runWidgetRequest = new EventEmitter<Widget>();
    @Output() fetchOutputResultsRequest = new EventEmitter<WorkflowOutput>();
    @Output() openSubprocessRequest = new EventEmitter<Widget>();
    ui_constants = UI;
    selectedInput:WorkflowInput = null;
    selectedOutput:WorkflowOutput = null;

    constructor(private contextMenuService:ContextMenuService) {
    }

    move(position:any, widget:Widget) {
        widget.x = position.x;
        widget.y = position.y;
    }

    saveWidget(widget:Widget) {
        this.saveWidgetRequest.emit(widget);
    }

    endMove(widget:Widget) {
        this.saveWidgetPositionRequest.emit(widget);
    }

    handleDoubleClick(widget:Widget) {
        if (widget.type == 'subprocess') {
            this.openSubprocessRequest.emit(widget);
        } else {
            this.showDialog(widget);
        }
    }

    showDialog(widget:Widget) {
        widget.showDialog = true;
    }

    showResults(widget:Widget) {
        for (let output of widget.outputs) {
            this.fetchOutputResultsRequest.emit(output);
        }
        widget.showResults = true;
    }

    showHelp(widget:Widget) {
        widget.showHelp = true;
    }

    showRenameDialog(widget:Widget) {
        widget.showRenameDialog = true;
    }

    select(event:any, object:any) {
        let clickedOnInput = object instanceof WorkflowInput;
        let clickedOnOutput = object instanceof WorkflowOutput;


        if (!event.shiftKey && !event.ctrlKey && !(clickedOnInput || clickedOnOutput)) {
            this.unselectObjects();
        }

        object.selected = true;
        event.stopPropagation();

        if (clickedOnInput) {
            if (this.selectedInput != null) {
                this.selectedInput.selected = false;
            }
            this.selectedInput = object;
        } else if (clickedOnOutput) {
            if (this.selectedOutput != null) {
                this.selectedOutput.selected = false;
            }
            this.selectedOutput = object;
        }

        if (clickedOnInput || clickedOnOutput) {
            if (this.selectedOutput != null && this.selectedInput != null &&
                this.selectedInput.connection == null) {
                this.newConnection();
            }
        }
    }

    newConnection() {
        this.addConnectionRequest.emit("");
    }

    unselectObjects() {
        for (let widget of this.workflow.widgets) {
            widget.selected = false;
        }
        for (let conn of this.workflow.connections) {
            conn.selected = false;
        }
        this.unselectSignals();
    }

    unselectSignals() {
        if (this.selectedInput != null) {
            this.selectedInput.selected = false;
            this.selectedInput = null;
        }
        if (this.selectedOutput != null) {
            this.selectedOutput.selected = false;
            this.selectedOutput = null;
        }
    }

    deleteSelectedObjects() {
        for (let widget of this.workflow.widgets) {
            if (widget.selected) {
                this.deleteWidget(widget);
            }
        }

        for (let conn of this.workflow.connections) {
            if (conn.selected) {
                this.deleteConnection(conn);
            }
        }
    }

    deleteWidget(widget:Widget) {
        this.deleteWidgetRequest.emit(widget);
    }

    deleteConnection(connection:Connection) {
        this.deleteConnectionRequest.emit(connection);
    }

    resetWidget(widget:Widget) {
        this.resetWidgetRequest.emit(widget);
    }

    resetWorkflow() {
        this.resetWorkflowRequest.emit("");
    }

    copyWidget(widget:Widget) {
        this.copyWidgetRequest.emit(widget);
    }

    runWidget(widget:Widget) {
        this.runWidgetRequest.emit(widget);
    }

    handleShortcuts(event:any) {
        if (event.keyCode == 46) {  // Delete
            // Check that it doesn't come from an input field
            if (event.srcElement.localName != "input") {
                this.deleteSelectedObjects();
            }
        }
    }

    public onContextMenu($event:MouseEvent, item:any):void {
        $event.preventDefault();
        this.contextMenuService.show.next({
            actions: [
                {
                    html: () => `<span class="glyphicon glyphicon-play"></span> Run only this`,
                    click: (widget:Widget) => this.runWidget(widget)
                },
                {
                    html: () => `<span class="glyphicon glyphicon-pencil"></span> Properties`,
                    click: (widget:Widget) => this.showDialog(widget)
                },
                {
                    html: () => `<span class="glyphicon glyphicon-stats"></span> Results`,
                    click: (widget:Widget) => this.showResults(widget)
                },
                {
                    html: () => `<span class="glyphicon glyphicon-repeat"></span> Reset`,
                    click: (widget:Widget) => this.resetWidget(widget)
                },
                {
                    html: () => `<span class="glyphicon glyphicon-repeat"></span> Reset workflow`,
                    click: (_:any) => this.resetWorkflow()
                },
                {
                    html: () => `<span class="glyphicon glyphicon-console"></span> Rename`,
                    click: (widget:Widget) => this.showRenameDialog(widget)
                },
                {
                    html: () => `<span class="glyphicon glyphicon-copy"></span> Copy`,
                    click: (widget:Widget) => this.copyWidget(widget)
                },
                {
                    html: () => `<span class="glyphicon glyphicon-trash"></span> Delete`,
                    click: (widget:Widget) => this.deleteWidget(widget)
                },
                {
                    html: () => `<span class="glyphicon glyphicon-question-sign"></span> Help`,
                    click: (widget:Widget) => this.showHelp(widget)
                },
            ],
            event: $event,
            item: item,
        });
    }
}
