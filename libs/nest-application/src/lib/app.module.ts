import { IpcModule } from "@electron-nx/nestjs-ipc";
import { ConfigurableModuleBuilder, Inject, Module } from "@nestjs/common";
import { BrowserWindow } from "electron";
import { IpcService } from "@electron-nx/nestjs-ipc";
import { RendererIpcModule } from "./renderer-ipc/renderer-ipc.module";

export interface AppConfig {
  renderer: BrowserWindow;
}
export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<AppConfig>()
    .setClassMethodName('forRoot')
    .build();

const APP_CONFIG_TOKEN = MODULE_OPTIONS_TOKEN;
@Module({
  providers: [
    {
      provide: BrowserWindow,
      useFactory: (config) => {
        return config.renderer;
      },
      inject: [APP_CONFIG_TOKEN],
    },
  ],
  imports: [IpcModule, RendererIpcModule],
  exports: [BrowserWindow],
})
export class AppModule extends ConfigurableModuleClass {
  constructor(
    @Inject(BrowserWindow) private renderer: BrowserWindow,
    @Inject(IpcService) private ipcService: IpcService,
  ) {
    super();
    ipcService.registerRenderer(renderer);
  }
}
