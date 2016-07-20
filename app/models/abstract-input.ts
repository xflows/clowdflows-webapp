import {AbstractOption} from "./abstract-option";
export class AbstractInput {
    name:String;
    short_name:String;
    description:String;
    variable:String;
    required:boolean;
    parameter:boolean;
    multi:boolean;
    default:String;
    parameter_type:String;
    order:Number;
    options: AbstractOption[];
}