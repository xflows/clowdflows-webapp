import {Component, Output, OnInit, EventEmitter} from '@angular/core';
import {ClowdFlowsDataService} from '../../../services/clowdflows-data.service';
import {Category} from "../../../models/category";
import {TreeViewComponent} from "./tree-view.component";
import {AbstractWidget} from "../../../models/abstract-widget";
import {specialCategoryName, specialWidgetNames} from '../../../services/special-widgets';

@Component({
    selector: 'widget-tree',
    template: require('./widget-tree.component.html'),
    styles: [require('./widget-tree.component.css'),],
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
                let library = this.parseWidgetLibrary(data);
                library = this.addSpecialWidgets(library);
                this.widgetTree = library
            });
    }

    private parseWidgetLibrary(data:Category[]):Category[] {
        let widgetTree:Category[] = [];
        for (let cat of <Category[]> data) {
            widgetTree.push(new Category(cat.name, cat.user, cat.order, cat.children, cat.widgets));
        }
        return widgetTree;
    }

    private addSpecialWidgets(library:Category[]):Category[] {
        let specialWidgets:AbstractWidget[] = [];
        specialWidgets.push(<AbstractWidget> {
            name: specialWidgetNames.subprocessWidget,
            static_image: "/public/images/gears.png",
            special: true,
            hidden: false
        });
        specialWidgets.push(<AbstractWidget> {
            name: specialWidgetNames.inputWidget,
            static_image: "/public/images/forward-arrow.png",
            special: true,
            hidden: false
        });
        specialWidgets.push(<AbstractWidget> {
            name: specialWidgetNames.outputWidget,
            static_image: "/public/images/forward-arrow.png",
            special: true,
            hidden: false
        });
        specialWidgets.push(<AbstractWidget> {
            name: specialWidgetNames.forLoopWidgets,
            static_image: "/public/images/loop.png",
            special: true,
            hidden: false
        });
        specialWidgets.push(<AbstractWidget> {
            name: specialWidgetNames.xValidationWidgets,
            static_image: "/public/images/loop.png",
            special: true,
            hidden: false
        });
        let subprocessCategory = new Category(
            specialCategoryName,
            null,
            library[library.length-1].order + 1,
            [],
            specialWidgets
        );
        subprocessCategory.collapsed = false;
        library.push(subprocessCategory);
        return library;
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
