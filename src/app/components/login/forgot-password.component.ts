import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {AbstractControl} from '@angular/forms';
import {UserService} from "../../services/user.service";

@Component({
    selector: 'forgot-password',
    template: require('./forgot-password.component.html')
})
export class ForgotPasswordComponent {

    sendPasswordResetEmailData:any = {
        email: '',
    };
    sendPasswordResetEmailStatus = '';

    constructor(private userService: UserService, private router: Router) {}

    sendPasswordResetEmail() {
        this.userService
            .sendPasswordResetEmail(this.sendPasswordResetEmailData.email)
            .subscribe(result =>  this.sendPasswordResetEmailStatus=result );
    }
}