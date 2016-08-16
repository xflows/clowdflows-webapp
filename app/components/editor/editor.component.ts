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
import {Workflow} from "../../models/workflow";

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
                private loggerService:LoggerService) {
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
            .addWidget(widgetData)
            .then((data) => {
                let error = this.reportMessage(data);
                if (!error) {
                    let widget:Widget = new Widget(data.id, data.url, data.x, data.y, data.name, data.finished, data.error,
                        data.running, data.interaction_waiting, data.type, data.progress, data.abstract_widget,
                        data.description, data.inputs, data.outputs, this.workflow);
                    this.workflow.widgets.push(widget);
                }
            });
    }

    saveWidget(widget:Widget) {
        this.clowdflowsDataService
            .saveWidget(widget)
            .then((data) => {
                this.reportMessage(data);
            });
    }

    saveWidgetPosition(widget:Widget) {
        this.clowdflowsDataService
            .saveWidgetPosition(widget)
            .then((data) => {
                this.reportMessage(data);
            });
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
                (data) => {
                    let error = this.reportMessage(data);
                    if (!error) {
                        let idx = this.workflow.widgets.indexOf(widget);
                        this.workflow.widgets.splice(idx, 1);
                    }
                }
            );
    }

    resetWidget(widget:Widget) {
        this.clowdflowsDataService
            .resetWidget(widget)
            .then((data) => {
                this.reportMessage(data);
            });
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
            .addWidget(widgetData)
            .then((data) => {
                let error = this.reportMessage(data);
                if (!error) {
                    let widget:Widget = new Widget(data.id, data.url, data.x, data.y, data.name, data.finished, data.error,
                        data.running, data.interaction_waiting, data.type, data.progress, data.abstract_widget,
                        data.description, data.inputs, data.outputs, this.workflow);
                    this.workflow.widgets.push(widget);
                }
            });
    }

    runWidget(widget:Widget) {
        this.clowdflowsDataService
            .runWidget(widget)
            .then((data) => {
                this.reportMessage(data);
            });
    }

    fetchOutputValue(output:WorkflowOutput) {
        this.clowdflowsDataService
            .fetchOutputValue(output)
            .then((data) => {
                let error = this.reportMessage(data);
                if (!error) {
                    output.value = data.value;
                }
            });
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
            .addConnection(connectionData)
            .then((data) => {
                let error = this.reportMessage(data);
                if (!error) {
                    let input_widget:Widget = this.workflow.widgets.find(widget => widget.url == data.input_widget);
                    let output_widget:Widget = this.workflow.widgets.find(widget => widget.url == data.output_widget);
                    let connection = new Connection(data.url, output_widget, input_widget, data.output, data.input, this.workflow);
                    this.workflow.connections.push(connection);
                    selectedInput.connection = connection;
                    this.canvasComponent.unselectSignals();
                }
            });
    }

    deleteConnection(connection:Connection) {
        this.clowdflowsDataService
            .deleteConnection(connection)
            .then((data) => {
                let error = this.reportMessage(data);
                if (!error) {
                    let idx = this.workflow.connections.indexOf(connection);
                    this.workflow.connections.splice(idx, 1);
                }
            });
    }

    runWorkflow() {
        this.clowdflowsDataService
            .runWorkflow(this.workflow)
            .then((data) => {
                this.reportMessage(data);
            });
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

    private parseWorkflow(data):Workflow {
        let workflow = new Workflow(data.id, data.url, data.widgets, data.connections, data.is_subprocess, data.name,
            data.public, data.description, data.widget, data.template_parent);
        return workflow;
    }

    private reportMessage(data):boolean {
        let error:boolean = false;
        if ('status' in data) {
            if (data.status == 'error') {
                this.loggerService.error(data.message || 'Problem executing action');
                error = true;
            } else if (data.status == 'ok' && 'message' in data) {
                this.loggerService.info(data.message);
            }
        }
        return error;
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            let id = +params['id'];
            this.clowdflowsDataService.getWorkflow(id)
                .then(data => {
                    this.workflow = this.parseWorkflow(data);
                    this.clowdflowsDataService.workflowUpdates((data) => {
                        this.receiveWorkflowUpdate(data);
                    }, this.workflow);

                    this.loggerService.success("Successfully loaded workflow.");
                });
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}
