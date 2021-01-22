import { IsOptional } from 'class-validator';
import { ChallengeStatus } from '../enums/challenges.status.enum';

export class UpdateChallengeDto {
  @IsOptional()
  status: ChallengeStatus;
}
