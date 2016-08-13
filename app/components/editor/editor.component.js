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
var clowdflows_data_service_1 = require("../../services/clowdflows-data.service");
var connection_1 = require("../../models/connection");
var widget_1 = require("../../models/widget");
var input_1 = require("../../models/input");
var output_1 = require("../../models/output");
var EditorComponent = (function () {
    function EditorComponent(clowdflowsDataService, route) {
        this.clowdflowsDataService = clowdflowsDataService;
        this.route = route;
        this.workflow = {};
    }
    EditorComponent.prototype.addWidget = function (abstractWidget) {
        var _this = this;
        var x = 50, y = 50;
        var inputs = new Array();
        var parameters = new Array();
        var outputs = new Array();
        var widget = new widget_1.Widget(-1, '', x, y, abstractWidget.name, false, false, false, false, 'regular', 0, abstractWidget.id, abstractWidget.description, inputs, outputs, this.workflow);
        var inputOrder = 1, parameterOrder = 1;
        for (var _i = 0, _a = abstractWidget.inputs; _i < _a.length; _i++) {
            var input = _a[_i];
            var order = input.parameter ? parameterOrder : inputOrder;
            var inputObj = new input_1.Input(-1, '', null, input.name, input.short_name, input.description, input.variable, input.required, input.parameter, -1, input.parameter_type, order, null, null, input.options, widget);
            if (input.parameter) {
                parameters.push(inputObj);
                inputOrder++;
            }
            else {
                inputs.push(inputObj);
                parameterOrder++;
            }
        }
        for (var _b = 0, _c = abstractWidget.outputs; _b < _c.length; _b++) {
            var output = _c[_b];
            outputs.push(new output_1.Output('', output.name, output.short_name, output.description, output.variable, output.order, null, null, widget));
        }
        widget.inputs = inputs;
        widget.parameters = parameters;
        widget.outputs = outputs;
        // Sync with server
        this.clowdflowsDataService.addWidget(widget)
            .then(function () { return _this.workflow.widgets.push(widget); });
    };
    EditorComponent.prototype.addConnection = function () {
        var selectedInput = this.canvasComponent.selectedInput;
        var selectedOutput = this.canvasComponent.selectedOutput;
        var conn = new connection_1.Connection('', selectedOutput.widget, selectedInput.widget, selectedOutput.url, selectedInput.url, this.workflow);
        this.clowdflowsDataService.addConnection(conn);
        this.workflow.connections.push(conn);
        selectedInput.connection = conn;
    };
    EditorComponent.prototype.runWorkflow = function () {
        this.clowdflowsDataService.runWorkflow(this.workflow);
    };
    EditorComponent.prototype.receiveWorkflowUpdate = function (data) {
        var widget = this.workflow.widgets.find(function (widgetObj) { return widgetObj.id == data.widget_pk; });
        if (widget != undefined) {
            widget.finished = data.status.finished;
            widget.error = data.status.error;
            widget.running = data.status.running;
            widget.interaction_waiting = data.status.interaction_waiting;
        }
    };
    EditorComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.sub = this.route.params.subscribe(function (params) {
            var id = +params['id'];
            _this.clowdflowsDataService.getWorkflow(id)
                .then(function (workflow) {
                _this.workflow = workflow;
                _this.clowdflowsDataService.workflowUpdates(function (data) {
                    _this.receiveWorkflowUpdate(data);
                }, workflow);
            });
        });
    };
    EditorComponent.prototype.ngOnDestroy = function () {
        this.sub.unsubscribe();
    };
    __decorate([
        core_1.ViewChild(widget_canvas_component_1.WidgetCanvasComponent), 
        __metadata('design:type', widget_canvas_component_1.WidgetCanvasComponent)
    ], EditorComponent.prototype, "canvasComponent", void 0);
    EditorComponent = __decorate([
        core_1.Component({
            selector: 'editor',
            templateUrl: 'app/components/editor/editor.component.html',
            directives: [toolbar_component_1.ToolbarComponent, widget_tree_component_1.WidgetTreeComponent, widget_canvas_component_1.WidgetCanvasComponent, logging_component_1.LoggingComponent]
        }), 
        __metadata('design:paramtypes', [clowdflows_data_service_1.ClowdFlowsDataService, router_1.ActivatedRoute])
    ], EditorComponent);
    return EditorComponent;
}());
exports.EditorComponent = EditorComponent;
//# sourceMappingURL=editor.component.js.map