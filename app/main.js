"use strict";
var platform_browser_dynamic_1 = require('@angular/platform-browser-dynamic');
var http_1 = require('@angular/http');
var app_component_1 = require('./components/app.component');
var config_service_1 = require('./services/config.service');
platform_browser_dynamic_1.bootstrap(app_component_1.AppComponent, [
    http_1.HTTP_PROVIDERS,
    config_service_1.ConfigService
]);
//# sourceMappingURL=main.js.map