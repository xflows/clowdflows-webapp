import {bootstrap} from '@angular/platform-browser-dynamic';
import {HTTP_PROVIDERS} from '@angular/http';
import {AppComponent} from './components/app.component';
import {ConfigService} from './services/config.service';

bootstrap(AppComponent, [
    HTTP_PROVIDERS,
    ConfigService
]);
