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
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Observable } from 'rxjs';
import AdminClient from 'src/clients/clients.admin';
import AwsClient from 'src/clients/clients.aws';
import { ParametersValidationPipe } from 'src/pipes/parameters-validation.pipe';
import { CreatePlayerDto } from './dtos/players.create.dto';
import { UpdatePlayerDto } from './dtos/players.update.dto';

@Controller('players')
export class PlayersController {
  private readonly logger = new Logger(PlayersController.name);
  constructor(private adminClient: AdminClient, private awsClient: AwsClient) {}

  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() createDto: CreatePlayerDto) {
    const { category } = createDto;
    this.logger.log(`${this.create.name} - body: ${JSON.stringify(createDto)}`);

    const foundedCategory = this.adminClient.client
      .emit('get-categories', category)
      .toPromise();

    if (foundedCategory) {
      this.adminClient.client.emit('create-player', createDto);
    } else {
      throw new BadRequestException(`Category with ID ${category} not found.`);
    }
  }

  @Post('/:id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @UploadedFile() file,
    @Param('id', ParametersValidationPipe) id: string,
  ): Promise<Observable<any>> {
    const player = await this.adminClient.client
      .send('get-players', id)
      .toPromise();

    if (!player)
      throw new BadRequestException(`There's no player with ID ${id}.`);

    const { url } = await this.awsClient.uploadPlayerAvatarFile(file, id);

    await this.adminClient.client.emit('update-player', {
      id,
      player: {
        avatarUrl: url,
      },
    });

    return this.adminClient.client.send('get-players', id);
  }

  @Get()
  get(@Query('id') id: string): Observable<any> {
    this.logger.log(`${this.get.name} - query param: ${id}`);

    return this.adminClient.client.send('get-players', id ? id : '');
  }

  @Put('/:id')
  update(
    @Body() updateDto: UpdatePlayerDto,
    @Param('id', ParametersValidationPipe) id: string,
  ): Observable<any> {
    this.logger.log(`${this.update.name} - url param: ${id}
    body: ${JSON.stringify(updateDto)}`);

    const { categoryId } = updateDto;
    if (categoryId) {
      const category = this.adminClient.client
        .emit('get-categories', categoryId)
        .toPromise();

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
    this.logger.log(`${this.delete.name} - url param: ${id}`);

    this.adminClient.client.send('delete-player', id);
  }
}
