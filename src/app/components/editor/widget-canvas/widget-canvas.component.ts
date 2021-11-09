import {Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnInit} from '@angular/core';
import {ContextMenuComponent, ContextMenuService} from 'ngx-contextmenu';
import {UI} from "../../../services/ui-constants";
import {Output as WorkflowOutput} from "../../../models/output";
import {Input as WorkflowInput} from "../../../models/input";
import {Connection} from "../../../models/connection";
import {Widget} from "../../../models/widget";
import {Workflow} from "../../../models/workflow";
import { ContextMenuWidgetComponent } from './context-menu-widget/context-menu-widget.component';
import { ContextMenuConnectionComponent } from './context-menu-connection/context-menu-connection.component';

@Component({
    selector: 'widget-canvas',
    template: require('./widget-canvas.component.html'),
    styles: [require('./widget-canvas.component.css'),]
})
export class WidgetCanvasComponent implements OnInit {
    @Input() workflow:Workflow;
    @Output() addConnectionRequest = new EventEmitter();
    @Output() deleteConnectionRequest = new EventEmitter<Connection>();
    @Output() saveWidgetRequest = new EventEmitter<Widget>();
    @Output() saveWidgetPositionRequest = new EventEmitter<Widget>();
    @Output() runWidgetRequest = new EventEmitter<Widget>();
    @Output() runAndInteractWidgetRequest = new EventEmitter<Widget>();
    @Output() fetchOutputResultsRequest = new EventEmitter<WorkflowOutput>();
    @Output() resetWidgetRequest = new EventEmitter<Widget>();
    @Output() resetWorkflowRequest = new EventEmitter();
    @Output() copyWidgetRequest = new EventEmitter<Widget>();
    @Output() deleteWidgetRequest = new EventEmitter<Widget>();
    @Output() continueRunWorkflowRequest = new EventEmitter<String>();
    @Output() openSubprocessRequest = new EventEmitter<Widget>();
    @Output() showRecommendationsRequest = new EventEmitter<Widget>();
    @Output() saveWidgetConfigurationRequest = new EventEmitter<any>();
    ui_constants = UI;
    selectedInput:WorkflowInput = null;
    selectedOutput:WorkflowOutput = null;

    rightClickedWidget:Widget = null;

    imagedragged = false;

    widgetBounds = {
        x: 0,
        y: 0
    };
    visibleCanvasSize = {
        width: 0,
        height: 0
    };
	mouseSelectRect = {
		visible: false,
		position: {x: 0, y:0},
		width: 0,
		height: 0,
		direction: {x: "right", y: "down"},
		scrollTop: 0,
		start_position: {x: 0, y: 0}
	}

	krenarray = [1,2];

    @ViewChild('svgElement', {static: false}) public svgElement:ElementRef;
    @ViewChild('widgetCanvas', {static: false}) public widgetCanvas:ElementRef;
    @ViewChild(ContextMenuWidgetComponent, {static: false}) contextMenuWidget: ContextMenuWidgetComponent;
    @ViewChild(ContextMenuConnectionComponent, {static: false}) contextMenuConnection: ContextMenuConnectionComponent;

    constructor(private contextMenuService: ContextMenuService) { }

    ngAfterViewInit() {

        //this.visibleCanvasSize.width = this.svgElement.nativeElement.scrollWidth;
        //this.visibleCanvasSize.height = this.svgElement.nativeElement.scrollHeight;
        //this.updateCanvasBounds(); ZAKAJ SM TO RABLA?

    }

    ngOnInit() {
      this.updateCanvasBounds();
    }

	splitNodeLabel(name: string): any[] {
		const mll = 20; // max line length
		var chunks = [];

		for (var i=0; i<Math.ceil(name.length/mll); i++) {
			chunks.push(name.substring(i*mll,(i+1)*mll));
		}

		for (var i=0; i<chunks.length-1; i++) {
			if (chunks[i].slice(-1) != " " && chunks[i+1].substring(0,1) != " ") {
				var char_index:number = chunks[i].lastIndexOf(" ");
				if (char_index != -1) {
					chunks[i+1] = chunks[i].substring(char_index+1)+chunks[i+1];
					chunks[i] = chunks[i].substring(0,char_index).trim();
				}
			}
		}
    	return chunks;
  	}

