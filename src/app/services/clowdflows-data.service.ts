import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from "@angular/http";
import 'rxjs/add/operator/toPromise';
import {Workflow} from "../models/workflow";
import {Widget} from "../models/widget";
import {Connection} from "../models/connection";
import {Output as WorkflowOutput} from "../models/output";
import {LoggerService} from "./logger.service";
import {API_ENDPOINT, DOMAIN} from "../config";

@Injectable()
export class ClowdFlowsDataService {

    widgetLibraryUrl = 'widget-library/';
    workflowsUrl = 'workflows/';
    inputsUrl = 'inputs/';
    outputsUrl = 'outputs/';
    widgetsUrl = 'widgets/';
    connectionsUrl = 'connections/';

    constructor(private http:Http, private loggerService:LoggerService) {
    }

    getRequestOptions():RequestOptions {
        let headers = new Headers();
        let auth_token = localStorage.getItem('auth_token');
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `Token ${auth_token}`);
        let options = new RequestOptions({headers: headers});
        return options;
    }

    getWidgetLibrary() {
        let options = this.getRequestOptions();
        options.body = '';
        return this.http
            .get(`${API_ENDPOINT}${this.widgetLibraryUrl}`, options)
            .toPromise()
            .then(response => response.json())
            .catch(error => this.handleError(error));
    }

    private handleError(error:any) {
        console.error('An error occurred', error);
        let message = error.message || error;
        this.loggerService.error(`HTTP error: ${error}`);
    }

    createWorkflow(workflowData:any) {
        let options = this.getRequestOptions();
        return this.http
            .post(`${API_ENDPOINT}${this.workflowsUrl}`, JSON.stringify(workflowData), options)
            .toPromise()
            .then(response => response.json())
            .catch(error => this.handleError(error));
    }

    saveWorkflowInfo(workflow:Workflow) {
        let options = this.getRequestOptions();
        let workflowData:any = {
            url: workflow.url,
            name: workflow.name,
            description: workflow.description,
            is_public: workflow.is_public
        };
        return this.http
            .patch(workflow.url, JSON.stringify(workflowData), options)
            .toPromise()
            .then(response => response.json())
            .catch(error => this.handleError(error));
    }

    getWorkflow(idOrUrl:any):Promise<any> {
        let options = this.getRequestOptions();
        options.body = '';
        let url = idOrUrl;
        if (typeof url === "number") {
            let id = idOrUrl;
            url = `${API_ENDPOINT}${this.workflowsUrl}${id}/`;
        }
        return this.http
            .get(url, options)
            .toPromise()
            .then(response => response.json())
            .catch(error => this.handleError(error));
    }

    getUserWorkflows():Promise<any> {
        let options = this.getRequestOptions();
        options.body = '';
        return this.http
            .get(`${API_ENDPOINT}${this.workflowsUrl}?user=1`, options)
            .toPromise()
            .then(response => response.json())
            .catch(error => this.handleError(error));
    }

    runWorkflow(workflow:Workflow):Promise<any> {
        let options = this.getRequestOptions();
        return this.http
            .post(`${workflow.url}run/`, {}, options)
            .toPromise()
            .then(response => response.json())
            .catch(error => this.handleError(error));
    }

    resetWorkflow(workflow:Workflow):Promise<any> {
        let options = this.getRequestOptions();
        return this.http
            .post(`${workflow.url}reset/`, {}, options)
            .toPromise()
            .then(response => response)
            .catch(error => this.handleError(error));
    }

    addSubprocessToWorkflow(workflow:Workflow):Promise<any> {
        let options = this.getRequestOptions();
        return this.http
            .post(`${workflow.url}subprocess/`, {}, options)
            .toPromise()
            .then(response => response.json())
            .catch(error => this.handleError(error));
    }

    addInputToSubprocess(workflow:Workflow):Promise<any> {
        let options = this.getRequestOptions();
        return this.http
            .post(`${workflow.url}subprocess-input/`, {}, options)
            .toPromise()
            .then(response => response.json())
            .catch(error => this.handleError(error));
    }

    addForLoopToSubprocess(workflow:Workflow):Promise<any> {
        let options = this.getRequestOptions();
        return this.http
            .post(`${workflow.url}subprocess-forloop/`, {}, options)
            .toPromise()
            .then(response => response.json())
            .catch(error => this.handleError(error));
    }

    addXValidationToSubprocess(workflow:Workflow):Promise<any> {
        let options = this.getRequestOptions();
        return this.http
            .post(`${workflow.url}subprocess-xvalidation/`, {}, options)
            .toPromise()
            .then(response => response.json())
            .catch(error => this.handleError(error));
    }

    addOutputToSubprocess(workflow:Workflow):Promise<any> {
        let options = this.getRequestOptions();
        return this.http
            .post(`${workflow.url}subprocess-output/`, {}, options)
            .toPromise()
            .then(response => response.json())
            .catch(error => this.handleError(error));
    }

    visualizeWidget(widget:Widget) {
        let options = this.getRequestOptions();
        options.body = '';
        return this.http
            .get(`${widget.url}visualize/`, options)
            .toPromise()
            .then(html => html)
            .catch(error => this.handleError(error));
    }

    interactWidget(widget:Widget) {
        let options = this.getRequestOptions();
        options.body = '';
        return this.http
            .get(`${widget.url}interact/`, options)
            .toPromise()
            .then(html => html)
            .catch(error => this.handleError(error));
    }

    finishInteractionWidget(widget:Widget, data:any) {
        let options = this.getRequestOptions();
        return this.http
            .post(`${widget.url}interact/`, JSON.stringify(data), options)
            .toPromise()
            .then(response => response.json())
            .catch(error => this.handleError(error));
    }

    getWidget(id:number):Promise<any> {
        let options = this.getRequestOptions();
        let date = new Date().toTimeString();  // FIX: better way to prevent GET caching
        options.body = '';
        return this.http
            .get(`${API_ENDPOINT}${this.widgetsUrl}${id}/?${date}`, options)
            .toPromise()
            .then(response => response.json())
            .catch(error => this.handleError(error));
    }

    createWidget(widgetData:any):Promise<Widget> {
        let options = this.getRequestOptions();
        return this.http
            .post(`${API_ENDPOINT}${this.widgetsUrl}`, JSON.stringify(widgetData), options)
            .toPromise()
            .then(response => response.json())
            .catch(error => this.handleError(error));
    }

    saveWidget(widget:Widget) {
        let options = this.getRequestOptions();
        return this.http
            .patch(widget.url, JSON.stringify(widget, Widget.omitKeys), options)
            .toPromise()
            .then(response => response)
            .catch(error => this.handleError(error));
    }

    resetWidget(widget:Widget) {
        let options = this.getRequestOptions();
        return this.http
            .post(`${widget.url}reset/`, '', options)
            .toPromise()
            .then(response => response.json())
            .catch(error => this.handleError(error));
    }

    runWidget(widget:Widget) {
        let options = this.getRequestOptions();
        return this.http
            .post(`${widget.url}run/`, '', options)
            .toPromise()
            .then(response => response.json())
            .catch(error => this.handleError(error));
    }

    deleteWidget(widget:Widget) {
        let options = this.getRequestOptions();
        options.body = '';
        return this.http
            .delete(widget.url, options)
            .toPromise()
            .then(response => response)
            .catch(error => this.handleError(error));
    }

    saveWidgetPosition(widget:Widget) {
        let options = this.getRequestOptions();
        return this.http
            .patch(widget.url, JSON.stringify({url: widget.url, x: widget.x, y: widget.y}), options)
            .toPromise()
            .then(response => response)
            .catch(error => this.handleError(error));
    }

    saveParameters(widget:Widget) {
        let options = this.getRequestOptions();
        let parameters:any[] = [];
        for (var param of widget.parameters) {
            parameters.push({
                'id': param.id,
                'value': param.deserialized_value
            });
        }
        return this.http
            .patch(`${widget.url}save-parameters/`, JSON.stringify(parameters), options)
            .toPromise()
            .then(response => response)
            .catch(error => this.handleError(error));
    }

    createConnection(connectionData:any) {
        let options = this.getRequestOptions();
        return this.http
            .post(`${API_ENDPOINT}${this.connectionsUrl}`, JSON.stringify(connectionData), options)
            .toPromise()
            .then(response => response.json())
            .catch(error => this.handleError(error));
    }

    fetchOutputValue(output:WorkflowOutput) {
        let options = this.getRequestOptions();
        options.body = '';
        return this.http
            .get(`${output.url}value/`, options)
            .toPromise()
            .then(response => response.json());
    }

    deleteConnection(conn:Connection) {
        let options = this.getRequestOptions();
        options.body = '';
        return this.http
            .delete(conn.url, options)
            .toPromise()
            .then(response => response)
            .catch(error => this.handleError(error));
    }

    workflowUpdates(onUpdateCallback:any, workflow:Workflow) {
        let socket = new WebSocket(`ws://${DOMAIN}/workflow-updates/?workflow_pk=${workflow.id}`);
        socket.onmessage = function (e) {
            onUpdateCallback(JSON.parse(e.data));
        }
    }
}