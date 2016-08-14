"use strict";
var Output = (function () {
    function Output(url, 
        // public deserialized_value:any,
        name, short_name, description, variable, order, inner_output, outer_output, widget) {
        this.url = url;
        this.name = name;
        this.short_name = short_name;
        this.description = description;
        this.variable = variable;
        this.order = order;
        this.inner_output = inner_output;
        this.outer_output = outer_output;
        this.widget = widget;
        this.value = null;
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
    return Output;
}());
exports.Output = Output;
//# sourceMappingURL=output.js.map