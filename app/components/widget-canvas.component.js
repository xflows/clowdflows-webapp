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
var ui_constants_1 = require("../services/ui-constants");
var draggable_directive_1 = require("../directives/draggable.directive");
var clowdflows_data_service_1 = require("../services/clowdflows-data.service");
var widget_dialog_component_1 = require("./widget-dialog.component");
var WidgetCanvasComponent = (function () {
    function WidgetCanvasComponent(clowdflowsDataService) {
        this.clowdflowsDataService = clowdflowsDataService;
        this.ui_constants = ui_constants_1.UI;
    }
    WidgetCanvasComponent.prototype.move = function (position, widget) {
        widget.x = position.x;
        widget.y = position.y;
    };
    WidgetCanvasComponent.prototype.saveWidget = function (widget) {
        this.clowdflowsDataService.saveWidget(widget);
    };
    WidgetCanvasComponent.prototype.showDialog = function (widget) {
        widget.showDialog = true;
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], WidgetCanvasComponent.prototype, "workflow", void 0);
    WidgetCanvasComponent = __decorate([
        core_1.Component({
            selector: 'widget-canvas',
            templateUrl: 'app/components/widget-canvas.component.html',
            styleUrls: ['app/components/widget-canvas.component.css'],
            directives: [widget_dialog_component_1.WidgetDialogComponent, draggable_directive_1.Draggable]
        }), 
        __metadata('design:paramtypes', [clowdflows_data_service_1.ClowdFlowsDataService])
    ], WidgetCanvasComponent);
    return WidgetCanvasComponent;
}());
exports.WidgetCanvasComponent = WidgetCanvasComponent;
//# sourceMappingURL=widget-canvas.component.js.map