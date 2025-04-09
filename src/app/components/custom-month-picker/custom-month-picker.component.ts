import {
    Component,
    EventEmitter,
    Input,
    Output,
    OnInit,
    OnChanges,
    SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import moment from 'moment';
import 'moment/locale/pt-br';
import 'moment/locale/en-gb';

@Component({
    selector: 'app-custom-month-picker',
    templateUrl: './custom-month-picker.component.html',
    styleUrls: ['./custom-month-picker.component.css'],
    standalone: true,
    imports: [CommonModule]
})
export class CustomMonthPickerComponent implements OnInit, OnChanges {
    @Input() locale: string = 'pt';
    @Output() dateSelected = new EventEmitter<{ month: number, year: number }>();

    DISABLED_MONTHS: number = 4;
    ENABLED_MONTHS: number = 12;
    START_YEAR: number = 2025;

    selectedMonth: number | null = moment().month();

    disabledMonths: number[] = this.getNextMonths();

    months: string[] = [];
    currentYear = moment().year();

    availableYears: number[] = this.START_YEAR === this.currentYear ? [this.currentYear] : [this.currentYear - 1, this.currentYear];
    
    ngOnInit() {
        this.setLocaleAndMonths();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['locale']) {
            this.setLocaleAndMonths();
        }
    }

    private setLocaleAndMonths() {
        const fullLocale = this.locale === 'pt' ? 'pt-BR' : 'en-US';
        moment.locale(fullLocale);

       let lenth = this.currentYear === moment().year() ? this.DISABLED_MONTHS : this.ENABLED_MONTHS;

       if (this.currentYear < moment().year()){
        lenth = this.ENABLED_MONTHS;
        this.disabledMonths = [];
        this.selectedMonth = null;
       }
       else{
        lenth = this.DISABLED_MONTHS;
        this.disabledMonths = this.getNextMonths();
       }
        
        this.months = Array.from({ length: lenth }, (_, i) =>
            moment().month(i).format('MMMM')
        ).map(m => m.charAt(0).toUpperCase() + m.slice(1));
    }

    prevYear() {
        if (this.canGoPrev) {
            this.currentYear--;
            this.setLocaleAndMonths();
        }
    }

    nextYear() {
        if (this.canGoNext) {
            this.currentYear++;
            this.setLocaleAndMonths();           
        }
    }

    get canGoPrev(): boolean {
        return this.currentYear > Math.min(...this.availableYears);
    }

    get canGoNext(): boolean {
        return this.currentYear < Math.max(...this.availableYears);
    }

    selectMonth(index: number) {
        if (this.disabledMonths.includes(index)) return;
        this.selectedMonth = index;
    }

    applySelection() {
        if (this.selectedMonth !== null) {
            this.dateSelected.emit({ month: this.selectedMonth, year: this.currentYear });
        }
    }

    private getNextMonths(count: number = 3): number[] {
        const now = new Date();
        const currentMonth = now.getMonth();
        const months: number[] = [];
      
        for (let i = 0; i <= count; i++) {
          const month = (currentMonth + 1 + i) % 12;
          months.push(month);
        }
      
        return months;
    }
}