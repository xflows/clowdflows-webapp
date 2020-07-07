import { Component } from '@angular/core';
import {WorkflowsComponent} from "./workflows.component";
import {DomSanitizer} from "@angular/platform-browser";
import {ClowdFlowsDataService} from "../../services/clowdflows-data.service";
import {ActivatedRoute, Router, Params} from "@angular/router";
import {UserService} from "../../services/user.service";
import {Workflow} from "../../models/workflow";
import {LoggerService} from "../../services/logger.service";

@Component({
    selector: 'workflows',
    styles: [require('./workflows.component.css')],
    template: require('./workflow-detail.component.html')
})
export class WorkflowDetailComponent extends WorkflowsComponent {

    workflow:Workflow = null;
    loaded:boolean = false;
    sub:any;

    constructor(domSanitizer:DomSanitizer,
                clowdflowsDataService:ClowdFlowsDataService,
                route:ActivatedRoute,
                router:Router,
                userService:UserService,
                loggerService:LoggerService) {
        super(domSanitizer, clowdflowsDataService, route, router, userService, loggerService);
    }

    ngOnInit():void {
        this.sub = this.route.params.subscribe((params:Params) => {

            // Fetch the current workflow
            let id = +params['id'];
            let includePreview = true;
            this.clowdflowsDataService.getWorkflow(id, includePreview)
                .then(workflow => {
                    this.workflow = workflow;
                    this.loaded = true;
                });
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}
