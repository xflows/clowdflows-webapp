import {Component, Output, OnInit, EventEmitter} from '@angular/core';
import {ClowdFlowsDataService} from '../../services/clowdflows-data.service';
import {Category} from "../../models/category";
import {TreeViewComponent} from "./tree-view.component";
import {AbstractWidget} from "../../models/abstract-widget";

@Component({
    selector: 'widget-tree',
    templateUrl: 'app/components/editor/widget-tree.component.html',
    styleUrls: ['app/components/editor/widget-tree.component.css'],
    directives: [TreeViewComponent]
})
export class WidgetTreeComponent implements OnInit {

    widgetTree:Category[];
    filterString:string;
    @Output() addWidgetRequest = new EventEmitter<AbstractWidget>();

    constructor(private clowdflowsService:ClowdFlowsDataService) { }

    ngOnInit() {
        this.getWidgetLibrary();
    }

    getWidgetLibrary() {
        this.clowdflowsService.getWidgetLibrary()
            .then(data => {
                let library = this.parseWidgetLibrary(data)
                this.widgetTree = library
            });
    }

    private parseWidgetLibrary(data):Category[] {
        let widgetTree:Category[] = [];
        for (let cat of <Category[]> data) {
            widgetTree.push(new Category(cat.name, cat.user, cat.order, cat.children, cat.widgets));
        }
        return widgetTree;
    }

    filterTree() {
        function applyFilter(category:Category, filterString:string) {
            let hide = true;
            let filterRegEx = new RegExp(filterString, 'i');
            if (category.name.match(filterRegEx)) {
                hide = false;
            }
            for (let widget of category.widgets) {
                if (widget.name.match(filterRegEx)) {
                    hide = false;
                    widget.hidden = false;
                } else {
                    widget.hidden = true;
                }
            }

            for (let childCategory of category.children) {
                let childrenHide = applyFilter(childCategory, filterString);

                // If any of the children match, show the parent as well
                if (!childrenHide) {
                    hide = false;
                }
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
            for (let widget of category.widgets) {
                widget.hidden = false;
            }
        }

        for (let category of this.widgetTree) {
            collapse(category);
        }
    }

    addWidgetToCanvas(abstractWidget:AbstractWidget) {
        this.addWidgetRequest.emit(abstractWidget);
    }
}
