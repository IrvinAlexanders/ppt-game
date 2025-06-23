import { Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';
import { GameComponent } from './pages/game/game.component';

export const routes: Routes = [
    { path: '', redirectTo: 'game/new', pathMatch: 'full' },
    { path: 'game/new', component: RegisterComponent },
    { path: 'game/:id', component: GameComponent },
];
