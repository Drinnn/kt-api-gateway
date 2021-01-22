import { Player } from 'src/players/interfaces/players.interface';
import { ChallengeStatus } from '../enums/challenges.status.enum';

export interface Challenge {
  dateTime: Date;
  status: ChallengeStatus;
  requestDateTime: Date;
  responseDateTime: Date;
  requester: Player;
  category: string;
  match?: string;
  players: Array<Player>;
}