    move(position:any, widgetDragged:Widget) {

		let direction_y = "down";
		let direction_x = "right";

		if (position.y < widgetDragged.y) {
			direction_y = "up";
		}
		if (position.x < widgetDragged.x) {
			direction_x = "left";
		}

		let x_diff = 0;
		let y_diff = 0;
		let min_x = Infinity;
		let min_y = Infinity;
		let max_x = 0;
		let max_y = 0;

		if (widgetDragged.selected) {

			let widgets = this.workflow.widgets;

			for (let widget of widgets) {
				if (widget.selected) {
					let x = widget.bounds.x1;
					let y = widget.bounds.y1;
					let x2 = widget.bounds.x2;
					let y2 = widget.bounds.y2;
					if (min_x > x) {
						min_x = x;
					}
					if (min_y > y) {
						min_y = y;
					}
					if (max_x < x2) {
						max_x = x2;
					}
					if (max_y < y2) {
						max_y = y2;
					}
				}
			}

			x_diff = Math.max(-min_x,position.x-widgetDragged.x);
			y_diff = Math.max(-min_y,position.y-widgetDragged.y);

			for (let widget of widgets) {
				if (widget.selected) {
					widget.x = widget.x+x_diff;
					widget.y = widget.y+y_diff;
				}
			}

		}
		else {
			x_diff = (position.x-widgetDragged.x);
			y_diff = (position.y-widgetDragged.y);
			widgetDragged.x = Math.max(0,position.x);
			widgetDragged.y = Math.max(0,position.y);
			max_x = widgetDragged.bounds.x2;
			max_y = widgetDragged.bounds.y2;
			min_x = widgetDragged.bounds.x1;
			min_y = widgetDragged.bounds.y1;
		}

        this.updateCanvasBounds();

        var widgetCanvasEl = this.widgetCanvas.nativeElement;

		//widgetCanvasEl.scrollTop = Math.max(widgetCanvasEl.scrollTop+y_diff, 0);
		//widgetCanvasEl.scrollLeft = Math.max(widgetCanvasEl.scrollLeft+x_diff,0);
    }

    updateCanvasBounds() {

        if (this.workflow.widgets.length == 0)
            return;

        this.widgetBounds.x = 0;
        this.widgetBounds.y = 0;

        for (let widget of this.workflow.widgets) {
          if (widget.bounds.x2 > this.widgetBounds.x) {
            this.widgetBounds.x = widget.bounds.x2;
          }
          if (widget.bounds.y2 > this.widgetBounds.y) {
            this.widgetBounds.y = widget.bounds.y2;
          }
        }
      }

    get canvasHeight() {
      this.visibleCanvasSize.height = Math.max(this.widgetBounds.y, this.visibleCanvasSize.height)
      return this.visibleCanvasSize.height;
    }

    get canvasWidth() {
      this.visibleCanvasSize.width = Math.max(this.widgetBounds.x, this.visibleCanvasSize.width);
      return this.visibleCanvasSize.width;
    }

	startMouseSelect(event:any) {
		if (event.target.id == "widget-canvas-svg") {
			this.mouseSelectRect.position = {x: event.layerX, y: event.layerY};
			this.mouseSelectRect.visible = true;
			this.mouseSelectRect.scrollTop = event.target.scrollTop;
			this.mouseSelectRect.start_position = {x: event.layerX, y: event.layerY};
		}
	}

	widenMouseSelect(event:any) {
		this.widenSelection(event)
	}

	widenMouseSelectScroll(event:any) {
		if (this.mouseSelectRect.visible) {
			this.widenSelection({movementX: 0, movementY: event.target.scrollTop-this.mouseSelectRect.scrollTop});
			this.mouseSelectRect.scrollTop = event.target.scrollTop;
		}
	}

