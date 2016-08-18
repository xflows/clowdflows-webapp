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
var widget_1 = require("../../models/widget");
var clowdflows_data_service_1 = require("../../services/clowdflows-data.service");
var WidgetDialogComponent = (function () {
    function WidgetDialogComponent(clowdflowsDataService) {
        this.clowdflowsDataService = clowdflowsDataService;
    }
    WidgetDialogComponent.prototype.closeDialog = function () {
        this.widget.showDialog = false;
    };
    WidgetDialogComponent.prototype.closeRenameDialog = function () {
        this.widget.showRenameDialog = false;
    };
    WidgetDialogComponent.prototype.closeVisualizationDialog = function () {
        this.widget.showVisualizationDialog = false;
    };
    WidgetDialogComponent.prototype.closeInteractionDialog = function () {
        this.widget.showInteractionDialog = false;
    };
    WidgetDialogComponent.prototype.applyInteraction = function () {
        var data = getFormResults(this.formContainer.nativeElement.getElementsByTagName('form')[0]);
        this.clowdflowsDataService.finishInteractionWidget(this.widget, data);
        this.widget.showInteractionDialog = false;
    };
    WidgetDialogComponent.prototype.closeResults = function () {
        this.widget.showResults = false;
    };
    WidgetDialogComponent.prototype.closeHelp = function () {
        this.widget.showHelp = false;
    };
    WidgetDialogComponent.prototype.applyParameters = function () {
        this.clowdflowsDataService.saveParameters(this.widget);
        this.widget.showDialog = false;
    };
    WidgetDialogComponent.prototype.saveName = function () {
        this.clowdflowsDataService.saveWidget(this.widget);
        this.widget.showRenameDialog = false;
    };
    WidgetDialogComponent.prototype.onCheckboxChange = function (parameter, event) {
        var isChecked = event.currentTarget.checked;
        parameter.deserialized_value = isChecked ? 'true' : 'false';
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', widget_1.Widget)
    ], WidgetDialogComponent.prototype, "widget", void 0);
    __decorate([
        core_1.ViewChild('formContainer'), 
        __metadata('design:type', core_1.ElementRef)
    ], WidgetDialogComponent.prototype, "formContainer", void 0);
    WidgetDialogComponent = __decorate([
        core_1.Component({
            selector: 'widget-dialog',
            templateUrl: 'app/components/editor/widget-dialog.component.html',
            styleUrls: ['app/components/editor/widget-dialog.component.css'],
            directives: []
        }), 
        __metadata('design:paramtypes', [clowdflows_data_service_1.ClowdFlowsDataService])
    ], WidgetDialogComponent);
    return WidgetDialogComponent;
}());
exports.WidgetDialogComponent = WidgetDialogComponent;
function setOrPush(target, val) {
    var result = val;
    if (target) {
        result = [target];
        result.push(val);
    }
    return result;
}
function getFormResults(formElement) {
    var formElements = formElement.elements;
    var formParams = {};
    var i = 0;
    var elem = null;
    for (i = 0; i < formElements.length; i += 1) {
        elem = formElements[i];
        switch (elem.type) {
            case 'submit':
                break;
            case 'radio':
                if (elem.checked) {
                    formParams[elem.name] = elem.value;
                }
                break;
            case 'checkbox':
                if (elem.checked) {
                    formParams[elem.name] = setOrPush(formParams[elem.name], elem.value);
                }
                break;
            default:
                formParams[elem.name] = setOrPush(formParams[elem.name], elem.value);
        }
    }
    return formParams;
}
//# sourceMappingURL=widget-dialog.component.js.map