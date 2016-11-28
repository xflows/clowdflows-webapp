import { Component } from '@angular/core';
import {WorkflowsComponent} from "./workflows.component";
import {DomSanitizer} from "@angular/platform-browser";
import {ClowdFlowsDataService} from "../../services/clowdflows-data.service";
import {ActivatedRoute, Router, Params} from "@angular/router";
import {UserService} from "../../services/user.service";
import {Workflow} from "../../models/workflow";

@Component({
    selector: 'workflows',
    styles: [require('./workflows.component.css')],
    template: require('./workflow-detail.component.html')
})
export class WorkflowDetailComponent extends WorkflowsComponent {

    workflow:Workflow = null;
    sub:any;

    constructor(domSanitizer:DomSanitizer,
                clowdflowsDataService:ClowdFlowsDataService,
                route:ActivatedRoute,
                router:Router,
                userService:UserService) {
        super(domSanitizer, clowdflowsDataService, route, router, userService);
    }

    ngOnInit():void {
        this.sub = this.route.params.subscribe((params:Params) => {

            // Fetch the current workflow
            let id = +params['id'];
            this.clowdflowsDataService.getWorkflow(id)
                .then(workflow => {
                    this.workflow = workflow;
                    console.log(workflow);
                });
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}