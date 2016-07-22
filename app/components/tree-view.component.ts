import {Component, Input, Output, EventEmitter} from '@angular/core';
import {Category} from "../models/category";
import {BASE_URL} from "../config";
import {AbstractWidget} from "../models/abstract-widget";

@Component({
    selector: 'tree-view',
    templateUrl: 'app/components/tree-view.component.html',
    styleUrls: ['app/components/tree-view.component.css'],
    directives:[TreeViewComponent]
})
export class TreeViewComponent {
    @Input() categories:Category[];
    @Output() addWidgetRequest = new EventEmitter<AbstractWidget>();

    iconUrl(widget:AbstractWidget):string {
        let url = '/app/images/question-mark.png';
        if (widget.static_image) {
            url = `${BASE_URL}/static/${widget.cfpackage}/icons/treeview/${widget.static_image}`;
        }
        return url;
    }

    toggleCollapsed(category) {
        category.collapsed = !category.collapsed;
    }

    addWidgetToCanvas(abstractWidget:AbstractWidget) {
        this.addWidgetRequest.emit(abstractWidget);
    }
}
