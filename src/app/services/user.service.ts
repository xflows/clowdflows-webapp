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
                    localStorage.setItem('auth_token', res.token);
                    this.loggedIn = true;
                    return true;
                }
                return false;
            });
    }

    logout(redirectUrl:string) {
        localStorage.removeItem('auth_token');
        this.loggedIn = false;
        this.router.navigate([redirectUrl]);
    }

    isLoggedIn() {
        return this.loggedIn;
    }
}