import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MenuLateralComponent } from '../../components/sidebar-menu/sidebar-menu.component';
import { HeaderComponent } from '../../components/header/header.component';
import { LoadingOverlayComponent } from '../../components/loading/loading.component';
import { MatTableModule } from '@angular/material/table';
import { DashboardService } from '../../services/dashboard.service';
import { GrossProfitGroup } from '../../models/interfaces/dashboards';
import { 
  ProjectResultAssessmentResponse, 
  StationsForAssessmentResponse, 
  SuccessFeeResponse,
} from '../../models/interfaces/dashboards.response';
import { DatePickerService } from '../../services/data-picker.service';
import { LoadingService } from '../../services/loading.service';
import { Observable } from 'rxjs';
import { ProjectOutcomeChartComponent } from '../../components/overview/project-outcome-chart/project-outcome-chart.component';
import { GrossProfitChartComponent } from '../../components/overview/gross-profit-chart/gross-profit-chart.component';
import { ParticipantingStationsComponent } from '../../components/overview/participanting-stations/participanting-stations.component';
import { StationsGrowthStateComponent } from '../../components/overview/stations-growth-state/stations-growth-state.component';
import { StationsGrowthCityComponent } from '../../components/overview/stations-growth-city/stations-growth-city.component';
import { ProjectResultCardComponent } from '../../components/overview/project-result-card/project-result-card.component';
import { StationsGrowthComponent } from '../../components/overview/stations-growth/stations-growth.component';
import { AdditiveMixCardComponent } from '../../components/overview/additive-mix-card/additive-mix-card.component';
import { ProductGapChartComponent } from '../../components/overview/product-gap-chart/product-gap-chart.component';
import { GrossProfitMixChartComponent } from '../../components/overview/gross-profit-mix-chart/gross-profit-mix-chart.component';
import { ResultAssessmentComponent } from './result-assessment/result-assessment.component';
import { TabService } from '../../services/tab.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule,
    MatToolbarModule,
    FormsModule,
    MenuLateralComponent,
    ProjectOutcomeChartComponent,
    GrossProfitChartComponent,
    ParticipantingStationsComponent,
    StationsGrowthStateComponent,
    StationsGrowthCityComponent,
    ProjectResultCardComponent,
    StationsGrowthComponent,
    AdditiveMixCardComponent,
    ProductGapChartComponent,
    GrossProfitMixChartComponent,
    ResultAssessmentComponent,
    HeaderComponent,
    TranslateModule,
    LoadingOverlayComponent,
    MatTableModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  encapsulation: ViewEncapsulation.None,
})

export class DashboardComponent implements OnInit {
  selectedLanguage: string = 'pt'
  loading$: Observable<boolean>;
  selectedDate: string = '2025-01-01'
  successFeeToCharge: number = 0;
  grossProfitData: ProjectResultAssessmentResponse[] = []
  dataSource: any[] = [];
  selectedTab: 'overview' | 'apuracao' = 'overview';
  isGrowthPositiveTG: boolean = false;
  isGrowthPositiveCG: boolean = false;
  openMenu: boolean = true;

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

  
  constructor(
    private DashboardService: DashboardService,
    private datePickerService: DatePickerService,
    private loadingService: LoadingService,
    private tabService: TabService,
  ) {
    this.selectedLanguage = localStorage.getItem('appLanguage') || 'pt';
    this.loading$ = this.loadingService.loading$;
  }

  ngOnInit(): void {
    this.tabService.onTabChange().subscribe(tab => this.selectTab(tab));
    this.datePickerService.selectedDate$.subscribe(date => {
      this.selectedDate = date;
      this.updateCharts();
    });
  }

  updateCharts(): void {
    this.getSuccessFee();
    this.getProjectResultAssessment();
    this.getStationsForAssessment();
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

  selectTab(aba: 'overview' | 'apuracao') {
    this.selectedTab = aba;
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

}