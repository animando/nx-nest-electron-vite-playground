import { SetMetadata } from '@nestjs/common';
import {
  MESSAGE_LISTENER_META,
  ON_CONNECT_META,
  ON_DISCONNECT_META,
} from './ws.constants';

export const MessageListener = (event: string) =>
  SetMetadata(MESSAGE_LISTENER_META, event);
export const OnConnect = () => SetMetadata(ON_CONNECT_META, '');
export const OnDisconnect = () => SetMetadata(ON_DISCONNECT_META, '');
