import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ToolbarComponent} from "./toolbar.component";
import {WidgetTreeComponent} from "./widget-tree.component";
import {WidgetCanvasComponent} from "./widget-canvas.component";
import {LoggingComponent} from "./logging.component";
import {AbstractWidget} from "../../models/abstract-widget";
import {ClowdFlowsDataService} from "../../services/clowdflows-data.service";
import {Workflow} from "../../models/workflow";
import {Connection} from "../../models/connection";

@Component({
    selector: 'editor',
    templateUrl: 'app/components/editor/editor.component.html',
    directives: [ToolbarComponent, WidgetTreeComponent, WidgetCanvasComponent, LoggingComponent]
})
export class EditorComponent implements OnInit, OnDestroy {
    @ViewChild(WidgetCanvasComponent) canvasComponent: WidgetCanvasComponent
    workflow:any = {};
    sub:any;

    constructor(private clowdflowsDataService:ClowdFlowsDataService,
                private route:ActivatedRoute) {
    }

    addWidget(abstractWidget:AbstractWidget) {
        // TODO: construct actual Widget from AbstractWidget here and call data service to save.
        console.log(abstractWidget.name);
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
        widget.finished = data.status.finished;
        widget.error = data.status.error;
        widget.running = data.status.running;
        widget.interaction_waiting = data.status.interaction_waiting;
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
