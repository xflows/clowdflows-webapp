import {bootstrap} from '@angular/platform-browser-dynamic';
import {HTTP_PROVIDERS} from '@angular/http';
import {AppComponent} from './app.component';
import {ConfigService} from './config.service';

bootstrap(AppComponent, [
    HTTP_PROVIDERS,
    ConfigService
]);
