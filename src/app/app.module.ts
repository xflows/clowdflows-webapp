import {NgModule} from '@angular/core';
import {BrowserModule}  from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {HttpModule} from '@angular/http';
import {UserService} from "./services/user.service";
import {LoggedInGuard} from "./services/logged-in.guard";
import {LoggerService} from "./services/logger.service";
import {FormsModule} from "@angular/forms";
import {routing} from './app.routing';
import {LoginComponent} from "./components/login/login.component";
import {HomeComponent} from "./components/home/home.component";
import {ClowdFlowsDataService} from './services/clowdflows-data.service';
import {EditorModule} from "./components/editor/editor.module";
import {WorkflowsComponent} from "./components/workflows/workflows.component";
import {UserWorkflowsComponent} from "./components/workflows/user-workflows.component";
import {WorkflowDetailComponent} from "./components/workflows/workflow-detail.component";
import {FooterComponent} from "./components/footer/footer.component";

@NgModule({
    imports: [
        BrowserModule,
        routing,
        FormsModule,
        HttpModule,
        EditorModule
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        LoginComponent,
        FooterComponent,
        WorkflowsComponent,
        UserWorkflowsComponent,
        WorkflowDetailComponent
    ],
    providers: [
        ClowdFlowsDataService,
        UserService,
        LoggerService,
        LoggedInGuard,
    ],
    bootstrap: [
        AppComponent,
    ]
})
export class AppModule {
}
