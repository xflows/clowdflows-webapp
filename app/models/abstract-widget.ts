import {AbstractInput} from "./abstract-input";
import {AbstractOutput} from "./abstract-output";
export class AbstractWidget {
    name:String;
    interactive:boolean;
    static_image:String;
    order:Number;
    outputs:AbstractOutput[];
    inputs:AbstractInput[];
}