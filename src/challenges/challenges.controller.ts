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
import { Category } from 'src/categories/interfaces/categories.interface';
import AdminClient from 'src/clients/clients.admin';
import ChallengesClient from 'src/clients/clients.challenges';
import { ParametersValidationPipe } from 'src/pipes/parameters-validation.pipe';
import { Player } from 'src/players/interfaces/players.interface';
import { AssignMatchChallengeDto } from './dtos/challenges.assign-match.dto';
import { CreateChallengeDto } from './dtos/challenges.create.dto';
import { UpdateChallengeDto } from './dtos/challenges.update.dto';
import { ChallengeStatus } from './enums/challenges.status.enum';
import { Challenge } from './interfaces/challenges.interface';
import { Match } from './interfaces/matches.interface';

@Controller('challenges')
export class ChallengesController {
  private readonly logger: Logger = new Logger(ChallengesController.name);
  constructor(
    private readonly adminClient: AdminClient,
    private readonly challengsClient: ChallengesClient,
  ) {}

  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() createDto: CreateChallengeDto) {
    const { players, category, requester } = createDto;
    let requesterInPlayers = false;

    this.logger.log(`${this.create.name} - body: ${JSON.stringify(createDto)}`);

    const existentCategory: Category = await this.adminClient.client
      .send('get-categories', category)
      .toPromise();

    if (!existentCategory)
      throw new BadRequestException(
        `Category with ID ${category} doesn't exists.`,
      );

    const registeredPlayers: Player[] = await this.adminClient.client
      .send('get-players', null)
      .toPromise();

    players.map((player) => {
      const playerExists = registeredPlayers.filter(
        (existentPlayer) => existentPlayer._id == player._id,
      );

      if (playerExists.length === 0)
        throw new BadRequestException(
          `Player with ID ${player._id} doesn't exists.`,
        );

      if (playerExists[0].category != category)
        throw new BadRequestException(
          `Player ${playerExists[0].name} is not in requested category.`,
        );

      if (player._id === requester) requesterInPlayers = true;
    });

    if (!requesterInPlayers)
      throw new BadRequestException(
        `The challenge must be created by one of the participant players.`,
      );

    return this.challengsClient.client.emit('create-challenge', createDto);
  }

  @Get()
  async getAllByPlayerId(@Query('playerId') playerId: string) {
    this.logger.log(`${this.getAllByPlayerId.name} - query param: ${playerId}`);

    if (playerId) {
      const existentPlayer = await this.adminClient.client
        .send('get-players', playerId)
        .toPromise();

      if (!existentPlayer)
        throw new BadRequestException(`There's no player with ID ${playerId}.`);
    }

    return this.challengsClient.client.send(
      'get-challenges',
      playerId ? { playerId, id: null } : null,
    );
  }

  @Put('/:id')
  async update(
    @Body() updateDto: UpdateChallengeDto,
    @Param('id', ParametersValidationPipe) id: string,
  ) {
    this.logger.log(`${this.update.name} - data: ${updateDto}
                     query param: ${id}`);

    const existentChallenge: Challenge = await this.challengsClient.client
      .send('get-challenges', { playerId: null, id })
      .toPromise();

    if (!existentChallenge)
      throw new BadRequestException(`There's no challenge with ID ${id}.`);

    if (existentChallenge.status != ChallengeStatus.PENDING)
      throw new BadRequestException('Only PENDING challenges can be updated.');

    return this.challengsClient.client.emit('update-challenge', {
      id,
      challenge: updateDto,
    });
  }

  @Post('/:id')
  async assignMatch(
    @Body() assignDto: AssignMatchChallengeDto,
    @Param('id', ParametersValidationPipe) id: string,
  ) {
    const { defender, result } = assignDto;

    this.logger.log(`${this.assignMatch.name} - data: ${assignDto}
    query param: ${id}`);

    const existentChallenge: Challenge = await this.challengsClient.client
      .send('get-challenges', { playerId: null, id })
      .toPromise();

    if (!existentChallenge)
      throw new BadRequestException(`There's no challenge with ID ${id}.`);

    if (existentChallenge.status == ChallengeStatus.ACCOMPLISHED)
      throw new BadRequestException(
        `Challenge with ID ${id} is already ACCOMPLISHED.`,
      );

    if (existentChallenge.status != ChallengeStatus.ACCEPTED)
      throw new BadRequestException(
        `Challenge must have ACCEPTED status to assign a Match`,
      );

    if (!existentChallenge.players.includes(defender))
      throw new BadRequestException(
        `Defender with ID ${defender} is not in Challenge.`,
      );

    const match: Match = {
      category: existentChallenge.category,
      defender,
      challenge: id,
      players: existentChallenge.players,
      result: result,
    };

    return this.challengsClient.client.emit('create-match', match);
  }

  @Delete('/:id')
  async delete(@Param('id', ParametersValidationPipe) id: string) {
    this.logger.log(`${this.delete.name} - url param: ${id}`);

    const existentChallenge: Challenge = await this.challengsClient.client
      .send('get-challenges', { playerId: null, id })
      .toPromise();

    if (!existentChallenge)
      throw new BadRequestException(`There's no challenge with ID ${id}.`);

    return this.challengsClient.client.emit('delete-challenge', id);
  }
}
