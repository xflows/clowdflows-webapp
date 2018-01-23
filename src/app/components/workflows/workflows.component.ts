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
    staff_picks:Workflow[] = [];
    title:string = 'Explore workflows';
    base_url:string;

    constructor(public domSanitizer:DomSanitizer,
                public clowdflowsDataService:ClowdFlowsDataService,
                public route:ActivatedRoute,
                public router:Router,
                public userService:UserService,
                private loggerService:LoggerService) {
        this.base_url = BASE_URL;
    }

    ngOnInit():void {
        let includePreview = true;
        this.clowdflowsDataService.getPublicWorkflows(includePreview)
            .then(workflows => {
                this.workflows = workflows;
                this.staff_picks = workflows.filter((workflow:Workflow) => workflow.staff_pick);
            });
    }

    getTrustedHTML(html:string) {
        return this.domSanitizer.bypassSecurityTrustHtml(html);
    }

    ngOnDestroy():void {
        this.workflows = [];
        this.staff_picks = [];
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
}
