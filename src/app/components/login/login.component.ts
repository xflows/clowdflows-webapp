import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {AbstractControl} from '@angular/forms';
import {UserService} from "../../services/user.service";

@Component({
    selector: 'login',
    template: require('./login.component.html')
})
export class LoginComponent {

    registrationData:any = {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    };
    registrationError = '';

    loginCredentials:any = {
        username: '',
        password: '',
        rememberMe: false
    };
    loginError = '';

    constructor(private userService: UserService, private router: Router) {}

    attemptLogin() {
        this.userService
            .login(this.loginCredentials.username, this.loginCredentials.password)
            .subscribe(
                (result) => {
                    if (result.status == 'ok') {
                        this.router.navigate(['']);
                        this.loginError = '';
                    } else if (result.status == 'error') {
                        this.loginError = result.message;
                    } else {
                        this.loginError = 'Something went wrong'
                    }
            });
    }

    attemptRegistration() {
        console.log('attemptRegistration');
        this.userService
            .register(this.registrationData.username, this.registrationData.password, this.registrationData.email)
            .subscribe(
                (result) => {
                    if (result.status == 'ok') {
                        this.router.navigate(['']);
                        this.registrationError = '';
                    } else if (result.status == 'error') {
                        this.registrationError = result.message;
                    } else {
                        this.registrationError = 'Something went wrong'
                    }
                });
    }
}