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
  searchTerm : string = '';

  // Pagination
	pages: number[] = [];
	n_all: number = 0;
	bounds: any = {lower: 0, upper: 0}
	n: number = 0;
	k: number = 1;

    constructor(domSanitizer: DomSanitizer,
                clowdflowsDataService: ClowdFlowsDataService,
                route: ActivatedRoute,
                router: Router,
                userService: UserService,
                loggerService: LoggerService) {
        super(domSanitizer, clowdflowsDataService, route, router, userService, loggerService);
    }

    ngOnInit(): void {
        this.getUserWorkflowsBackend()
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
                this.getUserWorkflowsBackend() 
            });
    }

	changePage(p:number) {
		if (p != this.k) {
			this.k = p;
      this.getUserWorkflowsBackend()
		}
	}
  
  getUserWorkflowsBackend() {
    this.clowdflowsDataService.getWorkflows(true, this.k, false, this.searchTerm)
        .then(response => { 
          let pag = response.pagination;
          this.n = pag.num_pages;
          this.n_all = pag.count;
          this.bounds.lower = pag.page_start;
          this.bounds.upper = pag.page_end;
          this.workflows = <Workflow[]> response.workflows; // All wf-s on the current page
          this.pages = this.range(1, pag.num_pages + 1);
        });
  }

  // Returns an array of form [a, a+1, ... b]
  range(a: number, b: number) : number[]{
    return Array.apply(null, {length: b-a}).map((v: any, i: any) => i+a);
  }

}
