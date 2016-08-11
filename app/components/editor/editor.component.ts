import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ToolbarComponent} from "./toolbar.component";
import {WidgetTreeComponent} from "./widget-tree.component";
import {WidgetCanvasComponent} from "./widget-canvas.component";
import {LoggingComponent} from "./logging.component";
import {AbstractWidget} from "../../models/abstract-widget";
import {ClowdFlowsDataService} from "../../services/clowdflows-data.service";
import {Connection} from "../../models/connection";
import {Widget} from "../../models/widget";
import {Input as WorkflowInput} from "../../models/input";
import {Output as WorkflowOutput} from "../../models/output";

@Component({
    selector: 'editor',
    templateUrl: 'app/components/editor/editor.component.html',
    directives: [ToolbarComponent, WidgetTreeComponent, WidgetCanvasComponent, LoggingComponent]
})
export class EditorComponent implements OnInit, OnDestroy {
    @ViewChild(WidgetCanvasComponent) canvasComponent:WidgetCanvasComponent
    workflow:any = {};
    sub:any;

    constructor(private clowdflowsDataService:ClowdFlowsDataService,
                private route:ActivatedRoute) {
    }

    addWidget(abstractWidget:AbstractWidget) {
        let x = 50,
            y = 50;
        let inputs = new Array<WorkflowInput>();
        let parameters = new Array<WorkflowInput>();
        let outputs = new Array<WorkflowOutput>();
        let widget = new Widget(-1, '', x, y, abstractWidget.name, false, false, false, false, 'regular', 0,
            abstractWidget.id, inputs, outputs, this.workflow);
        let inputOrder = 1,
            parameterOrder = 1;
        for (let input of abstractWidget.inputs) {
            let order = input.parameter ? parameterOrder : inputOrder;
            let inputObj = new WorkflowInput(-1, '', null, input.name, input.short_name, input.description,
                input.variable, input.required, input.parameter, -1, input.parameter_type, order,
                null, null, input.options, widget);
            if (input.parameter) {
                parameters.push(inputObj);
                inputOrder++;
            } else {
                inputs.push(inputObj);
                parameterOrder++;
            }
        }
        for (let output of abstractWidget.outputs) {
            outputs.push(new WorkflowOutput('', output.name, output.short_name, output.description,
                output.variable, output.order, null, null, widget));
        }
        widget.inputs = inputs;
        widget.parameters = parameters;
        widget.outputs = outputs;

        // Sync with server
        this.clowdflowsDataService.addWidget(widget)
            .then(() => this.workflow.widgets.push(widget));
    }

    addConnection() {
        let selectedInput = this.canvasComponent.selectedInput;
        let selectedOutput = this.canvasComponent.selectedOutput;
        let conn = new Connection('', selectedOutput.widget, selectedInput.widget,
            selectedOutput.url, selectedInput.url, this.workflow);
        this.clowdflowsDataService.addConnection(conn);
        this.workflow.connections.push(conn);
        selectedInput.connection = conn;
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
                });
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}
