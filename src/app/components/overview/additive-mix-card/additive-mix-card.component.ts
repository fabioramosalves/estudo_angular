




import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, ViewEncapsulation  } from '@angular/core';
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
import { AdditiveMixResponse } from '../../../models/interfaces/dashboards.response';
import { DatePickerService } from '../../../services/data-picker.service';
import { DynamicNumberPipe } from '../../../helpers/pipes/dynamic-number.pipe';

@Component({
  selector: 'app-additive-mix-card',
  templateUrl: './additive-mix-card.component.html',
  styleUrl: './additive-mix-card.component.css',
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

export class AdditiveMixCardComponent implements OnInit {
  selectedLanguage: string = 'pt'
  selectedDate: string = '2025-01-01'
  shareTotal: number = 0.0;
  
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
    this.getAdditiveMix();
  }

  getAdditiveMix() {
    this._dashboardService.getAdditiveMix(this.selectedDate).subscribe((data: AdditiveMixResponse) => {
      this.shareTotal = data.shareTotal
    })
  }

}