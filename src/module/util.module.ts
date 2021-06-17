import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UtilService } from '../service/util/util.service';
import { AppSettingsService } from '../service/util/app-settings.service';

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