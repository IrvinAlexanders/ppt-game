import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss'
})
export class AlertComponent {
  @Input() type: 'success' | 'danger' | 'warning' | 'info' = 'info';
  @Input() message = '';

  get alertClass(): string {
    const base = 'text-white';

    const variants: Record<string, string> = {
      success: 'bg-green-500',
      danger: 'bg-red-500',
      warning: 'bg-yellow-500 text-black',
      info: 'bg-blue-500'
    };

    return `${base} ${variants[this.type] || variants['info']}`;
  }

}
