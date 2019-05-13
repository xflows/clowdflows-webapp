import {Component, Output, EventEmitter, Input, ViewChild} from '@angular/core';
import {ModalDirective} from 'ng2-bootstrap';
import {Workflow} from "../../../models/workflow";

@Component({
    selector: 'toolbar',
    template: require('./toolbar.component.html'),
    styles: [require('./toolbar.component.css'),]
})
export class ToolbarComponent {
    @Input() workflow:Workflow;
    @Input() userWorkflows:Workflow[];
    @Input() saveWorkflowAsPNG:any;
    @Output() runWorkflowRequest = new EventEmitter();
    @Output() saveWorkflowRequest = new EventEmitter<Workflow>();
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
      let widgets = this.workflow.widgets;
      let widgetRunning = false;
      for (let i=0; i<widgets.length; i++) {
        if (widgets[i].running) {
          widgetRunning = true;
          break;
        }
      }

      if (widgetRunning) {
        alert("At least one widget is running. Please wait for it to finish.")
      }
      else {
        this.runWorkflowRequest.emit("");
      }
    }

    saveWorkflow() {
        this.saveWorkflowRequest.emit(this.workflow);
        this.saveWorkflowModal.hide();
    }

    createWorkflow() {
        this.createWorkflowRequest.emit("");
        this.createWorkflowModal.hide();
    }
}
