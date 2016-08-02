import {bootstrap} from '@angular/platform-browser-dynamic';
import {HTTP_PROVIDERS} from '@angular/http';
import {AppComponent} from './components/app.component';
import {appRouterProviders} from "./app.routes";
import {UserService} from "./services/user.service";
import {LoggedInGuard} from "./services/logged-in.guard";

bootstrap(AppComponent, [
    HTTP_PROVIDERS,
    UserService,
    LoggedInGuard,
    appRouterProviders
]);
