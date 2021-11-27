import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UtilService } from './util.service';
import { AppSettingsService } from './app-settings.service';

@Module({
  providers: [
    UtilService,
    AppSettingsService
  ],
  controllers: [
  ],
  exports: [UtilService,AppSettingsService]
})
export class UtilModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {

  }
}