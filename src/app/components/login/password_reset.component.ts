import { Component } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {AbstractControl} from '@angular/forms';
import {UserService} from "../../services/user.service";

@Component({
    selector: 'password_reset',
    template: require('./password_reset.component.html')
})
export class PasswordResetComponent {
    uid: string
    token: string

    passwordData: string
    confirmPasswordResetStatus = '';
    confirmPasswordResetErrorText = '';

    constructor(private userService: UserService, private route:ActivatedRoute) {}

    ngOnInit() {
        this.route.params.subscribe((params: Params) => {
            this.uid = params['uid']
            this.token = params['token'];
        });
    }

    // ngOnDestroy() {
    //     this.sub.unsubscribe();
    // }

    confirmPasswordReset() {
        this.userService
            .confirmPasswordReset(this.uid,this.token,this.passwordData)
            .subscribe(result =>  {
                this.confirmPasswordResetStatus=result.status;
                this.confirmPasswordResetErrorText=result.errorText;
            })
    }
}