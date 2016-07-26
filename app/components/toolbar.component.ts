import {Component, Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'toolbar',
    templateUrl: 'app/components/toolbar.component.html',
    styleUrls: ['app/components/toolbar.component.css'],
    directives: []
})
export class ToolbarComponent {
    @Output() runWorkflowRequest = new EventEmitter();

    runWorkflow() {
        this.runWorkflowRequest.emit("run");
    }
}
