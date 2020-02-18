import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ContextMenuComponent, ContextMenuService } from 'ngx-contextmenu';
import {Connection} from "../../../../models/connection";

@Component({
  selector: 'context-menu-connection',
  templateUrl: './context-menu-connection.component.html',
  //styleUrls: ['./context-menu-custom.css']
})
export class ContextMenuConnectionComponent {
  @ViewChild('connectionMenu', {static: false}) contextMenu: ContextMenuComponent;

  @Output() deleteConnectionRequest = new EventEmitter<Connection>();

  constructor( private contextMenuService: ContextMenuService ) { }

  deleteConnection(connection:Connection) {
      this.deleteConnectionRequest.emit(connection);
  }

}
