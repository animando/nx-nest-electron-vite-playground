import { SetMetadata } from '@nestjs/common';
import { IPC_MESSAGE_LISTENER_META } from './ipc.constants';

export const IpcMessageListener = (event: string) =>
  SetMetadata(IPC_MESSAGE_LISTENER_META, event);
