import {AbstractOption} from "./abstract-option";
export class AbstractInput {
    name:string;
    short_name:string;
    description:string;
    variable:string;
    required:boolean;
    parameter:boolean;
    multi:boolean;
    default:string;
    parameter_type:string;
    order:number;
    options: AbstractOption[];
}