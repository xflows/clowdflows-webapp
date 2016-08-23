import {Directive, ElementRef, EventEmitter, OnInit, Output} from '@angular/core';

@Directive({
    selector: '[draggable]',
    host: {
        '(mousedown)': 'onMouseDown($event)',
        '(window:mouseup)': 'onMouseUp($event)',
        '(window:mousemove)': 'onMouseMove($event)'
    }
})
export class Draggable {

    element:any = null;
    mouseDown = false;
    mouseOffsetX = 0;
    mouseOffsetY = 0;

    @Output() positionChangeRequest = new EventEmitter();
    @Output() endMoveRequest = new EventEmitter();

    constructor(private _elementRef: ElementRef) {
        this.element = this._elementRef.nativeElement;
    }

    onMouseDown(event:any) {
        this.mouseDown = true;

        var widgetCorner = this.element.parentElement.createSVGPoint();
        widgetCorner.x = 0;
        widgetCorner.y = 0;

        var mousePosition = this.element.parentElement.createSVGPoint();
        mousePosition.x = event.clientX;
        mousePosition.y = event.clientY;

        // Transforms the screen mouse position to the canvas SVG coordinates
        var m = this.element.parentElement.getScreenCTM();
        mousePosition = mousePosition.matrixTransform(m.inverse());

        // Transforms the widget corner position to the canvas SVG coordinates
        m = this.element.getCTM();
        widgetCorner = widgetCorner.matrixTransform(m);

        // Account for the distance from the mouse to the widget corner (which is what we must update)
        this.mouseOffsetX = mousePosition.x - widgetCorner.x;
        this.mouseOffsetY = mousePosition.y - widgetCorner.y;
    }

    onMouseUp(event:any) {
        if (this.mouseDown) {
            this.mouseDown = false;
            this.endMoveRequest.emit("");
        }
    }

    onMouseMove(event:any) {
        if (!this.mouseDown)
            return;

        var mousePosition = this.element.parentElement.createSVGPoint();
        mousePosition.x = event.clientX;
        mousePosition.y = event.clientY;

        // Transform the mouse position to the canvas SVG coordinates
        var m = this.element.parentElement.getScreenCTM();
        mousePosition = mousePosition.matrixTransform(m.inverse());

        // Account for the mouse offset
        var newWidgetPosition = {x: mousePosition.x - this.mouseOffsetX, y: mousePosition.y - this.mouseOffsetY};

        this.positionChangeRequest.emit(newWidgetPosition);
    }
}
