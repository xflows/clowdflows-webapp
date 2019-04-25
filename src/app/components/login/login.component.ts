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
            .subscribe((result) => {
              console.log(result)
                if (result.status == 200) {
                    this.router.navigate(['']);
                    this.loginError = '';
                } else {
                    this.loginError = result["errorText"]
                }
            });
    }

    attemptRegistration() {
        this.userService
            .register(this.registrationData.username, this.registrationData.password, this.registrationData.email)
            .subscribe((result) => {
                if (result.status == 200) {
                    this.router.navigate(['']);
                    this.registrationError = '';
                } else {
                    this.registrationError = result["errorText"]
                }
            });
    }
}