	widenSelection (event:any) {
		if (this.mouseSelectRect.visible) {
			if (this.mouseSelectRect.direction.x == "right") {
				if (event.layerX < this.mouseSelectRect.position.x) {
					this.mouseSelectRect.direction.x = "left";
					this.mouseSelectRect.position.x = event.layerX;
				}
			}
			else if (this.mouseSelectRect.direction.x == "left") {
				if (event.layerX > this.mouseSelectRect.position.x) {
					this.mouseSelectRect.direction.x = "right";
					this.mouseSelectRect.position.x = this.mouseSelectRect.start_position.x;
				}
				else {
					this.mouseSelectRect.position.x = event.layerX;
				}
			}
			if (this.mouseSelectRect.direction.y == "down") {
				if (event.layerY < this.mouseSelectRect.position.y) {
					this.mouseSelectRect.direction.y = "up";
					this.mouseSelectRect.position.y = event.layerY;
				}
			}
			else if (this.mouseSelectRect.direction.y == "up") {
				if (event.layerY > this.mouseSelectRect.position.y) {
					this.mouseSelectRect.direction.y = "down";
					this.mouseSelectRect.position.y = this.mouseSelectRect.start_position.y;
				}
				else {
					this.mouseSelectRect.position.y = event.layerY;
				}
			}

			this.mouseSelectRect.width = Math.abs(this.mouseSelectRect.start_position.x-event.layerX);
			this.mouseSelectRect.height = Math.abs(this.mouseSelectRect.start_position.y-event.layerY);

			let widgets = this.workflow.widgets
			for (let widget of widgets) {
				let x = widget.x+this.ui_constants.signalWidth;
				let y = widget.y;
				let width = this.ui_constants.widgetBoxWidth;
				let height = widget.boxHeight;
				let lower_x = this.mouseSelectRect.position.x;
				let upper_x = this.mouseSelectRect.position.x+this.mouseSelectRect.width;
				let lower_y = this.mouseSelectRect.position.y;
				let upper_y = this.mouseSelectRect.position.y+this.mouseSelectRect.height;
				if (x > lower_x && x+width < upper_x && y > lower_y && y+height < upper_y) {
					widget.selected = true;
				}
				else {
					widget.selected = false;
				}
			}
		}
	}

	endMouseSelect(event:any) {
		if (this.mouseSelectRect.visible) {
      if (this.mouseSelectRect.height < 10 && this.mouseSelectRect.width < 10) {
        this.unselectObjects();
      }
			event.stopPropagation();
			this.mouseSelectRect.visible = false;
			this.mouseSelectRect.width = 0;
			this.mouseSelectRect.height = 0;
			this.mouseSelectRect.direction = {x: "right", y: "down"};
		}
	}

    saveWidget(widget:Widget) {
        this.saveWidgetRequest.emit(widget);
    }

    endMove(widgetDragged:Widget) {

		if (widgetDragged.selected) {
			for (let widget of this.workflow.widgets) {
				if (widget.selected && (widget.x != widget.start_x || widget.y != widget.start_y)) {
					this.saveWidgetPositionRequest.emit(widget);
            		widget.start_x = Math.round(widget.x);
            		widget.start_y = Math.round(widget.y);
				}
			}
		}
		else {
        	if (widgetDragged.x != widgetDragged.start_x || widgetDragged.y != widgetDragged.start_y) {
            	this.saveWidgetPositionRequest.emit(widgetDragged);
            	widgetDragged.start_x = Math.round(widgetDragged.x);
            	widgetDragged.start_y = Math.round(widgetDragged.y);
			}
        }
    }

    handleDoubleClick(widget:Widget) {
        if (widget.type == 'subprocess') {
            this.openSubprocessRequest.emit(widget);
        } else {
            this.showDialog(widget);
        }
    }

    showDialog(widget:Widget) {
        widget.showDialog = true;
    }

    showRenameDialog(widget:Widget) {
        widget.showRenameDialog = true;
    }

    select(event:any, object:any) {
        let clickedOnInput = object instanceof WorkflowInput;
        let clickedOnOutput = object instanceof WorkflowOutput;


        if (!event.shiftKey && !event.ctrlKey && !(clickedOnInput || clickedOnOutput)) {
            this.unselectObjects();
        }

        object.selected = true;
        event.stopPropagation();

        if (clickedOnInput) {
            if (this.selectedInput != null) {
                this.selectedInput.selected = false;
            }
            this.selectedInput = object;
        } else if (clickedOnOutput) {
            if (this.selectedOutput != null) {
                this.selectedOutput.selected = false;
            }
            this.selectedOutput = object;
        }

        if (clickedOnInput || clickedOnOutput) {
            if (this.selectedOutput != null && this.selectedInput != null) {
                this.newConnection();
            }
        }

        // if (object instanceof Widget) {
        this.showRecommendationsRequest.emit(object);
        // }
    }

