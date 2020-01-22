import {Component} from '@angular/core';
import {WorkflowsComponent} from "./workflows.component";
import {Workflow} from "../../models/workflow";
import {ClowdFlowsDataService} from "../../services/clowdflows-data.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {DomSanitizer} from "@angular/platform-browser";
import {LoggerService} from "../../services/logger.service";


@Component({
    selector: 'user-workflows',
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
        this.getWorkflowsBackend()
    }

    startStreaming(workflowId: number) {
        this.clowdflowsDataService.startStreaming(workflowId)
            .then(data => {
              if (data) {
                this.router.navigate(['streams', data.stream_id]);
              }
            });
    }

    toggleWorkflowVisibility(workflow: Workflow) {
        workflow.is_public = !workflow.is_public
        this.clowdflowsDataService.saveWorkflowInfo(workflow);
    }

    deleteWorkflow(workflow: Workflow) {
        this.clowdflowsDataService
            .deleteWorkflow(workflow)
            .then( ()=> {
                this.getWorkflowsBackend() 
            });
    }
  
  getWorkflowsBackend() {
    let user_only = true;
    let current_page = this.k;
    let no_preview = false;

    this.clowdflowsDataService.getWorkflows(user_only, current_page, no_preview, this.search_term)
        .then(data => { 
          super.updateAttributes(data);
        });
  }

}
