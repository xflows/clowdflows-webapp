import {AbstractInput} from "./abstract-input";
import {AbstractOutput} from "./abstract-output";
export class AbstractWidget {
    name:string;
    interactive:boolean;
    static_image:string;
    order:number;
    outputs:AbstractOutput[];
    inputs:AbstractInput[];
    hidden:boolean = false;
}