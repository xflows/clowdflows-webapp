import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ToolbarComponent} from "./toolbar.component";
import {WidgetTreeComponent} from "./widget-tree.component";
import {WidgetCanvasComponent} from "./widget-canvas.component";
import {LoggingComponent} from "./logging.component";
import {AbstractWidget} from "../../models/abstract-widget";
import {ClowdFlowsDataService} from "../../services/clowdflows-data.service";
import {Workflow} from "../../models/workflow";

@Component({
    selector: 'editor',
    templateUrl: 'app/components/editor/editor.component.html',
    directives: [ToolbarComponent, WidgetTreeComponent, WidgetCanvasComponent, LoggingComponent]
})
export class EditorComponent implements OnInit, OnDestroy {
    workflow:any = {};
    sub:any;

    constructor(private clowdflowsDataService:ClowdFlowsDataService,
                private route:ActivatedRoute) {
    }

    addWidgetToCanvas(abstractWidget:AbstractWidget) {
        // TODO: construct actual Widget from AbstractWidget here and call data service to save.
        console.log(abstractWidget.name);
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
