"use strict";
var output_1 = require("./output");
var input_1 = require("./input");
var ui_constants_1 = require("../services/ui-constants");
var Widget = (function () {
    function Widget(id, url, x, y, name, finished, error, running, interaction_waiting, type, progress, inputs, parameters, outputs) {
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
        this.showDialog = false;
        this.selected = false;
        this.inputs = new Array();
        for (var _i = 0, inputs_1 = inputs; _i < inputs_1.length; _i++) {
            var input = inputs_1[_i];
            var input_obj = new input_1.Input(input.id, input.url, input.deserialized_value, input.name, input.short_name, input.description, input.variable, input.required, input.parameter, input.multi_id, input.parameter_type, input.order, input.inner_output, input.outer_output, input.options, this);
            this.inputs.push(input_obj);
        }
        this.parameters = new Array();
        for (var _a = 0, parameters_1 = parameters; _a < parameters_1.length; _a++) {
            var input = parameters_1[_a];
            var input_obj = new input_1.Input(input.id, input.url, input.deserialized_value, input.name, input.short_name, input.description, input.variable, input.required, input.parameter, input.multi_id, input.parameter_type, input.order, input.inner_output, input.outer_output, input.options, this);
            this.parameters.push(input_obj);
        }
        this.outputs = new Array();
        for (var _b = 0, outputs_1 = outputs; _b < outputs_1.length; _b++) {
            var output = outputs_1[_b];
            this.outputs.push(new output_1.Output(output.url, output.deserialized_value, output.name, output.short_name, output.description, output.variable, output.order, output.inner_output, output.outer_output, this));
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