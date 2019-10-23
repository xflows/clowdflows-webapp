import {NgModule} from '@angular/core';
import {BrowserModule}  from '@angular/platform-browser';
import {AppComponent} from './app.component';
import { XHRBackend} from '@angular/http';
import {HttpClientModule, HttpClient, HTTP_INTERCEPTORS} from '@angular/common/http';
import {UserService} from "./services/user.service";
import {LoggedInGuard} from "./services/logged-in.guard";
import {LoggerService} from "./services/logger.service";
import {FormsModule} from "@angular/forms";
import {AlertModule, CarouselModule} from "ngx-bootstrap";
import {routing} from './app.routing';
import {LoginComponent} from "./components/login/login.component";
import {ForgotPasswordComponent} from "./components/login/forgot-password.component";
import {HomeComponent} from "./components/home/home.component";
import {ClowdFlowsDataService} from './services/clowdflows-data.service';
import {EditorModule} from "./components/editor/editor.module";
import {WorkflowsComponent} from "./components/workflows/workflows.component";
import {UserWorkflowsComponent} from "./components/workflows/user-workflows.component";
import {WorkflowDetailComponent} from "./components/workflows/workflow-detail.component";
import {FooterComponent} from "./components/footer/footer.component";
import {LoadingService} from "./services/loading.service";
import {HttpLoading} from "./services/http-loading.service";
import {ImportWorkflowComponent} from "./components/import-export/import-workflow.component";
import {ExportWorkflowComponent} from "./components/import-export/export-workflow.component";
import {StreamComponent} from "./components/streams/stream.component";
import {StreamingWidgetComponent} from "./components/streams/streaming-widget.component";
import {SanitizeModule} from "./pipes/sanitize.module";
import {EqualValidator} from "./directives/validateEqual.directive";
import {PasswordResetComponent} from "./components/login/password-reset.component";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
    imports: [
        BrowserModule,
        routing,
        FormsModule,
        HttpClientModule,
        EditorModule,
        SanitizeModule,
        CarouselModule.forRoot(),
        AlertModule.forRoot(),
        FontAwesomeModule
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        LoginComponent,
        ForgotPasswordComponent,
        PasswordResetComponent,
        FooterComponent,
        WorkflowsComponent,
        UserWorkflowsComponent,
        WorkflowDetailComponent,
        ImportWorkflowComponent,
        ExportWorkflowComponent,
        StreamComponent,
        StreamingWidgetComponent,
        EqualValidator,
    ],
    providers: [
        ClowdFlowsDataService,
        UserService,
        LoggerService,
        LoggedInGuard,
        LoadingService,
        { provide: HTTP_INTERCEPTORS, useClass: HttpLoading, multi: true, deps: [LoadingService] }
        /*{
            provide: HttpClient,
            useClass: HttpLoading,
            deps: [XHRBackend, LoadingService],
            useFactory: (backend:XHRBackend, loadingService:LoadingService) => new HttpLoading(backend, loadingService)
        }*/
    ],
    bootstrap: [
        AppComponent,
    ]
})
export class AppModule {
}
