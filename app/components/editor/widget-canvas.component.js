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
var ui_constants_1 = require("../../services/ui-constants");
var draggable_directive_1 = require("../../directives/draggable.directive");
var clowdflows_data_service_1 = require("../../services/clowdflows-data.service");
var widget_dialog_component_1 = require("./widget-dialog.component");
var output_1 = require("../../models/output");
var input_1 = require("../../models/input");
var WidgetCanvasComponent = (function () {
    function WidgetCanvasComponent(clowdflowsDataService) {
        this.clowdflowsDataService = clowdflowsDataService;
        this.addConnectionRequest = new core_1.EventEmitter();
        this.ui_constants = ui_constants_1.UI;
        this.selectedInput = null;
        this.selectedOutput = null;
    }
    WidgetCanvasComponent.prototype.move = function (position, widget) {
        widget.x = position.x;
        widget.y = position.y;
    };
    WidgetCanvasComponent.prototype.saveWidget = function (widget) {
        this.clowdflowsDataService.saveWidget(widget);
    };
    WidgetCanvasComponent.prototype.endMove = function (widget) {
        this.clowdflowsDataService.saveWidgetPosition(widget);
    };
    WidgetCanvasComponent.prototype.showDialog = function (widget) {
        widget.showDialog = true;
    };
    WidgetCanvasComponent.prototype.select = function (event, object) {
        object.selected = true;
        event.stopPropagation();
        if (object instanceof input_1.Input) {
            if (this.selectedInput != null) {
                this.selectedInput.selected = false;
            }
            this.selectedInput = object;
        }
        else if (object instanceof output_1.Output) {
            if (this.selectedOutput != null) {
                this.selectedOutput.selected = false;
            }
            this.selectedOutput = object;
        }
        if (object instanceof input_1.Input || object instanceof output_1.Output) {
            if (this.selectedOutput != null && this.selectedInput != null &&
                this.selectedInput.connection == null) {
                this.newConnection();
            }
        }
    };
    WidgetCanvasComponent.prototype.newConnection = function () {
        this.addConnectionRequest.emit("");
        this.unselectSignals();
    };
    WidgetCanvasComponent.prototype.unselectObjects = function () {
        for (var _i = 0, _a = this.workflow.widgets; _i < _a.length; _i++) {
            var widget = _a[_i];
            widget.selected = false;
        }
        for (var _b = 0, _c = this.workflow.connections; _b < _c.length; _b++) {
            var conn = _c[_b];
            conn.selected = false;
        }
        this.unselectSignals();
    };
    WidgetCanvasComponent.prototype.unselectSignals = function () {
        if (this.selectedInput != null) {
            this.selectedInput.selected = false;
            this.selectedInput = null;
        }
        if (this.selectedOutput != null) {
            this.selectedOutput.selected = false;
            this.selectedOutput = null;
        }
    };
    WidgetCanvasComponent.prototype.deleteSelectedObjects = function () {
        var _this = this;
        var _loop_1 = function(widget) {
            if (widget.selected) {
                // Delete the connections
                var _loop_2 = function(conn) {
                    if (conn.input_widget == widget || conn.output_widget == widget) {
                        this_1.clowdflowsDataService
                            .deleteConnection(conn)
                            .then(function (result) {
                            var idx = _this.workflow.connections.indexOf(conn);
                            _this.workflow.connections.splice(idx, 1);
                        });
                    }
                };
                for (var _i = 0, _a = this_1.workflow.connections; _i < _a.length; _i++) {
                    var conn = _a[_i];
                    _loop_2(conn);
                }
                // Delete the widget
                this_1.clowdflowsDataService
                    .deleteWidget(widget)
                    .then(function (result) {
                    var idx = _this.workflow.widgets.indexOf(widget);
                    _this.workflow.widgets.splice(idx, 1);
                });
            }
        };
        var this_1 = this;
        for (var _b = 0, _c = this.workflow.widgets; _b < _c.length; _b++) {
            var widget = _c[_b];
            _loop_1(widget);
        }
        var _loop_3 = function(conn) {
            if (conn.selected) {
                this_2.clowdflowsDataService
                    .deleteConnection(conn)
                    .then(function (result) {
                    var idx = _this.workflow.connections.indexOf(conn);
                    _this.workflow.connections.splice(idx, 1);
                });
            }
        };
        var this_2 = this;
        for (var _d = 0, _e = this.workflow.connections; _d < _e.length; _d++) {
            var conn = _e[_d];
            _loop_3(conn);
        }
    };
    WidgetCanvasComponent.prototype.handleShortcuts = function (event) {
        if (event.keyCode == 46) {
            // Check that it doesn't come from an input field
            if (event.srcElement.localName != "input") {
                this.deleteSelectedObjects();
            }
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], WidgetCanvasComponent.prototype, "workflow", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], WidgetCanvasComponent.prototype, "addConnectionRequest", void 0);
    WidgetCanvasComponent = __decorate([
        core_1.Component({
            selector: 'widget-canvas',
            templateUrl: 'app/components/editor/widget-canvas.component.html',
            styleUrls: ['app/components/editor/widget-canvas.component.css'],
            directives: [widget_dialog_component_1.WidgetDialogComponent, draggable_directive_1.Draggable]
        }), 
        __metadata('design:paramtypes', [clowdflows_data_service_1.ClowdFlowsDataService])
    ], WidgetCanvasComponent);
    return WidgetCanvasComponent;
}());
exports.WidgetCanvasComponent = WidgetCanvasComponent;
//# sourceMappingURL=widget-canvas.component.js.map