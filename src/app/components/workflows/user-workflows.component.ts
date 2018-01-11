import {Component} from '@angular/core';
import {WorkflowsComponent} from "./workflows.component";
import {Workflow} from "../../models/workflow";
import {ClowdFlowsDataService} from "../../services/clowdflows-data.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {DomSanitizer} from "@angular/platform-browser";
import {LoggerService} from "../../services/logger.service";


@Component({
    selector: 'workflows',
    styles: [require('./workflows.component.css')],
    template: require('./user-workflows.component.html')
})
export class UserWorkflowsComponent extends WorkflowsComponent {

    title: string = 'Your workflows';

    constructor(domSanitizer: DomSanitizer,
                clowdflowsDataService: ClowdFlowsDataService,
                route: ActivatedRoute,
                router: Router,
                userService: UserService,
                loggerService: LoggerService) {
        super(domSanitizer, clowdflowsDataService, route, router, userService, loggerService);
    }

    ngOnInit(): void {
        this.clowdflowsDataService.getUserWorkflows()
            .then(workflows => {
                this.workflows = <Workflow[]> workflows;
            });
    }

    startStreaming(workflowId: number) {
        this.clowdflowsDataService.startStreaming(workflowId)
            .then(data => {
                this.router.navigate(['streams', data.stream_id]);
            });
    }

    toggleWorkflowVisibility(workflow: Workflow) {
        workflow.is_public = !workflow.is_public
        this.clowdflowsDataService.saveWorkflowInfo(workflow);
    }

}