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
var http_1 = require("@angular/http");
require('rxjs/add/operator/toPromise');
var config_1 = require("../config");
var category_1 = require("../models/category");
var workflow_1 = require("../models/workflow");
var ClowdFlowsDataService = (function () {
    function ClowdFlowsDataService(http) {
        this.http = http;
        this.widgetLibraryUrl = 'widget-library/';
        this.workflowsUrl = 'workflows/';
    }
    ClowdFlowsDataService.prototype.getAuthTokenHeaders = function () {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', "Token " + config_1.TEST_TOKEN);
        return headers;
    };
    ClowdFlowsDataService.prototype.getWidgetLibrary = function () {
        var headers = this.getAuthTokenHeaders();
        //noinspection TypeScriptUnresolvedFunction
        return this.http
            .get("" + config_1.API_ENDPOINT + this.widgetLibraryUrl, { headers: headers })
            .toPromise()
            .then(function (response) { return ClowdFlowsDataService.parseWidgetLibrary(response); })
            .catch(this.handleError);
    };
    ClowdFlowsDataService.parseWidgetLibrary = function (response) {
        var widgetTree = [];
        for (var _i = 0, _a = response.json(); _i < _a.length; _i++) {
            var cat = _a[_i];
            widgetTree.push(new category_1.Category(cat.name, cat.user, cat.order, cat.children, cat.widgets));
        }
        return widgetTree;
    };
    ClowdFlowsDataService.prototype.handleError = function (error) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    };
    ClowdFlowsDataService.prototype.getWorkflow = function (id) {
        var headers = this.getAuthTokenHeaders();
        //noinspection TypeScriptUnresolvedFunction
        return this.http
            .get("" + config_1.API_ENDPOINT + this.workflowsUrl + id + "/", { headers: headers })
            .toPromise()
            .then(function (response) { return ClowdFlowsDataService.parseWorkflow(response); })
            .catch(this.handleError);
    };
    ClowdFlowsDataService.prototype.runWorkflow = function (workflow) {
        var headers = this.getAuthTokenHeaders();
        //noinspection TypeScriptUnresolvedFunction
        return this.http
            .post(workflow.url + "run/", {}, { headers: headers })
            .toPromise()
            .then()
            .catch(this.handleError);
    };
    ClowdFlowsDataService.parseWorkflow = function (response) {
        var data = response.json();
        var workflow = new workflow_1.Workflow(data.url, data.widgets, data.connections, data.is_subprocess, data.name, data.public, data.description, data.widget, data.template_parent);
        return workflow;
    };
    ClowdFlowsDataService.prototype.saveWidget = function (widget) {
        var headers = this.getAuthTokenHeaders();
        //noinspection TypeScriptUnresolvedFunction
        return this.http
            .patch(widget.url, JSON.stringify(widget), { headers: headers })
            .toPromise()
            .then(function (response) { return response.json(); })
            .catch(this.handleError);
    };
    ClowdFlowsDataService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], ClowdFlowsDataService);
    return ClowdFlowsDataService;
}());
exports.ClowdFlowsDataService = ClowdFlowsDataService;
//# sourceMappingURL=clowdflows-data.service.js.map