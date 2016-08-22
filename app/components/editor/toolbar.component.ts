import {Component, Output, EventEmitter, Input, ViewChild} from '@angular/core';
import {MODAL_DIRECTIVES, BS_VIEW_PROVIDERS, ModalDirective} from 'ng2-bootstrap/ng2-bootstrap';

@Component({
    selector: 'toolbar',
    templateUrl: 'app/components/editor/toolbar.component.html',
    styleUrls: ['app/components/editor/toolbar.component.css'],
    directives: [MODAL_DIRECTIVES],
    viewProviders: [BS_VIEW_PROVIDERS],
})
export class ToolbarComponent {
    @Input() workflow:any;
    @Output() runWorkflowRequest = new EventEmitter();
    @Output() saveWorkflowRequest = new EventEmitter();
    @Output() newWorkflowRequest = new EventEmitter();

    @ViewChild('newWorkflow') public newWorkflowModal: ModalDirective;
    @ViewChild('openWorkflow') public openWorkflowModal: ModalDirective;
    @ViewChild('saveWorkflow') public saveWorkflowModal: ModalDirective;

    showNewWorkflowModal():void {
        this.newWorkflowModal.show();
    }

    showOpenWorkflowModal():void {
        this.openWorkflowModal.show();
    }

    showSaveWorkflowModal():void {
        this.saveWorkflowModal.show();
    }

    todo() {

    }

    togglePublicWorkflow(event) {
        var isChecked = event.currentTarget.checked;
        this.workflow.is_public = isChecked ? 'true' : 'false';
    }

    runWorkflow() {
        this.runWorkflowRequest.emit("");
    }

    saveWorkflow() {
        this.saveWorkflowRequest.emit("");
    }

    newWorkflow() {
        this.newWorkflowRequest.emit("");
    }
}
