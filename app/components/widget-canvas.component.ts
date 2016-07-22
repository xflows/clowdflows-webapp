import {Component, Input} from '@angular/core';

@Component({
    selector: 'widget-canvas',
    templateUrl: 'app/components/widget-canvas.component.html',
    styleUrls: ['app/components/widget-canvas.component.css'],
    directives: []
})
export class WidgetCanvasComponent {
    @Input() widgets:string[];
}
