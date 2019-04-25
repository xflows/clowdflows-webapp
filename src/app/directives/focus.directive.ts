import {Directive, ElementRef, OnInit, Renderer2, OnDestroy, AfterViewChecked, AfterViewInit} from '@angular/core';

@Directive({
    selector: '[focus-visible]'
})
export class FocusOnVisible implements AfterViewInit {

    constructor(private element:ElementRef, private renderer:Renderer2) {
    }

    public ngAfterViewInit():void {
        var inputs = this.element.nativeElement.getElementsByTagName('input');
        if (inputs.length > 0) {
            var firstInput = inputs[0];
            firstInput.focus(); //this.renderer.invokeElementMethod(firstInput, 'focus', []);
        }
    }

}
