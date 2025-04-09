import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertSubject = new BehaviorSubject<{ message: string, type: string, isVisible: boolean }>({
    message: '',
    type: 'info',
    isVisible: false
  });

  alertState = this.alertSubject.asObservable();

  showAlert(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration: number = 3000) {
    this.alertSubject.next({ message, type, isVisible: true });

    setTimeout(() => {
      this.alertSubject.next({ message: '', type, isVisible: false });
    }, duration);
  }
}
