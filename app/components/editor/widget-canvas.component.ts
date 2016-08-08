import {Component, Input} from '@angular/core';
import {UI} from "../../services/ui-constants";
import {Draggable} from "../../directives/draggable.directive";
import {ClowdFlowsDataService} from "../../services/clowdflows-data.service";
import {WidgetDialogComponent} from "./widget-dialog.component";
import {Output as WorkflowOutput} from "../../models/output";
import {Input as WorkflowInput} from "../../models/input";
import {Connection} from "../../models/connection";

@Component({
    selector: 'widget-canvas',
    templateUrl: 'app/components/editor/widget-canvas.component.html',
    styleUrls: ['app/components/editor/widget-canvas.component.css'],
    directives: [WidgetDialogComponent, Draggable]
})
export class WidgetCanvasComponent {
    @Input() workflow:any;
    ui_constants = UI;
    selectedInput:WorkflowInput = null;
    selectedOutput:WorkflowOutput = null;

    constructor(private clowdflowsDataService:ClowdFlowsDataService) {
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

    select(event, object) {
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
        let conn = new Connection('', this.selectedOutput.widget, this.selectedInput.widget,
            this.selectedOutput.url, this.selectedInput.url, this.workflow);
        this.clowdflowsDataService.addConnection(conn);
        this.workflow.connections.push(conn);
        this.selectedInput.connection = conn;
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
                // Delete the connections
                for (let conn of this.workflow.connections) {
                    if (conn.input_widget == widget || conn.output_widget == widget) {
                        this.clowdflowsDataService
                            .deleteConnection(conn)
                            .then(
                                (result) => {
                                    let idx = this.workflow.connections.indexOf(conn);
                                    this.workflow.connections.splice(idx, 1);
                                }
                            );
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
        }

        for (let conn of this.workflow.connections) {
            if (conn.selected) {
                this.clowdflowsDataService
                    .deleteConnection(conn)
                    .then(
                        (result) => {
                            let idx = this.workflow.connections.indexOf(conn);
                            this.workflow.connections.splice(idx, 1);
                        }
                    );
            }
        }
    }

    handleShortcuts(event) {
        if (event.keyCode == 46) {  // Delete
            // Check that it doesn't come from an input field
            if (event.srcElement.localName != "input") {
                this.deleteSelectedObjects();
            }
        }
    }
}
