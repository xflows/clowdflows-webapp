import {Component, Input, Output, EventEmitter} from '@angular/core';
import {Category} from "../../models/category";
import {BASE_URL} from "../../config";
import {AbstractWidget} from "../../models/abstract-widget";

@Component({
    selector: 'tree-view',
    template: require('./tree-view.component.html'),
    styles: [require('./tree-view.component.css'),],
    directives:[TreeViewComponent]
})
export class TreeViewComponent {
    @Input() categories:Category[];
    @Output() addWidgetRequest = new EventEmitter<AbstractWidget>();

    iconUrl(widget:AbstractWidget):string {
        let url = '/public/images/question-mark.png';
        if (widget.static_image && !widget.special) {
            url = `${BASE_URL}/static/${widget.cfpackage}/icons/treeview/${widget.static_image}`;
        } else if (widget.special) {  // We provide full paths for special widget icons
            url = widget.static_image;
        }
        return url;
    }

    toggleCollapsed(category:Category) {
        category.collapsed = !category.collapsed;
    }

    addWidgetToCanvas(abstractWidget:AbstractWidget) {
        this.addWidgetRequest.emit(abstractWidget);
    }
}
