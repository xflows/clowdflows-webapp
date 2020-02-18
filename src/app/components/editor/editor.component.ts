import {Component, OnInit, OnDestroy, ViewChild, HostListener} from '@angular/core';
import {ActivatedRoute, Router, Params} from '@angular/router';
import {WidgetCanvasComponent} from "./widget-canvas/widget-canvas.component";
import {AbstractWidget} from "../../models/abstract-widget";
import {ClowdFlowsDataService} from "../../services/clowdflows-data.service";
import {LoggerService} from "../../services/logger.service";
import {Widget} from "../../models/widget";
import {Connection} from "../../models/connection";
import {Output as WorkflowOutput, Output} from "../../models/output";
import {Workflow} from "../../models/workflow";
import {DomSanitizer} from "@angular/platform-browser";
import {Input} from "../../models/input";
import {specialWidgetNames} from '../../services/special-widgets';
import {WidgetTreeComponent} from "./widget-tree/widget-tree.component";
import {RecommenderService} from "../../services/recommender.service";
import {WidgetLibraryService} from "../../services/widget-library.service";
import {TabsetComponent} from "ngx-bootstrap";
import {CanvasElement} from "../../models/canvas-element";
const svg = require('save-svg-as-png');

@Component({
    selector: 'editor',
    template: require('./editor.component.html'),
    styles: [require('./editor.component.css')]
})
export class EditorComponent implements OnInit, OnDestroy {
    @ViewChild(WidgetCanvasComponent, {static: false}) canvasComponent:WidgetCanvasComponent;
    @ViewChild(WidgetTreeComponent, {static: false}) widgetTreeComponent: WidgetTreeComponent;
    @ViewChild(TabsetComponent, {static: false}) tabsetComponent: TabsetComponent;
    workflow:any = {};
    workflows:Workflow[] = [];
    userWorkflows:Workflow[] = [];
    sub:any;

	resizeComp:any = {width: {open: true}, height: {height: 100, oldY: 0}, grabber: false}

	@HostListener('document:mousemove', ['$event'])
	onMouseMove(event: MouseEvent) {
		if (!this.resizeComp.grabber) {
		    return;
		}
		  this.resizerY(event.clientY - this.resizeComp.height.oldY);
		  this.resizeComp.height.oldY = event.clientY;
	}

	@HostListener('document:mouseup', ['$event'])
	onMouseUp(event: MouseEvent) {
		if (event.target["classList"] && event.target["classList"].contains("grabber"))
		  this.resizeComp.grabber = false;
	}

	resizerY(offsetY: number) {
		this.resizeComp.height.height -= offsetY;
	}


	@HostListener('document:mousedown', ['$event'])
	onMouseDown(event: MouseEvent) {
		if (event.target["classList"] && event.target["classList"].contains("grabber-active")) {
		  this.resizeComp.grabber = true;
		    this.resizeComp.height.oldY = event.clientY;
		}
	}

    tutorial:boolean = false;
    loadedSubprocesses:any = {};
    activeWorkflow:Workflow = null;
    recommendWidget:Widget = null;

	removeWorkflowTab(workflow:Workflow){

		let index = this.workflows.indexOf(workflow);
  	this.workflows.splice(index, 1);

    if (workflow.is_subprocess) {
      delete this.loadedSubprocesses[workflow.url];
    }


	}

    constructor(private domSanitizer:DomSanitizer,
                private clowdflowsDataService:ClowdFlowsDataService,
                private route:ActivatedRoute,
                private router:Router,
                private loggerService:LoggerService,
                private widgetLibraryService:WidgetLibraryService,
                private recommenderService:RecommenderService) {
    }

    globalPositionToLocalPosition(coordinates:any) {
      let canvasEl:any = this.canvasComponent.widgetCanvas.nativeElement
      let offsetTop:number = canvasEl.offsetTop;
      let offsetLeft:number = canvasEl.offsetLeft;
      let scrollTop:number = canvasEl.scrollTop;
      let scrollLeft:number = canvasEl.scrollLeft;

      let x:number = coordinates.x;
      let y:number = coordinates.y;
      x = coordinates.x-offsetLeft;
      y = coordinates.y-offsetTop;

      if (x > 0 && y > 0 && x < canvasEl.clientWidth && y < canvasEl.clientHeight) {
        x = x+scrollLeft;
        y = y+scrollTop;
        return {x: x, y: y};
      }
      else {
        return false;
      }

    }

