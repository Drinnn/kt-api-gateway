import { Module } from '@nestjs/common';
import { ClientsModule } from 'src/clients/clients.module';
import { ChallengesController } from './challenges.controller';

@Module({
  imports: [ClientsModule],
  controllers: [ChallengesController],
})
export class ChallengesModule {}
