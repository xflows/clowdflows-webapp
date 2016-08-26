import {Widget} from "./widget";
import {Connection} from "./connection";

export class Workflow {

    public widgets:Widget[];
    public connections:Connection[];

    public active = false;

    constructor(public id:number,
                public url:string,
                widgets:any[],
                connections:any[],
                public is_subprocess:boolean,
                public name:string,
                public is_public:boolean,
                public owner:boolean,
                public description:string,
                public widget:string,
                public template_parent:string) {
        this.widgets = new Array<Widget>();
        for (let widget of widgets) {
            this.widgets.push(Widget.createFromJSON(widget, this));
        }

        this.connections = new Array<Connection>();
        for (let connection of connections) {
            let input_widget:Widget = this.widgets.find(widget => widget.url == connection.input_widget);
            let output_widget:Widget = this.widgets.find(widget => widget.url == connection.output_widget);
            let conn = new Connection(connection.url, output_widget, input_widget, connection.output,
                connection.input, this);
            this.connections.push(conn);
        }
    }
}