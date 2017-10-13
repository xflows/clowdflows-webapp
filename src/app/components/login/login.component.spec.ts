import {
    inject,
    TestBed, fakeAsync
} from '@angular/core/testing';
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";
import {LoginComponent} from "./login.component";
import {FormsModule} from "@angular/forms";
import {Observable} from "rxjs/Rx";
import {FooterComponent} from "../footer/footer.component";
import {AlertModule} from "ng2-bootstrap";

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
                    FormsModule,
                    AlertModule.forRoot()
                ],
                declarations: [
                    LoginComponent,
                    FooterComponent
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
