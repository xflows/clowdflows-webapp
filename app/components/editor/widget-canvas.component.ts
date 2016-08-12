import {Component, Input, Output, EventEmitter} from '@angular/core';
import {ContextMenuComponent, ContextMenuService} from 'angular2-contextmenu/angular2-contextmenu';
import {UI} from "../../services/ui-constants";
import {Draggable} from "../../directives/draggable.directive";
import {ClowdFlowsDataService} from "../../services/clowdflows-data.service";
import {WidgetDialogComponent} from "./widget-dialog.component";
import {Output as WorkflowOutput} from "../../models/output";
import {Input as WorkflowInput} from "../../models/input";

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

    public onContextMenu($event:MouseEvent, item:any):void {
        $event.preventDefault();
        this.contextMenuService.show.next({
            actions: [
                {
                    html: () => `<span class="glyphicon glyphicon-play" aria-hidden="true"></span> Run only this`,
                    click: (item) => console.log('Run', item.name)
                },
                {
                    html: () => `<span class="glyphicon glyphicon-pencil" aria-hidden="true"></span> Properties`,
                    click: (item) => console.log('Properties', item.name)
                },
                {
                    html: () => `<span class="glyphicon glyphicon-stats" aria-hidden="true"></span> Results`,
                    click: (item) => console.log('Results', item.name)
                },
                {
                    html: () => `<span class="glyphicon glyphicon-repeat" aria-hidden="true"></span> Reset`,
                    click: (item) => console.log('Reset', item.name)
                },
                {
                    html: () => `<span class="glyphicon glyphicon-console" aria-hidden="true"></span> Rename`,
                    click: (item) => console.log('Rename', item.name)
                },
                {
                    html: () => `<span class="glyphicon glyphicon-copy" aria-hidden="true"></span> Copy`,
                    click: (item) => console.log('Copy', item.name)
                },
                {
                    html: () => `<span class="glyphicon glyphicon-trash" aria-hidden="true"></span> Delete`,
                    click: (item) => console.log('Delete', item.name)
                },
                {
                    html: () => `<span class="glyphicon glyphicon-question-sign" aria-hidden="true"></span> Help`,
                    click: (item) => console.log('Help', item.name)
                },
            ],
            event: $event,
            item: item,
        });
    }
}