    addWidget(abstractWidget:AbstractWidget) {

      if (abstractWidget.globalPosition) {
        abstractWidget.globalPosition = this.globalPositionToLocalPosition(abstractWidget.globalPosition);

        if (abstractWidget.globalPosition == false) {
          console.log("WIDGET OUT OF BOUNDS")
          return;
        }
      }

        if (abstractWidget.special) {
            // Handle subprocesses, for loop inputs, etc
            this.addSpecialWidget(abstractWidget);
        } else {
          let newCoordinates = this.newWidgetCoordinates(abstractWidget.globalPosition);
            // Regular widgets
            let activeWorkflow = this.activeWorkflow;
            let save_results = false;
            if (abstractWidget.interactive || abstractWidget.visualization || abstractWidget.always_save_results) {
                save_results = true;
            }
            let widgetData = {
                workflow: activeWorkflow.url,
                x: newCoordinates.x,
                y: newCoordinates.y,
                name: abstractWidget.name,
                abstract_widget: abstractWidget.id,
                finished: false,
                error: false,
                running: false,
                interaction_waiting: false,
                type: 'regular',
                progress: 0,
                save_results: save_results
            };

            // Sync with server
            this.clowdflowsDataService
                .createWidget(widgetData)
                .then((data) => {
                    let error = this.loggerService.reportMessage(data);
                    if (!error) {
                      let widget:Widget = Widget.createFromJSON(data, activeWorkflow);
                      activeWorkflow.widgets.push(widget);

                    }
                });
        }
    }

    addSpecialWidget(abstractWidget:AbstractWidget) {
        let activeWorkflow = this.activeWorkflow;

        if (abstractWidget.name == specialWidgetNames.subprocessWidget) {
            // Adding a new subprocess
            this.clowdflowsDataService
                .addSubprocessToWorkflow(activeWorkflow)
                .then((data) => {
                    let error = this.loggerService.reportMessage(data);
                    if (!error) {
                      let newCoordinates = this.newWidgetCoordinates(abstractWidget.globalPosition);
                      data.x = newCoordinates.x;
                      data.y = newCoordinates.y;
                        let widget:Widget = Widget.createFromJSON(data, activeWorkflow);
                        this.canvasComponent.saveWidgetPositionRequest.emit(widget);
                        activeWorkflow.widgets.push(widget);
                        this.canvasComponent.updateCanvasBounds();
                        setTimeout(function(canvasComponent){
                          return function() {
                            let widgetCanvas = canvasComponent.widgetCanvas.nativeElement;
                            let svgElement = canvasComponent.svgElement.nativeElement;
                            widgetCanvas.scrollTop = 0;
                            widgetCanvas.scrollLeft = svgElement.getAttribute("width")-widgetCanvas.offsetWidth;
                          }}(this.canvasComponent), 300); // ali se da to narediti bolje?!

                    }
                });
        } else if (abstractWidget.name == specialWidgetNames.inputWidget) {
            // Adding a new input
            this.clowdflowsDataService
                .addInputToSubprocess(activeWorkflow)
                .then((data) => {
                    let error = this.loggerService.reportMessage(data);
                    if (!error) {
                      let newCoordinates = this.newWidgetCoordinates(abstractWidget.globalPosition);
                      data.x = newCoordinates.x;
                      data.y = newCoordinates.y;
                        let widget:Widget = Widget.createFromJSON(data, activeWorkflow);
                        activeWorkflow.widgets.push(widget);
                        if (activeWorkflow.subprocessWidget) {
                            this.updateWidget(activeWorkflow.subprocessWidget);
                        }
                    }
                });
        } else if (abstractWidget.name == specialWidgetNames.outputWidget) {
            // Adding a new output
            this.clowdflowsDataService
                .addOutputToSubprocess(activeWorkflow)
                .then((data) => {
                    let error = this.loggerService.reportMessage(data);
                    if (!error) {
                      let newCoordinates = this.newWidgetCoordinates(abstractWidget.globalPosition);
                      data.x = newCoordinates.x;
                      data.y = newCoordinates.y;
                        let widget:Widget = Widget.createFromJSON(data, activeWorkflow);
                        activeWorkflow.widgets.push(widget);
                        if (activeWorkflow.subprocessWidget) {
                            this.updateWidget(activeWorkflow.subprocessWidget);
                        }
                    }
                });
        } else if (abstractWidget.name == specialWidgetNames.forLoopWidgets) {
            // Adding for loop widgets
            this.clowdflowsDataService
                .addForLoopToSubprocess(activeWorkflow)
                .then((data) => {
                    let error = this.loggerService.reportMessage(data);
                    if (!error) {
                        for (let widgetData of <Array<Widget>> data) {
                          let newCoordinates = this.newWidgetCoordinates(abstractWidget.globalPosition);
                          widgetData.x = newCoordinates.x;
                          widgetData.y = newCoordinates.y;
                            let widget:Widget = Widget.createFromJSON(widgetData, activeWorkflow);
                            activeWorkflow.widgets.push(widget);
                        }
                        if (activeWorkflow.subprocessWidget) {
                            this.updateWidget(activeWorkflow.subprocessWidget);
                        }
                    }
                });
        } else if (abstractWidget.name == specialWidgetNames.xValidationWidgets) {
            // Adding CV widgets
            this.clowdflowsDataService
                .addXValidationToSubprocess(activeWorkflow)
                .then((data) => {
                    let error = this.loggerService.reportMessage(data);
                    if (!error) {
                        for (let widgetData of <Array<Widget>> data) {
                          let newCoordinates = this.newWidgetCoordinates(abstractWidget.globalPosition);
                          widgetData.x = newCoordinates.x;
                          widgetData.y = newCoordinates.y;
                            let widget:Widget = Widget.createFromJSON(widgetData, activeWorkflow);
                            activeWorkflow.widgets.push(widget);
                        }
                        if (activeWorkflow.subprocessWidget) {
                            this.updateWidget(activeWorkflow.subprocessWidget);
                        }
                    }
                });
        }
    }

