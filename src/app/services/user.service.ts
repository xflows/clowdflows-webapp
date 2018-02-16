import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';
import {API_ENDPOINT} from "../config";
import {Observable} from "rxjs/Observable";


@Injectable()
export class UserService {
    private loggedIn = false;
    public redirectUrl:string = null;

    constructor(private http: Http, private router: Router) {
        this.loggedIn = !!localStorage.getItem('auth_token');
    }

    login(username:string, password:string) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.http
            .post(`${API_ENDPOINT}auth/token/create/`, JSON.stringify({ username, password }), { headers })
            .map((res) => {
                if (res.status==200) {
                    localStorage.setItem('username', username);
                    localStorage.setItem('auth_token', res.json().auth_token);
                    this.loggedIn = true;
                }
                return {status: res.status};
            }).catch((error: any) => {
                return Observable.of({status: error.status,
                    errorText: (error.status==400 ? error.json().non_field_errors.join(' ') : 'Something went wrong')});
            });
    }

    logout(redirectUrl:string) {
        localStorage.removeItem('auth_token');
        //should destroy token also be called on server-side
        this.loggedIn = false;
        this.router.navigate([redirectUrl]);
    }

    register(username: string, password: string, email: string) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.http
            .post(`${API_ENDPOINT}auth/users/create/`, JSON.stringify({username, password, email}), {headers})
            .map((res) => {
                if (res.status==200) {
                    localStorage.setItem('username', username);
                    localStorage.setItem('auth_token', res.json().auth_token);
                    this.loggedIn = true;
                }
                return {status: res.status};
            }).catch((error: any) => {
                let errors:Array<String>=[]
                let body=error.json()
                Object.keys(body).forEach(function(key){
                    errors = errors.concat(body[key]);
                });

                return Observable.of({
                    status: error.status,
                    errorText: (error.status == 400 ? errors.join(' ') : 'Something went wrong')
                });
            })
    }

    sendPasswordResetEmail(email:string): Observable<string> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.http
            .post(`${API_ENDPOINT}auth/password/reset/`, JSON.stringify({ email }), { headers })
            .map(() => {
                return "ok"
            }).catch((error: any) => {
                return Observable.of("error")
            })
    }
    confirmPasswordReset(uid:string, token: string, password: string): Observable<any> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.http
            .post(`${API_ENDPOINT}auth/password/reset/confirm/`, JSON.stringify({ uid: uid, token: token, new_password: password }), { headers })
            .map((res) => {
                return {status: res.status,errorText: ''};
            }).catch((error: any) => {
                let errors:Array<String>=[]
                let body=error.json()
                Object.keys(body).forEach(function(key){
                    errors = errors.concat(body[key]);
                });
                return Observable.of({status: error.status,
                    errorText: (error.status==400 ? errors.join(' ') : 'Something went wrong')})
            })
    }

    isLoggedIn() {
        return this.loggedIn;
    }

    getUsername() {
        return localStorage.getItem('username');
    }
}