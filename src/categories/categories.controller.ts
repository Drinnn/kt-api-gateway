import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import AdminClient from 'src/clients/admin.client';
import { ParametersValidationPipe } from 'src/pipes/parameters-validation.pipe';
import { CreateCategoryDto } from './dtos/categories.create.dto';
import { UpdateCategoryDto } from './dtos/categories.update.dto';

@Controller('categories')
export class CategoriesController {
  private readonly adminClient: AdminClient;

  constructor() {
    this.adminClient = new AdminClient();
  }

  @Post()
  @UsePipes(ValidationPipe)
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    this.adminClient.client.emit('create-category', createCategoryDto);
  }

  @Get()
  getCategories(@Query('categoryId') categoryId: string): Observable<any> {
    return this.adminClient.client.send(
      'get-categories',
      categoryId ? categoryId : '',
    );
  }

  @Put('/:name')
  @UsePipes(ValidationPipe)
  updateCategory(
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Param('name', ParametersValidationPipe) name: string,
  ): Observable<any> {
    return this.adminClient.client.send('update-category', {
      name,
      category: updateCategoryDto,
    });
  }
}
