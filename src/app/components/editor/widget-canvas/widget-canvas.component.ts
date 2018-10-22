import {Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnInit} from '@angular/core';
import {ContextMenuService} from 'angular2-contextmenu/angular2-contextmenu';
import {UI} from "../../../services/ui-constants";
import {Output as WorkflowOutput} from "../../../models/output";
import {Input as WorkflowInput} from "../../../models/input";
import {Connection} from "../../../models/connection";
import {Widget} from "../../../models/widget";
import {Workflow} from "../../../models/workflow";

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
    @Output() deleteWidgetRequest = new EventEmitter<Widget>();
    @Output() resetWidgetRequest = new EventEmitter<Widget>();
    @Output() resetWorkflowRequest = new EventEmitter();
    @Output() copyWidgetRequest = new EventEmitter<Widget>();
    @Output() runWidgetRequest = new EventEmitter<Widget>();
    @Output() runAndInteractWidgetRequest = new EventEmitter<Widget>();
    @Output() continueRunWorkflowRequest = new EventEmitter<String>();
    @Output() fetchOutputResultsRequest = new EventEmitter<WorkflowOutput>();
    @Output() openSubprocessRequest = new EventEmitter<Widget>();
    @Output() showRecommendationsRequest = new EventEmitter<Widget>();
    @Output() saveWidgetConfigurationRequest = new EventEmitter<any>();
    ui_constants = UI;
    selectedInput:WorkflowInput = null;
    selectedOutput:WorkflowOutput = null;

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
		scrollTop: 0
	}

    @ViewChild('svgElement') private svgElement:ElementRef;
    @ViewChild('widgetCanvas') private widgetCanvas:ElementRef;

    constructor(private contextMenuService:ContextMenuService) {
    }

    ngOnInit() {
        this.visibleCanvasSize.width = this.svgElement.nativeElement.scrollWidth;
        this.visibleCanvasSize.height = this.svgElement.nativeElement.scrollHeight;
        this.updateCanvasBounds();
    }

    move(position:any, widgetDragged:Widget) {

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

			let x_diff = Math.max(-min_x,position.x-widgetDragged.x);
			let y_diff = Math.max(-min_y,position.y-widgetDragged.y);

			for (let widget of widgets) {
				if (widget.selected) {
					widget.x = widget.x+x_diff;
					widget.y = widget.y+y_diff;
				}
			}

		}
		else {
			widgetDragged.x = Math.max(0,position.x);
			widgetDragged.y = Math.max(0,position.y);
			max_x = widgetDragged.bounds.x2;
			max_y = widgetDragged.bounds.y2;
		}

        this.updateCanvasBounds();

        var widgetCanvasEl = this.widgetCanvas.nativeElement;
		console.log(widgetCanvasEl);
        widgetCanvasEl.scrollLeft = Math.max(max_x, 0);
        widgetCanvasEl.scrollTop = Math.max(max_y, 0);
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
        return Math.max(this.widgetBounds.y, this.visibleCanvasSize.height);
    }

    get canvasWidth() {
        return Math.max(this.widgetBounds.x, this.visibleCanvasSize.width);
    }

	startMouseSelect(event:any) {
		if (event.target.id == "widget-canvas-svg") {
			this.mouseSelectRect.position = {x: event.layerX, y: event.layerY};
			this.mouseSelectRect.visible = true;
			this.mouseSelectRect.scrollTop = event.originalTarget.scrollTop;
		}
	}

	widenMouseSelect(event:any) {
		this.widenSelection(event)
	}

	widenMouseSelectScroll(event:any) {
		if (this.mouseSelectRect.visible) {
			this.widenSelection({movementX: 0, movementY: event.originalTarget.scrollTop-this.mouseSelectRect.scrollTop});
			this.mouseSelectRect.scrollTop = event.originalTarget.scrollTop;
		}
	}
	
	widenSelection (event:any) {
		if (this.mouseSelectRect.visible) {
			if (this.mouseSelectRect.direction.x == "right") {
				if (this.mouseSelectRect.width + event.movementX < 0) {
					this.mouseSelectRect.direction.x = "left";
					this.mouseSelectRect.position.x += (this.mouseSelectRect.width + event.movementX);
					this.mouseSelectRect.width = -(this.mouseSelectRect.width + event.movementX)
				}
				else {
					this.mouseSelectRect.width += event.movementX;
				}
			}
			else if (this.mouseSelectRect.direction.x == "left") {
				if (this.mouseSelectRect.width - event.movementX < 0) {
					this.mouseSelectRect.direction.x = "right";
					this.mouseSelectRect.position.x -= (this.mouseSelectRect.width - event.movementX);
					this.mouseSelectRect.width = -(this.mouseSelectRect.width - event.movementX)
				}
				else {
					this.mouseSelectRect.position.x += event.movementX;
					this.mouseSelectRect.width -= event.movementX;
				}
			}
			if (this.mouseSelectRect.direction.y == "down") {
				if (this.mouseSelectRect.height + event.movementY < 0) {
					this.mouseSelectRect.direction.y = "up";
					this.mouseSelectRect.position.y += (this.mouseSelectRect.height + event.movementY);
					this.mouseSelectRect.height = -(this.mouseSelectRect.height + event.movementY)
				}
				else {
					this.mouseSelectRect.height += event.movementY;
				}
			}
			else if (this.mouseSelectRect.direction.y == "up") {
				if (this.mouseSelectRect.height - event.movementY < 0) {
					this.mouseSelectRect.direction.y = "down";
					this.mouseSelectRect.position.y -= (this.mouseSelectRect.height - event.movementY);
					this.mouseSelectRect.height = -(this.mouseSelectRect.height - event.movementY)
				}
				else {
					this.mouseSelectRect.position.y += event.movementY;
					this.mouseSelectRect.height -= event.movementY;
				}
			}
			
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

    endMove(widget:Widget) {
        if (widget.x != widget.start_x || widget.y != widget.start_y) {
            this.saveWidgetPositionRequest.emit(widget);
            widget.start_x = widget.x;
            widget.start_y = widget.y;
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

    showResults(widget:Widget) {
        for (let output of widget.outputs) {
            this.fetchOutputResultsRequest.emit(output);
        }
        widget.showResults = true;
    }

    showHelp(widget:Widget) {
        widget.showHelp = true;
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

    deleteWidget(widget:Widget) {
        this.deleteWidgetRequest.emit(widget);
    }

    deleteConnection(connection:Connection) {
        this.deleteConnectionRequest.emit(connection);
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

    runWidget(widget:Widget) {
        this.runWidgetRequest.emit(widget);
    }
    runWidgetWithInteraction(widget:Widget) {
        this.runAndInteractWidgetRequest.emit(widget);
    }

    continueRunWorkflow(event:any) {
        this.continueRunWorkflowRequest.emit(event);
    }

    saveWidgetConfiguration(event:any) {
        this.saveWidgetConfigurationRequest.emit(event);
    }

    handleShortcuts(event:any) {
        if (event.keyCode == 46) {  // Delete
            // Check that it doesn't come from an input field
            if (event.srcElement.localName != "input") {
                this.deleteSelectedObjects();
            }
        } else if (event.keyCode == 113) {  // F2 - rename
            for (let widget of this.workflow.widgets) {
                if (widget.selected)
                    this.showRenameDialog(widget);
            }
        }
    }

    public onContextMenu($event:MouseEvent, item:any):void {
        $event.preventDefault();
        this.contextMenuService.show.next({
            actions: [
                {
                    html: () => `<span class="glyphicon glyphicon-play"></span> Run`,
                    click: (widget:Widget) => this.runWidget(widget)
                },
                {
                    html: () => `<span class="glyphicon glyphicon-alert"></span> Run & interact`,
                    click: (widget:Widget) => this.runWidgetWithInteraction(widget)
                },
                {
                    html: () => `<span class="glyphicon glyphicon-pencil"></span> Properties`,
                    click: (widget:Widget) => this.showDialog(widget)
                },
                {
                    html: () => `<span class="glyphicon glyphicon-stats"></span> Results`,
                    click: (widget:Widget) => this.showResults(widget)
                },
                {
                    html: () => `<span class="glyphicon glyphicon-repeat"></span> Reset`,
                    click: (widget:Widget) => this.resetWidget(widget)
                },
                {
                    html: () => `<span class="glyphicon glyphicon-repeat"></span> Reset workflow`,
                    click: (_:any) => this.resetWorkflow()
                },
                {
                    html: () => `<span class="glyphicon glyphicon-console"></span> Rename`,
                    click: (widget:Widget) => this.showRenameDialog(widget)
                },
                {
                    html: () => `<span class="glyphicon glyphicon-copy"></span> Copy`,
                    click: (widget:Widget) => this.copyWidget(widget)
                },
                {
                    html: () => `<span class="glyphicon glyphicon-trash"></span> Delete`,
                    click: (widget:Widget) => this.deleteWidget(widget)
                },
                {
                    html: () => `<span class="glyphicon glyphicon-question-sign"></span> Help`,
                    click: (widget:Widget) => this.showHelp(widget)
                },
            ],
            event: $event,
            item: item,
        });
    }
}