    copyWidget(widget:Widget) {
        let activeWorkflow = this.activeWorkflow;
        this.clowdflowsDataService
            .copyWidget(widget)
            .then((data) => {
                let error = this.loggerService.reportMessage(data);
                if (!error) {
                    let widget:Widget = Widget.createFromJSON(data, activeWorkflow);
                    activeWorkflow.widgets.push(widget);
                }
            });
    }

    saveWidget(widget:Widget) {
        let activeWorkflow = this.activeWorkflow;
        this.clowdflowsDataService
            .saveWidget(widget)
            .then((data) => {
                this.loggerService.reportMessage(data);
                if (widget.type == 'subprocess') {
                    if (widget.workflow_link in this.loadedSubprocesses) {
                        let workflow = this.loadedSubprocesses[widget.workflow_link];
                        workflow.name = widget.name;
                    }
                } else if (widget.type == 'input' || widget.type == 'output') {
                    if (activeWorkflow.subprocessWidget) {
                        this.updateWidget(activeWorkflow.subprocessWidget);
                    }
                }
            });
    }

    saveWidgetPosition(widget:Widget) {
        this.clowdflowsDataService
            .saveWidgetPosition(widget)
            .then((data) => {
                this.loggerService.reportMessage(data);
            });
    }

    saveWidgetConfiguration(event:any) {
        let widget = event.widget;
        let configuration = event.configuration;
        this.clowdflowsDataService.saveWidgetConfiguration(widget, configuration)
            .then((response:any) => {
                this.updateWidget(widget)
                    .then(()=> {
                        widget.showInputDesignation = false;
                    });
            });
    }

