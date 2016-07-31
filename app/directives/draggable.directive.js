"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var Draggable = (function () {
    function Draggable(_elementRef) {
        this._elementRef = _elementRef;
        this.element = null;
        this.mouseDown = false;
        this.mouseOffsetX = 0;
        this.mouseOffsetY = 0;
        this.positionChangeRequest = new core_1.EventEmitter();
        this.endMoveRequest = new core_1.EventEmitter();
        this.element = this._elementRef.nativeElement;
    }
    Draggable.prototype.onMouseDown = function (event) {
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
    };
    Draggable.prototype.onMouseUp = function (event) {
        this.mouseDown = false;
        this.endMoveRequest.emit("");
    };
    Draggable.prototype.onMouseMove = function (event) {
        if (!this.mouseDown)
            return;
        var mousePosition = this.element.parentElement.createSVGPoint();
        mousePosition.x = event.clientX;
        mousePosition.y = event.clientY;
        // Transform the mouse position to the canvas SVG coordinates
        var m = this.element.parentElement.getScreenCTM();
        mousePosition = mousePosition.matrixTransform(m.inverse());
        // Account for the mouse offset
        var newWidgetPosition = { x: mousePosition.x - this.mouseOffsetX, y: mousePosition.y - this.mouseOffsetY };
        this.positionChangeRequest.emit(newWidgetPosition);
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], Draggable.prototype, "positionChangeRequest", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], Draggable.prototype, "endMoveRequest", void 0);
    Draggable = __decorate([
        core_1.Directive({
            selector: '[draggable]',
            host: {
                '(mousedown)': 'onMouseDown($event)',
                '(window:mouseup)': 'onMouseUp($event)',
                '(window:mousemove)': 'onMouseMove($event)'
            }
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], Draggable);
    return Draggable;
}());
exports.Draggable = Draggable;
//# sourceMappingURL=draggable.directive.js.map