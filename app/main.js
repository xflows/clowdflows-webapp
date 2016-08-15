"use strict";
var platform_browser_dynamic_1 = require('@angular/platform-browser-dynamic');
var http_1 = require('@angular/http');
var app_component_1 = require('./components/app.component');
var app_routes_1 = require("./app.routes");
var user_service_1 = require("./services/user.service");
var logged_in_guard_1 = require("./services/logged-in.guard");
var logger_service_1 = require("./services/logger.service");
platform_browser_dynamic_1.bootstrap(app_component_1.AppComponent, [
    http_1.HTTP_PROVIDERS,
    user_service_1.UserService,
    logged_in_guard_1.LoggedInGuard,
    logger_service_1.LoggerService,
    app_routes_1.appRouterProviders
]);
//# sourceMappingURL=main.js.map