import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

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

  createGame(data: CreateGamePayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/new/`, data);
  }

  getGame(gameId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${gameId}/`);
  }

  createRound(gameId: string, data: { player1_choice: string; player2_choice: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/${gameId}/rounds/new/`, data);
  }
}
