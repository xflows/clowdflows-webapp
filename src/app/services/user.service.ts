
import {of as observableOf, Observable} from 'rxjs';

import {catchError, map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from "@angular/common/http";
import { Router } from '@angular/router';
import {API_ENDPOINT} from "../config";


@Injectable()
export class UserService {
    private loggedIn = false;
    public redirectUrl:string = null;

    constructor(private http: HttpClient, private router: Router) {
        this.loggedIn = !!localStorage.getItem('auth_token');
    }

    login(username:string, password:string) {
        let headers = new HttpHeaders({
           'Content-Type':  'application/json',
        });
        return this.http
            .post(`${API_ENDPOINT}auth/token/create/`, JSON.stringify({ username, password }), {observe: 'response', headers: headers}).pipe(
            map(res => {
                if (res.status==200) {
                    localStorage.setItem('username', username);
                    let body:any = res.body
                    localStorage.setItem('auth_token', body.auth_token);
                    this.loggedIn = true;
                }
                return {status: res.status};
            }),catchError((error: any) => {
               return observableOf({status: error.status,
                    errorText: (error.status==400 ? error.error.non_field_errors.join(' ') : 'Something went wrong')});
            }),);
    }

    logout(redirectUrl:string) {
        localStorage.removeItem('auth_token');
        //should destroy token also be called on server-side
        this.loggedIn = false;
        this.router.navigate([redirectUrl]);
    }

    register(username: string, password: string, email: string) {
        let headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');

        return this.http
            .post(`${API_ENDPOINT}auth/users/create/`, {username, password, email}, {observe: 'response', headers}).pipe(
            map((res) => {
                if (res.status==200) {
                    localStorage.setItem('username', username);
                    let body:any = res.body
                    localStorage.setItem('auth_token', body.auth_token);
                    this.loggedIn = true;
                }
                return {status: res.status};
            }),catchError((error: any) => {
                let errors:Array<String>=[]
                let body=error.error
                Object.keys(body).forEach(function(key){
                    errors = errors.concat(body[key]);
                });

                return observableOf({
                    status: error.status,
                    errorText: (error.status == 400 ? errors.join(' ') : 'Something went wrong')
                });
            }),)
    }

    sendPasswordResetEmail(email:string): Observable<string> {
        let headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');

        return this.http
            .post(`${API_ENDPOINT}auth/password/reset/`, JSON.stringify({ email }), { headers }).pipe(
            map(() => {
                return "ok"
            }),catchError((error: any) => {
                return observableOf("error")
            }),)
    }
    confirmPasswordReset(uid:string, token: string, password: string): Observable<any> {
        let headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');

        return this.http
            .post(`${API_ENDPOINT}auth/password/reset/confirm/`, JSON.stringify({ uid: uid, token: token, new_password: password }), { observe: 'response', headers }).pipe(
            map((res) => {
                return {status: res.status,errorText: ''};
            }),catchError((error: any) => {
                let errors:Array<String>=[]
                let body=error.error
                Object.keys(body).forEach(function(key){
                    errors = errors.concat(body[key]);
                });
                return observableOf({status: error.status,
                    errorText: (error.status==400 ? errors.join(' ') : 'Something went wrong')})
            }),)
    }

    isLoggedIn() {
        return this.loggedIn;
    }

    getUsername() {
        return localStorage.getItem('username');
    }
}
