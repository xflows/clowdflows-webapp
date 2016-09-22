import {Component, Output, EventEmitter, Input, ViewChild} from '@angular/core';
import {ModalDirective} from 'ng2-bootstrap/ng2-bootstrap';
import {Workflow} from "../../../models/workflow";

@Component({
    selector: 'toolbar',
    template: require('./toolbar.component.html'),
    styles: [require('./toolbar.component.css'),]
})
export class ToolbarComponent {
    @Input() workflow:Workflow;
    @Input() userWorkflows:Workflow[];
    @Output() runWorkflowRequest = new EventEmitter();
    @Output() saveWorkflowRequest = new EventEmitter();
    @Output() createWorkflowRequest = new EventEmitter();

    @ViewChild('createWorkflowModal') public createWorkflowModal: ModalDirective;
    @ViewChild('openWorkflowModal') public openWorkflowModal: ModalDirective;
    @ViewChild('saveWorkflowModal') public saveWorkflowModal: ModalDirective;

    constructor() {}

    showCreateWorkflowModal():void {
        this.createWorkflowModal.show();
    }

    showOpenWorkflowModal():void {
        this.openWorkflowModal.show();
    }

    showSaveWorkflowModal():void {
        this.saveWorkflowModal.show();
    }

    runWorkflow() {
        this.runWorkflowRequest.emit("");
    }

    saveWorkflow() {
        this.saveWorkflowRequest.emit("");
        this.saveWorkflowModal.hide();
    }

    createWorkflow() {
        this.createWorkflowRequest.emit("");
        this.createWorkflowModal.hide();
    }
}
