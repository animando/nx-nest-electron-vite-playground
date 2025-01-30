import {
  ConfigurableModuleBuilder,
  Inject,
  Module,
  OnApplicationBootstrap,
  OnModuleInit,
} from '@nestjs/common';
import {
  MESSAGE_LISTENER_META,
  ON_CONNECT_META,
  ON_DISCONNECT_META,
} from './ws.constants';
import { DiscoveryModule, DiscoveryService } from '@golevelup/nestjs-discovery';
import { MetadataScanner } from '@nestjs/core';
import { type WsConfig, WsConnection } from './ws.connection';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<WsConfig>()
    .setClassMethodName('forRoot')
    .build();
export const WS_CONFIG_TOKEN = MODULE_OPTIONS_TOKEN;

@Module({
  imports: [DiscoveryModule, MetadataScanner],
  providers: [
    {
      provide: WsConnection,
      useFactory: async (config: WsConfig): Promise<WsConnection> => {
        await WsModule.initConnection(config);
        console.log('ws module factory');
        return WsModule.connection as WsConnection;
      },
      inject: [WS_CONFIG_TOKEN],
    },
    DiscoveryService,
    MetadataScanner,
  ],
  exports: [WsConnection],
})
export class WsModule
  extends ConfigurableModuleClass
  implements OnApplicationBootstrap, OnModuleInit
{
  private static connection?: WsConnection;

  constructor(
    @Inject(WsConnection) private readonly connection: WsConnection,
    @Inject(DiscoveryService) private readonly discovery: DiscoveryService,
    @Inject(WS_CONFIG_TOKEN) private readonly config: WsConfig,
  ) {
    super();
    console.log('ws module constructor', config);
  }

  async onModuleInit() {
    const listeners = await this.discovery.providerMethodsWithMetaAtKey<string>(
      MESSAGE_LISTENER_META,
    );
    listeners.forEach((listener) => {
      const handler = listener.discoveredMethod.handler.bind(
        listener.discoveredMethod.parentClass.instance,
      );
      console.log(
        `Registering socket event listener '${listener.meta}'`,
        `${listener.discoveredMethod.parentClass.name}#${listener.discoveredMethod.methodName} in ${listener.discoveredMethod.parentClass.parentModule.name}`,
      );
      this.connection.addListener(listener.meta, handler);
    });
  }

  async onApplicationBootstrap() {
    const connectHandlers =
      await this.discovery.providerMethodsWithMetaAtKey<void>(ON_CONNECT_META);
    connectHandlers.forEach((listener) => {
      const handler = listener.discoveredMethod.handler.bind(
        listener.discoveredMethod.parentClass.instance,
      );
      console.log(
        'Registering socket connection listener',
        `${listener.discoveredMethod.parentClass.name}#${listener.discoveredMethod.methodName} in ${listener.discoveredMethod.parentClass.parentModule.name}`,
      );
      this.connection.addConnectListener(handler);
    });
    const disconnectHandlers =
      await this.discovery.providerMethodsWithMetaAtKey<void>(
        ON_DISCONNECT_META,
      );
    disconnectHandlers.forEach((listener) => {
      const handler = listener.discoveredMethod.handler.bind(
        listener.discoveredMethod.parentClass.instance,
      );
      console.log(
        'Registering socket disconnection listener',
        `${listener.discoveredMethod.parentClass.name}#${listener.discoveredMethod.methodName} in ${listener.discoveredMethod.parentClass.parentModule.name}`,
      );
      this.connection.addDisconnectListener(handler);
    });

    if (this.config.autoConnect) {
      console.log('auto connecting');
      await this.connection.connect();
    }
  }

  static async initConnection(config: WsConfig) {
    this.connection = new WsConnection(config);
  }
}
