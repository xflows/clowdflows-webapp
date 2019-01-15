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
import {TabsetComponent} from "ng2-bootstrap";
import {CanvasElement} from "../../models/canvas-element";

@Component({
    selector: 'editor',
    template: require('./editor.component.html'),
    styles: [require('./editor.component.css')]
})
export class EditorComponent implements OnInit, OnDestroy {
    @ViewChild(WidgetCanvasComponent) canvasComponent:WidgetCanvasComponent;
    @ViewChild(WidgetTreeComponent) widgetTreeComponent: WidgetTreeComponent;
    @ViewChild(TabsetComponent) tabsetComponent: TabsetComponent;
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

    addWidget(abstractWidget:AbstractWidget) {

        if (abstractWidget.special) {
            // Handle subprocesses, for loop inputs, etc
            this.addSpecialWidget(abstractWidget);
        } else {
            // Regular widgets
            let activeWorkflow = this.activeWorkflow;
            let save_results = false;
            if (abstractWidget.interactive || abstractWidget.visualization || abstractWidget.always_save_results) {
                save_results = true;
            }
            let widgetData = {
                workflow: activeWorkflow.url,
                x: 50,
                y: 50,
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
                        let widget:Widget = Widget.createFromJSON(data, activeWorkflow);
                        activeWorkflow.widgets.push(widget);
                    }
                });
        } else if (abstractWidget.name == specialWidgetNames.inputWidget) {
            // Adding a new input
            this.clowdflowsDataService
                .addInputToSubprocess(activeWorkflow)
                .then((data) => {
                    let error = this.loggerService.reportMessage(data);
                    if (!error) {
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
                widget.visualizationHtml = response.text();
                widget.showVisualizationDialog = true;
            });
    }

    interactWidget(widget:Widget) {
        this.clowdflowsDataService
            .interactWidget(widget)
            .then((response) => {
                widget.interactionHtml = response.text();
                widget.showInteractionDialog = true;
            });
    }

    updateRecommendation(recommendWidget:CanvasElement) {
        // this.recommendWidget = recommendWidget;
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
                        // console.log(data);

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
}
