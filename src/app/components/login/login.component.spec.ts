import {
    async,
    inject,
    TestBed, fakeAsync, tick
} from '@angular/core/testing';
import {dispatchEvent} from '@angular/platform-browser/testing/browser_util';
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";
import {LoginComponent} from "./login.component";
import {FormsModule} from "@angular/forms";
import {Observable} from "rxjs/Rx";
import {By} from "@angular/platform-browser";

let TEST_CREDENTIALS = {
    username: 'testuser',
    password: 'testpassword'
};

class MockUserService {
    private loggedIn = false;

    login(username:string, password:string) {
        if (username == TEST_CREDENTIALS.username &&
            password == TEST_CREDENTIALS.password) {
            this.loggedIn = true;
            console.log(this.loggedIn);
            return Observable.of(true);
        }
        return Observable.of(false);
    }

    logout(redirectUrl:string) {
        this.loggedIn = false;
    }

    isLoggedIn() {
        return this.loggedIn;
    }
}

class MockRouter {
    navigate(_:any) {
    }
}

describe('LoginComponent', () => {

    beforeEach(() => {
        TestBed
            .configureTestingModule({
                imports: [
                    FormsModule
                ],
                declarations: [
                  LoginComponent
                ],
                providers: [
                    { provide: UserService, useClass: MockUserService },
                    { provide: Router, useClass: MockRouter }
                ]
            })
            .compileComponents();
    });

    it('should log in', fakeAsync(inject([UserService], (userService:UserService) => {
        var fixture = TestBed.createComponent(LoginComponent);
        fixture.debugElement.componentInstance.loginCredentials = {
            username: TEST_CREDENTIALS.username,
            password: TEST_CREDENTIALS.password
        };
        fixture.debugElement.componentInstance.attemptLogin();
        fixture.detectChanges();
        fixture.whenStable().then(()=>{
            expect(userService.isLoggedIn()).toBe(true);
        });
    })));

    it('should not log in', fakeAsync(inject([UserService], (userService:UserService) => {
        var fixture = TestBed.createComponent(LoginComponent);
        fixture.debugElement.componentInstance.loginCredentials = {
            username: TEST_CREDENTIALS.username,
            password: 'wrongpassword'
        };
        fixture.debugElement.componentInstance.attemptLogin();
        fixture.detectChanges();
        fixture.whenStable().then(()=>{
            expect(userService.isLoggedIn()).toBe(false);
        });
    })));
});
