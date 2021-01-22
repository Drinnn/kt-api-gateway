import { Module } from '@nestjs/common';
import AdminClient from './clients.admin';
import AwsClient from './clients.aws';

@Module({
  providers: [AdminClient, AwsClient],
  exports: [AdminClient, AwsClient],
})
export class ClientsModule {}
