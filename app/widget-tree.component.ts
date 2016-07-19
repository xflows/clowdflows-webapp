import { Component, OnInit } from '@angular/core';
import { ClowdFlowsService } from './clowdflows.service';

@Component({
    selector: 'widget-tree',
    templateUrl: 'app/widget-tree.component.html',
    styleUrls: ['app/widget-tree.component.css'],
    directives: []
})
export class WidgetTreeComponent implements OnInit {

    widgetTree = null;

    constructor(
        private clowdflowsService: ClowdFlowsService
    ) {}

    ngOnInit() {
        this.getWidgetLibrary();
    }

    getWidgetLibrary() {
        this.clowdflowsService.getWidgetLibrary().then(library => this.widgetTree = library)
    }
}
