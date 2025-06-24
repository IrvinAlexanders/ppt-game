import { Player } from "./player";

export interface Round {
  id: string;
  round_number: number;
  player1_choice: "rock" | "paper" | "scissors";
  player2_choice: "rock" | "paper" | "scissors";
  round_winner: Player;
  game: string;
  created_at: string;
  updated_at: string;
}
