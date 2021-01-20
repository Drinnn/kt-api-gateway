import { Module } from '@nestjs/common';
import AdminClient from './clients.admin';

@Module({
  providers: [AdminClient],
  exports: [AdminClient],
})
export class ClientsModule {}
