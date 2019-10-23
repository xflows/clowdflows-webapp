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
	pages: number[] = []; // to mora pridt iz baze
	n_all: number = 0; //no of all entries, more pridt iz baze
	rpp: number = 2 //rows per page
	n: number = 0;
	k: number = 1;
  bounds: any = {};

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
                //let index = this.workflows.findIndex(w => w.id === workflow.id);
                //this.workflows.splice(index, 1);//remove element from array
                this.getUserWorkflowsBackend() // tole bi blo bl prov!
            });
    }

	changePage(p:number) {
		if (p != this.k) {
			this.k = p;
      this.getUserWorkflowsBackend()
		}
	}

  getUserWorkflowsBackend() {
    //this.clowdflowsDataService.getUserWorkflows(false,{page: this.k, length: this.rpp, include_subprocesses: 0})
    this.clowdflowsDataService.getUserWorkflows(false)
        .then(results => { // TOLE MORE VRNIT SAMO WORKFLOWE, KI JIH POKAŽEMO V TABELI!
          //this.n_all = results.n_all; // vsi rezultati
          //this.bounds = {"lower": (this.k-1)*this.rpp+1, "upper": Math.min(this.n_all,this.k*this.rpp)}
          //this.pages = Array.apply(null, {length: Math.ceil(results.n_all/this.rpp)}).map(Number.call, Number).map((x:any) => {return x+1})
          this.workflows = <Workflow[]> results
        });
  }

}
