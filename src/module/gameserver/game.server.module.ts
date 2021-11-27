import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PrismaService } from '../../service/prisma.service';
import { GameServerService } from './game.server.service';
import { GameServerController } from './game.server.controller';

@Module({
  imports: [ 
  ],
  providers: [
    PrismaService,
    GameServerService
  ],
  controllers: [
    GameServerController
  ],
  exports: [GameServerService]
})
export class GameServerModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
  }
}