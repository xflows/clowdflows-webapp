"use strict";
var Input = (function () {
    function Input(id, url, deserialized_value, name, short_name, description, variable, required, parameter, multi_id, parameter_type, order, inner_output, outer_output, options, widget) {
        this.id = id;
        this.url = url;
        this.deserialized_value = deserialized_value;
        this.name = name;
        this.short_name = short_name;
        this.description = description;
        this.variable = variable;
        this.required = required;
        this.parameter = parameter;
        this.multi_id = multi_id;
        this.parameter_type = parameter_type;
        this.order = order;
        this.inner_output = inner_output;
        this.outer_output = outer_output;
        this.options = options;
        this.widget = widget;
        this.selected = false;
        this.connection = null;
    }
    Object.defineProperty(Input.prototype, "x", {
        get: function () {
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Input.prototype, "y", {
        get: function () {
            return (this.order - 1) * (10 + 16) + 10;
        },
        enumerable: true,
        configurable: true
    });
    Input.prototype.toJSON = function (withIds) {
        if (withIds === void 0) { withIds = true; }
        var serialized = {
            // deserialized_value: this.deserialized_value,
            name: this.name,
            short_name: this.short_name,
            description: this.description,
            variable: this.variable,
            required: this.required,
            parameter: this.parameter,
            multi_id: this.multi_id,
            parameter_type: this.parameter_type,
            order: this.order,
            widget: this.widget.url
        };
        if (withIds) {
            serialized['id'] = this.id;
            serialized['url'] = this.url;
        }
        return JSON.stringify(serialized);
    };
    return Input;
}());
exports.Input = Input;
//# sourceMappingURL=input.js.map