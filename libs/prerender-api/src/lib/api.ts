import { PagedResponse } from "./query";
import { UITransaction } from "./transactions";

export type Handler = (...args: unknown[]) => void;
export type Api = {
  getTransactions: (
    nextToken: string | null,
  ) => Promise<PagedResponse<UITransaction[]>>;
  connectWebsocket: () => Promise<void>;
  disconnectWebsocket: () => Promise<void>;
  onWsConnected: (callback: (val: boolean) => void) => void;
  emitEvent: (event: string, payload: unknown) => Promise<void>;
  registerEventHandler: (event: string, handler: Handler) => Promise<void>;
};