    deleteWidget(widget:Widget) {
        let workflow = widget.workflow;
        // Delete the connections
        for (let conn of workflow.connections) {
            if (conn.input_widget == widget || conn.output_widget == widget) {
                this.deleteConnection(conn, true);
            }
        }
        // Delete the widget
        this.clowdflowsDataService
            .deleteWidget(widget)
            .then(
                (data) => {
                    let error = this.loggerService.reportMessage(data);
                    if (!error) {
                        let idx = workflow.widgets.indexOf(widget);
                        workflow.widgets.splice(idx, 1);

                        if (widget.isSpecialWidget) {
                            this.updateWidget(widget.workflow.subprocessWidget);
                        }
                    }
                }
            );

        if (widget.type == 'subprocess') {
            if (widget.workflow_link in this.loadedSubprocesses) {
                let workflow = this.loadedSubprocesses[widget.workflow_link];
                let idx = this.workflows.indexOf(workflow);
                this.workflows.splice(idx, 1);
            }
        }
    }

    resetWidget(widget:Widget) {
        this.clowdflowsDataService
            .resetWidget(widget)
            .then((data) => {
                this._clearOutputs(widget);
                this.loggerService.reportMessage(data);
            });
    }

    _clearOutputs(widget:Widget) {
        for (let output of widget.outputs) {
            output.value = undefined;
        }
    }

    runWidget(widget:Widget, interact:boolean = false) {
        this.clowdflowsDataService
            .runWidget(widget, interact)
            .then((data) => {
                this.loggerService.reportMessage(data);
            });
    }

    updateWidget(widget:Widget) {
        let workflow = widget.workflow;
        return this.clowdflowsDataService
            .getWidget(widget.id)
            .then((data) => {
                let newWidget:Widget = Widget.createFromJSON(data, workflow);
                for (let conn of workflow.connections.filter((c:Connection) => c.input_widget.url == newWidget.url)) {
                    let input = newWidget.inputs.find((i:Input) => conn.input.url == i.url);
                    if (!input) {
                        this.deleteConnectionReference(conn);
                    } else {
                        conn.updateInputWidgetRef(newWidget, input.url);
                    }
                }
                for (let conn of workflow.connections.filter((c:Connection) => c.output_widget.url == newWidget.url)) {
                    let output = newWidget.outputs.find((o:Output) => conn.output.url == o.url);
                    if (!output) {
                        this.deleteConnectionReference(conn);
                    } else {
                        conn.updateOutputWidgetRef(newWidget, output.url);
                    }
                }

                // Remove old version
                let idx = workflow.widgets.indexOf(widget);
                workflow.widgets.splice(idx, 1);
                workflow.widgets.push(newWidget);
                return newWidget;
            });
    }

    fetchOutputValue(output:WorkflowOutput) {
        this.clowdflowsDataService
            .fetchOutputValue(output)
            .then((data) => {
                let error = this.loggerService.reportMessage(data);
                if (!error) {
                  console.log(output)
                    output.value = data.value;
                }
            });
    }

    addConnection(event:any) {
        let selectedInput = event.selectedInput;
        let selectedOutput = event.selectedOutput;
        let workflow = event.workflow;
        let canvasTab = event.canvasTab;

        if (selectedInput.connection != null) {
            // We are replacing some existing connection
            let connectionToDelete = selectedInput.connection;
            selectedInput.connection = null;

            // Only delete local connection object since the server
            // deletes existing connections on the input
            this.deleteConnectionReference(connectionToDelete);
        }

        let connectionData = {
            input: selectedInput.url,
            output: selectedOutput.url,
            workflow: workflow.url
        };
        let updateInputs = selectedInput.multi_id != 0;
        this.clowdflowsDataService
        .createConnection(connectionData)
        .then((data:any) => {
            let error = this.loggerService.reportMessage(data);
            if (!error) {
                let input_widget:Widget = workflow.widgets.find((widget:Widget) => widget.url == data.input_widget);
                let output_widget:Widget = workflow.widgets.find((widget:Widget) => widget.url == data.output_widget);
                let connection = new Connection(data.url, output_widget, input_widget, data.output, data.input, workflow);
                workflow.connections.push(connection);
                selectedInput.connection = connection;
                canvasTab.unselectSignals();
                if (updateInputs) {
                    this.updateWidget(input_widget);
                }
            }
        });
    }

    deleteConnection(connection:Connection, widgetDelete = false) {
        let updateInputs = connection.input.multi_id != 0 && !widgetDelete;
        return this.clowdflowsDataService
            .deleteConnection(connection)
            .then((data) => {
                let error = this.loggerService.reportMessage(data);
                if (!error) {
                    this.deleteConnectionReference(connection);
                    if (updateInputs) {
                        this.updateWidget(connection.input_widget);
                    }
                }
            });
    }

