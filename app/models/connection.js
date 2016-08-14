"use strict";
var ui_constants_1 = require("../services/ui-constants");
var Connection = (function () {
    function Connection(url, output_widget, input_widget, output, input, workflow) {
        this.url = url;
        this.output_widget = output_widget;
        this.input_widget = input_widget;
        this.workflow = workflow;
        this.selected = false;
        this.output = output_widget.outputs.find(function (outputObj) { return outputObj.url == output; });
        this.input = input_widget.inputs.find(function (inputObj) { return inputObj.url == input; });
        console.log(this.input, output_widget, input_widget);
        this.input.connection = this;
    }
    Object.defineProperty(Connection.prototype, "bezierPoints", {
        get: function () {
            var outputX = this.output_widget.x + this.output.x + ui_constants_1.UI.signalWidth;
            var outputY = this.output_widget.y + this.output.y + ui_constants_1.UI.signalHeight / 2;
            var inputX = this.input_widget.x + this.input.x;
            var inputY = this.input_widget.y + this.input.y + ui_constants_1.UI.signalHeight / 2;
            var p1 = [outputX, outputY];
            var p2 = [inputX, inputY];
            var coeffMulDirection = 100;
            var distance = Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
            if (distance < coeffMulDirection) {
                coeffMulDirection = distance / 4;
            }
            var d1 = [1 * coeffMulDirection,
                0 * coeffMulDirection];
            var d2 = [-1 * coeffMulDirection,
                0 * coeffMulDirection];
            if (outputX > inputX && Math.abs(outputY - inputY) < 65) {
                coeffMulDirection = 150;
                var d1 = [1 * coeffMulDirection,
                    -1 * coeffMulDirection];
                var d2 = [-1 * coeffMulDirection,
                    -1 * coeffMulDirection];
            }
            var bezierPoints = [];
            bezierPoints[0] = p1;
            bezierPoints[1] = [p1[0] + d1[0], p1[1] + d1[1]];
            bezierPoints[2] = [p2[0] + d2[0], p2[1] + d2[1]];
            bezierPoints[3] = p2;
            var min = [p1[0], p1[1]];
            var max = [p1[0], p1[1]];
            for (var i = 1; i < bezierPoints.length; i++) {
                var p = bezierPoints[i];
                if (p[0] < min[0]) {
                    min[0] = p[0];
                }
                if (p[1] < min[1]) {
                    min[1] = p[1];
                }
                if (p[0] > max[0]) {
                    max[0] = p[0];
                }
                if (p[1] > max[1]) {
                    max[1] = p[1];
                }
            }
            return "M" + bezierPoints[0][0] + "," + bezierPoints[0][1] + " C" + bezierPoints[1][0] + "," + bezierPoints[1][1] + " " + bezierPoints[2][0] + "," + bezierPoints[2][1] + " " + bezierPoints[3][0] + "," + bezierPoints[3][1];
        },
        enumerable: true,
        configurable: true
    });
    return Connection;
}());
exports.Connection = Connection;
//# sourceMappingURL=connection.js.map