import { Component } from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {ClowdFlowsDataService} from "../../services/clowdflows-data.service";
import {ActivatedRoute, Router, Params} from "@angular/router";
import {UserService} from "../../services/user.service";

@Component({
    selector: 'export-workflow',
    styles: [],
    template: require('./export-workflow.component.html')
})
export class ExportWorkflowComponent {

    workflowJson:string = '';
    sub:any;

    constructor(private domSanitizer:DomSanitizer,
                private clowdflowsDataService:ClowdFlowsDataService,
                private route:ActivatedRoute,
                private router:Router,
                private userService:UserService) {
    }

    ngOnInit():void {
        this.sub = this.route.params.subscribe((params:Params) => {

            // Fetch the current workflow
            let id = +params['id'];
            this.clowdflowsDataService.exportWorkflow(id)
                .then((data:any) => {
                    this.workflowJson = JSON.stringify(data.workflow_json, null, 2);
                });
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}