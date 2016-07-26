import {Component, Output, EventEmitter, Input} from '@angular/core';
import {Widget} from "../models/widget";

@Component({
    selector: 'widget-dialog',
    templateUrl: 'app/components/widget-dialog.component.html',
    styleUrls: ['app/components/widget-dialog.component.css'],
    directives: []
})
export class WidgetDialogComponent {
    @Input() widget:Widget;
}
