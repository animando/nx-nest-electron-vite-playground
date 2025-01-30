'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type Handler = (value: unknown) => void;
type HandlerMap = Record<string, Handler>;
type UseWebsocketConfig = {
  handlers?: HandlerMap;
  rooms?: string[];
};
export const useWebsocket = ({
  handlers,
  rooms,
}: UseWebsocketConfig): { connected: boolean } => {
  const socketConnected = useRef<boolean>(false);
  const connectListenersInitialized = useRef<boolean>(false);
  const [connected, setConnected] = useState<boolean>(false);

  const onWsConnected = useCallback((isConnected: boolean) => {
    socketConnected.current = isConnected;
    setConnected(isConnected);
  }, []);

  useEffect(() => {
    if (connectListenersInitialized.current) return;
    connectListenersInitialized.current = true;
    window.api.onWsConnected(onWsConnected);
  }, [onWsConnected]);

  useEffect(() => {
    if (socketConnected.current) {
      return;
    }
    socketConnected.current = true;
    void (async () => {
      await window.api.connectWebsocket();
    })();

    return () => {
      if (socketConnected.current) {
        socketConnected.current = false;
        void window.api.disconnectWebsocket();
      }
    };
  }, []);

  useEffect(() => {
    if (!connected) {
      return;
    }
    if (rooms?.length) {
      rooms.forEach((room) => {
        void window.api
          .emitEvent('joinRoom', { room })
          .then(() => console.log(`joined room '${room}'`))
          .catch((e) => console.error(e));
      });
    }

    if (handlers) {
      Object.entries(handlers).forEach(([ev, handler]) => {
        void window.api
          .registerEventHandler(ev, handler)
          .then(() => console.log(`registered event handler '${ev}'`));
      });
    }
  }, [connected, handlers, rooms]);

  return { connected };
};
