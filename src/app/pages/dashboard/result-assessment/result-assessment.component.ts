


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
import { DashboardService } from '../../../services/dashboard.service';
import { 
  ProjectResultAssessmentResponse, 
  StationsForAssessmentResponse, 
  SuccessFeeResponse, 
  UpsideResponse
} from '../../../models/interfaces/dashboards.response';
import { DatePickerService } from '../../../services/data-picker.service';
import { DynamicNumberPipe } from '../../../helpers/pipes/dynamic-number.pipe';
import { GrossProfitGroup } from '../../../models/interfaces/dashboards';

@Component({
  selector: 'app-assessment-result',
  templateUrl: './result-assessment.component.html',
  styleUrl: './result-assessment.component.css',
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

export class ResultAssessmentComponent implements OnInit {
  selectedLanguage: string = 'pt'
  successFeeToCharge: number = 0;
  selectedDate: string = '2025-01-01'
  isGrowthPositiveTG: boolean = false;
  isGrowthPositiveCG: boolean = false;
  upsideGrossProfitResult: number = 0.0;
  monetaryUpsideGrossProfitResult: number = 0.00;
  dataSource: any[] = [];

  grossProfitData: ProjectResultAssessmentResponse[] = []
  groupTG: GrossProfitGroup = {
    grossProfit: 0,
    grossProfitBaseline: 0,
    growthValue: 0,
    growthPercent: 0,
  };

  groupCG: GrossProfitGroup = {
    grossProfit: 0,
    grossProfitBaseline: 0,
    growthValue: 0,
    growthPercent: 0,
  };

  displayedColumns: string[] = [
    'comparisonGroupDisplay',
    'countTotalStores',
    'countStoresRemovedBySss',
    'countStoresOutliers',
    'countStoresAssessed'
  ];
 
  constructor(
    private DashboardService: DashboardService,
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
    this.getSuccessFee();
    this.getProjectResultAssessment();
    this.getStationsForAssessment();
    this.getProjectUpside();
  }

  getSuccessFee() {
    this.DashboardService.getSuccessFee(this.selectedDate).subscribe((fee: SuccessFeeResponse) => {
      this.successFeeToCharge = fee.successFeeToCharge;
    });
  }

  getProjectResultAssessment() {
    this.DashboardService.getProjectResultAssessment(this.selectedDate).subscribe((data: ProjectResultAssessmentResponse[]) => {
      this.grossProfitData = data;
      this.mapGrossProfitByGroup();
    });
  }

  getStationsForAssessment() {
    this.DashboardService.getStationsForAssessment(this.selectedDate).subscribe((data: StationsForAssessmentResponse[]) => {
      this.dataSource = data;
    })
  }

  getProjectUpside() {
    this.DashboardService.getProjectUpside(this.selectedDate).subscribe((data: UpsideResponse) => {
      this.monetaryUpsideGrossProfitResult = data.monetaryUpsideGrossProfit;
      this.upsideGrossProfitResult = data.upsideGrossProfit;

    })
  }

  private mapGrossProfitByGroup(): void {
    const grouped = new Map<'TG' | 'CG', GrossProfitGroup>();

    for (const item of this.grossProfitData) {
      grouped.set(item.comparisonGroup, {
        grossProfit: item.grossProfit,
        grossProfitBaseline: item.grossProfitBaseline,
        growthValue: item.growthValue,
        growthPercent: item.growthPercent,
      });
    }

    this.groupTG = grouped.get('TG') ?? this.groupTG;
    this.groupCG = grouped.get('CG') ?? this.groupCG;
    this.isGrowthPositiveTG = this.groupTG.growthValue >= 0;
    this.isGrowthPositiveCG = this.groupCG.growthValue >= 0;
  }

  get isNegative(): boolean {
    return this.upsideGrossProfitResult < 0 || Object.is(this.upsideGrossProfitResult, -0);
  }

}