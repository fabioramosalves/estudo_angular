import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import moment from 'moment'; // Importando Moment.js

@Injectable({
  providedIn: 'root'
})
export class DatePickerService {
  private selectedDateSubject = new BehaviorSubject<string>(moment().format('YYYY-MM-01'));
  selectedDate$ = this.selectedDateSubject.asObservable();

  updateSelectedDate(newDate: moment.Moment | string): void {
    const formattedDate = this.formatDate(newDate);
    this.selectedDateSubject.next(formattedDate);
  }

  private formatDate(date: moment.Moment | string): string {
    return typeof date === 'string' ? date : date.format('YYYY-MM-01');
  }
}
