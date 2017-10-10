import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';
import {API_ENDPOINT} from "../config";


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
            .post(`${API_ENDPOINT}login/`, JSON.stringify({ username, password }), { headers })
            .map(res => res.json())
            .map((res) => {
                if (res.token) {
                    localStorage.setItem('username', username);
                    localStorage.setItem('auth_token', res.token);
                    this.loggedIn = true;
                }
                return res;
            });
    }

    logout(redirectUrl:string) {
        localStorage.removeItem('auth_token');
        this.loggedIn = false;
        this.router.navigate([redirectUrl]);
    }

    register(username:string, password:string, email:string) {
        console.log('register');
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.http
            .post(`${API_ENDPOINT}register/`, JSON.stringify({ username, password, email }), { headers })
            .map(res => res.json())
            .map((res) => {
                if (res.token) {
                    localStorage.setItem('username', username);
                    localStorage.setItem('auth_token', res.token);
                    this.loggedIn = true;
                }
                return res;
            });
    }

    isLoggedIn() {
        return this.loggedIn;
    }

    getUsername() {
        return localStorage.getItem('username');
    }
}