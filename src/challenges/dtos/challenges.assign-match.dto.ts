import { IsNotEmpty } from 'class-validator';
import { Player } from 'src/players/interfaces/players.interface';
import { Result } from '../interfaces/matches.interface';

export class AssignMatchChallengeDto {
  @IsNotEmpty()
  defender: Player;

  @IsNotEmpty()
  result: Array<Result>;
}
