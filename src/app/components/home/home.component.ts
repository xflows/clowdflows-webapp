import { Component } from '@angular/core';
import {ClowdFlowsDataService} from "../../services/clowdflows-data.service";
import {ActivatedRoute, Router} from "@angular/router";
import {LoggerService} from "../../services/logger.service";

@Component({
    selector: 'home',
    template: require('./home.component.html')
})
export class HomeComponent {

    constructor(private clowdflowsDataService:ClowdFlowsDataService,
                private router:Router,
                private loggerService:LoggerService) {
    }

    runTutorial() {
        let workflowData:any = {
            name: 'Tutorial workflow',
            is_public: false,
            description: '',
            widget: null,
            template_parent: null
        };
        this.clowdflowsDataService
            .createWorkflow(workflowData)
            .then((data:any) => {
				if (data) {
                	let error = this.loggerService.reportMessage(data);
                	if (!error) {
                    	this.router.navigate(['/tutorial', data.id]);
                	}
				}
				else {
					this.router.navigate(['/explore-workflows']);
				}
            });
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
				if (data) {
                	let error = this.loggerService.reportMessage(data);
                	if (!error) {
                    	this.router.navigate(['/editor', data.id]);
                	}
				}
				else {
					this.router.navigate(['/explore-workflows']);	
				}
            });
    }
}
