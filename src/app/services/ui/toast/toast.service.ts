import { Injectable, signal, computed } from '@angular/core';

export type ToastType = 'success' | 'error' | 'warning';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSignal = signal<{ message: string; type: ToastType } | null>(null);

  showSuccess(message: string) {
    this.toastSignal.set({ message, type: 'success' });
  }

  showError(message: string) {
    this.toastSignal.set({ message, type: 'error' });
  }

  showWarning(message: string) {
    this.toastSignal.set({ message, type: 'warning' });
  }

  clear() {
    this.toastSignal.set(null);
  }

  toast = computed(() => this.toastSignal());
}
