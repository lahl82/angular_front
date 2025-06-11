import { Component, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { ToastService } from '../../../services/ui/toast/toast.service';

@Component({
  selector: 'app-message-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message-toast.component.html',
  styleUrl: './message-toast.component.css',
  animations: [
    trigger('fadeOut', [
      transition(':enter', [
        style({ opacity: 0}),
        animate('200ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0 }))
      ])
    ])
  ],
})
export class MessageToastComponent {
  visible = signal(false);

  constructor(public toastService: ToastService) {
    effect(() => {
      const message = this.toastService.message();
      if (message) {
        this.visible.set(true);
        setTimeout(() => {
          this.visible.set(false);
          this.toastService.clear();
        }, 3000);
      }
    });
  }
}
