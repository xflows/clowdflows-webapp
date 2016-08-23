import { Injectable } from '@angular/core';
import { CanActivate, Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot }    from '@angular/router';
import {UserService} from "./user.service";


@Injectable()
export class LoggedInGuard implements CanActivate {
    constructor(private user: UserService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.user.isLoggedIn()) {
            return true;
        }

        // Store the attempted URL for redirecting
        this.user.redirectUrl = state.url;

        // Navigate to the login page
        this.router.navigate(['/login']);
        return false;
    }
}