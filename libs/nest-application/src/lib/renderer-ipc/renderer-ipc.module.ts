import { Module } from '@nestjs/common';
import { WebsocketIpcBridgeService } from './websocket-ipc-bridge.service';
import { WebsocketsModule } from '../websockets/websockets.module';
import { IpcService } from './ipc.service';
import { GraphqlClientModule } from '../graphql-client/graphql-client.module';

@Module({
  imports: [RendererIpcModule, WebsocketsModule, GraphqlClientModule],
  providers: [WebsocketIpcBridgeService, IpcService],
})
export class RendererIpcModule {}
