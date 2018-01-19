import {Widget} from "./widget";
import {Connection} from "./connection";
import {CanvasElement} from "./canvas-element";

export class Output extends CanvasElement{

    public value:any = null;
    public connection:Connection = null;

    constructor(
        public id:number,
        public url:string,
        // public deserialized_value:any,
        public name:string,
        public short_name:string,
        public description:string,
        public variable:string,
        public order:number,
        public abstract_output_id:number,
        public inner_output:string,
        public outer_output:string,
        public widget:Widget
    ) {
        super()
    }

    get x():number {
        return 96;
    }

    get y():number {
        return (this.order - 1)*(10+16) + 10
    }
}