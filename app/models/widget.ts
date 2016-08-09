import {Output} from "./output";
import {Input} from "./input";
import {UI} from "../services/ui-constants"
import {Workflow} from "./workflow";

export class Widget {

    inputs:Input[];
    parameters:Input[];
    outputs:Output[];
    showDialog:boolean = false;
    selected:boolean = false;

    constructor(
        public id:number,
        public url:string,
        public x:number,
        public y:number,
        public name:string,
        public finished:boolean,
        public error:boolean,
        public running:boolean,
        public interaction_waiting:boolean,
        public type:string,
        public progress:number,
        public abstract_widget:number,
        inputs:any[],
        parameters:any[],
        outputs:any[],
        public workflow:Workflow
    ){
        this.inputs = new Array<Input>();
        for (let input of inputs) {
            let input_obj:Input = new Input(input.id, input.url, input.deserialized_value, input.name, input.short_name,
                                            input.description, input.variable, input.required, input.parameter,
                                            input.multi_id, input.parameter_type, input.order, input.inner_output,
                                            input.outer_output, input.options, this);
            this.inputs.push(input_obj);
        }
        this.parameters = new Array<Input>();
        for (let input of parameters) {
            let input_obj:Input = new Input(input.id, input.url, input.deserialized_value, input.name, input.short_name,
                input.description, input.variable, input.required, input.parameter,
                input.multi_id, input.parameter_type, input.order, input.inner_output,
                input.outer_output, input.options, this);
            this.parameters.push(input_obj);
        }
        this.outputs = new Array<Output>();
        for (let output of outputs) {
            this.outputs.push(new Output(output.url, output.deserialized_value, output.name, output.short_name,
                                         output.description, output.variable, output.order,
                                         output.inner_output, output.outer_output, this));
        }
    }

    get boxHeight() {
        return 50 + (UI.signalHeight + 10)*(this.inputs.length > this.outputs.length ? this.inputs.length - 1 : this.outputs.length - 1);
    }

    get labelY() {
        return this.boxHeight + 20;
    }

    toJSON(withIds:boolean = true) {
        let serialized = {
            workflow: this.workflow.url,
            x: this.x,
            y: this.y,
            name: this.name,
            abstract_widget: this.abstract_widget,
            finished: this.finished,
            error: this.error,
            running: this.running,
            interaction_waiting: this.interaction_waiting,
            type: this.type,
            progress: this.progress
        };
        if (withIds) {
            serialized['id'] = this.id;
        }
        return JSON.stringify(serialized);
    }
}