import { Injectable } from '@angular/core';
import { Http, Headers } from "@angular/http";
import 'rxjs/add/operator/toPromise';
import {ConfigService} from "./config.service";

@Injectable()
export class ClowdFlowsService {

    widgetLibraryUrl = 'widget-library/';

    constructor(private http: Http,
                private config: ConfigService) { }

    getWidgetLibrary(): Promise {
        console.log(this.config.api_base_url + this.widgetLibraryUrl);
        return this.http.get(this.config.api_base_url + this.widgetLibraryUrl)
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}