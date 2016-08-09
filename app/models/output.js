"use strict";
var Output = (function () {
    function Output(url, deserialized_value, name, short_name, description, variable, order, inner_output, outer_output, widget) {
        this.url = url;
        this.deserialized_value = deserialized_value;
        this.name = name;
        this.short_name = short_name;
        this.description = description;
        this.variable = variable;
        this.order = order;
        this.inner_output = inner_output;
        this.outer_output = outer_output;
        this.widget = widget;
        this.selected = false;
    }
    Object.defineProperty(Output.prototype, "x", {
        get: function () {
            return 96;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Output.prototype, "y", {
        get: function () {
            return (this.order - 1) * (10 + 16) + 10;
        },
        enumerable: true,
        configurable: true
    });
    Output.prototype.toJSON = function (withIds) {
        if (withIds === void 0) { withIds = true; }
        var serialized = {
            url: this.url,
            // deserialized_value: this.deserialized_value,
            name: this.name,
            short_name: this.short_name,
            description: this.description,
            variable: this.variable,
            order: this.order,
            widget: this.widget.url
        };
        if (withIds) {
            serialized['url'] = this.url;
        }
        return JSON.stringify(serialized);
    };
    return Output;
}());
exports.Output = Output;
//# sourceMappingURL=output.js.map