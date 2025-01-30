import { Inject, Injectable } from '@nestjs/common';
import { WebsocketsService } from '../websockets/websockets.service';
import { IpcMessageListener } from '@electron-nx/nestjs-ipc';

@Injectable()
export class WebsocketIpcBridgeService {
  constructor(
    @Inject(WebsocketsService) private wsService: WebsocketsService,
  ) {}

  @IpcMessageListener('connectWebsocket')
  doConnect() {
    this.wsService.doConnect();
  }

  @IpcMessageListener('disconnectWebsocket')
  doDisconnect() {
    this.wsService.doDisconnect();
  }

  @IpcMessageListener('emitEvent')
  joinRoom(event: string, payload: unknown) {
    this.wsService.emitEvent(event, payload);
  }
}
