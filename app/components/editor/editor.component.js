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
var widget_1 = require("../../models/widget");
var connection_1 = require("../../models/connection");
var workflow_1 = require("../../models/workflow");
var platform_browser_1 = require("@angular/platform-browser");
var EditorComponent = (function () {
    function EditorComponent(domSanitizer, clowdflowsDataService, route, loggerService) {
        this.domSanitizer = domSanitizer;
        this.clowdflowsDataService = clowdflowsDataService;
        this.route = route;
        this.loggerService = loggerService;
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
        this.clowdflowsDataService
            .addWidget(widgetData)
            .then(function (data) {
            var error = _this.reportMessage(data);
            if (!error) {
                var widget = new widget_1.Widget(data.id, data.url, data.x, data.y, data.name, data.finished, data.error, data.running, data.interaction_waiting, data.type, data.progress, data.abstract_widget, data.description, data.icon, data.inputs, data.outputs, _this.workflow);
                _this.workflow.widgets.push(widget);
            }
        });
    };
    EditorComponent.prototype.copyWidget = function (widget) {
        var _this = this;
        var widgetData = {
            workflow: this.workflow.url,
            x: widget.x + 50,
            y: widget.y + 50,
            name: widget.name + " (copy)",
            abstract_widget: widget.abstract_widget,
            finished: false,
            error: false,
            running: false,
            interaction_waiting: false,
            type: widget.type,
            progress: 0
        };
        // Sync with server
        this.clowdflowsDataService
            .addWidget(widgetData)
            .then(function (data) {
            var error = _this.reportMessage(data);
            if (!error) {
                var widget_2 = new widget_1.Widget(data.id, data.url, data.x, data.y, data.name, data.finished, data.error, data.running, data.interaction_waiting, data.type, data.progress, data.abstract_widget, data.description, data.icon, data.inputs, data.outputs, _this.workflow);
                _this.workflow.widgets.push(widget_2);
            }
        });
    };
    EditorComponent.prototype.saveWidget = function (widget) {
        var _this = this;
        this.clowdflowsDataService
            .saveWidget(widget)
            .then(function (data) {
            _this.reportMessage(data);
        });
    };
    EditorComponent.prototype.saveWidgetPosition = function (widget) {
        var _this = this;
        this.clowdflowsDataService
            .saveWidgetPosition(widget)
            .then(function (data) {
            _this.reportMessage(data);
        });
    };
    EditorComponent.prototype.deleteWidget = function (widget) {
        var _this = this;
        // Delete the connections
        for (var _i = 0, _a = this.workflow.connections; _i < _a.length; _i++) {
            var conn = _a[_i];
            if (conn.input_widget == widget || conn.output_widget == widget) {
                this.deleteConnection(conn);
            }
        }
        // Delete the widget
        this.clowdflowsDataService
            .deleteWidget(widget)
            .then(function (data) {
            var error = _this.reportMessage(data);
            if (!error) {
                var idx = _this.workflow.widgets.indexOf(widget);
                _this.workflow.widgets.splice(idx, 1);
            }
        });
    };
    EditorComponent.prototype.resetWidget = function (widget) {
        var _this = this;
        this.clowdflowsDataService
            .resetWidget(widget)
            .then(function (data) {
            _this.reportMessage(data);
        });
    };
    EditorComponent.prototype.runWidget = function (widget) {
        var _this = this;
        this.clowdflowsDataService
            .runWidget(widget)
            .then(function (data) {
            _this.reportMessage(data);
        });
    };
    EditorComponent.prototype.updateWidget = function (widget) {
        var _this = this;
        return this.clowdflowsDataService
            .getWidget(widget.id)
            .then(function (data) {
            var newWidget = new widget_1.Widget(data.id, data.url, data.x, data.y, data.name, data.finished, data.error, data.running, data.interaction_waiting, data.type, data.progress, data.abstract_widget, data.description, data.icon, data.inputs, data.outputs, _this.workflow);
            // Update connection references
            for (var _i = 0, _a = _this.workflow.connections.filter(function (c) { return c.input_widget.url == newWidget.url; }); _i < _a.length; _i++) {
                var conn = _a[_i];
                conn.input_widget = newWidget;
            }
            for (var _b = 0, _c = _this.workflow.connections.filter(function (c) { return c.output_widget.url == newWidget.url; }); _b < _c.length; _b++) {
                var conn = _c[_b];
                conn.output_widget = newWidget;
            }
            // Remove old version
            var idx = _this.workflow.widgets.indexOf(widget);
            _this.workflow.widgets.splice(idx, 1);
            _this.workflow.widgets.push(newWidget);
            return newWidget;
        });
    };
    EditorComponent.prototype.fetchOutputValue = function (output) {
        var _this = this;
        this.clowdflowsDataService
            .fetchOutputValue(output)
            .then(function (data) {
            var error = _this.reportMessage(data);
            if (!error) {
                output.value = data.value;
            }
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
        var updateInputs = selectedInput.multi_id != 0;
        this.clowdflowsDataService
            .addConnection(connectionData)
            .then(function (data) {
            var error = _this.reportMessage(data);
            if (!error) {
                var input_widget = _this.workflow.widgets.find(function (widget) { return widget.url == data.input_widget; });
                var output_widget = _this.workflow.widgets.find(function (widget) { return widget.url == data.output_widget; });
                var connection = new connection_1.Connection(data.url, output_widget, input_widget, data.output, data.input, _this.workflow);
                _this.workflow.connections.push(connection);
                selectedInput.connection = connection;
                _this.canvasComponent.unselectSignals();
                if (updateInputs) {
                    _this.updateWidget(input_widget);
                }
            }
        });
    };
    EditorComponent.prototype.deleteConnection = function (connection) {
        var _this = this;
        var updateInputs = connection.input.multi_id != 0;
        this.clowdflowsDataService
            .deleteConnection(connection)
            .then(function (data) {
            var error = _this.reportMessage(data);
            if (!error) {
                var idx = _this.workflow.connections.indexOf(connection);
                _this.workflow.connections.splice(idx, 1);
                if (updateInputs) {
                    _this.updateWidget(connection.input_widget);
                }
            }
        });
    };
    EditorComponent.prototype.runWorkflow = function () {
        var _this = this;
        this.clowdflowsDataService
            .runWorkflow(this.workflow)
            .then(function (data) {
            _this.reportMessage(data);
        });
    };
    EditorComponent.prototype.resetWorkflow = function () {
        var _this = this;
        this.clowdflowsDataService
            .resetWorkflow(this.workflow)
            .then(function (data) {
            _this.reportMessage(data);
        });
    };
    EditorComponent.prototype.receiveWorkflowUpdate = function (data) {
        var widget = this.workflow.widgets.find(function (widgetObj) { return widgetObj.id == data.widget_pk; });
        if (widget != undefined) {
            if (data.status.finished && !widget.finished) {
                if (data.status.is_visualization) {
                    // console.log(`should visualize ${widget.name}`);
                    this.visualizeWidget(widget);
                }
            }
            if (!data.status.finished && data.status.interaction_waiting) {
                if (!widget.showInteractionDialog) {
                    this.interactWidget(widget);
                }
            }
            widget.finished = data.status.finished;
            widget.error = data.status.error;
            widget.running = data.status.running;
            widget.interaction_waiting = data.status.interaction_waiting;
        }
    };
    EditorComponent.prototype.visualizeWidget = function (widget) {
        var _this = this;
        this.clowdflowsDataService
            .visualizeWidget(widget)
            .then(function (response) {
            //noinspection TypeScriptValidateTypes
            widget.visualizationHtml = _this.domSanitizer.bypassSecurityTrustHtml(response.text());
            widget.showVisualizationDialog = true;
        });
    };
    EditorComponent.prototype.interactWidget = function (widget) {
        var _this = this;
        this.clowdflowsDataService
            .interactWidget(widget)
            .then(function (response) {
            //noinspection TypeScriptValidateTypes
            widget.interactionHtml = _this.domSanitizer.bypassSecurityTrustHtml(response.text());
            widget.showInteractionDialog = true;
        });
    };
    EditorComponent.prototype.parseWorkflow = function (data) {
        var workflow = new workflow_1.Workflow(data.id, data.url, data.widgets, data.connections, data.is_subprocess, data.name, data.public, data.description, data.widget, data.template_parent);
        return workflow;
    };
    EditorComponent.prototype.reportMessage = function (data) {
        var error = false;
        if (data && 'status' in data) {
            if (data.status == 'error') {
                this.loggerService.error(data.message || 'Problem executing action');
                error = true;
            }
            else if (data.status == 'ok' && 'message' in data) {
                this.loggerService.info(data.message);
            }
        }
        return error;
    };
    EditorComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.sub = this.route.params.subscribe(function (params) {
            var id = +params['id'];
            _this.clowdflowsDataService.getWorkflow(id)
                .then(function (data) {
                _this.workflow = _this.parseWorkflow(data);
                _this.clowdflowsDataService.workflowUpdates(function (data) {
                    _this.receiveWorkflowUpdate(data);
                }, _this.workflow);
                _this.loggerService.success("Successfully loaded workflow.");
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
        __metadata('design:paramtypes', [platform_browser_1.DomSanitizationService, clowdflows_data_service_1.ClowdFlowsDataService, router_1.ActivatedRoute, logger_service_1.LoggerService])
    ], EditorComponent);
    return EditorComponent;
}());
exports.EditorComponent = EditorComponent;
//# sourceMappingURL=editor.component.js.map