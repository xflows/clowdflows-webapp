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
var logger_service_1 = require("../../services/logger.service");
var EditorComponent = (function () {
    function EditorComponent(clowdflowsDataService, route, loggingService) {
        this.clowdflowsDataService = clowdflowsDataService;
        this.route = route;
        this.loggingService = loggingService;
        this.workflow = {};
    }
    EditorComponent.prototype.addWidget = function (abstractWidget) {
        var _this = this;
        var widgetData = {
            workflow: this.workflow.url,
            x: 50,
            y: 50,
            name: abstractWidget.name,
            abstract_widget: abstractWidget.id,
            finished: false,
            error: false,
            running: false,
            interaction_waiting: false,
            type: 'regular',
            progress: 0
        };
        // Sync with server
        this.clowdflowsDataService.addWidget(widgetData, this.workflow)
            .then(function (widget) {
            _this.workflow.widgets.push(widget);
        });
    };
    EditorComponent.prototype.addConnection = function () {
        var _this = this;
        var selectedInput = this.canvasComponent.selectedInput;
        var selectedOutput = this.canvasComponent.selectedOutput;
        var connectionData = {
            input: selectedInput.url,
            output: selectedOutput.url,
            workflow: this.workflow.url
        };
        this.clowdflowsDataService
            .addConnection(connectionData, this.workflow)
            .then(function (connection) {
            _this.workflow.connections.push(connection);
            selectedInput.connection = connection;
            _this.canvasComponent.unselectSignals();
        });
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
                _this.loggingService.success("Successfully loaded workflow " + workflow.url);
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
        __metadata('design:paramtypes', [clowdflows_data_service_1.ClowdFlowsDataService, router_1.ActivatedRoute, logger_service_1.LoggerService])
    ], EditorComponent);
    return EditorComponent;
}());
exports.EditorComponent = EditorComponent;
//# sourceMappingURL=editor.component.js.map