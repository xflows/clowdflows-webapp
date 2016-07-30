import {Option} from "./option";
export class Input {
    constructor(
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
        public inner_output:string,
        public outer_output:string,
        public options:Option[]
    ) {

    }

    get x():number {
        return 0;
    }

    get y():number {
        return (this.order - 1)*(10+16) + 10
    }
}