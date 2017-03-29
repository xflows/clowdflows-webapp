import {Option} from "./option";
import {Widget} from "./widget";
import {Connection} from "./connection";
export class Input {

    public selected:boolean = false;
    public connection:Connection = null;

    constructor(
        public id:number,
        public url:string,
        public deserialized_value:any,
        public name:string,
        public short_name:string,
        public description:string,
        public variable:string,
        public required:boolean,
        public parameter:boolean,
        public multi_id:number,
        public parameter_type:string,
        public order:number,
        public abstract_input_id:number,
        public inner_output:string,
        public outer_output:string,
        public options:Option[],
        public widget:Widget
    ) {

    }

    get x():number {
        return 0;
    }

    get y():number {
        return (this.order - 1)*(10+16) + 10
    }
}