    private deleteConnectionReference(connection:Connection) {
        connection.input.connection = null;
        connection.output.connection = null;
        let workflow = connection.workflow;
        let idx = workflow.connections.indexOf(connection);
        workflow.connections.splice(idx, 1);
    }

    runWorkflow() {
        this.clowdflowsDataService
            .runWorkflow(this.activeWorkflow)
            .then((data) => {
                this.loggerService.reportMessage(data);
            });
    }

    continueRunWorkflow() {
        this.runWorkflow();
    }

    resetWorkflow() {
        this.clowdflowsDataService
            .resetWorkflow(this.workflow)
            .then((data) => {
                this.loggerService.reportMessage(data);
            });
    }

    createWorkflow() {
        let workflowData:any = {
            name: 'Untitled workflow',
            is_public: false,
            description: '',
            widget: null,
            template_parent: null
        };
        this.clowdflowsDataService
            .createWorkflow(workflowData)
            .then((data:any) => {
                let error = this.loggerService.reportMessage(data);
                if (!error) {
                    this.router.navigate(['/editor', data.id]);
                }
            });
    }

    saveWorkflow(workflow:Workflow) {
        this.clowdflowsDataService
            .saveWorkflowInfo(workflow)
            .then((data:any) => {
                this.loggerService.reportMessage(data);
            });
    }

    receiveWorkflowUpdate(data:any) {
        let widget = this.workflow.widgets.find((widgetObj:Widget) => widgetObj.id == data.widget_pk);
        if (widget != undefined) {
            if (data.status.finished && !widget.finished) {
                if (data.status.is_visualization) {
                    this.visualizeWidget(widget);
                }
            }

            if (!data.status.finished && data.status.interaction_waiting) {
                if (!widget.showInteractionDialog) {
                    this.interactWidget(widget);
                }
            }

            widget.finished = data.status.finished;
            widget.error = data.status.error;
            widget.running = data.status.running;
            widget.interaction_waiting = data.status.interaction_waiting;
            widget.x = data.position.x;
            widget.y = data.position.y;
        }
    }

    saveWorkflowAsPNG() {

      let svgCanvas = document.querySelectorAll(".tab-pane.active #widget-canvas-svg")[0];

      let paths = svgCanvas.getElementsByTagName("path");
      let rects = svgCanvas.getElementsByTagName("rect");
      let texts = svgCanvas.getElementsByTagName("text");

      for (let i=0; i<paths.length; i++) {
        let cssStyle = window.getComputedStyle(paths[i]);
        paths[i].style.stroke = cssStyle.stroke;
      }
      for (let i=0; i<rects.length; i++) {
        let cssStyle = window.getComputedStyle(rects[i]);
        rects[i].style.fill = cssStyle.fill;
        rects[i].style["fill-opacity"] = cssStyle["fill-opacity"];
        rects[i].style.stroke = cssStyle.stroke;
        rects[i].style["stroke-width"] = cssStyle["stroke-width"];
        rects[i].style["stroke-miterlimit"] = cssStyle["stroke-miterlimit"];
        rects[i].style["stroke-dasharray"] = cssStyle["stroke-dasharray"];
      }
      for (let i=0; i<texts.length; i++) {
        let cssStyle = window.getComputedStyle(texts[i]);
        texts[i].style["font-family"] = cssStyle["font-family"];
        texts[i].style.fill = cssStyle.fill;
      }

      svg.svgAsDataUri(svgCanvas).then(function (uri:any) {

        for (let i=0; i<paths.length; i++) {
          paths[i].removeAttribute("style");
        }
        for (let i=0; i<rects.length; i++) {
          rects[i].removeAttribute("style");
        }
        for (let i=0; i<texts.length; i++) {
          texts[i].removeAttribute("style");
        }

        return svg.download("diagram.svg", uri);
      }).catch(function(err:any) {
        console.log(err)
        for (let i=0; i<paths.length; i++) {
          paths[i].removeAttribute("style");
        }
        for (let i=0; i<rects.length; i++) {
          rects[i].removeAttribute("style");
        }
        for (let i=0; i<texts.length; i++) {
          texts[i].removeAttribute("style");
        }
      });
    }

