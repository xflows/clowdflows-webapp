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
var toolbar_component_1 = require("./toolbar.component");
var widget_tree_component_1 = require("./widget-tree.component");
var widget_canvas_component_1 = require("./widget-canvas.component");
var logging_component_1 = require("./logging.component");
var EditorComponent = (function () {
    function EditorComponent() {
    }
    EditorComponent = __decorate([
        core_1.Component({
            selector: 'editor',
            templateUrl: 'app/components/editor.component.html',
            directives: [toolbar_component_1.ToolbarComponent, widget_tree_component_1.WidgetTreeComponent, widget_canvas_component_1.WidgetCanvasComponent, logging_component_1.LoggingComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], EditorComponent);
    return EditorComponent;
}());
exports.EditorComponent = EditorComponent;
//# sourceMappingURL=editor.component.js.map