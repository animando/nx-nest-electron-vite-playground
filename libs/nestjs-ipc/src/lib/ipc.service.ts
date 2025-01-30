import { Injectable } from '@nestjs/common';
import { BrowserWindow } from 'electron/main';

@Injectable()
export class IpcService {
  private renderer?: BrowserWindow;

  sendToRenderer(event: string, payload: unknown) {
    if (!this.renderer) {
      console.log('cannot send event to renderer');
      return;
    }
    this.renderer.webContents.send(event, payload);
  }

  registerRenderer(renderer: BrowserWindow) {
    this.renderer = renderer;
  }
}
