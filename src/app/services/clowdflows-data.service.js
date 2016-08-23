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
var logger_service_1 = require("./logger.service");
var ClowdFlowsDataService = (function () {
    function ClowdFlowsDataService(http, loggerService) {
        this.http = http;
        this.loggerService = loggerService;
        this.widgetLibraryUrl = 'widget-library/';
        this.workflowsUrl = 'workflows/';
        this.inputsUrl = 'inputs/';
        this.outputsUrl = 'outputs/';
        this.widgetsUrl = 'widgets/';
        this.connectionsUrl = 'connections/';
    }
    ClowdFlowsDataService.prototype.getRequestOptions = function () {
        var headers = new http_1.Headers();
        var auth_token = localStorage.getItem('auth_token');
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', "Token " + auth_token);
        var options = new http_1.RequestOptions({ headers: headers });
        return options;
    };
    ClowdFlowsDataService.prototype.getWidgetLibrary = function () {
        var _this = this;
        var options = this.getRequestOptions();
        options.body = '';
        return this.http
            .get("" + config_1.API_ENDPOINT + this.widgetLibraryUrl, options)
            .toPromise()
            .then(function (response) { return response.json(); })
            .catch(function (error) { return _this.handleError(error); });
    };
    ClowdFlowsDataService.prototype.handleError = function (error) {
        console.error('An error occurred', error);
        var message = error.message || error;
        this.loggerService.error("HTTP error: " + error);
    };
    ClowdFlowsDataService.prototype.getWorkflow = function (id) {
        var _this = this;
        var options = this.getRequestOptions();
        options.body = '';
        return this.http
            .get("" + config_1.API_ENDPOINT + this.workflowsUrl + id + "/", options)
            .toPromise()
            .then(function (response) { return response.json(); })
            .catch(function (error) { return _this.handleError(error); });
    };
    ClowdFlowsDataService.prototype.runWorkflow = function (workflow) {
        var _this = this;
        var options = this.getRequestOptions();
        return this.http
            .post(workflow.url + "run/", {}, options)
            .toPromise()
            .then(function (response) { return response.json(); })
            .catch(function (error) { return _this.handleError(error); });
    };
    ClowdFlowsDataService.prototype.resetWorkflow = function (workflow) {
        var _this = this;
        var options = this.getRequestOptions();
        return this.http
            .post(workflow.url + "reset/", {}, options)
            .toPromise()
            .then(function (response) { return response; })
            .catch(function (error) { return _this.handleError(error); });
    };
    ClowdFlowsDataService.prototype.visualizeWidget = function (widget) {
        var _this = this;
        var options = this.getRequestOptions();
        options.body = '';
        return this.http
            .get(widget.url + "visualize/", options)
            .toPromise()
            .then(function (html) { return html; })
            .catch(function (error) { return _this.handleError(error); });
    };
    ClowdFlowsDataService.prototype.interactWidget = function (widget) {
        var _this = this;
        var options = this.getRequestOptions();
        options.body = '';
        return this.http
            .get(widget.url + "interact/", options)
            .toPromise()
            .then(function (html) { return html; })
            .catch(function (error) { return _this.handleError(error); });
    };
    ClowdFlowsDataService.prototype.finishInteractionWidget = function (widget, data) {
        var _this = this;
        var options = this.getRequestOptions();
        return this.http
            .post(widget.url + "interact/", JSON.stringify(data), options)
            .toPromise()
            .then(function (response) { return response.json(); })
            .catch(function (error) { return _this.handleError(error); });
    };
    ClowdFlowsDataService.prototype.getWidget = function (id) {
        var _this = this;
        var options = this.getRequestOptions();
        var date = new Date().toTimeString(); // FIX: better way to prevent GET caching
        options.body = '';
        return this.http
            .get("" + config_1.API_ENDPOINT + this.widgetsUrl + id + "/?" + date, options)
            .toPromise()
            .then(function (response) { return response.json(); })
            .catch(function (error) { return _this.handleError(error); });
    };
    ClowdFlowsDataService.prototype.addWidget = function (widgetData) {
        var _this = this;
        var options = this.getRequestOptions();
        return this.http
            .post("" + config_1.API_ENDPOINT + this.widgetsUrl, JSON.stringify(widgetData), options)
            .toPromise()
            .then(function (response) { return response.json(); })
            .catch(function (error) { return _this.handleError(error); });
    };
    ClowdFlowsDataService.prototype.saveWidget = function (widget) {
        var _this = this;
        var options = this.getRequestOptions();
        return this.http
            .patch(widget.url, JSON.stringify(widget), options)
            .toPromise()
            .then(function (response) { return response; })
            .catch(function (error) { return _this.handleError(error); });
    };
    ClowdFlowsDataService.prototype.resetWidget = function (widget) {
        var _this = this;
        var options = this.getRequestOptions();
        return this.http
            .post(widget.url + "reset/", '', options)
            .toPromise()
            .then(function (response) { return response.json(); })
            .catch(function (error) { return _this.handleError(error); });
    };
    ClowdFlowsDataService.prototype.runWidget = function (widget) {
        var _this = this;
        var options = this.getRequestOptions();
        return this.http
            .post(widget.url + "run/", '', options)
            .toPromise()
            .then(function (response) { return response.json(); })
            .catch(function (error) { return _this.handleError(error); });
    };
    ClowdFlowsDataService.prototype.deleteWidget = function (widget) {
        var _this = this;
        var options = this.getRequestOptions();
        options.body = '';
        return this.http
            .delete(widget.url, options)
            .toPromise()
            .then(function (response) { return response; })
            .catch(function (error) { return _this.handleError(error); });
    };
    ClowdFlowsDataService.prototype.saveWidgetPosition = function (widget) {
        var _this = this;
        var options = this.getRequestOptions();
        return this.http
            .patch(widget.url, JSON.stringify({ url: widget.url, x: widget.x, y: widget.y }), options)
            .toPromise()
            .then(function (response) { return response; })
            .catch(function (error) { return _this.handleError(error); });
    };
    ClowdFlowsDataService.prototype.saveParameters = function (widget) {
        var _this = this;
        var options = this.getRequestOptions();
        var parameters = [];
        for (var _i = 0, _a = widget.parameters; _i < _a.length; _i++) {
            var param = _a[_i];
            parameters.push({
                'id': param.id,
                'value': param.deserialized_value
            });
        }
        return this.http
            .patch(widget.url + "save-parameters/", JSON.stringify(parameters), options)
            .toPromise()
            .then(function (response) { return response; })
            .catch(function (error) { return _this.handleError(error); });
    };
    ClowdFlowsDataService.prototype.addConnection = function (connectionData) {
        var _this = this;
        var options = this.getRequestOptions();
        return this.http
            .post("" + config_1.API_ENDPOINT + this.connectionsUrl, JSON.stringify(connectionData), options)
            .toPromise()
            .then(function (response) { return response.json(); })
            .catch(function (error) { return _this.handleError(error); });
    };
    ClowdFlowsDataService.prototype.fetchOutputValue = function (output) {
        var options = this.getRequestOptions();
        options.body = '';
        return this.http
            .get(output.url + "value/", options)
            .toPromise()
            .then(function (response) { return response.json(); });
    };
    ClowdFlowsDataService.prototype.deleteConnection = function (conn) {
        var _this = this;
        var options = this.getRequestOptions();
        options.body = '';
        return this.http
            .delete(conn.url, options)
            .toPromise()
            .then(function (response) { return response; })
            .catch(function (error) { return _this.handleError(error); });
    };
    ClowdFlowsDataService.prototype.workflowUpdates = function (onUpdateCallback, workflow) {
        var socket = new WebSocket("ws://" + config_1.DOMAIN + "/workflow-updates/?workflow_pk=" + workflow.id);
        socket.onmessage = function (e) {
            onUpdateCallback(JSON.parse(e.data));
        };
    };
    ClowdFlowsDataService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http, logger_service_1.LoggerService])
    ], ClowdFlowsDataService);
    return ClowdFlowsDataService;
}());
exports.ClowdFlowsDataService = ClowdFlowsDataService;
//# sourceMappingURL=clowdflows-data.service.js.map