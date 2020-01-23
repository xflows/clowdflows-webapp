import {Component} from '@angular/core';
import {WorkflowsComponent} from "./workflows.component";
import {Workflow} from "../../models/workflow";
import {ClowdFlowsDataService} from "../../services/clowdflows-data.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {DomSanitizer} from "@angular/platform-browser";
import {LoggerService} from "../../services/logger.service";


@Component({
    selector: 'explore-workflows',
    styles: [require('./workflows.component.css')],
    template: require('./explore-workflows.component.html')
})
export class ExploreWorkflowsComponent extends WorkflowsComponent {

    staff_picks: Workflow[] = [];

    title: string = 'Explore workflows';

    constructor(domSanitizer: DomSanitizer,
                clowdflowsDataService: ClowdFlowsDataService,
                route: ActivatedRoute,
                router: Router,
                userService: UserService,
                loggerService: LoggerService) {
        super(domSanitizer, clowdflowsDataService, route, router, userService, loggerService);
    }

    ngOnInit(): void {
        this.getWorkflowsBackend()
    }
  
  getWorkflowsBackend() {
    let user_only = false;
    let page = this.k;
    let include_preview = true;

    this.clowdflowsDataService.getWorkflows(user_only, page, include_preview, this.search_term)
        .then(data => { 
            super.updateAttributes(data);
            this.staff_picks = this.workflows.filter((workflow:Workflow) => workflow.staff_pick);
        });
  }

}
