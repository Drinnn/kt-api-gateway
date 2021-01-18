import {
  Body,
  Controller,
  Logger,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
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
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.adminClient.emit('create-category', createCategoryDto);
  }
}
