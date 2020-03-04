import {Component, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import {Category} from "../../../models/category";
import {BASE_URL} from "../../../config";
import {AbstractWidget} from "../../../models/abstract-widget";

@Component({
    selector: 'tree-view',
    template: require('./tree-view.component.html'),
    styles: [require('./tree-view.component.css'),]
})
export class TreeViewComponent {
    @Input() categories:Category[];
    @Output() addWidgetRequest = new EventEmitter<AbstractWidget>();

    constructor(private el: ElementRef) { }

    dragStatus:string = "none"
    clonedEl:any;
    widgetToAdd:AbstractWidget

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

    startDrag($event:any, abstractWidget:AbstractWidget) {
      this.dragStatus = "mousedown"
      this.widgetToAdd = abstractWidget
    }

    detectDrag($event:any,imgUrl:any) {
      console.log(imgUrl)
      if (this.dragStatus == "mousedown") {
        this.dragStatus = "dragged"
        $event.source.element.nativeElement.setAttribute("style","cursor: url('"+imgUrl+"'), default !important; display: none;")
        this.el.nativeElement.closest('body').setAttribute("style","cursor: url('"+imgUrl+"'), default !important;")

        this.clonedEl = $event.source.element.nativeElement.cloneNode(true);
        this.clonedEl.setAttribute("id","cloned-element")
        this.clonedEl.setAttribute("style","display: auto;")
        $event.source.element.nativeElement.parentNode.insertBefore(this.clonedEl, $event.source.element.nativeElement.nextSibling);
      }
    }

    endDrag($event:any,abstractWidget:AbstractWidget) {
      this.el.nativeElement.closest('body').setAttribute("style","cursor: default !important;")
      $event.source.element.nativeElement.setAttribute("style","cursor: pointer;")
      $event.source.reset();
      this.clonedEl.remove()
    }

    detectMouseUp($event:any) {
      if (this.dragStatus == "dragged") {
        this.widgetToAdd.globalPosition = {x: $event.x, y: $event.y}
        this.addWidgetRequest.emit(this.widgetToAdd);
        this.dragStatus = "none";
        this.widgetToAdd = undefined;
      }
      else if (this.dragStatus == "mousedown") {
        this.addWidgetRequest.emit(this.widgetToAdd)
        this.dragStatus = "none";
        this.widgetToAdd = undefined;
      }
    }
}
