import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, ViewEncapsulation, HostListener, NgModule } from '@angular/core';
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
import {  RegionGrowthResponse} from '../../../models/interfaces/dashboards.response';
import { DatePickerService } from '../../../services/data-picker.service';
import { DynamicNumberPipe } from '../../../helpers/pipes/dynamic-number.pipe';
import { toTitleCase } from '../../../helpers/string-utils';

@Component({
  selector: 'app-stations-growth-city',
  templateUrl: './stations-growth-city.component.html',
  styleUrl: './stations-growth-city.component.css',
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

export class StationsGrowthCityComponent implements OnInit {
    selectedLanguage: string = 'pt'
    selectedDate: string = '2025-01-01'
    stateGrowth: RegionGrowthResponse[] = [];
    cityGrowth: RegionGrowthResponse[] = [];
  
  constructor(
    private _dashboardService: _DashboardService,
    private datePickerService: DatePickerService
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
    this.getRegionGrowth('city');
  }

  getRegionGrowth(region: 'city' | 'state'): void {
    this._dashboardService.getRegionGrowth(region, this.selectedDate).subscribe((data: RegionGrowthResponse[]) => {
      const formattedGrowth = data.map(item => ({
        ...item,
        levelValue: toTitleCase(item.levelValue)
      }));
      switch (region) {
        case 'city':
          this.cityGrowth = formattedGrowth;
          break;
        case 'state':
          this.stateGrowth = formattedGrowth;
          break;
        default:
          console.warn(`Unknown region type: ${region}`);
      }
    });
  }

  getPercentualClass(percentual: number): string {
    return percentual >= 0 ? 'percent-positive' : 'percent-negative';
  }
  
  getArrowClass(percentual: number): string {
    return percentual >= 0 ? 'arrow-up' : 'arrow-down';
  }
}