import {Component, OnInit} from '@angular/core';
import {ClowdFlowsService} from '../services/clowdflows.service';
import {Category} from "../models/category";
import {TreeViewComponent} from "./tree-view.component";

@Component({
    selector: 'widget-tree',
    templateUrl: 'app/components/widget-tree.component.html',
    styleUrls: ['app/components/widget-tree.component.css'],
    directives: [TreeViewComponent]
})
export class WidgetTreeComponent implements OnInit {

    widgetTree:Category[];
    filterString:string;

    constructor(private clowdflowsService:ClowdFlowsService) {
    }

    ngOnInit() {
        this.getWidgetLibrary();
    }

    getWidgetLibrary() {
        this.clowdflowsService.getWidgetLibrary().then(library => this.widgetTree = library);
    }

    filterTree() {
        function applyFilter(category:Category, filterString:string) {
            let hide = true;

            if (category.name.indexOf(filterString) != -1) {
                hide = false;
            }
            for (let widget of category.widgets) {
                if (widget.name.indexOf(filterString) != -1) {
                    hide = false;
                    widget.hidden = false;
                } else {
                    widget.hidden = true;
                }
            }

            for (let childCategory of category.children) {
                hide = applyFilter(childCategory, filterString);
            }
            category.hidden = hide;
            category.collapsed = hide;

            return hide;
        }

        if (this.filterString.trim() == "") {
            this.collapseAll();
        } else {
            for (let category of this.widgetTree) {
                applyFilter(category, this.filterString);
            }
        }
    }

    collapseAll() {
        function collapse(category:Category) {
            category.collapsed = true;
            category.hidden = false;
            for (let childCategory of category.children) {
                collapse(childCategory);
            }
        }

        for (let category of this.widgetTree) {
            collapse(category);
        }
    }
}
