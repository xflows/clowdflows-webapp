"use strict";
var Input = (function () {
    function Input(id, url, deserialized_value, name, short_name, description, variable, required, parameter, multi_id, parameter_type, order, inner_output, outer_output, options) {
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
    return Input;
}());
exports.Input = Input;
//# sourceMappingURL=input.js.map