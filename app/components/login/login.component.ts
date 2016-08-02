import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {UserService} from "../../services/user.service";

@Component({
    selector: 'login',
    templateUrl: 'app/components/login/login.component.html'
})
export class LoginComponent {
    constructor(private userService: UserService, private router: Router) {}

    attemptLogin(loginData) {
        console.log(loginData, loginData.username, loginData.password);
        this.userService
            .login(loginData.username, loginData.password)
            .subscribe(
                (result) => {
                    if (result) {
                        this.router.navigate(['']);
                    }
            });
    }

    attemptRegistration(username, password) {

    }
}