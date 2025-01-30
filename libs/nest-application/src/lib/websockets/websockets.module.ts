import { Module } from '@nestjs/common';
import { WebsocketsService } from './websockets.service';
import { WsModule } from '@electron-nx/nestjs-websocket';
import { IpcModule } from '@electron-nx/nestjs-ipc';

@Module({
  imports: [
    WsModule.forRoot({
      uri: process.env['VITE_WS_SERVER_URL'] || '',
      autoConnect: false,
    }),
    IpcModule,
  ],
  providers: [WebsocketsService],
  exports: [WebsocketsService],
})
export class WebsocketsModule {}
