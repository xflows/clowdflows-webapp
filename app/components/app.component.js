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
var router_1 = require('@angular/router');
var editor_component_1 = require("./editor/editor.component");
var clowdflows_data_service_1 = require('../services/clowdflows-data.service');
var user_service_1 = require("../services/user.service");
var AppComponent = (function () {
    function AppComponent(viewContainerRef, userService, router) {
        this.viewContainerRef = viewContainerRef;
        this.userService = userService;
        this.router = router;
    }
    AppComponent = __decorate([
        core_1.Component({
            selector: 'clowdflows-app',
            templateUrl: 'app/components/app.component.html',
            directives: [editor_component_1.EditorComponent, router_1.ROUTER_DIRECTIVES],
            providers: [clowdflows_data_service_1.ClowdFlowsDataService],
            precompile: [editor_component_1.EditorComponent]
        }), 
        __metadata('design:paramtypes', [core_1.ViewContainerRef, user_service_1.UserService, router_1.Router])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map