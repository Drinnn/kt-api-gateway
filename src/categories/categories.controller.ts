import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import AdminClient from 'src/clients/clients.admin';
import { ParametersValidationPipe } from 'src/pipes/parameters-validation.pipe';
import { CreateCategoryDto } from './dtos/categories.create.dto';
import { UpdateCategoryDto } from './dtos/categories.update.dto';

@Controller('categories')
export class CategoriesController {
  private readonly logger: Logger = new Logger(CategoriesController.name);
  constructor(private adminClient: AdminClient) {}

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createDto: CreateCategoryDto) {
    this.logger.log(`${this.create.name} - body: ${JSON.stringify(createDto)}`);

    return this.adminClient.client.emit('create-category', createDto);
  }

  @Get()
  get(@Query('id') id: string): Observable<any> {
    this.logger.log(`${this.get.name} - query param: ${id}`);

    return this.adminClient.client.send('get-categories', id ? id : '');
  }

  @Put('/:name')
  @UsePipes(ValidationPipe)
  update(
    @Body() updateDto: UpdateCategoryDto,
    @Param('name', ParametersValidationPipe) name: string,
  ): Observable<any> {
    this.logger.log(
      `${this.update.name} - url param: ${name} 
       body: ${JSON.stringify(updateDto)}`,
    );

    return this.adminClient.client.send('update-category', {
      name,
      category: updateDto,
    });
  }
}
