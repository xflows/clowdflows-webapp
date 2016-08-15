import {bootstrap} from '@angular/platform-browser-dynamic';
import {HTTP_PROVIDERS} from '@angular/http';
import {AppComponent} from './components/app.component';
import {appRouterProviders} from "./app.routes";
import {UserService} from "./services/user.service";
import {LoggedInGuard} from "./services/logged-in.guard";
import {LoggerService} from "./services/logger.service";

bootstrap(AppComponent, [
    HTTP_PROVIDERS,
    UserService,
    LoggedInGuard,
    LoggerService,
    appRouterProviders
]);
