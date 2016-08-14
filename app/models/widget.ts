import {Output} from "./output";
import {Input} from "./input";
import {UI} from "../services/ui-constants"
import {Workflow} from "./workflow";

export class Widget {

    inputs:Input[];
    parameters:Input[];
    outputs:Output[];
    showDialog:boolean = false;
    showResults:boolean = false;
    showRenameDialog:boolean = false;
    showHelp:boolean = false;
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
        public description:string,
        inputs:any[],
        outputs:any[],
        public workflow:Workflow
    ){
        // Keep proper inputs and parameters separately
        this.inputs = new Array<Input>();
        this.parameters = new Array<Input>();
        for (let input of inputs) {
            let input_obj:Input = new Input(input.id, input.url, input.deserialized_value, input.name, input.short_name,
                                            input.description, input.variable, input.required, input.parameter,
                                            input.multi_id, input.parameter_type, input.order, input.inner_output,
                                            input.outer_output, input.options, this);
            if (input.parameter) {
                this.parameters.push(input_obj);
            } else {
                this.inputs.push(input_obj);
            }
        }
        this.outputs = new Array<Output>();
        for (let output of outputs) {
            this.outputs.push(new Output(output.url, output.name, output.short_name,
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

    clone():Widget {
        let widgetCopy:Widget = Object.create(this);
        widgetCopy.id = -1;
        widgetCopy.url = '';
        widgetCopy.finished = false;
        widgetCopy.inputs = new Array<Input>();
        widgetCopy.parameters = new Array<Input>();
        widgetCopy.outputs = new Array<Output>();
        for (let input of this.inputs) {
            let inputCopy:Input = input.clone();
            inputCopy.widget = widgetCopy;
            widgetCopy.inputs.push(inputCopy);
        }
        for (let parameter of this.parameters) {
            let parameterCopy:Input = parameter.clone();
            parameterCopy.widget = widgetCopy;
            widgetCopy.parameters.push(parameterCopy);
        }
        for (let output of this.outputs) {
            let outputCopy:Output = output.clone();
            outputCopy.widget = widgetCopy;
            widgetCopy.outputs.push(outputCopy);
        }
        return widgetCopy;
    }

    toDict(withIds:boolean = true) {
        var serializedInputs = [];
        var serializedOutputs = [];
        for (let input of this.inputs) {
            serializedInputs.push(input.toDict(false));
        }
        for (let parameter of this.parameters) {
            serializedInputs.push(parameter.toDict(false));
        }
        for (let output of this.outputs) {
            serializedOutputs.push(output.toDict(false));
        }
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
            progress: this.progress,
            inputs: serializedInputs,
            outputs: serializedOutputs
        };
        if (withIds) {
            serialized['id'] = this.id;
        }
        return serialized;
    }
}