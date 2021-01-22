import { Module } from '@nestjs/common';
import AdminClient from './clients.admin';
import AwsClient from './clients.aws';
import ChallengesClient from './clients.challenges';

@Module({
  providers: [AdminClient, AwsClient, ChallengesClient],
  exports: [AdminClient, AwsClient, ChallengesClient],
})
export class ClientsModule {}
