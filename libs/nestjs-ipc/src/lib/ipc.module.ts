import {
  ConfigurableModuleBuilder,
  Inject,
  Module,
  OnModuleInit,
} from '@nestjs/common';
import { IPC_MESSAGE_LISTENER_META } from './ipc.constants';
import {
  DiscoveredMethodWithMeta,
  DiscoveryModule,
  DiscoveryService,
} from '@golevelup/nestjs-discovery';
import { MetadataScanner } from '@nestjs/core';
import { ipcMain } from 'electron';
import { IpcService } from './ipc.service';

export interface IpConfig {
  something?: string;
}

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<IpConfig>()
    .setClassMethodName('forRoot')
    .build();
export const WS_CONFIG_TOKEN = MODULE_OPTIONS_TOKEN;

@Module({
  imports: [DiscoveryModule, MetadataScanner],
  providers: [DiscoveryService, MetadataScanner, IpcService],
  exports: [IpcService],
})
export class IpcModule extends ConfigurableModuleClass implements OnModuleInit {
  private listeners: DiscoveredMethodWithMeta<string>[] = [];
  constructor(
    @Inject(DiscoveryService) private readonly discovery: DiscoveryService,
  ) {
    super();
  }

  async onModuleInit() {
    const listeners = await this.discovery.providerMethodsWithMetaAtKey<string>(
      IPC_MESSAGE_LISTENER_META,
    );
    listeners.forEach((listener) => {
      console.log(
        `Registering ipc event listener '${listener.meta}'`,
        `using handler ${listener.discoveredMethod.parentClass.name}#${listener.discoveredMethod.methodName} in module ${listener.discoveredMethod.parentClass.parentModule.name}`,
      );
      this.listeners.push(listener);
    });

    this.listeners.forEach((listener) => {
      const handler = listener.discoveredMethod.handler.bind(
        listener.discoveredMethod.parentClass.instance,
      );
      ipcMain.handle(listener.meta, (_ev, ...args: unknown[]) =>
        handler(...args),
      );
    });
  }
}
