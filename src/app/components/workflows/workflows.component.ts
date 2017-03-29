import {Component, OnInit, OnDestroy} from '@angular/core';
import {Workflow} from "../../models/workflow";
import {ClowdFlowsDataService} from "../../services/clowdflows-data.service";
import {ActivatedRoute, Router} from "@angular/router";
import {BASE_URL} from "../../config";
import {UserService} from "../../services/user.service";
import {DomSanitizer} from "@angular/platform-browser";


@Component({
    selector: 'workflows',
    styles: [require('./workflows.component.css')],
    template: require('./explore-workflows.component.html')
})
export class WorkflowsComponent implements OnInit, OnDestroy {
    workflows:Workflow[] = [];
    title:string = 'Explore workflows';
    base_url:string;

    constructor(public domSanitizer:DomSanitizer,
                public clowdflowsDataService:ClowdFlowsDataService,
                public route:ActivatedRoute,
                public router:Router,
                public userService:UserService) {
        this.base_url = BASE_URL;
    }

    ngOnInit():void {
        let includePreview = true;
        this.clowdflowsDataService.getPublicWorkflows(includePreview)
            .then(workflows => {
                this.workflows = workflows;
            });
    }

    getTrustedHTML(html:string) {
        return this.domSanitizer.bypassSecurityTrustHtml(html);
    }

    ngOnDestroy():void {
        this.workflows = [];
    }
}
