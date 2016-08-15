import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ToolbarComponent} from "./toolbar.component";
import {WidgetTreeComponent} from "./widget-tree.component";
import {WidgetCanvasComponent} from "./widget-canvas.component";
import {LoggingComponent} from "./logging.component";
import {AbstractWidget} from "../../models/abstract-widget";
import {ClowdFlowsDataService} from "../../services/clowdflows-data.service";
import {LoggerService} from "../../services/logger.service";
import {Widget} from "../../models/widget";
import {Connection} from "../../models/connection";
import {Output as WorkflowOutput} from "../../models/output";

@Component({
    selector: 'editor',
    templateUrl: 'app/components/editor/editor.component.html',
    directives: [ToolbarComponent, WidgetTreeComponent, WidgetCanvasComponent, LoggingComponent]
})
export class EditorComponent implements OnInit, OnDestroy {
    @ViewChild(WidgetCanvasComponent) canvasComponent:WidgetCanvasComponent;
    workflow:any = {};
    sub:any;

    constructor(private clowdflowsDataService:ClowdFlowsDataService,
                private route:ActivatedRoute,
                private loggingService:LoggerService) {
    }

    addWidget(abstractWidget:AbstractWidget) {
        let widgetData = {
            workflow: this.workflow.url,
            x: 50,
            y: 50,
            name: abstractWidget.name,
            abstract_widget: abstractWidget.id,
            finished: false,
            error: false,
            running: false,
            interaction_waiting: false,
            type: 'regular',
            progress: 0
        };

        // Sync with server
        this.clowdflowsDataService
            .addWidget(widgetData, this.workflow)
            .then((widget) => {
                this.workflow.widgets.push(widget);
            });
    }

    saveWidget(widget:Widget) {
        this.clowdflowsDataService
            .saveWidget(widget);
    }

    saveWidgetPosition(widget:Widget) {
        this.clowdflowsDataService
            .saveWidgetPosition(widget);
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

    resetWidget(widget:Widget) {
        this.clowdflowsDataService
            .resetWidget(widget);
    }

    copyWidget(widget:Widget) {
        let widgetData = {
            workflow: this.workflow.url,
            x: widget.x + 50,
            y: widget.y + 50,
            name: `${widget.name} (copy)`,
            abstract_widget: widget.abstract_widget,
            finished: false,
            error: false,
            running: false,
            interaction_waiting: false,
            type: widget.type,
            progress: 0
        };

        // Sync with server
        this.clowdflowsDataService
            .addWidget(widgetData, this.workflow)
            .then((widget) => {
                this.workflow.widgets.push(widget);
            });
    }

    runWidget(widget:Widget) {
        this.clowdflowsDataService
            .runWidget(widget);
    }

    fetchOutputValue(output:WorkflowOutput) {
        this.clowdflowsDataService
            .fetchOutputValue(output);
    }

    addConnection() {
        var selectedInput = this.canvasComponent.selectedInput;
        var selectedOutput = this.canvasComponent.selectedOutput;
        let connectionData = {
            input: selectedInput.url,
            output: selectedOutput.url,
            workflow: this.workflow.url
        };
        this.clowdflowsDataService
            .addConnection(connectionData, this.workflow)
            .then((connection) => {
                this.workflow.connections.push(connection);
                selectedInput.connection = connection;
                this.canvasComponent.unselectSignals();
            });
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

    runWorkflow() {
        this.clowdflowsDataService.runWorkflow(this.workflow);
    }

    receiveWorkflowUpdate(data) {
        let widget = this.workflow.widgets.find(widgetObj => widgetObj.id == data.widget_pk);
        if (widget != undefined) {
            widget.finished = data.status.finished;
            widget.error = data.status.error;
            widget.running = data.status.running;
            widget.interaction_waiting = data.status.interaction_waiting;
        }
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            let id = +params['id'];
            this.clowdflowsDataService.getWorkflow(id)
                .then(workflow => {
                    this.workflow = workflow;
                    this.clowdflowsDataService.workflowUpdates((data) => {
                        this.receiveWorkflowUpdate(data);
                    }, workflow);

                    this.loggingService.success("Successfully loaded workflow.");
                });
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}
