import { Routes, RouterModule } from '@angular/router';
import {EditorComponent} from "./components/editor/editor.component";
import {LoginComponent} from "./components/login/login.component";
import {LoggedInGuard} from "./services/logged-in.guard";
import {HomeComponent} from "./components/home/home.component";
import {UserWorkflowsComponent} from "./components/workflows/user-workflows.component";
import {WorkflowDetailComponent} from "./components/workflows/workflow-detail.component";
import {WorkflowsComponent} from "./components/workflows/workflows.component";

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
    },
    {
        path: 'your-workflows',
        component: UserWorkflowsComponent,
        canActivate: [LoggedInGuard]
    },
    {
        path: 'explore-workflows',
        component: WorkflowsComponent,
        canActivate: [LoggedInGuard]
    },
    {
        path: 'workflow/:id',
        component: WorkflowDetailComponent,
        canActivate: [LoggedInGuard]
    },
];

export const routing = RouterModule.forRoot(routes);