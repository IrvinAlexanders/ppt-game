import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GameService } from 'src/app/services/game.service';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonComponent } from '@app/components/ui/button/button.component';
import { AlertComponent } from '@app/components/ui/alert/alert.component';
import { LoadingScreenComponent } from '@app/components/shared/loading-screen/loading-screen.component';
import { finalize, Observable } from 'rxjs';
import { Round } from '@app/models';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    ButtonComponent,
    AlertComponent,
    LoadingScreenComponent
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private gameService = inject(GameService);
  private fb = inject(FormBuilder);

  game: any = null;
  loading = true;
  roundForm!: FormGroup;
  gameId!: string;
  alertMessage: string | null = null;
  alertType: 'success' | 'danger' | 'info' | 'warning' = 'info';

  choices = [
    { label: 'Piedra', value: 'rock', emoji: '🪨' },
    { label: 'Papel', value: 'paper', emoji: '📄' },
    { label: 'Tijera', value: 'scissors', emoji: '✂️' }
  ];

  private choiceMap = new Map<string, { label: string; emoji: string }>();

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.gameId = params.get('id')!;
      this.loadGame(this.gameId);
    });

    this.choices.forEach(choice => {
      this.choiceMap.set(choice.value, { label: choice.label, emoji: choice.emoji });
    });
  }

  showRoundResult(round: Round) {
    const p1 = this.choiceMap.get(round.player1_choice);
    const p2 = this.choiceMap.get(round.player2_choice);

    if (!p1 || !p2) return;

    if (round.player1_choice === round.player2_choice) {
      this.showAlert('info', `Empate: ambos eligieron ${p1.emoji} ${p1.label}`);
      return;
    }

    const ganador = round.round_winner?.name ?? 'Ninguno';
    this.showAlert('success', `${p1.emoji} ${p1.label} gana a ${p2.emoji} ${p2.label} — esta ronda la gana ${ganador}`);
  }

  setLoadingWhile<T>(obs: Observable<T>): Observable<T> {
    this.loading = true;
    return obs.pipe(
      finalize(() => this.loading = false)
    );
  }

  loadGame(gameId: string) {
    this.loading = true;
    this.initForm();
    this.currentTurn = 1;
    this.player1Choice = '';

    this.gameService.getGame(gameId).subscribe({
      next: (data) => {
        this.game = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar el juego', err);
        this.loading = false;
        this.showAlert('danger', 'Error al cargar el juego. Inténtalo de nuevo más tarde.');
      }
    });
  }

  initForm() {
    this.roundForm = this.fb.group({
      player1_choice: ['', Validators.required],
      player2_choice: ['', Validators.required]
    });
  }

  showAlert(type: typeof this.alertType, message: string) {
    this.alertType = type;
    this.alertMessage = message;

    setTimeout(() => {
      this.alertMessage = null;
    }, 5000);
  }

  currentTurn = 1;
  player1Choice = '';

  nextTurn() {
    if (this.currentTurn === 1) {
      if (!this.roundForm.get('player1_choice')?.valid) {
        this.roundForm.get('player1_choice')?.markAsTouched();
        return;
      }

      this.player1Choice = this.roundForm.value.player1_choice;
      this.currentTurn = 2;
    } else if (this.currentTurn === 2) {
      if (!this.roundForm.get('player2_choice')?.valid) {
        this.roundForm.get('player2_choice')?.markAsTouched();
        return;
      }

      const payload = {
        player1_choice: this.player1Choice,
        player2_choice: this.roundForm.value.player2_choice
      };

      this.setLoadingWhile(this.gameService.createRound(this.gameId, payload)).subscribe({
        next: (res) => {
          this.roundForm.reset();
          this.player1Choice = '';
          this.currentTurn = 1;
          this.showRoundResult(res);
          this.loadGame(this.gameId);
        },
        error: (err) => {
          console.error('Error al crear la ronda', err);
          this.showAlert('danger', 'Error al crear la ronda. Inténtalo de nuevo más tarde.');
        }
      });
    }
  }

  restartGame() {
    const player1_name = this.game.player1.name;
    const player2_name = this.game.player2.name;

    this.setLoadingWhile(
      this.gameService.createGame({ player1_name, player2_name })
    ).subscribe({
      next: (newGame) => {
        this.router.navigate(['/game', newGame.id]);
      },
      error: (err) => {
        console.error('Error al reiniciar el juego', err);
        this.showAlert('danger', 'Error al reiniciar el juego. Inténtalo de nuevo más tarde.');
      }
    });
  }

  goToNewGame() {
    this.router.navigate(['/game/new']);
  }
}
