import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {LoadingService} from "./loading.service";
import { map } from 'rxjs/operators';

@Injectable()
export class HttpLoading implements HttpInterceptor {

  public constructor(private loadingService: LoadingService) {
  }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    this.loadingService.isLoading = true;

    return next.handle(req).pipe(
      map((event: HttpEvent<any>) => {
        this.loadingService.isLoading = false;
        return event;
      }));;
  }
}


//import {RequestOptions, ConnectionBackend, RequestOptionsArgs} from "@angular/http";
//import { HttpClient } from "@angular/common/http";
//


// /*
//     Overrides Http methods to toggle the loading flag
//  */
// export class HttpLoading extends HttpClient {
//
//     constructor(backend: ConnectionBackend, defaultOptions: RequestOptions, private loadingService: LoadingService) {
//         super(backend, defaultOptions);
//     }
//
//     get(url: string, options?: RequestOptionsArgs) {
//         this.loadingService.isLoading = true;
//         return super.get(url, options)
//             .map(res => {
//                 this.loadingService.isLoading = false;
//                 return res;
//             });
//     }
//
//     // post(url: string, body: any, options?: RequestOptionsArgs) {
//     //     this.loadingService.isLoading = true;
//     //     return super.post(url, body, options)
//     //         .map(res => {
//     //             this.loadingService.isLoading = false;
//     //             return res;
//     //         });
//     // }
//     //
//     // put(url: string, body: any, options?: RequestOptionsArgs) {
//     //     this.loadingService.isLoading = true;
//     //     return super.put(url, body, options)
//     //         .map(res => {
//     //             this.loadingService.isLoading = false;
//     //             return res;
//     //         });
//     // }
//     //
//     // delete(url: string, options?: RequestOptionsArgs) {
//     //     this.loadingService.isLoading = true;
//     //     return super.delete(url, options)
//     //         .map(res => {
//     //             this.loadingService.isLoading = false;
//     //             return res;
//     //         });
//     // }
//     //
//     // patch(url: string, body: any, options?: RequestOptionsArgs) {
//     //     this.loadingService.isLoading = true;
//     //     return super.patch(url, body, options)
//     //         .map(res => {
//     //             this.loadingService.isLoading = false;
//     //             return res;
//     //         });
//     // }
// }
