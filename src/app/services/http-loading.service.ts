import {Http, RequestOptions, ConnectionBackend, RequestOptionsArgs} from "@angular/http";
import {LoadingService} from "./loading.service";


export class HttpLoading extends Http {

    constructor(backend: ConnectionBackend, defaultOptions: RequestOptions, private loadingService: LoadingService) {
        super(backend, defaultOptions);
    }

    get(url: string, options?: RequestOptionsArgs) {
        this.loadingService.isLoading = true;
        return super.get(url, options)
            .map(res => {
                this.loadingService.isLoading = false;
                return res;
            });
    }

    // post(url: string, body: any, options?: RequestOptionsArgs) {
    //     this.loadingService.isLoading = true;
    //     return super.post(url, body, options)
    //         .map(res => {
    //             this.loadingService.isLoading = false;
    //             return res;
    //         });
    // }
    //
    // put(url: string, body: any, options?: RequestOptionsArgs) {
    //     this.loadingService.isLoading = true;
    //     return super.put(url, body, options)
    //         .map(res => {
    //             this.loadingService.isLoading = false;
    //             return res;
    //         });
    // }
    //
    // delete(url: string, options?: RequestOptionsArgs) {
    //     this.loadingService.isLoading = true;
    //     return super.delete(url, options)
    //         .map(res => {
    //             this.loadingService.isLoading = false;
    //             return res;
    //         });
    // }
    //
    // patch(url: string, body: any, options?: RequestOptionsArgs) {
    //     this.loadingService.isLoading = true;
    //     return super.patch(url, body, options)
    //         .map(res => {
    //             this.loadingService.isLoading = false;
    //             return res;
    //         });
    // }
}
