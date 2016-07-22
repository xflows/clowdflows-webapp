import { provideRouter, RouterConfig }  from '@angular/router';
import {EditorComponent} from "./components/editor.component";

const routes: RouterConfig = [
    {
        path: 'editor/:id',
        component: EditorComponent
    }
];

export const appRouterProviders = [
    provideRouter(routes)
];
