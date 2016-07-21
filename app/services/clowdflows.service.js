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
var config_service_1 = require("./config.service");
var category_1 = require("../models/category");
var ClowdFlowsService = (function () {
    function ClowdFlowsService(http, config) {
        this.http = http;
        this.config = config;
        this.widgetLibraryUrl = 'widget-library/';
    }
    ClowdFlowsService.prototype.getAuthTokenHeaders = function () {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        var authToken = this.config.test_token;
        headers.append('Authorization', "Token " + authToken);
        return headers;
    };
    ClowdFlowsService.prototype.getWidgetLibrary = function () {
        var headers = this.getAuthTokenHeaders();
        return this.http
            .get(this.config.api_base_url + this.widgetLibraryUrl, { headers: headers })
            .toPromise()
            .then(function (response) { return ClowdFlowsService.parseWidgetLibrary(response); })
            .catch(this.handleError);
    };
    ClowdFlowsService.parseWidgetLibrary = function (response) {
        var widgetTree = [];
        for (var _i = 0, _a = response.json(); _i < _a.length; _i++) {
            var cat = _a[_i];
            widgetTree.push(new category_1.Category(cat.name, cat.user, cat.order, cat.children, cat.widgets));
        }
        return widgetTree;
    };
    ClowdFlowsService.prototype.handleError = function (error) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    };
    ClowdFlowsService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http, config_service_1.ConfigService])
    ], ClowdFlowsService);
    return ClowdFlowsService;
}());
exports.ClowdFlowsService = ClowdFlowsService;
//# sourceMappingURL=clowdflows.service.js.map