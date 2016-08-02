import {Component, Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'toolbar',
    templateUrl: 'app/components/editor/toolbar.component.html',
    styleUrls: ['app/components/editor/toolbar.component.css'],
    directives: []
})
export class ToolbarComponent {
    @Output() runWorkflowRequest = new EventEmitter();

    runWorkflow() {
        this.runWorkflowRequest.emit("run");
    }
}
