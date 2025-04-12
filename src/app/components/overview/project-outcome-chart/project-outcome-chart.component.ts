import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatTableModule } from '@angular/material/table';
import { ProjectOutcomeResponse} from '../../../models/interfaces/dashboards.response';
import { DashboardService } from '../../../services/dashboard.service';
import { DatePickerService } from '../../../services/data-picker.service';
import { LanguageService } from '../../../services/language.service';
import { getMonthLabels } from '../../../helpers/date-utils';
import { TabService } from '../../../services/tab.service';

@Component({
  selector: 'app-project-outcome-chart',
  templateUrl: './project-outcome-chart.component.html',
  styleUrls: ['./project-outcome-chart.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule,
    MatToolbarModule,
    FormsModule,
    TranslateModule,
    MatTableModule
],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  encapsulation: ViewEncapsulation.None,
})

export class ProjectOutcomeChartComponent implements OnInit {
  selectedLanguage: string = 'pt';
  selectedDate: string = '2025-01-01';
  monetaryUpsideGrossProfit: number = 0.00;
  selectedView: string = 'anual';
  visibleMonths: string[] = [];
  periods: string[] = ['Visão Anual', 'Últimos 6 meses'];
  selectedPeriod: string = 'Visão Anual';
  isResultDropdownOpen = false; 
  originalChartData: any[] = [];  
  totalLastSixMonths: number = 0;
  variation: number = 0;
  visibleDetails: any;
  yAxisValues: string[] = [];
  hoverIndex: number = -1;
  tooltipVisible = false;
  tooltipX = 0;
  tooltipY = 0;
  tooltipValue = 0;
  tooltipColor = '';
  zeroLinePercent: number = 50;

  sixMonthChartData: {
    name: string;
    value: number;
    rawValue: number;
  }[] = [];

  annualChartData: {
    name: string;
    value: number;
    rawValue: number;
    tooltip: string
  }[] = [];


  constructor(
    private DashboardService: DashboardService,
    private datePickerService: DatePickerService,
    private languageService: LanguageService,
    private tabService: TabService,
  ) {
    this.selectedLanguage = localStorage.getItem('appLanguage') || 'pt';

    this.languageService.getLang$().subscribe(lang => {
      this.selectedLanguage = lang;
      this.generateChartData();
    });
  } 

  ngOnInit(): void {
    this.datePickerService.selectedDate$.subscribe(date => {
      this.selectedDate = date;
      this.annualChartData = this.generateMockChartData()
      this.updateCharts();
    });
  }

  updateCharts(): void {
    this.getProjectOutcome();
  }

  getProjectOutcome() {
    this.DashboardService.getProjectOutcome().subscribe((data: ProjectOutcomeResponse[]) => {
      this.originalChartData = data;
      this.generateChartData();
     });
  }

  generateChartData(): void {
    if (!this.originalChartData.length) return;
  
    const positives = this.originalChartData.map(x => x.monetaryUpsideGrossProfit).filter(x => x > 0);
    const negatives = this.originalChartData.map(x => x.monetaryUpsideGrossProfit).filter(x => x < 0);
  
    const maxPositive = Math.max(...positives, 0);
    const maxNegative = Math.abs(Math.min(...negatives, 0));
    const totalRange = maxPositive + maxNegative;
  
    this.zeroLinePercent = totalRange > 0 ? (maxNegative / totalRange) * 100  : 50;
  
    this.annualChartData = this.originalChartData.map(item => {
      const [year, month, day] = item.assessmentMonth.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      const shortMonth = date.toLocaleString(this.selectedLanguage, { month: 'short' }).replace('.', '');
      const capitalizedMonth = shortMonth.charAt(0).toUpperCase() + shortMonth.slice(1);
  
      return {
        name: capitalizedMonth,
        tooltip: `${capitalizedMonth}, ${date.getFullYear()}`,
        value: totalRange ? (item.monetaryUpsideGrossProfit / totalRange) * 100 : 0,
        rawValue: item.monetaryUpsideGrossProfit
      };
    });
  
    this.sixMonthChartData = this.originalChartData.slice(-6).map(item => ({
      name: item.assessmentMonth,
      value: totalRange ? (item.monetaryUpsideGrossProfit / totalRange) * 100 : 0,
      rawValue: item.monetaryUpsideGrossProfit
    }));
  
    this.visibleMonths = this.selectedView === '6meses'
      ? this.sixMonthChartData.map(item => item.name)
      : this.annualChartData.map(item => item.name);
  
    this.totalLastSixMonths = this.sixMonthChartData.reduce((acc, item) => acc + item.rawValue, 0);
  
    const first = this.sixMonthChartData[0]?.rawValue || 1;
    const last = this.sixMonthChartData[this.sixMonthChartData.length - 1]?.rawValue || 1;
    this.variation = ((last - first) / first) * 100;
  }
  
  toggleDropdownResultado() {
    this.isResultDropdownOpen = !this.isResultDropdownOpen;
  }

  periodSelected(periodo: string, event: Event) {
    event.stopPropagation();
    this.selectedPeriod = periodo;
    this.isResultDropdownOpen = false;
    this.selectedView = periodo === 'Visão Anual' ? 'anual' : '6meses';
    this.generateChartData();
  }

  getAbs(value: number): number {
    return Math.abs(value);
  }

  private generateMockChartData(): any[] {
    const months = getMonthLabels(this.selectedLanguage);
    return months.map(month => ({
      name: month,
      tooltip: `${month}, ${new Date().getFullYear}`,
      value: 0,
      rawValue: 0
    }));
  }

  onClickApuracao() {
    this.tabService.changeTab('apuracao');
  }

  get tooltipBottomPercent(): number | null {
    const bar = this.annualChartData[this.hoverIndex];
    if (!bar || bar.value < 0) return null;
    return this.zeroLinePercent + Math.abs(bar.value);
  }
  
  get tooltipTopPercent(): number | null {
    const bar = this.annualChartData[this.hoverIndex];
    if (!bar || bar.value >= 0) return null;
    return (100 - this.zeroLinePercent) + Math.abs(bar.value);
  }
 
}