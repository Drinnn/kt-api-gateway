import { Player } from 'src/players/interfaces/players.interface';

export class Match {
  category?: string;
  challenge?: string;
  players: Array<Player>;
  defender?: Player;
  result?: Array<Result>;
}

export interface Result {
  set: string;
}
