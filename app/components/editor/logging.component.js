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
var LoggingComponent = (function () {
    function LoggingComponent() {
        this.numberOfMessages = 0;
    }
    LoggingComponent.prototype.ngOnInit = function () {
        this.numberOfMessages = this.messages.length;
    };
    LoggingComponent.prototype.ngDoCheck = function () {
        if (this.numberOfMessages < this.messages.length) {
            this.scrollToBottom();
            this.numberOfMessages = this.messages.length;
        }
    };
    LoggingComponent.prototype.scrollToBottom = function () {
        console.log('yo', this.logContainer.nativeElement.scrollTop, this.logContainer.nativeElement.scrollHeight);
        this.logContainer.nativeElement.scrollTop = this.logContainer.nativeElement.scrollHeight;
        console.log(this.logContainer.nativeElement.scrollTop);
    };
    __decorate([
        core_1.ViewChild('log'), 
        __metadata('design:type', core_1.ElementRef)
    ], LoggingComponent.prototype, "logContainer", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], LoggingComponent.prototype, "messages", void 0);
    LoggingComponent = __decorate([
        core_1.Component({
            selector: 'logging',
            templateUrl: 'app/components/editor/logging.component.html',
            styleUrls: ['app/components/editor/logging.component.css',],
            directives: []
        }), 
        __metadata('design:paramtypes', [])
    ], LoggingComponent);
    return LoggingComponent;
}());
exports.LoggingComponent = LoggingComponent;
//# sourceMappingURL=logging.component.js.map