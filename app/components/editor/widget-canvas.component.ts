import {Component, Input, Output, EventEmitter} from '@angular/core';
import {ContextMenuComponent, ContextMenuService} from 'angular2-contextmenu/angular2-contextmenu';
import {UI} from "../../services/ui-constants";
import {Draggable} from "../../directives/draggable.directive";
import {ClowdFlowsDataService} from "../../services/clowdflows-data.service";
import {WidgetDialogComponent} from "./widget-dialog.component";
import {Output as WorkflowOutput} from "../../models/output";
import {Input as WorkflowInput} from "../../models/input";
import {Connection} from "../../models/connection";
import {Widget} from "../../models/widget";

@Component({
    selector: 'widget-canvas',
    templateUrl: 'app/components/editor/widget-canvas.component.html',
    styleUrls: ['app/components/editor/widget-canvas.component.css'],
    directives: [WidgetDialogComponent, Draggable, ContextMenuComponent],
    providers: [ContextMenuService]
})
export class WidgetCanvasComponent {
    @Input() workflow:any;
    @Output() addConnectionRequest = new EventEmitter();
    ui_constants = UI;
    selectedInput:WorkflowInput = null;
    selectedOutput:WorkflowOutput = null;

    public items = [
        {name: 'John', otherProperty: 'Foo'},
        {name: 'Joe', otherProperty: 'Bar'}
    ];

    constructor(private clowdflowsDataService:ClowdFlowsDataService, private contextMenuService:ContextMenuService) {
    }

    move(position, widget) {
        widget.x = position.x;
        widget.y = position.y;
    }

    saveWidget(widget) {
        this.clowdflowsDataService.saveWidget(widget);
    }

    endMove(widget) {
        this.clowdflowsDataService.saveWidgetPosition(widget);
    }

    showDialog(widget) {
        widget.showDialog = true;
    }

    showResults(widget) {
        if (widget.value == null) {
            for (let output of widget.outputs) {
                this.clowdflowsDataService.fetchOutputValue(output);
            }
        }
        widget.showResults = true;
    }

    showHelp(widget) {
        widget.showHelp = true;
    }

    showRenameDialog(widget) {
        widget.showRenameDialog = true;
    }

    select(event, object) {
        if (!event.shiftKey && !event.ctrlKey) {
            this.unselectObjects();
        }

        object.selected = true;
        event.stopPropagation();

        if (object instanceof WorkflowInput) {
            if (this.selectedInput != null) {
                this.selectedInput.selected = false;
            }
            this.selectedInput = object;
        } else if (object instanceof WorkflowOutput) {
            if (this.selectedOutput != null) {
                this.selectedOutput.selected = false;
            }
            this.selectedOutput = object;
        }

        if (object instanceof WorkflowInput || object instanceof WorkflowOutput) {
            if (this.selectedOutput != null && this.selectedInput != null &&
                this.selectedInput.connection == null) {
                this.newConnection();
            }
        }
    }

    newConnection() {
        this.addConnectionRequest.emit("");
        this.unselectSignals();
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
        // Delete the connections
        for (let conn of this.workflow.connections) {
            if (conn.input_widget == widget || conn.output_widget == widget) {
                this.deleteConnection(conn);
            }
        }
        // Delete the widget
        this.clowdflowsDataService
            .deleteWidget(widget)
            .then(
                (result) => {
                    let idx = this.workflow.widgets.indexOf(widget);
                    this.workflow.widgets.splice(idx, 1);
                }
            );
    }

    deleteConnection(connection:Connection) {
        this.clowdflowsDataService
            .deleteConnection(connection)
            .then(
                (result) => {
                    let idx = this.workflow.connections.indexOf(connection);
                    this.workflow.connections.splice(idx, 1);
                }
            );
    }

    resetWidget(widget:Widget) {
        this.clowdflowsDataService
            .resetWidget(widget);
    }

    copyWidget(widget:Widget) {
        // TODO
    }

    runWidget(widget:Widget) {
        // TODO
    }

    handleShortcuts(event) {
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
                    click: (widget) => this.runWidget(widget)
                },
                {
                    html: () => `<span class="glyphicon glyphicon-pencil"></span> Properties`,
                    click: (widget) => this.showDialog(widget)
                },
                {
                    html: () => `<span class="glyphicon glyphicon-stats"></span> Results`,
                    click: (widget) => this.showResults(widget)
                },
                {
                    html: () => `<span class="glyphicon glyphicon-repeat"></span> Reset`,
                    click: (widget) => this.resetWidget(widget)
                },
                {
                    html: () => `<span class="glyphicon glyphicon-console"></span> Rename`,
                    click: (widget) => this.showRenameDialog(widget)
                },
                {
                    html: () => `<span class="glyphicon glyphicon-copy"></span> Copy`,
                    click: (widget) => this.copyWidget(widget)
                },
                {
                    html: () => `<span class="glyphicon glyphicon-trash"></span> Delete`,
                    click: (widget) => this.deleteWidget(widget)
                },
                {
                    html: () => `<span class="glyphicon glyphicon-question-sign"></span> Help`,
                    click: (widget) => this.showHelp(widget)
                },
            ],
            event: $event,
            item: item,
        });
    }
}
