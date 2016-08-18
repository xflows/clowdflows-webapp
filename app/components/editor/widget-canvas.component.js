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
var angular2_contextmenu_1 = require('angular2-contextmenu/angular2-contextmenu');
var ui_constants_1 = require("../../services/ui-constants");
var draggable_directive_1 = require("../../directives/draggable.directive");
var widget_dialog_component_1 = require("./widget-dialog.component");
var output_1 = require("../../models/output");
var input_1 = require("../../models/input");
var WidgetCanvasComponent = (function () {
    function WidgetCanvasComponent(contextMenuService) {
        this.contextMenuService = contextMenuService;
        this.addConnectionRequest = new core_1.EventEmitter();
        this.deleteConnectionRequest = new core_1.EventEmitter();
        this.saveWidgetRequest = new core_1.EventEmitter();
        this.saveWidgetPositionRequest = new core_1.EventEmitter();
        this.deleteWidgetRequest = new core_1.EventEmitter();
        this.resetWidgetRequest = new core_1.EventEmitter();
        this.resetWorkflowRequest = new core_1.EventEmitter();
        this.copyWidgetRequest = new core_1.EventEmitter();
        this.runWidgetRequest = new core_1.EventEmitter();
        this.fetchOutputResultsRequest = new core_1.EventEmitter();
        this.ui_constants = ui_constants_1.UI;
        this.selectedInput = null;
        this.selectedOutput = null;
    }
    WidgetCanvasComponent.prototype.move = function (position, widget) {
        widget.x = position.x;
        widget.y = position.y;
    };
    WidgetCanvasComponent.prototype.saveWidget = function (widget) {
        this.saveWidgetRequest.emit(widget);
    };
    WidgetCanvasComponent.prototype.endMove = function (widget) {
        this.saveWidgetPositionRequest.emit(widget);
    };
    WidgetCanvasComponent.prototype.showDialog = function (widget) {
        widget.showDialog = true;
    };
    WidgetCanvasComponent.prototype.showResults = function (widget) {
        for (var _i = 0, _a = widget.outputs; _i < _a.length; _i++) {
            var output = _a[_i];
            this.fetchOutputResultsRequest.emit(output);
        }
        widget.showResults = true;
    };
    WidgetCanvasComponent.prototype.showHelp = function (widget) {
        widget.showHelp = true;
    };
    WidgetCanvasComponent.prototype.showRenameDialog = function (widget) {
        widget.showRenameDialog = true;
    };
    WidgetCanvasComponent.prototype.select = function (event, object) {
        var clickedOnInput = object instanceof input_1.Input;
        var clickedOnOutput = object instanceof output_1.Output;
        if (!event.shiftKey && !event.ctrlKey && !(clickedOnInput || clickedOnOutput)) {
            this.unselectObjects();
        }
        object.selected = true;
        event.stopPropagation();
        if (clickedOnInput) {
            if (this.selectedInput != null) {
                this.selectedInput.selected = false;
            }
            this.selectedInput = object;
        }
        else if (clickedOnOutput) {
            if (this.selectedOutput != null) {
                this.selectedOutput.selected = false;
            }
            this.selectedOutput = object;
        }
        if (clickedOnInput || clickedOnOutput) {
            if (this.selectedOutput != null && this.selectedInput != null &&
                this.selectedInput.connection == null) {
                this.newConnection();
            }
        }
    };
    WidgetCanvasComponent.prototype.newConnection = function () {
        this.addConnectionRequest.emit("");
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
        for (var _i = 0, _a = this.workflow.widgets; _i < _a.length; _i++) {
            var widget = _a[_i];
            if (widget.selected) {
                this.deleteWidget(widget);
            }
        }
        for (var _b = 0, _c = this.workflow.connections; _b < _c.length; _b++) {
            var conn = _c[_b];
            if (conn.selected) {
                this.deleteConnection(conn);
            }
        }
    };
    WidgetCanvasComponent.prototype.deleteWidget = function (widget) {
        this.deleteWidgetRequest.emit(widget);
    };
    WidgetCanvasComponent.prototype.deleteConnection = function (connection) {
        this.deleteConnectionRequest.emit(connection);
    };
    WidgetCanvasComponent.prototype.resetWidget = function (widget) {
        this.resetWidgetRequest.emit(widget);
    };
    WidgetCanvasComponent.prototype.resetWorkflow = function () {
        this.resetWorkflowRequest.emit("");
    };
    WidgetCanvasComponent.prototype.copyWidget = function (widget) {
        this.copyWidgetRequest.emit(widget);
    };
    WidgetCanvasComponent.prototype.runWidget = function (widget) {
        this.runWidgetRequest.emit(widget);
    };
    WidgetCanvasComponent.prototype.handleShortcuts = function (event) {
        if (event.keyCode == 46) {
            // Check that it doesn't come from an input field
            if (event.srcElement.localName != "input") {
                this.deleteSelectedObjects();
            }
        }
    };
    WidgetCanvasComponent.prototype.onContextMenu = function ($event, item) {
        var _this = this;
        $event.preventDefault();
        this.contextMenuService.show.next({
            actions: [
                {
                    html: function () { return "<span class=\"glyphicon glyphicon-play\"></span> Run only this"; },
                    click: function (widget) { return _this.runWidget(widget); }
                },
                {
                    html: function () { return "<span class=\"glyphicon glyphicon-pencil\"></span> Properties"; },
                    click: function (widget) { return _this.showDialog(widget); }
                },
                {
                    html: function () { return "<span class=\"glyphicon glyphicon-stats\"></span> Results"; },
                    click: function (widget) { return _this.showResults(widget); }
                },
                {
                    html: function () { return "<span class=\"glyphicon glyphicon-repeat\"></span> Reset"; },
                    click: function (widget) { return _this.resetWidget(widget); }
                },
                {
                    html: function () { return "<span class=\"glyphicon glyphicon-repeat\"></span> Reset workflow"; },
                    click: function (_) { return _this.resetWorkflow(); }
                },
                {
                    html: function () { return "<span class=\"glyphicon glyphicon-console\"></span> Rename"; },
                    click: function (widget) { return _this.showRenameDialog(widget); }
                },
                {
                    html: function () { return "<span class=\"glyphicon glyphicon-copy\"></span> Copy"; },
                    click: function (widget) { return _this.copyWidget(widget); }
                },
                {
                    html: function () { return "<span class=\"glyphicon glyphicon-trash\"></span> Delete"; },
                    click: function (widget) { return _this.deleteWidget(widget); }
                },
                {
                    html: function () { return "<span class=\"glyphicon glyphicon-question-sign\"></span> Help"; },
                    click: function (widget) { return _this.showHelp(widget); }
                },
            ],
            event: $event,
            item: item,
        });
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], WidgetCanvasComponent.prototype, "workflow", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], WidgetCanvasComponent.prototype, "addConnectionRequest", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], WidgetCanvasComponent.prototype, "deleteConnectionRequest", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], WidgetCanvasComponent.prototype, "saveWidgetRequest", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], WidgetCanvasComponent.prototype, "saveWidgetPositionRequest", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], WidgetCanvasComponent.prototype, "deleteWidgetRequest", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], WidgetCanvasComponent.prototype, "resetWidgetRequest", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], WidgetCanvasComponent.prototype, "resetWorkflowRequest", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], WidgetCanvasComponent.prototype, "copyWidgetRequest", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], WidgetCanvasComponent.prototype, "runWidgetRequest", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], WidgetCanvasComponent.prototype, "fetchOutputResultsRequest", void 0);
    WidgetCanvasComponent = __decorate([
        core_1.Component({
            selector: 'widget-canvas',
            templateUrl: 'app/components/editor/widget-canvas.component.html',
            styleUrls: ['app/components/editor/widget-canvas.component.css'],
            directives: [widget_dialog_component_1.WidgetDialogComponent, draggable_directive_1.Draggable, angular2_contextmenu_1.ContextMenuComponent],
            providers: [angular2_contextmenu_1.ContextMenuService]
        }), 
        __metadata('design:paramtypes', [angular2_contextmenu_1.ContextMenuService])
    ], WidgetCanvasComponent);
    return WidgetCanvasComponent;
}());
exports.WidgetCanvasComponent = WidgetCanvasComponent;
//# sourceMappingURL=widget-canvas.component.js.map