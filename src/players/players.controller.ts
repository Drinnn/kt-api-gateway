import {
  BadRequestException,
  Body,
  Controller,
  Delete,
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
import { CreatePlayerDto } from './dtos/players.create.dto';
import { UpdatePlayerDto } from './dtos/players.update.dto';

@Controller('players')
export class PlayersController {
  private readonly logger = new Logger(PlayersController.name);
  constructor(private adminClient: AdminClient) {}

  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() createDto: CreatePlayerDto) {
    const { categoryId } = createDto;
    this.logger.log(`${this.create.name} - body: ${JSON.stringify(createDto)}`);

    const category = this.adminClient.client.emit('get-category', categoryId);
    category.toPromise();

    if (category) {
      this.adminClient.client.emit('create-player', createDto);
    } else {
      throw new BadRequestException(
        `Category with ID ${categoryId} not found.`,
      );
    }
  }

  @Get()
  get(@Query('id') id: string): Observable<any> {
    return this.adminClient.client.send('get-players', id ? id : '');
  }

  @Put('/:id')
  update(
    @Body() updateDto: UpdatePlayerDto,
    @Param('id', ParametersValidationPipe) id: string,
  ): Observable<any> {
    const { categoryId } = updateDto;
    if (categoryId) {
      const category = this.adminClient.client.emit('get-category', categoryId);
      category.toPromise();

      if (category) {
        return this.adminClient.client.emit('update-player', {
          id,
          player: updateDto,
        });
      } else {
        throw new BadRequestException(
          `Category with ID ${categoryId} not found.`,
        );
      }
    }
  }

  @Delete(':/id')
  delete(@Param('id', ParametersValidationPipe) id: string) {
    this.adminClient.client.send('delete-player', id);
  }
}
