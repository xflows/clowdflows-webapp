import {Injectable} from '@angular/core';
import {Http, Headers} from "@angular/http";
import 'rxjs/add/operator/toPromise';
import {API_ENDPOINT, DOMAIN} from "../config";
import {Workflow} from "../models/workflow";
import {Widget} from "../models/widget";
import {Connection} from "../models/connection";
import {Output as WorkflowOutput} from "../models/output";
import {LoggerService} from "./logger.service";
import {BASE_URL} from "../_config";

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

    getAuthTokenHeaders():Headers {
        let headers = new Headers();
        let auth_token = localStorage.getItem('auth_token');
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `Token ${auth_token}`);
        return headers;
    }

    getWidgetLibrary() {
        let headers = this.getAuthTokenHeaders();
        //noinspection TypeScriptUnresolvedFunction
        return this.http
            .get(`${API_ENDPOINT}${this.widgetLibraryUrl}`, {headers})
            .toPromise()
            .then(response => response.json())
            .catch(error => this.handleError(error));
    }

    private handleError(error:any) {
        console.error('An error occurred', error);
        let message = error.message || error;
        this.loggerService.error(`HTTP error: ${error}`);
    }

    getWorkflow(id:number):Promise<any> {
        let headers = this.getAuthTokenHeaders();
        //noinspection TypeScriptUnresolvedFunction
        return this.http
            .get(`${API_ENDPOINT}${this.workflowsUrl}${id}/`, {headers})
            .toPromise()
            .then(response => response.json())
            .catch(error => this.handleError(error));
    }

    runWorkflow(workflow:Workflow):Promise<any> {
        let headers = this.getAuthTokenHeaders();
        //noinspection TypeScriptUnresolvedFunction
        return this.http
            .post(`${workflow.url}run/`, {}, {headers})
            .toPromise()
            .then(response => response.json())
            .catch(error => this.handleError(error));
    }

    resetWorkflow(workflow:Workflow):Promise<any> {
        let headers = this.getAuthTokenHeaders();
        //noinspection TypeScriptUnresolvedFunction
        return this.http
            .post(`${workflow.url}reset/`, {}, {headers})
            .toPromise()
            .then(response => response)
            .catch(error => this.handleError(error));
    }

    visualizeWidget(widget:Widget) {
        let headers = this.getAuthTokenHeaders();
        //noinspection TypeScriptUnresolvedFunction
        return this.http
            .get(`${widget.url}visualize/`, {headers})
            .toPromise()
            .then(html => html)
            .catch(error => this.handleError(error));
    }

    interactWidget(widget:Widget) {
        let headers = this.getAuthTokenHeaders();
        //noinspection TypeScriptUnresolvedFunction
        return this.http
            .get(`${widget.url}interact/`, {headers})
            .toPromise()
            .then(html => html)
            .catch(error => this.handleError(error));
    }

    finishInteractionWidget(widget:Widget, data:any) {
        let headers = this.getAuthTokenHeaders();
        //noinspection TypeScriptUnresolvedFunction
        return this.http
            .post(`${widget.url}interact/`, JSON.stringify(data), {headers})
            .toPromise()
            .then(response => response.json())
            .catch(error => this.handleError(error));
    }

    getWidget(id:number):Promise<any> {
        let headers = this.getAuthTokenHeaders();
        //noinspection TypeScriptUnresolvedFunction
        return this.http
            .get(`${API_ENDPOINT}${this.widgetsUrl}${id}/`, {headers})
            .toPromise()
            .then(response => response.json())
            .catch(error => this.handleError(error));
    }

    addWidget(widgetData:any):Promise<Widget> {
        let headers = this.getAuthTokenHeaders();
        return this.http
            .post(`${API_ENDPOINT}${this.widgetsUrl}`, JSON.stringify(widgetData), {headers})
            .toPromise()
            .then(response => response.json())
            .catch(error => this.handleError(error));
    }

    saveWidget(widget:Widget) {
        let headers = this.getAuthTokenHeaders();
        //noinspection TypeScriptUnresolvedFunction
        return this.http
            .patch(widget.url, JSON.stringify(widget), {headers})
            .toPromise()
            .then(response => response)
            .catch(error => this.handleError(error));
    }

    resetWidget(widget:Widget) {
        let headers = this.getAuthTokenHeaders();
        //noinspection TypeScriptUnresolvedFunction
        return this.http
            .post(`${widget.url}reset/`, '', {headers})
            .toPromise()
            .then(response => response.json())
            .catch(error => this.handleError(error));
    }

    runWidget(widget:Widget) {
        let headers = this.getAuthTokenHeaders();
        //noinspection TypeScriptUnresolvedFunction
        return this.http
            .post(`${widget.url}run/`, '', {headers})
            .toPromise()
            .then(response => response.json())
            .catch(error => this.handleError(error));
    }

    deleteWidget(widget:Widget) {
        let headers = this.getAuthTokenHeaders();
        //noinspection TypeScriptUnresolvedFunction
        return this.http
            .delete(widget.url, {headers})
            .toPromise()
            .then(response => response)
            .catch(error => this.handleError(error));
    }

    saveWidgetPosition(widget:Widget) {
        let headers = this.getAuthTokenHeaders();
        //noinspection TypeScriptUnresolvedFunction
        return this.http
            .patch(widget.url, JSON.stringify({url: widget.url, x: widget.x, y: widget.y}), {headers})
            .toPromise()
            .then(response => response)
            .catch(error => this.handleError(error));
    }

    saveParameters(widget:Widget) {
        let headers = this.getAuthTokenHeaders();
        let parameters = [];
        for (var param of widget.parameters) {
            parameters.push({
                'id': param.id,
                'value': param.deserialized_value
            });
        }
        return this.http
            .patch(`${widget.url}save-parameters/`, JSON.stringify(parameters), {headers})
            .toPromise()
            .then(response => response)
            .catch(error => this.handleError(error));
    }

    addConnection(connectionData:any) {
        let headers = this.getAuthTokenHeaders();
        //noinspection TypeScriptUnresolvedFunction
        return this.http
            .post(`${API_ENDPOINT}${this.connectionsUrl}`, JSON.stringify(connectionData), {headers})
            .toPromise()
            .then(response => response.json())
            .catch(error => this.handleError(error));
    }

    fetchOutputValue(output:WorkflowOutput) {
        let headers = this.getAuthTokenHeaders();
        return this.http
            .get(`${output.url}value/`, {headers})
            .toPromise()
            .then(response => response.json());
    }

    deleteConnection(conn:Connection) {
        let headers = this.getAuthTokenHeaders();
        //noinspection TypeScriptUnresolvedFunction
        return this.http
            .delete(conn.url, {headers})
            .toPromise()
            .then(response => response)
            .catch(error => this.handleError(error));
    }

    workflowUpdates(onUpdateCallback, workflow:Workflow) {
        let socket = new WebSocket(`ws://${DOMAIN}/workflow-updates/?workflow_pk=${workflow.id}`);
        socket.onmessage = function (e) {
            onUpdateCallback(JSON.parse(e.data));
        }
    }
}