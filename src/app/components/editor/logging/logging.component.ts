import {
    Component, ElementRef, ViewChild, Input, OnInit, AfterViewInit, ViewChildren, QueryList
} from '@angular/core';

@Component({
    selector: 'logging',
    template: require('./logging.component.html'),
    styles: [require('./logging.component.css'),]
})
export class LoggingComponent implements OnInit, AfterViewInit {
    @ViewChild('log') private logContainer:ElementRef;
    @ViewChildren('msgEl') private messagesElements:QueryList<any>;
    @Input() messages:Array<any>;
    numberOfMessages:number = 0;

    ngOnInit() {
        this.numberOfMessages = this.messages.length;
    }

    ngAfterViewInit() {
        this.messagesElements.changes.subscribe(() => {
            if (this.numberOfMessages < this.messages.length) {
                this.scrollToBottom();
                this.numberOfMessages = this.messages.length;
            }
        });
    }

    scrollToBottom():void {
        this.logContainer.nativeElement.scrollTop = this.logContainer.nativeElement.scrollHeight;
    }
}
