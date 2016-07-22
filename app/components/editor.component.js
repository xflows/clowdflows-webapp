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
var router_1 = require('@angular/router');
var toolbar_component_1 = require("./toolbar.component");
var widget_tree_component_1 = require("./widget-tree.component");
var widget_canvas_component_1 = require("./widget-canvas.component");
var logging_component_1 = require("./logging.component");
var clowdflows_data_service_1 = require("../services/clowdflows-data.service");
var EditorComponent = (function () {
    function EditorComponent(clowdflowsDataService, route) {
        this.clowdflowsDataService = clowdflowsDataService;
        this.route = route;
        this.workflow = {};
    }
    EditorComponent.prototype.addWidgetToCanvas = function (abstractWidget) {
        // TODO: construct actual Widget from AbstractWidget here and call data service to save.
        console.log(abstractWidget.name);
    };
    EditorComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.sub = this.route.params.subscribe(function (params) {
            var id = +params['id'];
            _this.clowdflowsDataService.getWorkflow(id)
                .then(function (workflow) { return _this.workflow = workflow; });
        });
    };
    EditorComponent.prototype.ngOnDestroy = function () {
        this.sub.unsubscribe();
    };
    EditorComponent = __decorate([
        core_1.Component({
            selector: 'editor',
            templateUrl: 'app/components/editor.component.html',
            directives: [toolbar_component_1.ToolbarComponent, widget_tree_component_1.WidgetTreeComponent, widget_canvas_component_1.WidgetCanvasComponent, logging_component_1.LoggingComponent]
        }), 
        __metadata('design:paramtypes', [clowdflows_data_service_1.ClowdFlowsDataService, router_1.ActivatedRoute])
    ], EditorComponent);
    return EditorComponent;
}());
exports.EditorComponent = EditorComponent;
//# sourceMappingURL=editor.component.js.map