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
var config_1 = require("../config");
var TreeViewComponent = (function () {
    function TreeViewComponent() {
        this.addWidgetRequest = new core_1.EventEmitter();
    }
    TreeViewComponent.prototype.iconUrl = function (widget) {
        var url = '/app/images/question-mark.png';
        if (widget.static_image) {
            url = config_1.BASE_URL + "/static/" + widget.cfpackage + "/icons/treeview/" + widget.static_image;
        }
        return url;
    };
    TreeViewComponent.prototype.toggleCollapsed = function (category) {
        category.collapsed = !category.collapsed;
    };
    TreeViewComponent.prototype.addWidgetToCanvas = function (abstractWidget) {
        this.addWidgetRequest.emit(abstractWidget);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], TreeViewComponent.prototype, "categories", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], TreeViewComponent.prototype, "addWidgetRequest", void 0);
    TreeViewComponent = __decorate([
        core_1.Component({
            selector: 'tree-view',
            templateUrl: 'app/components/tree-view.component.html',
            styleUrls: ['app/components/tree-view.component.css'],
            directives: [TreeViewComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], TreeViewComponent);
    return TreeViewComponent;
}());
exports.TreeViewComponent = TreeViewComponent;
//# sourceMappingURL=tree-view.component.js.map