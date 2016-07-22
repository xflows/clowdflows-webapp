import {Injectable} from '@angular/core';
import {Http, Headers} from "@angular/http";
import 'rxjs/add/operator/toPromise';
import {ConfigService} from "./config.service";
import {Category} from "../models/category";

@Injectable()
export class ClowdFlowsDataService {

    widgetLibraryUrl = 'widget-library/';

    constructor(private http:Http,
                private config:ConfigService
    ) { }

    getAuthTokenHeaders():Headers {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let authToken = this.config.test_token;
        headers.append('Authorization', `Token ${authToken}`);
        return headers;
    }

    getWidgetLibrary():Promise<Category[]> {
        let headers = this.getAuthTokenHeaders();
        return this.http
            .get(this.config.api_base_url + this.widgetLibraryUrl, {headers})
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
}