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
var platform_browser_1 = require('@angular/platform-browser');
var app_component_1 = require('./app.component');
var http_1 = require('@angular/http');
var user_service_1 = require("./services/user.service");
var logged_in_guard_1 = require("./services/logged-in.guard");
var logger_service_1 = require("./services/logger.service");
var forms_1 = require("@angular/forms");
var app_routing_1 = require('./app.routing');
var login_component_1 = require("./components/login/login.component");
var home_component_1 = require("./components/home/home.component");
var editor_component_1 = require("./components/editor/editor.component");
var clowdflows_data_service_1 = require('./services/clowdflows-data.service');
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [
                platform_browser_1.BrowserModule,
                app_routing_1.routing,
                forms_1.FormsModule,
                http_1.HttpModule,
            ],
            declarations: [
                app_component_1.AppComponent,
                home_component_1.HomeComponent,
                login_component_1.LoginComponent,
                editor_component_1.EditorComponent
            ],
            providers: [
                clowdflows_data_service_1.ClowdFlowsDataService,
                user_service_1.UserService,
                logger_service_1.LoggerService,
                logged_in_guard_1.LoggedInGuard,
            ],
            bootstrap: [
                app_component_1.AppComponent,
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map