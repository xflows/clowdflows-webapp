import { Component } from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {ClowdFlowsDataService} from "../../services/clowdflows-data.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {LoggerService} from "../../services/logger.service";
import {LoadingService} from "../../services/loading.service";

@Component({
    selector: 'import-workflow',
    styles: [],
    template: require('./import-workflow.component.html')
})
export class ImportWorkflowComponent {

    workflowData:string = null;
    errorMsg:string = '';

    constructor(private domSanitizer:DomSanitizer,
                private clowdflowsDataService:ClowdFlowsDataService,
                private loggerService:LoggerService,
                private route:ActivatedRoute,
                private router:Router,
                private userService:UserService,
                private loadingService:LoadingService) {
    }

    importWorkflow() {
        this.errorMsg = '';
        this.loadingService.isLoading = true;
        this.clowdflowsDataService
            .importWorkflow(this.workflowData)
            .then((data:any) => {
                this.loadingService.isLoading = false;
                let error = this.loggerService.reportMessage(data);
                if (!error) {
                    console.log(data);
                    this.router.navigate(['/workflow/', data.new_workflow_id]);
                } else if ('message' in data) {
                    this.errorMsg = data.message;
                } else {
                    this.errorMsg = 'Problem importing workflow';
                }
            });
    }
}