import { io, Socket } from 'socket.io-client';

export interface WsConfig {
  name?: string;
  uri: string;
  autoConnect: boolean;
}

type Listener<T = unknown[], R = unknown> = (args: T) => R;

export class WsConnection {
  private socket?: Socket;
  private connected = false;
  private eventListeners: Record<string, Listener<unknown[], void>[]> = {};
  private connectListeners: Listener<void, void>[] = [];
  private disconnectListeners: Listener<void, void>[] = [];

  constructor(private config: WsConfig) {}

  async connect() {
    return new Promise<void>((res, rej) => {
      try {
        this.socket = io(this.config.uri);
        this.socket.on('connect', async () => {
          this.connected = true;
          await this.notifyConnectListeners();
          this.attachListeners();
          res();
        });
        this.socket.on('disconnect', async () => {
          this.connected = false;
          await this.notifyDisconnectListeners();
        });
      } catch (err) {
        rej(err);
      }
    });
  }

  async disconnect() {
    if (!this.socket) {
      console.log('No socket to disconnect');
      return;
    }
    this.socket.disconnect();
  }

  private async notifyListeners(
    listeners: Listener<void, void>[],
  ): Promise<void> {
    await Promise.all(
      listeners.map((listener) => {
        return Promise.resolve(listener());
      }),
    );
  }

  async notifyConnectListeners() {
    await this.notifyListeners(this.connectListeners);
  }

  async notifyDisconnectListeners() {
    await this.notifyListeners(this.disconnectListeners);
  }

  addConnectListener(handler: Listener<void, void>) {
    this.connectListeners.push(handler);
  }

  addDisconnectListener(handler: Listener<void, void>) {
    this.disconnectListeners.push(handler);
  }

  attachListeners() {
    if (!this.socket) return;
    Object.entries(this.eventListeners).forEach(([event, listeners]) => {
      listeners.forEach((listener) => {
        this.socket?.on(event, listener);
      });
    });
  }

  addListener(event: string, listener: Listener<unknown[], void>) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [listener];
    } else {
      this.eventListeners[event].push(listener);
    }
  }

  emitEvent(event: string, payload: unknown) {
    this.socket?.emit(event, payload);
  }
}
