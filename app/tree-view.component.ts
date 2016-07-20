import {Component, Input} from '@angular/core';
import {Category} from "./models/category";

@Component({
    selector: 'tree-view',
    templateUrl: 'app/tree-view.component.html',
    styleUrls: ['app/tree-view.component.css'],
    directives:[TreeViewComponent]
})
export class TreeViewComponent {
    @Input() categories:Category[];
}
