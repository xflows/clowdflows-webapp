import { Injectable } from '@angular/core';

@Injectable()
export class LoggerService {

    public messages:any[] = [];

    constructor() {}

    private addMessage(type:string, text:string) {
        let timestamp = new Date().toLocaleTimeString();
        this.messages.push({type: type, text: text, timestamp: timestamp});
    }

    public info(text:string) {
        this.addMessage('info', text);
    }

    public warning(text:string) {
        this.addMessage('warning', text);
    }

    public error(text:string) {
        this.addMessage('danger', text);
    }

    public success(text:string) {
        this.addMessage('success', text);
    }

    public clear() {
        this.messages.splice(0, this.messages.length);
    }
}
