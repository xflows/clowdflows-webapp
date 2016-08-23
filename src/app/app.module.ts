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
import {EditorComponent} from "./components/editor/editor.component";
import {ClowdFlowsDataService} from './services/clowdflows-data.service';

@NgModule({
    imports: [
        BrowserModule,
        routing,
        FormsModule,
        HttpModule,
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        LoginComponent,
        EditorComponent
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
