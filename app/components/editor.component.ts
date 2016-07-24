import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ToolbarComponent} from "./toolbar.component";
import {WidgetTreeComponent} from "./widget-tree.component";
import {WidgetCanvasComponent} from "./widget-canvas.component";
import {LoggingComponent} from "./logging.component";
import {AbstractWidget} from "../models/abstract-widget";
import {ClowdFlowsDataService} from "../services/clowdflows-data.service";

@Component({
    selector: 'editor',
    templateUrl: 'app/components/editor.component.html',
    directives: [ToolbarComponent, WidgetTreeComponent, WidgetCanvasComponent, LoggingComponent]
})
export class EditorComponent implements OnInit, OnDestroy {
    workflow = {};
    sub: any;

    constructor(private clowdflowsDataService:ClowdFlowsDataService,
                private route: ActivatedRoute) {
    }

    addWidgetToCanvas(abstractWidget:AbstractWidget) {
        // TODO: construct actual Widget from AbstractWidget here and call data service to save.
        console.log(abstractWidget.name);
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            let id = +params['id'];
            this.clowdflowsDataService.getWorkflow(id)
                .then(workflow => this.workflow = workflow);
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}
