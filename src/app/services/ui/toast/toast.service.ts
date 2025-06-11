import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private messageSignal = signal<string>('');

  showSuccess(message: string) {
    this.messageSignal.set(message);
  }

  showError(message: string) {
    this.messageSignal.set(message);
  }

  showWarning(message: string) {
    this.messageSignal.set(message);
  }

  clear() {
    this.messageSignal.set('');
  }

  message = computed(() => this.messageSignal());
}
