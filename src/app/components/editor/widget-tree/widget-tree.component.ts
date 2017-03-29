import {Component, Output, OnInit, EventEmitter, Input} from '@angular/core';
import {ClowdFlowsDataService} from '../../../services/clowdflows-data.service';
import {Category} from "../../../models/category";
import {AbstractWidget} from "../../../models/abstract-widget";
import {LoggerService} from "../../../services/logger.service";
import {WidgetRecommendation} from "../../../services/recommender.service";
import {WidgetLibraryService} from "../../../services/widget-library.service";

@Component({
    selector: 'widget-tree',
    template: require('./widget-tree.component.html'),
    styles: [require('./widget-tree.component.css'),]
})
export class WidgetTreeComponent {

    widgetTree:Category[];
    filterString:string = '';
    showImportWebserviceDialog = false;
    @Output() addWidgetRequest = new EventEmitter<AbstractWidget>();
    @Output() importWebServiceRequest = new EventEmitter<string>();

    constructor(private clowdflowsDataService:ClowdFlowsDataService,
                private widgetLibraryService:WidgetLibraryService,
                private loggerService:LoggerService) {
        this.widgetTree = widgetLibraryService.widgetTree;
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

    updateRecommendation(widgetRecommendation:WidgetRecommendation) {
        if (this.widgetTree == null) {
            return;
        }
        this.resetRecommendations();

        if (widgetRecommendation == null) {
            return;
        }
        for (let category of this.widgetTree) {
            WidgetTreeComponent.markRecommendation(category, widgetRecommendation);
        }
    }

    resetRecommendations() {
        this.filterTree();  // Filter to the current filterString
        for (let category of this.widgetTree) { // No recommendations in the tree
            WidgetTreeComponent.markRecommendation(category, null);
        }
    }

    static markRecommendation(category:Category, widgetRecommendation:WidgetRecommendation) {
        let hide = true;
        for (let abstractWidget of category.widgets) {
            if (widgetRecommendation == null || widgetRecommendation.empty()) {
                abstractWidget.recommended_input = false;
                abstractWidget.recommended_output = false;
                continue;
            }

            if (widgetRecommendation.isRecommendedInputWidget(abstractWidget)) {
                hide = false;
                abstractWidget.hidden = false;
                abstractWidget.recommended_input = true;
            } else {
                abstractWidget.recommended_input = false;
            }

            if (widgetRecommendation.isRecommendedOutputWidget(abstractWidget)) {
                hide = false;
                abstractWidget.hidden = false;
                abstractWidget.recommended_output = true;
            } else {
                abstractWidget.recommended_output = false;
            }
        }

        for (let childCategory of category.children) {
            let childrenHide = WidgetTreeComponent.markRecommendation(childCategory, widgetRecommendation);

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

    importWebservice(wsdl:string) {
        this.closeImportWebserviceDialog();
        this.clowdflowsDataService.importWebservice(wsdl)
            .then((data) => {
                let error = this.loggerService.reportMessage(data);
                if (!error) {
                    // Reload library
                    this.widgetLibraryService.reload();
                    this.loggerService.success(`Successfully imported webservice from: ${wsdl}`);
                }
            });
    }
}