    openSubprocess(widget:Widget) {
        let workflowUrl = widget.workflow_link;
        if (!(workflowUrl in this.loadedSubprocesses)) {
            this.clowdflowsDataService.getWorkflow(workflowUrl)
                .then(data => {
                    let subprocessWorkflow = Workflow.createFromJSON(data);
                    subprocessWorkflow.subprocessWidget = widget;
                    this.workflows.push(subprocessWorkflow);
                    this.loadedSubprocesses[workflowUrl] = subprocessWorkflow;
                    this.switchToWorkflowTab(subprocessWorkflow);
                });
        } else {
            let subprocessWorkflow = this.loadedSubprocesses[workflowUrl];
            this.switchToWorkflowTab(subprocessWorkflow);
        }
        widget.selected = false;
    }

    switchToWorkflowTab(workflowToActivate:Workflow) {
        for (let workflow of this.workflows) {
            workflow.active = false;
        }
        workflowToActivate.active = true;
        this.activeWorkflow = workflowToActivate;
    }

    visualizeWidget(widget:Widget) {
        this.clowdflowsDataService
            .visualizeWidget(widget)
            .then((response) => {
              if (response) {
                widget.visualizationHtml = response;
                widget.showVisualizationDialog = true;
              }
            });
    }

    interactWidget(widget:Widget) {
        this.clowdflowsDataService
            .interactWidget(widget)
            .then((response) => {
              if (response) {
                widget.interactionHtml = response;
                widget.showInteractionDialog = true;
              }
            });
    }

    updateRecommendation(recommendWidget:CanvasElement) {
        let widgetRecommendation = this.recommenderService.getRecommendation(recommendWidget);
        this.widgetTreeComponent.updateRecommendation(widgetRecommendation);
    }

    _clearTabs() {
        this.workflows = [];

        // NOTE This is a workaround - here we manually remove any open tabs
        let tabs = this.tabsetComponent.tabs;
        while (tabs.length > 0) {
            tabs.pop()
        }
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe((params:Params) => {
            this.tutorial = this.route.snapshot.data[0]['tutorial'];
            this.loggerService.clear();  // Clear old messages
            // Fetch the current workflow
            let id = +params['id'];
            this.clowdflowsDataService.getWorkflow(id)
                .then(data => {
                    // Deactivate existing workflows before loading new ones
                    for (let workflow of this.workflows) {
                        workflow.active = false;
                    }
                    this._clearTabs(); // Clear workflow tabs on load
                    this.workflow = Workflow.createFromJSON(data);
                    this.workflows.push(this.workflow);
                    this.switchToWorkflowTab(this.workflow);
                    this.clowdflowsDataService.editorUpdates((data:any) => {
                        switch(data.type) {
                            case "logMessage": {
                                this.loggerService.receiveLogMessage(data)
                                break;
                            }
                            case "widget": {
                                this.receiveWorkflowUpdate(data);
                                break;
                            }
                            default: {
                                //statements;
                                break;
                            }
                        }

                    }, this.workflow);

                    this.loggerService.success("Successfully loaded workflow.");
                });

            // Fetch all of the user's workflows
            this.clowdflowsDataService.getUserWorkflows()
                .then(userWorkflows => {
                    this.userWorkflows = <Workflow[]> userWorkflows;
                });
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    newWidgetCoordinates(globalPosition:any) {

      if (globalPosition) {
        return globalPosition;
      }
      else {
        let widgets = this.workflow.widgets;
        let mostRightWidget;
        let maxX = -Infinity;
        for (let i=0; i<widgets.length; i++) {
          if (widgets[i].x > maxX) {
            maxX = widgets[i].x;
            mostRightWidget = widgets[i];
          }
        }

        if (mostRightWidget) {
          let mostRightWidgetDOM = document.getElementById("widget-"+mostRightWidget.id);
          return {x: mostRightWidget.x+parseInt(mostRightWidgetDOM.getAttribute("width")), y: 50}
        }
        else {
          return {x: 50, y: 50}
        }
      }
    }
}
