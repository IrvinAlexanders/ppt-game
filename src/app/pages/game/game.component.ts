import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GameService } from 'src/app/services/game.service';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonComponent } from '@app/components/ui/button/button.component';
import { AlertComponent } from '@app/components/ui/alert/alert.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    ButtonComponent,
    AlertComponent
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
    { label: 'Piedra', value: 'rock' },
    { label: 'Papel', value: 'paper' },
    { label: 'Tijera', value: 'scissors' }
  ];

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.gameId = params.get('id')!;
      this.loadGame(this.gameId);
    });
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

      this.gameService.createRound(this.gameId, payload).subscribe({
        next: (res) => {
          this.roundForm.reset();
          this.player1Choice = '';
          this.currentTurn = 1;
          this.loadGame(this.gameId);
        },
        error: (err) => {
          console.error('Error al crear la ronda', err);
          this.showAlert('danger', 'Error al crear la ronda. Inténtalo de nuevo más tarde.');
        }
      });
    }
  }

  submitRound() {
    if (this.roundForm.invalid) {
      this.roundForm.markAllAsTouched();
      return;
    }

    this.gameService.createRound(this.gameId, this.roundForm.value).subscribe({
      next: () => {
        this.roundForm.reset();
      },
      error: (err) => {
        console.error('Error al enviar la ronda', err);
        this.showAlert('danger', 'Error al enviar la ronda. Inténtalo de nuevo más tarde.');
      }
    });
  }

  restartGame() {
    const player1_name = this.game.player1.name;
    const player2_name = this.game.player2.name;

    this.gameService.createGame({ player1_name, player2_name }).subscribe({
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
