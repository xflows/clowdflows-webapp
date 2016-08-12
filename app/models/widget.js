"use strict";
var output_1 = require("./output");
var input_1 = require("./input");
var ui_constants_1 = require("../services/ui-constants");
var Widget = (function () {
    function Widget(id, url, x, y, name, finished, error, running, interaction_waiting, type, progress, abstract_widget, inputs, outputs, workflow) {
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
        this.workflow = workflow;
        this.showDialog = false;
        this.selected = false;
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
    Widget.prototype.toDict = function (withIds) {
        if (withIds === void 0) { withIds = true; }
        var serializedInputs = [];
        var serializedOutputs = [];
        for (var _i = 0, _a = this.inputs; _i < _a.length; _i++) {
            var input = _a[_i];
            serializedInputs.push(input.toDict());
        }
        for (var _b = 0, _c = this.parameters; _b < _c.length; _b++) {
            var parameter = _c[_b];
            serializedInputs.push(parameter.toDict());
        }
        for (var _d = 0, _e = this.outputs; _d < _e.length; _d++) {
            var output = _e[_d];
            serializedOutputs.push(output.toDict());
        }
        var serialized = {
            workflow: this.workflow.url,
            x: this.x,
            y: this.y,
            name: this.name,
            abstract_widget: this.abstract_widget,
            finished: this.finished,
            error: this.error,
            running: this.running,
            interaction_waiting: this.interaction_waiting,
            type: this.type,
            progress: this.progress,
            inputs: serializedInputs,
            outputs: serializedOutputs
        };
        if (withIds) {
            serialized['id'] = this.id;
        }
        return serialized;
    };
    return Widget;
}());
exports.Widget = Widget;
//# sourceMappingURL=widget.js.map