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
var clowdflows_service_1 = require('./clowdflows.service');
var WidgetTreeComponent = (function () {
    function WidgetTreeComponent(clowdflowsService) {
        this.clowdflowsService = clowdflowsService;
        this.widgetTree = null;
    }
    WidgetTreeComponent.prototype.ngOnInit = function () {
        this.getWidgetLibrary();
    };
    WidgetTreeComponent.prototype.getWidgetLibrary = function () {
        var _this = this;
        this.clowdflowsService.getWidgetLibrary().then(function (library) { return _this.widgetTree = library; });
    };
    WidgetTreeComponent = __decorate([
        core_1.Component({
            selector: 'widget-tree',
            templateUrl: 'app/widget-tree.component.html',
            styleUrls: ['app/widget-tree.component.css'],
            directives: []
        }), 
        __metadata('design:paramtypes', [clowdflows_service_1.ClowdFlowsService])
    ], WidgetTreeComponent);
    return WidgetTreeComponent;
}());
exports.WidgetTreeComponent = WidgetTreeComponent;
//# sourceMappingURL=widget-tree.component.js.map