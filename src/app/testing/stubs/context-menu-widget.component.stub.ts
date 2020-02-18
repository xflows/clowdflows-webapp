import {Component, Input, Output, EventEmitter} from "@angular/core";
import {Widget} from "../../models/widget";
import {Output as WorkflowOutput} from "../../models/output";

@Component({
    selector: 'context-menu-widget',
    template: ''
})
export class ContextMenuWidgetStub {

  @Output() runWidgetRequest = new EventEmitter<Widget>();
  @Output() runWidgetWithInteractionRequest = new EventEmitter<Widget>();
  @Output() fetchOutputResultsRequest = new EventEmitter<WorkflowOutput>();
  @Output() resetWidgetRequest = new EventEmitter<Widget>();
  @Output() resetWorkflowRequest = new EventEmitter();
  @Output() copyWidgetRequest = new EventEmitter<Widget>();
  @Output() deleteWidgetRequest = new EventEmitter<Widget>();

}
