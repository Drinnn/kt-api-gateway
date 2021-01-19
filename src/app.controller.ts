import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { CreateCategoryDto } from './dtos/categories/categories.create.dto';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  private readonly adminClient: ClientProxy;
  constructor() {
    this.logger = new Logger(AppController.name);
    this.adminClient = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.AMQP_CONNECTION_URL],
        queue: 'admin',
      },
    });
  }

  @Post('categories')
  @UsePipes(ValidationPipe)
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    this.adminClient.emit('create-category', createCategoryDto);
  }

  @Get('categories')
  getCategories(@Query('categoryId') categoryId: string): Observable<any> {
    return this.adminClient.send(
      'get-categories',
      categoryId ? categoryId : '',
    );
  }
}
