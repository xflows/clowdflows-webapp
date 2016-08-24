import {Component, Output, EventEmitter, Input, ViewChild} from '@angular/core';
import {MODAL_DIRECTIVES, BS_VIEW_PROVIDERS, ModalDirective} from 'ng2-bootstrap/ng2-bootstrap';

@Component({
    selector: 'toolbar',
    template: require('./toolbar.component.html'),
    styles: [require('./toolbar.component.css'),],
    directives: [MODAL_DIRECTIVES],
    viewProviders: [BS_VIEW_PROVIDERS],
})
export class ToolbarComponent {
    @Input() workflow:any;
    @Output() runWorkflowRequest = new EventEmitter();
    @Output() saveWorkflowRequest = new EventEmitter();
    @Output() createWorkflowRequest = new EventEmitter();

    @ViewChild('createWorkflowModal') public createWorkflowModal: ModalDirective;
    @ViewChild('openWorkflowModal') public openWorkflowModal: ModalDirective;
    @ViewChild('saveWorkflowModal') public saveWorkflowModal: ModalDirective;

    showCreateWorkflowModal():void {
        this.createWorkflowModal.show();
    }

    showOpenWorkflowModal():void {
        this.openWorkflowModal.show();
    }

    showSaveWorkflowModal():void {
        this.saveWorkflowModal.show();
    }

    todo() {

    }

    togglePublicWorkflow(event:any) {
        var isChecked = event.currentTarget.checked;
        this.workflow.is_public = isChecked ? 'true' : 'false';
    }

    runWorkflow() {
        this.runWorkflowRequest.emit("");
    }

    saveWorkflow() {
        this.saveWorkflowRequest.emit("");
    }

    createWorkflow() {
        this.createWorkflowRequest.emit("");
        this.createWorkflowModal.hide();
    }
}
