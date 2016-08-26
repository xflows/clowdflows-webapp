import {AbstractInput} from "./abstract-input";
import {AbstractOutput} from "./abstract-output";
export class AbstractWidget {
    id:number;
    name:string;
    interactive:boolean;
    static_image:string;
    order:number;
    cfpackage:string;
    description:string;
    outputs:AbstractOutput[];
    inputs:AbstractInput[];
    hidden:boolean = false;

    special = false;
}