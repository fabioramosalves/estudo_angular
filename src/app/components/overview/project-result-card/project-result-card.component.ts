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
import { _DashboardService } from '../../../services/dashboard.service';
import {  UpsideResponse} from '../../../models/interfaces/dashboards.response';
import { DatePickerService } from '../../../services/data-picker.service';
import { DynamicNumberPipe } from '../../../helpers/pipes/dynamic-number.pipe';
import { TabService } from '../../../services/tab.service';

@Component({
  selector: 'app-project-result-card',
  templateUrl: './project-result-card.component.html',
  styleUrls: ['./project-result-card.component.css'],
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

export class ProjectResultCardComponent implements OnInit {
  selectedLanguage: string = 'pt'
  selectedDate: string = '2025-01-01'
  monetaryUpsideGrossProfit: number = 0.00;
  upsideGrossProfit: number = 0.0;
  
  constructor(
    private _dashboardService: _DashboardService,
    private datePickerService: DatePickerService,
    private tabService: TabService,
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
    this.getProjectUpside();
  }

  getProjectUpside() {
    this._dashboardService.getProjectUpside(this.selectedDate).subscribe((data: UpsideResponse) => {
      this.monetaryUpsideGrossProfit = data.monetaryUpsideGrossProfit;
      this.upsideGrossProfit = data.upsideGrossProfit;

    })
  }

  onClickApuracao() {
    this.tabService.changeTab('apuracao');
  }

  get isNegative(): boolean {
    return this.upsideGrossProfit < 0 || Object.is(this.upsideGrossProfit, -0);
  }

}  