import {Component, ElementRef, ViewChild, Input, DoCheck, OnInit} from '@angular/core';

@Component({
    selector: 'logging',
    template: require('./logging.component.html'),
    styles: [require('./logging.component.css'),],
    directives: []
})
export class LoggingComponent implements DoCheck, OnInit {

    @ViewChild('log') private logContainer:ElementRef;
    @Input() messages:Array<any>;
    numberOfMessages:number = 0;

    constructor() {}

    ngOnInit() {
        this.numberOfMessages = this.messages.length;
    }

    ngDoCheck() {
        if (this.numberOfMessages < this.messages.length) {
            this.scrollToBottom();
            this.numberOfMessages = this.messages.length;
        }
    }

    scrollToBottom():void {
        this.logContainer.nativeElement.scrollTop = this.logContainer.nativeElement.scrollHeight;
    }
}
