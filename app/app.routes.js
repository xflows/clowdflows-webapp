"use strict";
var router_1 = require('@angular/router');
var editor_component_1 = require("./components/editor.component");
var routes = [
    {
        path: 'editor/:id',
        component: editor_component_1.EditorComponent
    }
];
exports.appRouterProviders = [
    router_1.provideRouter(routes)
];
//# sourceMappingURL=app.routes.js.map