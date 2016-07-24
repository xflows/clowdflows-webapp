import {Widget} from "./widget";
import {Connection} from "./connection";
export class Workflow {

    widgets:Widget[];
    connections:Connection[];

    constructor(
        public url:string,
        widgets:any[],
        connections:any[],
        public is_subprocess:boolean,
        public name:string,
        public is_public:boolean,
        public description:string,
        public widget:string,
        public template_parent:string
    ) {
        this.widgets = new Array<Widget>();
        for (let widget of widgets) {
            this.widgets.push(new Widget(widget.url, widget.x, widget.y, widget.name, widget.finished, widget.error,
                                         widget.runing, widget.interaction_waiting, widget.type, widget.progress,
                                         widget.inputs, widget.parameters, widget.outputs));
        }

        this.connections  = new Array<Connection>();
        for (let connection of connections) {
            let input_widget:Widget = this.widgets.find(widget => widget.url == connection.input_widget);
            let output_widget:Widget = this.widgets.find(widget => widget.url == connection.output_widget);
            this.connections.push(new Connection(connection.url, output_widget, input_widget, connection.output,
                                                 connection.input, this));
        }
    }
}