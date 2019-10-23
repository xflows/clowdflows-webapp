
import {of as observableOf, Observable} from 'rxjs';
import {
  getTestBed,
    inject,
    TestBed, fakeAsync
} from '@angular/core/testing';
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";
import {LoginComponent} from "./login.component";
import {FormsModule} from "@angular/forms";
import {FooterComponent} from "../footer/footer.component";
import {AlertModule} from "ngx-bootstrap";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

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
            return observableOf(true);
        }
        return observableOf(false);
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

  let injector: TestBed;
  let service: UserService;
  let httpMock: HttpTestingController;

    beforeEach(() => {

        TestBed
            .configureTestingModule({
                imports: [
                    FormsModule,
                    AlertModule.forRoot(),
                    HttpClientTestingModule
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

            injector = getTestBed();
            service = injector.get(UserService);
            httpMock = injector.get(HttpTestingController);
    });


    it('should log in', () => {
      let serviceCopy = service;
      var fixture = TestBed.createComponent(LoginComponent);
      fixture.debugElement.componentInstance.loginCredentials = {
          username: TEST_CREDENTIALS.username,
          password: TEST_CREDENTIALS.password
      };
      fixture.debugElement.componentInstance.attemptLogin();
      fixture.detectChanges();
      fixture.whenStable().then(()=>{
        expect(serviceCopy.isLoggedIn()).toBe(true);
      });
    });


    /*it('should log in', fakeAsync(inject([UserService], (userService:UserService) => {
      console.log("should log in im in")
        var fixture = TestBed.createComponent(LoginComponent);
        fixture.debugElement.componentInstance.loginCredentials = {
            username: TEST_CREDENTIALS.username,
            password: TEST_CREDENTIALS.password
        };
        fixture.debugElement.componentInstance.attemptLogin();
        fixture.detectChanges();
        fixture.whenStable().then(()=>{
          console.log(" lalala");
            expect(userService.isLoggedIn()).toBe(true);
        });
    })));*/

    it('should not log in', () => {
      let serviceCopy = service;
      var fixture = TestBed.createComponent(LoginComponent);
      fixture.debugElement.componentInstance.loginCredentials = {
          username: TEST_CREDENTIALS.username,
          password: 'wrongpassword'
      };
      fixture.debugElement.componentInstance.attemptLogin();
      fixture.detectChanges();
      fixture.whenStable().then(()=>{
        expect(serviceCopy.isLoggedIn()).toBe(false);
      });
    });

    /*it('should not log in', fakeAsync(inject([UserService], (userService:UserService) => {
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
    })));*/
});
