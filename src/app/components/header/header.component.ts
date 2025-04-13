import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import moment, { Moment } from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import 'moment/locale/pt-br';
import { DatePickerService } from '../../services/data-picker.service';
import { LanguageService } from '../../services/language.service';
import { DashboardService } from '../../services/dashboard.service';
import { ProjectOutcomeResponse } from '../../models/interfaces/dashboards.response';
import { CustomMonthPickerComponent } from "../custom-month-picker/custom-month-picker.component";

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatFormFieldModule,
    TranslateModule,
    FormsModule,
    CustomMonthPickerComponent
  ],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class HeaderComponent {
  @Input() isMenuOpen: boolean = true;
  selectedLanguage: string = 'POR';
  lastUpdate: Date | any;
  selectedDate: string = "";
  selectedMoment: Moment = moment();

  @ViewChild('pickerWrapper') pickerWrapperRef!: ElementRef;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const clickedInside = this.pickerWrapperRef?.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.showPicker = false;
    }
  }

  constructor(
    private dashboardService: DashboardService,
    private translate: TranslateService,
    private langService: LanguageService,
    private datePickerService: DatePickerService) {
    const lang = localStorage.getItem('appLanguage') || 'pt';
    this.selectedLanguage = lang;
    translate.use(lang);
    moment.locale(lang === 'pt' ? 'pt-BR' : 'en-US');
    this.selectedDate = moment().format('MMMM YYYY').charAt(0).toUpperCase() + moment().format('MMMM YYYY').slice(1).toLowerCase();
  }

  ngOnInit() {
    this.getLastUpdate();
  }

  getLastUpdate() {
    this.dashboardService.getProjectOutcome().subscribe((data: ProjectOutcomeResponse[]) => {
      const validData = data.filter(item => item.executionDate != null);
      const lasted = validData.reduce((a, b) =>
        a.executionDate > b.executionDate ? a : b
      );
      this.lastUpdate = lasted.executionDate
    });
  }

  changeLanguage(lang: string) {
    this.selectedLanguage = lang;
    localStorage.setItem('appLanguage', lang);
    this.translate.use(lang);
    this.langService.setLang(lang);

    const locale = lang === 'pt' ? 'pt-BR' : 'en-US';

    const formatted = this.selectedMoment
      ? moment(this.selectedMoment).locale(locale).format('MMMM YYYY')
      : moment().locale(locale).format('MMMM YYYY');

    this.selectedDate = formatted.charAt(0).toUpperCase() + formatted.slice(1).toLowerCase();
  }

  showPicker = false;

  onDatePicked(event: { month: number, year: number }) {
    const { month, year } = event;

    this.selectedMoment = moment({ year, month });
  
    const locale = this.selectedLanguage === 'pt' ? 'pt-BR' : 'en-US';
    const formatted = this.selectedMoment.locale(locale).format('MMMM YYYY');
  
    this.selectedDate = formatted.charAt(0).toUpperCase() + formatted.slice(1);
  
    this.datePickerService.updateSelectedDate(
      moment({ year, month, day: 1 })
    );
  
    this.showPicker = false;
  }


  getLangName(): string {
    return this.selectedLanguage === 'pt' ? 'POR' : 'ENG';
  }
}
