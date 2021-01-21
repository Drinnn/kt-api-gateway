import { Module } from '@nestjs/common';
import { ClientsModule } from 'src/clients/clients.module';
import { PlayersController } from './players.controller';

@Module({
  imports: [ClientsModule],
  controllers: [PlayersController],
})
export class PlayersModule {}
