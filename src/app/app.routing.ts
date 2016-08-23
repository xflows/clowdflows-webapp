import { Routes, RouterModule } from '@angular/router';
import {EditorComponent} from "./components/editor/editor.component";
import {LoginComponent} from "./components/login/login.component";
import {LoggedInGuard} from "./services/logged-in.guard";
import {HomeComponent} from "./components/home/home.component";

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'editor/:id',
        component: EditorComponent,
        canActivate: [LoggedInGuard]
    },
    {
        path: 'login',
        component: LoginComponent
    }
];

export const routing = RouterModule.forRoot(routes);