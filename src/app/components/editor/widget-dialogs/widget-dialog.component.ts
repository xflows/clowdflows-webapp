import {Component, Output, EventEmitter, Input, ViewChild, ElementRef} from '@angular/core';
import {Widget} from "../../../models/widget";
import {ClowdFlowsDataService} from "../../../services/clowdflows-data.service";
import {Input as WidgetInput} from "../../../models/input";
import {Output as WidgetOutput} from "../../../models/output";
import {LoggerService} from "../../../services/logger.service";
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions, UploadStatus } from 'ngx-uploader';

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
    @ViewChild('formContainer', {static: false}) private formContainer:ElementRef;

    fileToUpload: UploadFile;
    uploadInput: EventEmitter<UploadInput>;
    humanizeBytes: Function;
    options: UploaderOptions;

    // Configuration variables
    listInputs:Array<WidgetInput> = [];
    listParameters:Array<WidgetInput> = [];
    listOutputs:Array<WidgetOutput> = [];
    benchmark:boolean = false;


    constructor(private clowdflowsDataService:ClowdFlowsDataService,
                private loggerService:LoggerService) {

                  this.options = { concurrency: 1, maxUploads: 1 };
    this.uploadInput = new EventEmitter<UploadInput>();
    this.humanizeBytes = humanizeBytes;
    this.fileToUpload = null;
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

    toggleSaveResults(event:any) {
        this.widget.save_results = event.currentTarget.checked;
        this.widget.finished = false;
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

  onUploadOutput(output: UploadOutput, input:WidgetInput): void {
    if (output.type === 'allAddedToQueue') {
      let credentialOptions = this.clowdflowsDataService.getFileUploadOption(input);
      const event: UploadInput = {
        type: 'uploadFile',
        url: credentialOptions.url,
        headers: { 'Authorization': 'Token ' + credentialOptions.authToken },
        method: 'POST',
        file: this.fileToUpload
      };

      this.uploadInput.emit(event);
    } else if (output.type === 'addedToQueue' && typeof output.file !== 'undefined') {
      this.fileToUpload = output.file;
    } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
      this.fileToUpload = output.file;
    } else if (output.type === 'cancelled' || output.type === 'removed') {
      this.fileToUpload = null;
    }
    else if (output.type === 'rejected' && typeof output.file !== 'undefined') {
      console.log(output.file.name + ' rejected');
    }

    if (this.fileToUpload.progress.status == UploadStatus.Done) {
      if (this.fileToUpload.response) {
          let mssg = this.fileToUpload.response;
          let error = this.loggerService.reportMessage(mssg);
          if (!error) {
              this.fileToUpload = mssg;
          }
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
            case 'select-multiple':
                let options = elem.options;
                let values = [];
                for (let j = 0; j < options.length; j++) {
                    if (options[j].selected) {
                        values.push(options[j].value);
                    }
                }
                formParams[elem.name] = values;
                break;
            default:
                formParams[elem.name] = setOrPush(formParams[elem.name], elem.value);
        }
    }
    return formParams;
}
