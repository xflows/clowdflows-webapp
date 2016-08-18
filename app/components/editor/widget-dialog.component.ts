import {Component, Output, EventEmitter, Input, ViewChild, ElementRef} from '@angular/core';
import {Widget} from "../../models/widget";
import {ClowdFlowsDataService} from "../../services/clowdflows-data.service";
import {Input as WidgetInput} from "../../models/input";

@Component({
    selector: 'widget-dialog',
    templateUrl: 'app/components/editor/widget-dialog.component.html',
    styleUrls: ['app/components/editor/widget-dialog.component.css'],
    directives: []
})
export class WidgetDialogComponent {
    @Input() widget:Widget;
    @ViewChild('formContainer') private formContainer:ElementRef;

    constructor(private clowdflowsDataService:ClowdFlowsDataService) {}

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

    applyInteraction() {
        let data = getFormResults(this.formContainer.nativeElement.getElementsByTagName('form')[0]);
        this.clowdflowsDataService.finishInteractionWidget(this.widget, data);
        this.widget.showInteractionDialog = false;
    }

    closeResults() {
        this.widget.showResults = false;
    }

    closeHelp() {
        this.widget.showHelp = false;
    }

    applyParameters() {
        this.clowdflowsDataService.saveParameters(this.widget);
        this.widget.showDialog = false;
    }

    saveName() {
        this.clowdflowsDataService.saveWidget(this.widget);
        this.widget.showRenameDialog = false;
    }

    onCheckboxChange(parameter:WidgetInput, event) {
        var isChecked = event.currentTarget.checked;
        parameter.deserialized_value = isChecked ? 'true' : 'false';
    }
}

function setOrPush(target, val) {
    var result = val;
    if (target) {
        result = [target];
        result.push(val);
    }
    return result;
}

function getFormResults(formElement) {
    var formElements = formElement.elements;
    var formParams = {};
    var i = 0;
    var elem = null;
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