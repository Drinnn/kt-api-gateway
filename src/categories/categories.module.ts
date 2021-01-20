import { Module } from '@nestjs/common';
import { ClientsModule } from 'src/clients/clients.module';
import { CategoriesController } from './categories.controller';

@Module({
  imports: [ClientsModule],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
