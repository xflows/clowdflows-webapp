import {Component, OnDestroy, OnInit} from '@angular/core';
import {ClowdFlowsDataService} from "../../services/clowdflows-data.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {LoggerService} from "../../services/logger.service";
import {LoadingService} from "../../services/loading.service";
import {Stream} from "../../models/stream";

@Component({
    selector: 'stream',
    styles: [],
    template: require('./stream.component.html')
})
export class StreamComponent implements OnInit, OnDestroy {

    stream:any = {};
    workflow:any = {};
    sub:any;

    constructor(private clowdflowsDataService:ClowdFlowsDataService,
                private loggerService:LoggerService,
                private route:ActivatedRoute,
                private router:Router,
                private userService:UserService,
                private loadingService:LoadingService) {
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe((params:Params) => {
            // Fetch the current stream
            let id = +params['id'];
            this.clowdflowsDataService.getStream(id)
                .then(data => {
                    this.stream = data;
                    this.workflow = data.workflow;
                });
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    activate() {
        this.clowdflowsDataService.activateStream(this.stream.id)
            .then(data => {
                let error = this.loggerService.reportMessage(data);
                if (!error) {
                    this.stream.active = true;
                }
            });
    }

    deactivate() {
        this.clowdflowsDataService.deactivateStream(this.stream.id)
            .then(data => {
                let error = this.loggerService.reportMessage(data);
                if (!error) {
                    this.stream.active = false;
                }
            });
    }

    reset() {
        this.clowdflowsDataService.resetStream(this.stream.id)
            .then(data => {
                let error = this.loggerService.reportMessage(data);
                if (!error) {
                    this.loggerService.info('Successfully reset the stream.')
                }
            });
    }
}
