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

    public reportMessage(data:any):boolean {
        let error:boolean = false;
        if (data && 'status' in data) {
            if (data.status == 'error') {
                this.error(data.message || 'Problem executing action');
                error = true;
            } else if (data.status == 'ok' && 'message' in data) {
                this.info(data.message);
            }
        }
        return error;
    }
    receiveLogMessage(data:any) {
        var message=`[${data.widget}] ${data.message}`
        switch (data.level){
            case 'critical':
            case 'error': {
                this.error(message)
                break;
            }
            case 'warning': {
                this.warning(message)
                break;
            }
            case 'success': {
                this.success(message)
                break;
            }
            case 'info': {
                this.info(message)
                break;
            }
            case 'error': {
                this.error(message)
                break;
            }
        }
        // let widget = this.workflow.widgets.find((widgetObj:Widget) => widgetObj.id == data.widget_pk);
        // if (widget != undefined) {
        //     if (data.status.finished && !widget.finished) {
        //         if (data.status.is_visualization) {
        //             this.visualizeWidget(widget);
        //         }
        //     }
        //
        //     if (!data.status.finished && data.status.interaction_waiting) {
        //         if (!widget.showInteractionDialog) {
        //             this.interactWidget(widget);
        //         }
        //     }
        //
        //     widget.finished = data.status.finished;
        //     widget.error = data.status.error;
        //     widget.running = data.status.running;
        //     widget.interaction_waiting = data.status.interaction_waiting;
        //     widget.x = data.position.x;
        //     widget.y = data.position.y;
        // }
    }

}
