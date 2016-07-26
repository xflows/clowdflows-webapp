import {Injectable} from '@angular/core';
import {Http, Headers} from "@angular/http";
import 'rxjs/add/operator/toPromise';
import {API_ENDPOINT, TEST_TOKEN} from "../config";
import {Category} from "../models/category";
import {Workflow} from "../models/workflow";
import {Widget} from "../models/widget";

@Injectable()
export class ClowdFlowsDataService {

    widgetLibraryUrl = 'widget-library/';
    workflowsUrl = 'workflows/';
    widgetsUrl = 'widgets/';

    constructor(private http:Http) {
    }

    getAuthTokenHeaders():Headers {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `Token ${TEST_TOKEN}`);
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

    static parseWorkflow(response):Workflow {
        let data = response.json();
        let workflow = new Workflow(data.url, data.widgets, data.connections, data.is_subprocess, data.name,
                                    data.public, data.description, data.widget, data.template_parent);
        return workflow;
    }

    saveWidget(widget:Widget) {
        let headers = this.getAuthTokenHeaders();
        //noinspection TypeScriptUnresolvedFunction
        return this.http
            .put(widget.url, JSON.stringify(widget), {headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }
}