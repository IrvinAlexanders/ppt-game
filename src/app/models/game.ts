import { Player } from "./player";
import { Round } from "./round";

export interface Game {
  id: string;
  player1: Player;
  player2: Player;
  winner: Player | null;
  created_at: string;
  finished_at: string | null;
  rounds: Round[];
}
