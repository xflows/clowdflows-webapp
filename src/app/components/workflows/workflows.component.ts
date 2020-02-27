import {Component, OnInit, OnDestroy} from '@angular/core';
import {Workflow} from "../../models/workflow";
import {ClowdFlowsDataService} from "../../services/clowdflows-data.service";
import {ActivatedRoute, Router} from "@angular/router";
import {BASE_URL} from "../../config";
import {UserService} from "../../services/user.service";
import {DomSanitizer} from "@angular/platform-browser";
import {LoggerService} from "../../services/logger.service";


@Component({
    selector: 'workflows',
    styles: [require('./workflows.component.css')],
    template: require('./explore-workflows.component.html')
})
export class WorkflowsComponent implements OnInit, OnDestroy {

    workflows:Workflow[] = [];
    title:string = 'Workflows';
    base_url:string;
    search_term : string = '';

    // Pagination
  	pages: number[] = [];
  	n_all: number = 0;
  	bounds: any = {lower: 0, upper: 0}
  	n: number = 0;
  	k: number = 1;

    constructor(public domSanitizer:DomSanitizer,
                public clowdflowsDataService:ClowdFlowsDataService,
                public route:ActivatedRoute,
                public router:Router,
                public userService:UserService,
                private loggerService:LoggerService) {
        this.base_url = BASE_URL;
    }

    ngOnInit():void {
              this.getWorkflowsBackend()
    }

    getTrustedHTML(html:string) {
        return this.domSanitizer.bypassSecurityTrustHtml(html);
    }

    ngOnDestroy():void {
        this.workflows = [];
    }

    newWorkflow() {
        let workflowData:any = {
            name: 'Untitled workflow',
            is_public: false,
            description: '',
            widget: null,
            template_parent: null
        };
        this.clowdflowsDataService
            .createWorkflow(workflowData)
            .then((data:any) => {
                let error = this.loggerService.reportMessage(data);
                if (!error) {
                    this.router.navigate(['/editor', data.id]);
                }
            });
    }

    copyWorkflow(workflow: Workflow) {
        this.clowdflowsDataService
            .copyWorkflow(workflow)
            .then((data:any) => {
                let error = this.loggerService.reportMessage(data);
                if (!error) {
                    this.router.navigate(['/editor', data.id]);
                }
            });
    }

    getWorkflowsBackend(){
        // To be overriden by extending components
    }

    changePage(p:number) {
		if (p != this.k) {
			this.k = p;
      this.getWorkflowsBackend()
		}
	}

    // Assigns response data to attributes to be read by the template
    updateAttributes(data: any){
        let pag = data.pagination;
          this.n = pag.num_pages;
          this.n_all = pag.count;
          this.bounds.lower = pag.page_start;
          this.bounds.upper = pag.page_end;
          this.workflows = <Workflow[]> data.workflows; // All wf-s on the current page
          this.pages = this.range(1, pag.num_pages + 1);
    }

    // Returns an array of form [a, a+1, ... b]
    range(a: number, b: number) : number[]{
        return Array.apply(null, {length: b-a}).map((v: any, i: any) => i+a);
    }
}
