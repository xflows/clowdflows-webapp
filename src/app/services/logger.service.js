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
var LoggerService = (function () {
    function LoggerService() {
        this.messages = [];
    }
    LoggerService.prototype.addMessage = function (type, text) {
        var timestamp = new Date().toLocaleTimeString();
        this.messages.push({ type: type, text: text, timestamp: timestamp });
    };
    LoggerService.prototype.info = function (text) {
        this.addMessage('info', text);
    };
    LoggerService.prototype.warning = function (text) {
        this.addMessage('warning', text);
    };
    LoggerService.prototype.error = function (text) {
        this.addMessage('danger', text);
    };
    LoggerService.prototype.success = function (text) {
        this.addMessage('success', text);
    };
    LoggerService.prototype.clear = function () {
        this.messages.splice(0, this.messages.length);
    };
    LoggerService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], LoggerService);
    return LoggerService;
}());
exports.LoggerService = LoggerService;
//# sourceMappingURL=logger.service.js.map