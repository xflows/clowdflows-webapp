import {Component, OnInit} from '@angular/core';
import {ClowdFlowsService} from './clowdflows.service';
import {Category} from "./models/category";
import {TreeViewComponent} from "./tree-view.component";

@Component({
    selector: 'widget-tree',
    templateUrl: 'app/widget-tree.component.html',
    styleUrls: ['app/widget-tree.component.css'],
    directives: [TreeViewComponent]
})
export class WidgetTreeComponent implements OnInit {

    widgetTree:Category[];

    constructor(private clowdflowsService:ClowdFlowsService) {
    }

    ngOnInit() {
        this.getWidgetLibrary();
    }

    getWidgetLibrary() {
        this.clowdflowsService.getWidgetLibrary().then(library => this.widgetTree = library);
    }
}
