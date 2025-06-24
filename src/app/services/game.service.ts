import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Game, Round } from '@app/models';

interface CreateGamePayload {
  player1_name: string;
  player2_name: string;
}

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private apiUrl = `${environment.apiBaseUrl}/game`;

  constructor(private http: HttpClient) { }

  createGame(data: CreateGamePayload): Observable<Game> {
    return this.http.post<Game>(`${this.apiUrl}/new/`, data);
  }

  getGame(gameId: string): Observable<Game> {
    return this.http.get<Game>(`${this.apiUrl}/${gameId}/`);
  }

  createRound(gameId: string, data: { player1_choice: string; player2_choice: string }): Observable<Round> {
    return this.http.post<Round>(`${this.apiUrl}/${gameId}/rounds/new/`, data);
  }
}
