import {Component, Output, EventEmitter, Input, ViewChild, ElementRef} from '@angular/core';
import {Widget} from "../../../models/widget";
import {ClowdFlowsDataService} from "../../../services/clowdflows-data.service";
import {Input as WidgetInput} from "../../../models/input";
import {Output as WidgetOutput} from "../../../models/output";
import {LoggerService} from "../../../services/logger.service";

@Component({
    selector: 'widget-dialog',
    template: require('./widget-dialog.component.html'),
    styles: [require('./widget-dialog.component.css'),],
})
export class WidgetDialogComponent {
    @Input() widget:Widget;
    @Output() continueRunWorkflowRequest = new EventEmitter<String>();
    @Output() saveWidgetRequest = new EventEmitter<Widget>();
    @Output() saveWidgetConfigurationRequest = new EventEmitter<any>();
    @Output() resetWidgetRequest = new EventEmitter<any>();
    @ViewChild('formContainer') private formContainer:ElementRef;

    uploadFile:any;

    // Configuration variables
    listInputs:Array<WidgetInput> = [];
    listParameters:Array<WidgetInput> = [];
    listOutputs:Array<WidgetOutput> = [];
    benchmark:boolean = false;


    constructor(private clowdflowsDataService:ClowdFlowsDataService,
                private loggerService:LoggerService) {
    }

    closeDialog() {
        this.widget.showDialog = false;
    }

    closeRenameDialog() {
        this.widget.showRenameDialog = false;
    }

    closeVisualizationDialog() {
        this.widget.showVisualizationDialog = false;
    }

    closeInteractionDialog() {
        this.widget.showInteractionDialog = false;
    }

    showInputDesignation() {
        this.listInputs = this.widget.inputs.slice();
        this.listParameters = this.widget.parameters.slice();
        this.listOutputs = this.widget.outputs.slice();
        this.benchmark = this.widget.hasBenchmark;
        this.widget.showInputDesignation = true;
        return false;
    }

    closeInputDesignation() {
        this.widget.showInputDesignation = false;
    }

    applyInputDesignation() {
        var configuration = {
            'inputs': this.listInputs.slice(),
            'parameters': this.listParameters.slice(),
            'outputs': this.listOutputs.slice(),
            'benchmark': this.benchmark
        };
        this.saveWidgetConfigurationRequest.emit({
            widget: this.widget,
            configuration: configuration
        });
    }

    toggleBenchmarkOutput(widget:Widget, event:any) {
        this.benchmark = event.currentTarget.checked;
    }

    applyInteraction() {
        let data = getFormResults(this.formContainer.nativeElement.getElementsByTagName('form')[0]);
        this.clowdflowsDataService.finishInteractionWidget(this.widget, data)
            .then(response => {
                this.continueRunWorkflowRequest.emit("");
            });
        this.widget.showInteractionDialog = false;
    }

    closeResults() {
        this.widget.showResults = false;
        this.saveWidgetRequest.emit(this.widget);
    }

    toggleSaveResults(widget:Widget, event:any) {
        this.widget.save_results = event.currentTarget.checked;
    }

    closeHelp() {
        this.widget.showHelp = false;
    }

    applyParameters() {
        this.clowdflowsDataService.saveParameters(this.widget);
        this.resetWidgetRequest.emit(this.widget);
        this.widget.showDialog = false;
    }

    saveName() {
        this.saveWidgetRequest.emit(this.widget);
        this.widget.showRenameDialog = false;
    }

    onCheckboxChange(parameter:WidgetInput, event:any) {
        var isChecked = event.currentTarget.checked;
        parameter.deserialized_value = isChecked ? 'true' : 'false';
    }

    fileUploadOptions(input:WidgetInput):any {
        return this.clowdflowsDataService.getFileUploadOption(input);
    }

    handleUpload(data:any):void {
        if (data && data.response) {
            data = JSON.parse(data.response);
            let error = this.loggerService.reportMessage(data);
            if (!error) {
                this.uploadFile = data;
            }
        }
    }
}

function setOrPush(target:any, val:any) {
    var result = val;
    if (target) {
        result = [target];
        result.push(val);
    }
    return result;
}

function getFormResults(formElement:any) {
    var formElements = formElement.elements;
    var formParams = {};
    var i = 0;
    var elem:any = null;
    for (i = 0; i < formElements.length; i += 1) {
        elem = formElements[i];
        switch (elem.type) {
            case 'submit':
                break;
            case 'radio':
                if (elem.checked) {
                    formParams[elem.name] = elem.value;
                }
                break;
            case 'checkbox':
                if (elem.checked) {
                    formParams[elem.name] = setOrPush(formParams[elem.name], elem.value);
                }
                break;
            default:
                formParams[elem.name] = setOrPush(formParams[elem.name], elem.value);
        }
    }
    return formParams;
}