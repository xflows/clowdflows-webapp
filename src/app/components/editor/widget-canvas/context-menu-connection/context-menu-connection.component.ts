import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ContextMenuComponent } from 'ngx-contextmenu';
import {Connection} from "../../../../models/connection";

@Component({
  selector: 'context-menu-connection',
  templateUrl: './context-menu-connection.component.html',
  //styleUrls: ['./context-menu-custom.css']
})
export class ContextMenuConnectionComponent implements OnInit {
  @ViewChild('connectionMenu', {static: false}) contextMenu: ContextMenuComponent;

  @Output() deleteConnectionRequest = new EventEmitter<Connection>();

  constructor() { }

  ngOnInit() {
  }

  deleteConnection(connection:Connection) {
      this.deleteConnectionRequest.emit(connection);
  }

}
