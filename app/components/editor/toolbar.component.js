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
var ng2_bootstrap_1 = require('ng2-bootstrap/ng2-bootstrap');
var ToolbarComponent = (function () {
    function ToolbarComponent() {
        this.runWorkflowRequest = new core_1.EventEmitter();
        this.saveWorkflowRequest = new core_1.EventEmitter();
        this.newWorkflowRequest = new core_1.EventEmitter();
    }
    ToolbarComponent.prototype.showNewWorkflowModal = function () {
        this.newWorkflowModal.show();
    };
    ToolbarComponent.prototype.showOpenWorkflowModal = function () {
        this.openWorkflowModal.show();
    };
    ToolbarComponent.prototype.showSaveWorkflowModal = function () {
        this.saveWorkflowModal.show();
    };
    ToolbarComponent.prototype.todo = function () {
    };
    ToolbarComponent.prototype.togglePublicWorkflow = function (event) {
        var isChecked = event.currentTarget.checked;
        this.workflow.is_public = isChecked ? 'true' : 'false';
    };
    ToolbarComponent.prototype.runWorkflow = function () {
        this.runWorkflowRequest.emit("");
    };
    ToolbarComponent.prototype.saveWorkflow = function () {
        this.saveWorkflowRequest.emit("");
    };
    ToolbarComponent.prototype.newWorkflow = function () {
        this.newWorkflowRequest.emit("");
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], ToolbarComponent.prototype, "workflow", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], ToolbarComponent.prototype, "runWorkflowRequest", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], ToolbarComponent.prototype, "saveWorkflowRequest", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], ToolbarComponent.prototype, "newWorkflowRequest", void 0);
    __decorate([
        core_1.ViewChild('newWorkflow'), 
        __metadata('design:type', ng2_bootstrap_1.ModalDirective)
    ], ToolbarComponent.prototype, "newWorkflowModal", void 0);
    __decorate([
        core_1.ViewChild('openWorkflow'), 
        __metadata('design:type', ng2_bootstrap_1.ModalDirective)
    ], ToolbarComponent.prototype, "openWorkflowModal", void 0);
    __decorate([
        core_1.ViewChild('saveWorkflow'), 
        __metadata('design:type', ng2_bootstrap_1.ModalDirective)
    ], ToolbarComponent.prototype, "saveWorkflowModal", void 0);
    ToolbarComponent = __decorate([
        core_1.Component({
            selector: 'toolbar',
            templateUrl: 'app/components/editor/toolbar.component.html',
            styleUrls: ['app/components/editor/toolbar.component.css'],
            directives: [ng2_bootstrap_1.MODAL_DIRECTIVES],
            viewProviders: [ng2_bootstrap_1.BS_VIEW_PROVIDERS],
        }), 
        __metadata('design:paramtypes', [])
    ], ToolbarComponent);
    return ToolbarComponent;
}());
exports.ToolbarComponent = ToolbarComponent;
//# sourceMappingURL=toolbar.component.js.map