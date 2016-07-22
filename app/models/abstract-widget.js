"use strict";
var AbstractWidget = (function () {
    function AbstractWidget(name, interactive, static_image, order, cfpackage, outputs, inputs) {
        this.name = name;
        this.interactive = interactive;
        this.static_image = static_image;
        this.order = order;
        this.cfpackage = cfpackage;
        this.outputs = outputs;
        this.inputs = inputs;
        this.hidden = false;
    }
    return AbstractWidget;
}());
exports.AbstractWidget = AbstractWidget;
//# sourceMappingURL=abstract-widget.js.map