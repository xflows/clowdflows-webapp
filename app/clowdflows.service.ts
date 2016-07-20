import {Injectable} from '@angular/core';
import {Http, Headers} from "@angular/http";
import 'rxjs/add/operator/toPromise';
import {ConfigService} from "./config.service";
import {Category} from "./models/category";

@Injectable()
export class ClowdFlowsService {

    widgetLibraryUrl = 'widget-library/';

    constructor(private http:Http,
                private config:ConfigService) {
    }

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
            .then(response => <Category[]> response.json())
            .catch(this.handleError);
    }

    private handleError(error:any) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}