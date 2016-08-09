import {Injectable} from '@angular/core';
import {Http, Headers} from "@angular/http";
import 'rxjs/add/operator/toPromise';
import {API_ENDPOINT, TEST_TOKEN, DOMAIN} from "../config";
import {Category} from "../models/category";
import {Workflow} from "../models/workflow";
import {Widget} from "../models/widget";
import {Connection} from "../models/connection";
import {Input as WorkflowInput} from "../models/input";
import {Output as WorkflowOutput} from "../models/output";

@Injectable()
export class ClowdFlowsDataService {

    widgetLibraryUrl = 'widget-library/';
    workflowsUrl = 'workflows/';
    inputsUrl = 'inputs/';
    outputsUrl = 'outputs/';
    widgetsUrl = 'widgets/';
    connectionsUrl = 'connections/';

    constructor(private http:Http) {
    }

    getAuthTokenHeaders():Headers {
        let headers = new Headers();
        let auth_token = localStorage.getItem('auth_token');
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `Token ${auth_token}`);
        return headers;
    }

    getWidgetLibrary():Promise<Category[]> {
        let headers = this.getAuthTokenHeaders();
        //noinspection TypeScriptUnresolvedFunction
        return this.http
            .get(`${API_ENDPOINT}${this.widgetLibraryUrl}`, {headers})
            .toPromise()
            .then(response => ClowdFlowsDataService.parseWidgetLibrary(response))
            .catch(this.handleError);
    }

    static parseWidgetLibrary(response):Category[] {
        let widgetTree:Category[] = [];
        for (let cat of <Category[]> response.json()) {
            widgetTree.push(new Category(cat.name, cat.user, cat.order, cat.children, cat.widgets));
        }
        return widgetTree;
    }

    private handleError(error:any) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

    getWorkflow(id:number):Promise<any> {
        let headers = this.getAuthTokenHeaders();
        //noinspection TypeScriptUnresolvedFunction
        return this.http
            .get(`${API_ENDPOINT}${this.workflowsUrl}${id}/`, {headers})
            .toPromise()
            .then(response => ClowdFlowsDataService.parseWorkflow(response))
            .catch(this.handleError);
    }

    runWorkflow(workflow):Promise<any> {
        let headers = this.getAuthTokenHeaders();
        //noinspection TypeScriptUnresolvedFunction
        return this.http
            .post(`${workflow.url}run/`, {}, {headers})
            .toPromise()
            .then()
            .catch(this.handleError);
    }

    static parseWorkflow(response):Workflow {
        let data = response.json();
        let workflow = new Workflow(data.id, data.url, data.widgets, data.connections, data.is_subprocess, data.name,
            data.public, data.description, data.widget, data.template_parent);
        return workflow;
    }

    saveWidget(widget:Widget) {
        let headers = this.getAuthTokenHeaders();
        //noinspection TypeScriptUnresolvedFunction
        return this.http
            .patch(widget.url, widget.toJSON(), {headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    deleteWidget(widget:Widget) {
        let headers = this.getAuthTokenHeaders();
        //noinspection TypeScriptUnresolvedFunction
        return this.http
            .delete(widget.url, {headers})
            .toPromise()
            .then(result => result)
            .catch(this.handleError);
    }

    saveWidgetPosition(widget:Widget) {
        let headers = this.getAuthTokenHeaders();
        //noinspection TypeScriptUnresolvedFunction
        return this.http
            .patch(widget.url, JSON.stringify({url: widget.url, x: widget.x, y: widget.y}), {headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
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
            .then(response => response.json())
            .catch(this.handleError);
    }

    addConnection(conn:Connection) {
        let headers = this.getAuthTokenHeaders();
        //noinspection TypeScriptUnresolvedFunction
        return this.http
            .post(`${API_ENDPOINT}${this.connectionsUrl}`, conn.toJSON(), {headers})
            .toPromise()
            .then(result => conn.url = result.json().url)
            .catch(this.handleError);
    }

    addWidget(widget:Widget) {
        let headers = this.getAuthTokenHeaders();
        return this.http
            .post(`${API_ENDPOINT}${this.widgetsUrl}`, widget.toJSON(false), {headers})
            .toPromise()
            .then(result => {
                let data = result.json();
                widget.url = data.url;
                widget.id = data.id;
                for (let input of widget.inputs) {
                    this.addInput(input);
                }
                for (let output of widget.outputs) {
                    this.addOutput(output);
                }
            });
    }

    addInput(input:WorkflowInput) {
        let headers = this.getAuthTokenHeaders();
        return this.http
            .post(`${API_ENDPOINT}${this.inputsUrl}`, input.toJSON(false), {headers})
            .toPromise()
            .then(result => {
                let data = result.json();
                input.url = data.url;
                input.id = data.id;
            });
    }

    addOutput(output:WorkflowOutput) {
            let headers = this.getAuthTokenHeaders();
            return this.http
                .post(`${API_ENDPOINT}${this.outputsUrl}`, output.toJSON(false), {headers})
                .toPromise()
                .then(result => {
                    let data = result.json();
                    output.url = data.url;
                    // output.id = data.id;
                });
    }

    deleteConnection(conn:Connection) {
        let headers = this.getAuthTokenHeaders();
        //noinspection TypeScriptUnresolvedFunction
        return this.http
            .delete(conn.url, {headers})
            .toPromise()
            .then(result => result)
            .catch(this.handleError);
    }

    workflowUpdates(onUpdateCallback, workflow:Workflow) {
        let socket = new WebSocket(`ws://${DOMAIN}/workflow-updates/?workflow_pk=` + workflow.id);
        socket.onmessage = function (e) {
            onUpdateCallback(JSON.parse(e.data));
        }
    }
}