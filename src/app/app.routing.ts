import { Routes, RouterModule } from '@angular/router';
import {EditorComponent} from "./components/editor/editor.component";
import {LoginComponent} from "./components/login/login.component";
import {LoggedInGuard} from "./services/logged-in.guard";
import {HomeComponent} from "./components/home/home.component";
import {UserWorkflowsComponent} from "./components/workflows/user-workflows.component";
import {WorkflowDetailComponent} from "./components/workflows/workflow-detail.component";
import {WorkflowsComponent} from "./components/workflows/workflows.component";
import {ImportWorkflowComponent} from "./components/import-export/import-workflow.component";
import {ExportWorkflowComponent} from "./components/import-export/export-workflow.component";
import {StreamComponent} from "./components/streams/stream.component";
import {StreamingWidgetComponent} from "./components/streams/streaming-widget.component";
import {ForgotPasswordComponent} from "./components/login/forgot-password.component";
import {PasswordResetComponent} from "./components/login/password-reset.component";

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'editor/:id',
        component: EditorComponent,
        data: [{tutorial: false}],
        canActivate: [LoggedInGuard]
    },
    {
        path: 'tutorial/:id',
        component: EditorComponent,
        data: [{tutorial: true}],
        canActivate: [LoggedInGuard]
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'forgot-password',
        component: ForgotPasswordComponent
    },
    {
        path: 'password-reset/:uid/:token',
        component: PasswordResetComponent
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
    {
        path: 'streams/:id',
        component: StreamComponent,
        canActivate: [LoggedInGuard]
    },
    {
        path: 'streams/data/:stream_id/:id',
        component: StreamingWidgetComponent,
        canActivate: [LoggedInGuard]
    },
    {
        path: 'export-workflow/:id',
        component: ExportWorkflowComponent,
        canActivate: [LoggedInGuard]
    },
    {
        path: 'import-workflow',
        component: ImportWorkflowComponent,
        canActivate: [LoggedInGuard]
    }
];

export const routing = RouterModule.forRoot(routes);