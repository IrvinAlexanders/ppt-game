import { Component, inject } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { InputComponent } from '@app/components/ui/input/input.component';
import { ButtonComponent } from '@app/components/ui/button/button.component';
import { CardComponent } from '@app/components/ui/card/card.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, InputComponent, ButtonComponent, CardComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  player1 = '';
  player2 = '';

  constructor(private router: Router) { }

  private gameService = inject(GameService);

  startGame(form: NgForm) {
    const name1 = this.player1?.trim();
    const name2 = this.player2?.trim();

    if (form.invalid || name1.toLowerCase() === name2.toLowerCase()) {
      form.control.markAllAsTouched(); // ✅ fuerza que se muestren los errores
      return;
    }

    this.gameService.createGame({
      player1_name: name1,
      player2_name: name2
    }).subscribe({
      next: (res) => {
        this.router.navigate(['/game', res.id]);
      }
    });
  }

}
