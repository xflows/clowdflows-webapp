import {Component, Output, OnInit, EventEmitter, Input} from '@angular/core';
import {ClowdFlowsDataService} from '../../../services/clowdflows-data.service';
import {Category} from "../../../models/category";
import {AbstractWidget} from "../../../models/abstract-widget";
import {LoggerService} from "../../../services/logger.service";
import {Widget} from "../../../models/widget";
import {specialWidgetNames, specialCategoryName} from "../../../services/special-widgets";

@Component({
    selector: 'widget-tree',
    template: require('./widget-tree.component.html'),
    styles: [require('./widget-tree.component.css'),]
})
export class WidgetTreeComponent implements OnInit {

    @Input() widgetTree:Category[];
    filterString:string = '';
    showImportWebserviceDialog = false;
    @Output() addWidgetRequest = new EventEmitter<AbstractWidget>();

    constructor(private clowdflowsDataService:ClowdFlowsDataService,
                private loggerService:LoggerService) {
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

    openImportWebserviceDialog() {
        this.showImportWebserviceDialog = true;
    }

    closeImportWebserviceDialog() {
        this.showImportWebserviceDialog = false;
    }

    updateRecommendation(recommendWidget:Widget) {
        if (this.widgetTree == null) {
            return;
        }
        this.resetRecommendations();

        if (recommendWidget == null) {
            return;
        }
        for (let category of this.widgetTree) {
            WidgetTreeComponent.markRecommendation(category, recommendWidget);
        }
    }

    resetRecommendations() {
        this.filterTree();  // Filter to the current filterString
        for (let category of this.widgetTree) { // No recommendations in the tree
            WidgetTreeComponent.markRecommendation(category, null);
        }
    }

    static markRecommendation(category:Category, recommendWidget:Widget) {
        let hide = true;
        for (let widget of category.widgets) {
            if (recommendWidget == null) {
                widget.recommended_input = false;
                widget.recommended_output = false;
                continue;
            }

            for (let widget_name of recommendWidget.recommended_inputs) {
                if (widget.name == widget_name) {
                    hide = false;
                    widget.hidden = false;
                    widget.recommended_input = true;
                } else {
                    widget.recommended_input = false;
                }
            }

            for (let widget_name of recommendWidget.recommended_outputs) {
                if (widget.name == widget_name) {
                    hide = false;
                    widget.hidden = false;
                    widget.recommended_output = true;
                } else {
                    widget.recommended_output = false;
                }
            }
        }

        for (let childCategory of category.children) {
            let childrenHide = WidgetTreeComponent.markRecommendation(childCategory, recommendWidget);

            // If any of the children match, show the parent as well
            if (!childrenHide) {
                hide = false;
            }
        }

        if (!hide) {
            category.hidden = hide;
            category.collapsed = hide;
        }

        return hide;
    }

    getWidgetLibrary() {
        this.clowdflowsDataService.getWidgetLibrary()
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
            library[library.length - 1].order + 1,
            [],
            specialWidgets
        );
        subprocessCategory.collapsed = false;
        library.push(subprocessCategory);
        return library;
    }

    importWebservice(wsdl:string) {
        this.closeImportWebserviceDialog();
        this.clowdflowsDataService.importWebservice(wsdl)
            .then((data) => {
                let error = this.loggerService.reportMessage(data);
                if (!error) {
                    // Reload library
                    this.getWidgetLibrary();
                    this.loggerService.success(`Successfully imported webservice from: ${wsdl}`);
                }
            });
    }

    ngOnInit() {
        this.getWidgetLibrary();
    }
}
