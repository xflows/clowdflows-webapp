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
var http_1 = require('@angular/http');
var router_1 = require('@angular/router');
var config_1 = require("../config");
var UserService = (function () {
    function UserService(http, router) {
        this.http = http;
        this.router = router;
        this.loggedIn = false;
        this.redirectUrl = null;
        this.loggedIn = !!localStorage.getItem('auth_token');
    }
    UserService.prototype.login = function (username, password) {
        var _this = this;
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this.http
            .post(config_1.API_ENDPOINT + "login/", JSON.stringify({ username: username, password: password }), { headers: headers })
            .map(function (res) { return res.json(); })
            .map(function (res) {
            if (res.token) {
                localStorage.setItem('auth_token', res.token);
                _this.loggedIn = true;
                return true;
            }
            return false;
        });
    };
    UserService.prototype.logout = function (redirectUrl) {
        localStorage.removeItem('auth_token');
        this.loggedIn = false;
        this.router.navigate([redirectUrl]);
    };
    UserService.prototype.isLoggedIn = function () {
        return this.loggedIn;
    };
    UserService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http, router_1.Router])
    ], UserService);
    return UserService;
}());
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map