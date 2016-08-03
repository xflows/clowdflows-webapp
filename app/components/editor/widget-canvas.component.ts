import {Component, Input} from '@angular/core';
import {UI} from "../../services/ui-constants";
import {Draggable} from "../../directives/draggable.directive";
import {ClowdFlowsDataService} from "../../services/clowdflows-data.service";
import {WidgetDialogComponent} from "./widget-dialog.component";

@Component({
    selector: 'widget-canvas',
    templateUrl: 'app/components/editor/widget-canvas.component.html',
    styleUrls: ['app/components/editor/widget-canvas.component.css'],
    directives: [WidgetDialogComponent, Draggable]
})
export class WidgetCanvasComponent {
    @Input() workflow:any;
    ui_constants = UI;

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
    }

    unselectObjects() {
        for (let widget of this.workflow.widgets) {
            widget.selected = false;
        }
        for (let conn of this.workflow.connections) {
            conn.selected = false;
        }
    }

    deleteSelectedObjects() {
        for (let widget of this.workflow.widgets) {
            if (widget.selected) {
                // Delete the connections
                for(let conn of this.workflow.connections) {
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

        for(let conn of this.workflow.connections) {
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
