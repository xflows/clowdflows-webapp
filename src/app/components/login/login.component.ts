import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {UserService} from "../../services/user.service";

@Component({
    selector: 'login',
    template: require('./login.component.html')
})
export class LoginComponent {

    loginCredentials:any = {
        username: '',
        password: '',
        rememberMe: false
    };

    constructor(private userService: UserService, private router: Router) {}

    attemptLogin() {
        this.userService
            .login(this.loginCredentials.username, this.loginCredentials.password)
            .subscribe(
                (result) => {
                    if (result) {
                        this.router.navigate(['']);

                    }
            });
    }

    attemptRegistration(username:string, password:string) {

    }
}