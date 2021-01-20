import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { PlayersController } from './players.controller';

@Module({
  imports: [ClientsModule],
  controllers: [PlayersController],
})
export class PlayersModule {}
