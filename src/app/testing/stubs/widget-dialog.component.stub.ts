import {Component, Input, Output, EventEmitter} from "@angular/core";
import {Widget} from "../../models/widget";


@Component({
    selector: 'widget-dialog',
    template: ''
})
export class WidgetDialogStub {
    @Input() widget:Widget;
    @Output() continueRunWorkflowRequest = new EventEmitter<String>();
    @Output() saveWidgetRequest = new EventEmitter<Widget>();
    @Output() saveWidgetConfigurationRequest = new EventEmitter<any>();
}