    newConnection() {
        this.addConnectionRequest.emit({
            workflow: this.workflow,
            selectedInput: this.selectedInput,
            selectedOutput: this.selectedOutput,
            canvasTab: this
        });
    }

    unselectObjects() {
        for (let widget of this.workflow.widgets) {
            widget.selected = false;
        }
        for (let conn of this.workflow.connections) {
            conn.selected = false;
        }
        this.unselectSignals();
        this.showRecommendationsRequest.emit(null);
    }

    unselectSignals() {
        if (this.selectedInput != null) {
            this.selectedInput.selected = false;
            this.selectedInput = null;
        }
        if (this.selectedOutput != null) {
            this.selectedOutput.selected = false;
            this.selectedOutput = null;
        }
    }

    deleteSelectedObjects() {
        for (let widget of this.workflow.widgets) {
            if (widget.selected) {
                this.deleteWidget(widget);
            }
        }

        for (let conn of this.workflow.connections) {
            if (conn.selected) {
                this.deleteConnection(conn);
            }
        }
    }

    runWidget(widget:Widget) {
        this.runWidgetRequest.emit(widget);
    }

    runWidgetWithInteraction(widget:Widget) {
        this.runAndInteractWidgetRequest.emit(widget);
    }

    fetchOutputResults(output:WorkflowOutput) {
        this.fetchOutputResultsRequest.emit(output);
    }

    resetWidget(widget:Widget) {
        this.resetWidgetRequest.emit(widget);
    }

    resetWorkflow() {
        this.resetWorkflowRequest.emit("");
    }

    copyWidget(widget:Widget) {
        this.copyWidgetRequest.emit(widget);
    }

    deleteWidget(widget:Widget) {
        this.deleteWidgetRequest.emit(widget);
    }

    deleteConnection(connection:Connection) {
        this.deleteConnectionRequest.emit(connection);
    }

    continueRunWorkflow(event:any) {
        this.continueRunWorkflowRequest.emit(event);
    }

    saveWidgetConfiguration(event:any) {
        this.saveWidgetConfigurationRequest.emit(event);
    }

    handleShortcuts(event:any) {
        if (event.keyCode == 46) {  // Delete

          // check no dialogs are open
          let noDialogs = true;
          for (let widget of this.workflow.widgets) {
              if (widget.showDialog)
                noDialogs = false;
          }

          if (noDialogs == true) {
            this.deleteSelectedObjects();
          }

        } else if (event.keyCode == 113) {  // F2 - rename
            for (let widget of this.workflow.widgets) {
                if (widget.selected)
                    this.showRenameDialog(widget);
            }
        }
    }

    changeSaveResults(widget:Widget) {
      if (widget.must_save == true) {
        alert("This widget must save results!")
      }
      else {
        widget.save_results = !(widget.save_results);
        widget.finished = false;
        this.saveWidget(widget);
      }
    }

    dragimagestart() {
      this.imagedragged = true;
      return false;
    }

    dragimagestop(widget:Widget) {
      if (this.imagedragged == false) {
        this.changeSaveResults(widget)
      }
      this.imagedragged = false;
    }

    changeRightClickedWidget(widget:Widget) {
      this.rightClickedWidget = widget;
    }

    public onContextMenu($event:MouseEvent, item:any, type:string):void {

      $event.preventDefault();
      $event.stopPropagation();

        if (type == "widget") {
          this.contextMenuService.show.next({
            contextMenu: this.contextMenuWidget.contextMenu,
            event: $event,
            item: item
          });
        }
        else if (type == "connection") {
          this.contextMenuService.show.next({
            contextMenu: this.contextMenuConnection.contextMenu,
            event: $event,
            item: item
          });
        }
    }
}
