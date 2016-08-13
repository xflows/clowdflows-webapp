import {Component, Output, EventEmitter, Input} from '@angular/core';
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

    constructor(private clowdflowsDataService:ClowdFlowsDataService) {}

    closeDialog() {
        this.widget.showDialog = false;
    }

    closeRenameDialog() {
        this.widget.showRenameDialog = false;
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
