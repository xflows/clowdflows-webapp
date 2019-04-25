import {Directive, ElementRef, EventEmitter, OnInit, Output, Renderer2} from '@angular/core';

@Directive({
    selector: '[draggable-widget]',
    host: {
        '(mousedown)': 'onMouseDown($event)',
        '(window:mouseup)': 'onMouseUp($event)',
        '(window:mousemove)': 'onMouseMove($event)'
    }
})
export class DraggableWidget implements OnInit {

    element:any = null;
    mouseDown = false;
    mouseOffsetX = 0;
    mouseOffsetY = 0;
    mousePosition:SVGPoint = null;
    screenCTM:any = null;

    @Output() positionChangeRequest = new EventEmitter();
    @Output() endMoveRequest = new EventEmitter();

    constructor(private _elementRef: ElementRef, private renderer:Renderer2) {
        this.element = this._elementRef.nativeElement;
    }

    public ngOnInit():void {
        this.mousePosition = this.element.parentElement.createSVGPoint();
        this.screenCTM = this.element.parentElement.getScreenCTM();
    }

    onMouseDown(event:any) {
        this.mouseDown = true;

        var widgetCorner = this.element.parentElement.createSVGPoint();
        widgetCorner.x = 0;
        widgetCorner.y = 0;

        this.mousePosition.x = event.clientX;
        this.mousePosition.y = event.clientY;

        // Transforms the screen mouse position to the canvas SVG coordinates
        this.mousePosition = this.mousePosition.matrixTransform(this.screenCTM.inverse());

        // Transforms the widget corner position to the canvas SVG coordinates
        var m = this.element.getCTM();
        widgetCorner = widgetCorner.matrixTransform(m);

        // Account for the distance from the mouse to the widget corner (which is what we must update)
        this.mouseOffsetX = this.mousePosition.x - widgetCorner.x;
        this.mouseOffsetY = this.mousePosition.y - widgetCorner.y;
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

        this.mousePosition.x = event.clientX;
        this.mousePosition.y = event.clientY;

        // Transform the mouse position to the canvas SVG coordinates
        this.mousePosition = this.mousePosition.matrixTransform(this.screenCTM.inverse());

        // Account for the mouse offset
        var newWidgetPosition = {x: this.mousePosition.x - this.mouseOffsetX, y: this.mousePosition.y - this.mouseOffsetY};

        this.positionChangeRequest.emit(newWidgetPosition);
    }
}
