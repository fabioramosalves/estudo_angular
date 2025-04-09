import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatTableModule } from '@angular/material/table';
import { _DashboardService } from '../../../services/dashboard.service';
import { StationsGrowthResponse } from '../../../models/interfaces/dashboards.response';
import { DatePickerService } from '../../../services/data-picker.service';
import { DynamicNumberPipe } from '../../../helpers/pipes/dynamic-number.pipe';

@Component({
  selector: 'app-stations-growth',
  templateUrl: './stations-growth.component.html',
  styleUrl: './stations-growth.component.css',
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
    DynamicNumberPipe,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  encapsulation: ViewEncapsulation.None,
})

export class StationsGrowthComponent implements OnInit {
  selectedDate: string = '2025-01-01'

  selectedLanguage: string = 'pt'

  stationsGrowth = {
    treatment: 0,
    control: 0
  };
  
  constructor(
    private _dashboardService: _DashboardService,
    private datePickerService: DatePickerService,
  ) {
    this.selectedLanguage = localStorage.getItem('appLanguage') || 'pt';

  }

  ngOnInit(): void {
    this.datePickerService.selectedDate$.subscribe(date => {
      this.selectedDate = date;
      this.updateCharts();
    });
  }

  updateCharts(): void {
    this.getStationsGrowth();

  }

  getStationsGrowth() {
    this._dashboardService.getStationsGrowth(this.selectedDate).subscribe({
      next: (data: StationsGrowthResponse[]) => {
        const treatment = data.find(item => item.comparisonGroup === 'TG')?.liftGrossProfit || 0;
        const control = data.find(item => item.comparisonGroup === 'CG')?.liftGrossProfit || 0;

        this.stationsGrowth = {
          treatment: (treatment),
          control: (control),
        };
      }
    });
  }

}