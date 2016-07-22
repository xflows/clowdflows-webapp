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
var clowdflows_data_service_1 = require('../services/clowdflows-data.service');
var tree_view_component_1 = require("./tree-view.component");
var config_service_1 = require("../services/config.service");
var WidgetTreeComponent = (function () {
    function WidgetTreeComponent(clowdflowsService, config) {
        this.clowdflowsService = clowdflowsService;
        this.config = config;
        this.addWidgetRequest = new core_1.EventEmitter();
    }
    WidgetTreeComponent.prototype.ngOnInit = function () {
        this.getWidgetLibrary();
    };
    WidgetTreeComponent.prototype.getWidgetLibrary = function () {
        var _this = this;
        this.clowdflowsService.getWidgetLibrary().then(function (library) { return _this.widgetTree = library; });
    };
    WidgetTreeComponent.prototype.filterTree = function () {
        function applyFilter(category, filterString) {
            var hide = true;
            var filterRegEx = new RegExp(filterString, 'i');
            if (category.name.match(filterRegEx)) {
                hide = false;
            }
            for (var _i = 0, _a = category.widgets; _i < _a.length; _i++) {
                var widget = _a[_i];
                if (widget.name.match(filterRegEx)) {
                    hide = false;
                    widget.hidden = false;
                }
                else {
                    widget.hidden = true;
                }
            }
            for (var _b = 0, _c = category.children; _b < _c.length; _b++) {
                var childCategory = _c[_b];
                var childrenHide = applyFilter(childCategory, filterString);
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
        }
        else {
            for (var _i = 0, _a = this.widgetTree; _i < _a.length; _i++) {
                var category = _a[_i];
                applyFilter(category, this.filterString);
            }
        }
    };
    WidgetTreeComponent.prototype.collapseAll = function () {
        function collapse(category) {
            category.collapsed = true;
            category.hidden = false;
            for (var _i = 0, _a = category.children; _i < _a.length; _i++) {
                var childCategory = _a[_i];
                collapse(childCategory);
            }
            for (var _b = 0, _c = category.widgets; _b < _c.length; _b++) {
                var widget = _c[_b];
                widget.hidden = false;
            }
        }
        for (var _i = 0, _a = this.widgetTree; _i < _a.length; _i++) {
            var category = _a[_i];
            collapse(category);
        }
    };
    WidgetTreeComponent.prototype.addWidgetToCanvas = function (abstractWidget) {
        this.addWidgetRequest.emit(abstractWidget);
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], WidgetTreeComponent.prototype, "addWidgetRequest", void 0);
    WidgetTreeComponent = __decorate([
        core_1.Component({
            selector: 'widget-tree',
            templateUrl: 'app/components/widget-tree.component.html',
            styleUrls: ['app/components/widget-tree.component.css'],
            directives: [tree_view_component_1.TreeViewComponent]
        }), 
        __metadata('design:paramtypes', [clowdflows_data_service_1.ClowdFlowsDataService, config_service_1.ConfigService])
    ], WidgetTreeComponent);
    return WidgetTreeComponent;
}());
exports.WidgetTreeComponent = WidgetTreeComponent;
//# sourceMappingURL=widget-tree.component.js.map