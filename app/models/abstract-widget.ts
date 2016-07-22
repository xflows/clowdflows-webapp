import {AbstractInput} from "./abstract-input";
import {AbstractOutput} from "./abstract-output";
export class AbstractWidget {

    hidden:boolean = false;

    constructor(
        public name:string,
        public interactive:boolean,
        public static_image:string,
        public order:number,
        public cfpackage:string,
        public outputs:AbstractOutput[],
        public inputs:AbstractInput[]
    ) { }
}