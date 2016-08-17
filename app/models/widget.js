"use strict";
var output_1 = require("./output");
var input_1 = require("./input");
var ui_constants_1 = require("../services/ui-constants");
var Widget = (function () {
    function Widget(id, url, x, y, name, finished, error, running, interaction_waiting, type, progress, abstract_widget, description, icon, inputs, outputs, workflow) {
        this.id = id;
        this.url = url;
        this.x = x;
        this.y = y;
        this.name = name;
        this.finished = finished;
        this.error = error;
        this.running = running;
        this.interaction_waiting = interaction_waiting;
        this.type = type;
        this.progress = progress;
        this.abstract_widget = abstract_widget;
        this.description = description;
        this.icon = icon;
        this.workflow = workflow;
        this.showDialog = false;
        this.showResults = false;
        this.showRenameDialog = false;
        this.showVisualizationDialog = false;
        this.showHelp = false;
        this.selected = false;
        this.visualizationHtml = '';
        // Keep proper inputs and parameters separately
        this.inputs = new Array();
        this.parameters = new Array();
        for (var _i = 0, inputs_1 = inputs; _i < inputs_1.length; _i++) {
            var input = inputs_1[_i];
            var input_obj = new input_1.Input(input.id, input.url, input.deserialized_value, input.name, input.short_name, input.description, input.variable, input.required, input.parameter, input.multi_id, input.parameter_type, input.order, input.inner_output, input.outer_output, input.options, this);
            if (input.parameter) {
                this.parameters.push(input_obj);
            }
            else {
                this.inputs.push(input_obj);
            }
        }
        this.outputs = new Array();
        for (var _a = 0, outputs_1 = outputs; _a < outputs_1.length; _a++) {
            var output = outputs_1[_a];
            this.outputs.push(new output_1.Output(output.url, output.name, output.short_name, output.description, output.variable, output.order, output.inner_output, output.outer_output, this));
        }
    }
    Object.defineProperty(Widget.prototype, "boxHeight", {
        get: function () {
            return 50 + (ui_constants_1.UI.signalHeight + 10) * (this.inputs.length > this.outputs.length ? this.inputs.length - 1 : this.outputs.length - 1);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Widget.prototype, "labelY", {
        get: function () {
            return this.boxHeight + 20;
        },
        enumerable: true,
        configurable: true
    });
    return Widget;
}());
exports.Widget = Widget;
//# sourceMappingURL=widget.js.map