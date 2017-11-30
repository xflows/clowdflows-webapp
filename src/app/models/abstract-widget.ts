import {AbstractInput} from "./abstract-input";
import {AbstractOutput} from "./abstract-output";
export class AbstractWidget {
    id:number;
    name:string;
    interactive:boolean;
    visualization:boolean;
    static_image:string;
    order:number;
    cfpackage:string;
    description:string;
    outputs:AbstractOutput[];
    inputs:AbstractInput[];
    hidden:boolean = false;

    recommended_input:boolean = false;
    recommended_output:boolean = false;

    special = false;
}