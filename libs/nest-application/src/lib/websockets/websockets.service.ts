import { IpcService } from '@electron-nx/nestjs-ipc';
import { MessageListener, OnConnect, OnDisconnect, WsConnection } from '@electron-nx/nestjs-websocket';
import { UITransaction } from '@electron-nx/prerender-api';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class WebsocketsService {
  constructor(
    @Inject(IpcService) private ipcService: IpcService,
    @Inject(WsConnection) private connection: WsConnection,
  ) {}

  doConnect() {
    this.connection.connect();
  }

  doDisconnect() {
    this.connection.disconnect();
  }

  emitEvent(event: string, payload: unknown) {
    this.connection.emitEvent(event, payload);
  }

  @MessageListener('newTransaction')
  onNewTransaction(trx: UITransaction) {
    this.ipcService.sendToRenderer('__wsEvent-newTransaction', trx);
  }

  @OnConnect()
  onConnect() {
    this.ipcService.sendToRenderer('wsConnected', true);
  }

  @OnDisconnect()
  onDisconnect() {
    this.ipcService.sendToRenderer('wsConnected', false);
  }
}
