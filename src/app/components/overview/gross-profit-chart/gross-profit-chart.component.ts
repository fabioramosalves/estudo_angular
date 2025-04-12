import {
  Component,
  OnInit,
  CUSTOM_ELEMENTS_SCHEMA,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatTableModule } from '@angular/material/table';
import { DashboardService } from '../../../services/dashboard.service';
import { ProductGrossProfitResponse } from '../../../models/interfaces/dashboards.response';
import { DatePickerService } from '../../../services/data-picker.service';

@Component({
  selector: 'app-gross-profit-chart',
  templateUrl: './gross-profit-chart.component.html',
  styleUrls: ['./gross-profit-chart.component.css'],
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
    MatTableModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  encapsulation: ViewEncapsulation.None,
})
export class GrossProfitChartComponent implements OnInit {
  selectedLanguage: string = 'pt';
  selectedDate: string = '2025-01-01';
  productGrossProfit: ProductGrossProfitResponse[] = [];
  grossFitrowGridXValue: { percent: number; value: number }[] = [];
  maxValueGrossProfit: number = 0;
  maxGrossProfit: number = 0;

  constructor(
    private DashboardService: DashboardService,
    private datePickerService: DatePickerService
  ) {
    this.selectedLanguage = localStorage.getItem('appLanguage') || 'pt';
  }

  ngOnInit(): void {
    this.datePickerService.selectedDate$.subscribe((date) => {
      this.selectedDate = date;
      this.updateCharts();
    });
  }

  updateCharts(): void {
    this.getProductGrossProfit();
  }

  formatProductName(name: string): string[] {
    return name ? name.split(' ') : [];
  }

  getProductGrossProfit(): void {
    this.DashboardService
      .getProductGrossProfit(this.selectedDate)
      .subscribe((data: ProductGrossProfitResponse[]) => {
        this.productGrossProfit = data;
        this.generateGrossProfitChart();
      });
  }

  generateGrossProfitChart(): void {
    if (!this.productGrossProfit.length) {
      this.initializeProductGrossProfitData();
      return;
    }

    const maxKpi = Math.max(...this.productGrossProfit.map(item => item.kpiValue));
    this.maxGrossProfit = maxKpi;

    const columnsNumber = 8;
    this.grossFitrowGridXValue = [];

    for (let i = 0; i <= columnsNumber; i++) {
      const percent = (i / columnsNumber) * 100;
      const value = (this.maxGrossProfit / columnsNumber) * i;
      this.grossFitrowGridXValue.push({
        percent: percent,
        value: Math.trunc(value / 1000)
      });
    }

    this.maxValueGrossProfit = maxKpi;
  }

  private initializeProductGrossProfitData(): void {
    const productNames: string[] = [
      'Gasolina Grid',
      'Diesel S10 Grid',
      'Gasolina Podium',
      'Diesel S500 Grid',
      'Etanol Grid',
      'Diesel Verana',
      'Diesel S10 Podium',
    ];

    this.productGrossProfit = productNames.map((name) => ({
      kpiValue: 0,
      productDescription: name,
      productDisplayName: name,
    }));
  }
}
