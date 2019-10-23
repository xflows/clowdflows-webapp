import {Component, Output, EventEmitter, Input, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {Workflow} from "../../../models/workflow";
import { faFile, faFolderOpen, faSave } from '@fortawesome/free-regular-svg-icons';
import { faPlay, faCamera } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'toolbar',
    template: require('./toolbar.component.html'),
    styles: [require('./toolbar.component.css'),]
})
export class ToolbarComponent {

    faPlay = faPlay
    faCamera = faCamera
    faFile = faFile
    faFolderOpen = faFolderOpen
    faSave = faSave

    @Input() workflow:Workflow;
    @Input() userWorkflows:Workflow[];
    @Input() saveWorkflowAsPNG:any;
    @Output() runWorkflowRequest = new EventEmitter();
    @Output() saveWorkflowRequest = new EventEmitter<Workflow>();
    @Output() createWorkflowRequest = new EventEmitter();

    @ViewChild('createWorkflowModal', {static: false}) public createWorkflowModal: ModalDirective;
    @ViewChild('openWorkflowModal', {static: false}) public openWorkflowModal: ModalDirective;
    @ViewChild('saveWorkflowModal', {static: false}) public saveWorkflowModal: ModalDirective;

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
