"use strict";
var widget_1 = require("./widget");
var connection_1 = require("./connection");
var Workflow = (function () {
    function Workflow(id, url, widgets, connections, is_subprocess, name, is_public, description, widget, template_parent) {
        this.id = id;
        this.url = url;
        this.is_subprocess = is_subprocess;
        this.name = name;
        this.is_public = is_public;
        this.description = description;
        this.widget = widget;
        this.template_parent = template_parent;
        this.widgets = new Array();
        for (var _i = 0, widgets_1 = widgets; _i < widgets_1.length; _i++) {
            var widget_2 = widgets_1[_i];
            this.widgets.push(new widget_1.Widget(widget_2.id, widget_2.url, widget_2.x, widget_2.y, widget_2.name, widget_2.finished, widget_2.error, widget_2.runing, widget_2.interaction_waiting, widget_2.type, widget_2.progress, widget_2.inputs, widget_2.parameters, widget_2.outputs));
        }
        this.connections = new Array();
        var _loop_1 = function(connection) {
            var input_widget = this_1.widgets.find(function (widget) { return widget.url == connection.input_widget; });
            var output_widget = this_1.widgets.find(function (widget) { return widget.url == connection.output_widget; });
            this_1.connections.push(new connection_1.Connection(connection.url, output_widget, input_widget, connection.output, connection.input, this_1));
        };
        var this_1 = this;
        for (var _a = 0, connections_1 = connections; _a < connections_1.length; _a++) {
            var connection = connections_1[_a];
            _loop_1(connection);
        }
    }
    return Workflow;
}());
exports.Workflow = Workflow;
//# sourceMappingURL=workflow.js.map