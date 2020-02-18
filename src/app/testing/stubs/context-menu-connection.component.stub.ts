import {Component, Input, Output, EventEmitter} from "@angular/core";
import {Connection} from "../../models/connection";


@Component({
    selector: 'context-menu-connection',
    template: ''
})
export class ContextMenuConnectionStub {

  @Output() deleteConnectionRequest = new EventEmitter<Connection>();

}
