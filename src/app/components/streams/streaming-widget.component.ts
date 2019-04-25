import {Component, OnDestroy, OnInit} from '@angular/core';
import {ClowdFlowsDataService} from "../../services/clowdflows-data.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {LoggerService} from "../../services/logger.service";
import {LoadingService} from "../../services/loading.service";

@Component({
    selector: 'streaming-widget',
    styles: [require('./streaming-widget.component.css')],
    template: require('./streaming-widget.component.html')
})
export class StreamingWidgetComponent implements OnInit, OnDestroy {

    widget_id:number;
    widget_visualization_html:string = '';
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
            let stream_id = +params['stream_id'];
            this.widget_id = +params['id'];
            this.clowdflowsDataService.getStream(stream_id)
                .then(data => {
                    this.stream = data;
                    this.workflow = data.workflow;
                });
            this.clowdflowsDataService.getWidgetStreamVisualization(this.widget_id)
                .then((response) => {
                  if (response) {
                    this.widget_visualization_html = response.text();
                  }
                });
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}
