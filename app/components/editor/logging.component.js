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
var logger_service_1 = require("../../services/logger.service");
var LoggingComponent = (function () {
    function LoggingComponent(loggingService) {
        this.loggingService = loggingService;
        this.messages = null;
        this.messages = loggingService.messages;
        // this.loggingService.info('test test info');
        // this.loggingService.error('test test error');
        // this.loggingService.warning('test test warning');
        // this.loggingService.success('test test success');
    }
    LoggingComponent = __decorate([
        core_1.Component({
            selector: 'logging',
            templateUrl: 'app/components/editor/logging.component.html',
            styleUrls: ['app/components/editor/logging.component.css',],
            directives: []
        }), 
        __metadata('design:paramtypes', [logger_service_1.LoggerService])
    ], LoggingComponent);
    return LoggingComponent;
}());
exports.LoggingComponent = LoggingComponent;
//# sourceMappingURL=logging.component.js.map