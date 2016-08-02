"use strict";
var router_1 = require('@angular/router');
var editor_component_1 = require("./components/editor/editor.component");
var login_component_1 = require("./components/login/login.component");
var logged_in_guard_1 = require("./services/logged-in.guard");
var home_component_1 = require("./components/home/home.component");
var routes = [
    {
        path: '',
        component: home_component_1.HomeComponent
    },
    {
        path: 'editor/:id',
        component: editor_component_1.EditorComponent,
        canActivate: [logged_in_guard_1.LoggedInGuard]
    },
    {
        path: 'login',
        component: login_component_1.LoginComponent
    }
];
exports.appRouterProviders = [
    router_1.provideRouter(routes)
];
//# sourceMappingURL=app.routes.js.map