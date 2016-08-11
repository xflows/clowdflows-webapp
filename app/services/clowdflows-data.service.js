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
        this.inputsUrl = 'inputs/';
        this.outputsUrl = 'outputs/';
        this.widgetsUrl = 'widgets/';
        this.connectionsUrl = 'connections/';
    }
    ClowdFlowsDataService.prototype.getAuthTokenHeaders = function () {
        var headers = new http_1.Headers();
        var auth_token = localStorage.getItem('auth_token');
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', "Token " + auth_token);
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
        var workflow = new workflow_1.Workflow(data.id, data.url, data.widgets, data.connections, data.is_subprocess, data.name, data.public, data.description, data.widget, data.template_parent);
        return workflow;
    };
    ClowdFlowsDataService.prototype.addWidget = function (widget) {
        var headers = this.getAuthTokenHeaders();
        return this.http
            .post("" + config_1.API_ENDPOINT + this.widgetsUrl, JSON.stringify(widget.toDict(false)), { headers: headers })
            .toPromise()
            .then(function (result) {
            var data = result.json();
            widget.url = data.url;
            widget.id = data.id;
        });
    };
    ClowdFlowsDataService.prototype.saveWidget = function (widget) {
        var headers = this.getAuthTokenHeaders();
        //noinspection TypeScriptUnresolvedFunction
        return this.http
            .patch(widget.url, JSON.stringify(widget.toDict()), { headers: headers })
            .toPromise()
            .then(function (response) { return response.json(); })
            .catch(this.handleError);
    };
    ClowdFlowsDataService.prototype.deleteWidget = function (widget) {
        var headers = this.getAuthTokenHeaders();
        //noinspection TypeScriptUnresolvedFunction
        return this.http
            .delete(widget.url, { headers: headers })
            .toPromise()
            .then(function (result) { return result; })
            .catch(this.handleError);
    };
    ClowdFlowsDataService.prototype.saveWidgetPosition = function (widget) {
        var headers = this.getAuthTokenHeaders();
        //noinspection TypeScriptUnresolvedFunction
        return this.http
            .patch(widget.url, JSON.stringify({ url: widget.url, x: widget.x, y: widget.y }), { headers: headers })
            .toPromise()
            .then(function (response) { return response.json(); })
            .catch(this.handleError);
    };
    ClowdFlowsDataService.prototype.saveParameters = function (widget) {
        var headers = this.getAuthTokenHeaders();
        var parameters = [];
        for (var _i = 0, _a = widget.parameters; _i < _a.length; _i++) {
            var param = _a[_i];
            parameters.push({
                'id': param.id,
                'value': param.deserialized_value
            });
        }
        return this.http
            .patch(widget.url + "save-parameters/", JSON.stringify(parameters), { headers: headers })
            .toPromise()
            .then(function (response) { return response.json(); })
            .catch(this.handleError);
    };
    ClowdFlowsDataService.prototype.addConnection = function (conn) {
        var headers = this.getAuthTokenHeaders();
        //noinspection TypeScriptUnresolvedFunction
        return this.http
            .post("" + config_1.API_ENDPOINT + this.connectionsUrl, JSON.stringify(conn.toDict()), { headers: headers })
            .toPromise()
            .then(function (result) { return conn.url = result.json().url; })
            .catch(this.handleError);
    };
    ClowdFlowsDataService.prototype.addInput = function (input) {
        var headers = this.getAuthTokenHeaders();
        return this.http
            .post("" + config_1.API_ENDPOINT + this.inputsUrl, JSON.stringify(input.toDict(false)), { headers: headers })
            .toPromise()
            .then(function (result) {
            var data = result.json();
            input.url = data.url;
            input.id = data.id;
        });
    };
    ClowdFlowsDataService.prototype.addOutput = function (output) {
        var headers = this.getAuthTokenHeaders();
        return this.http
            .post("" + config_1.API_ENDPOINT + this.outputsUrl, JSON.stringify(output.toDict(false)), { headers: headers })
            .toPromise()
            .then(function (result) {
            var data = result.json();
            output.url = data.url;
        });
    };
    ClowdFlowsDataService.prototype.fetchOutputValue = function (output) {
        var headers = this.getAuthTokenHeaders();
        return this.http
            .get(output.url + "value/", { headers: headers })
            .toPromise()
            .then(function (result) {
            var data = result.json();
            output.value = data.value;
        });
    };
    ClowdFlowsDataService.prototype.deleteConnection = function (conn) {
        var headers = this.getAuthTokenHeaders();
        //noinspection TypeScriptUnresolvedFunction
        return this.http
            .delete(conn.url, { headers: headers })
            .toPromise()
            .then(function (result) { return result; })
            .catch(this.handleError);
    };
    ClowdFlowsDataService.prototype.workflowUpdates = function (onUpdateCallback, workflow) {
        var socket = new WebSocket(("ws://" + config_1.DOMAIN + "/workflow-updates/?workflow_pk=") + workflow.id);
        socket.onmessage = function (e) {
            onUpdateCallback(JSON.parse(e.data));
        };
    };
    ClowdFlowsDataService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], ClowdFlowsDataService);
    return ClowdFlowsDataService;
}());
exports.ClowdFlowsDataService = ClowdFlowsDataService;
//# sourceMappingURL=clowdflows-data.service.js.map