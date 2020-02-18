import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ContextMenuComponent, ContextMenuService } from 'ngx-contextmenu';
import {Widget} from "../../../../models/widget";
import {Output as WorkflowOutput} from "../../../../models/output";

@Component({
  selector: 'context-menu-widget',
  templateUrl: './context-menu-widget.component.html',
  styleUrls: ['./context-menu-widget.component.css']
})
export class ContextMenuWidgetComponent {

  @ViewChild('widgetMenu', {static: false}) contextMenu: ContextMenuComponent;

  @Input() widget:Widget;

  @Output() runWidgetRequest = new EventEmitter<Widget>();
  @Output() runWidgetWithInteractionRequest = new EventEmitter<Widget>();
  @Output() fetchOutputResultsRequest = new EventEmitter<WorkflowOutput>();
  @Output() resetWidgetRequest = new EventEmitter<Widget>();
  @Output() resetWorkflowRequest = new EventEmitter();
  @Output() copyWidgetRequest = new EventEmitter<Widget>();
  @Output() deleteWidgetRequest = new EventEmitter<Widget>();
  @Output() changeSaveResultsRequest = new EventEmitter<Widget>();

  constructor(private contextMenuService: ContextMenuService) {}

  runWidget(widget:Widget) {
      this.runWidgetRequest.emit(widget);
  }

  runWidgetWithInteraction(widget:Widget) {
      this.runWidgetWithInteractionRequest.emit(widget);
  }

  showDialog(widget:Widget) {
      widget.showDialog = true;
  }

  showResults(widget:Widget) {
      for (let output of widget.outputs) {
          this.fetchOutputResultsRequest.emit(output);
      }
      widget.showResults = true;
  }

  resetWidget(widget:Widget) {
      this.resetWidgetRequest.emit(widget);
  }

  resetWorkflow() {
      this.resetWorkflowRequest.emit("");
  }

  showRenameDialog(widget:Widget) {
      widget.showRenameDialog = true;
  }

  copyWidget(widget:Widget) {
      this.copyWidgetRequest.emit(widget);
  }

  deleteWidget(widget:Widget) {
      this.deleteWidgetRequest.emit(widget);
  }

  changeSaveResults(widget:Widget) {
    this.changeSaveResultsRequest.emit(widget);
  }

  showHelp(widget:Widget) {
      widget.showHelp = true;
  }

}
