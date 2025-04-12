import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import {
  UpsideResponse,
  ProjectOutcomeResponse,
  StationsGrowthResponse,
  ParticipatingStationsResponse,
  ProductGrossProfitResponse,
  AdditiveMixResponse,
  GrossProfitMixResponse,
  SuccessFeeResponse,
  ProjectResultAssessmentResponse,
  StationsForAssessmentResponse,
  RegionGrowthResponse,
  ProductGapResponse
} from '../models/interfaces/dashboards.response';
import { ConfigService } from './config.service';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private http = inject(HttpClient);
  private configService = inject(ConfigService);
  private apiUrl = this.configService.vibraApiUrl + '/dashboard';

  getProjectUpside(assessmentMonth: string): Observable<UpsideResponse> {
    return this.http.get<any>(`${this.apiUrl}/upside/${assessmentMonth}`).pipe(
      map(data => ({
        monetaryUpsideGrossProfit: data.monetary_upside_gross_profit,
        upsideGrossProfit: data.upside_gross_profit
      }))
    );
  }

  getProjectOutcome(): Observable<ProjectOutcomeResponse[]> {
    return this.http.get<any[]>(`${this.apiUrl}/project-outcome`).pipe(
      map(list => list.map(item => ({
        monetaryUpsideGrossProfit: item.monetary_upside_gross_profit,
        assessmentMonth: item.assessment_month,
        executionDate: item.execution_date,
      })))
    );
  }

  getStationsGrowth(assessmentMonth: string): Observable<StationsGrowthResponse[]> {
    return this.http.get<any[]>(`${this.apiUrl}/stations-growth/${assessmentMonth}`).pipe(
      map(list => list.map(item => ({
        liftGrossProfit: item.lift_gross_profit,
        comparisonGroup: item.comparison_group
      })))
    );
  }

  getParticipatingStations(assessmentMonth: string): Observable<ParticipatingStationsResponse> {
    return this.http.get<any>(`${this.apiUrl}/participating-stations/${assessmentMonth}`).pipe(
      map(data => ({
        countStoresProject: data.count_stores_project,
        countStoresProjectTg: data.count_stores_project_tg,
        countTgStoresWithTransactions: data.count_tg_stores_with_transactions
      }))
    );
  }
  
  getProductGrossProfit(assessmentMonth: string): Observable<ProductGrossProfitResponse[]> {
    return this.http.get<any[]>(`${this.apiUrl}/product-gross-profit/${assessmentMonth}`).pipe(
      map(list => list.map(item => ({
        kpiValue: item.kpi_value,
        productDescription: item.product_description,
        productDisplayName: item.product_display_name
      })))
    );
  }

  getAdditiveMix(assessmentMonth: string): Observable<AdditiveMixResponse> {
    return this.http.get<any>(`${this.apiUrl}/additive-mix/${assessmentMonth}`).pipe(
      map(data => ({
        assessmentMonth: data.assessment_month,
        shareTotal: data.share_total
        }))
    );
  }

  getGrossProfitMix(): Observable<GrossProfitMixResponse[]> {
    return this.http.get<any[]>(`${this.apiUrl}/gross-profit-mix`).pipe(
      map(list => list.map(item => ({
        assessmentMonth: item.assessment_month,
        comparisonGroup: item.comparison_group,
        share: item.share,
        productDescription: item.product_description,
        productDisplayName: item.product_display_name
      })))
    );
  }

  getProductGap(): Observable<ProductGapResponse[]> {
    return this.http.get<any[]>(`${this.apiUrl}/product-gap`).pipe(
      map(list => list.map(item => ({
        assessmentMonth: item.assessment_month,
        comparisonGroup: item.comparison_group,
        internalProductId: item.internal_product_id,
        productDescription: item.product_description,
        productDisplayName: item.product_display_name,
        appliedPriceGap: item.applied_price_gap
      })))
    )
  }

  getRegionGrowth(region: string, assessmentMonth: string): Observable<RegionGrowthResponse[]> {
    return this.http.get<any[]>(`${this.apiUrl}/region-growth/${region}/${assessmentMonth}`).pipe(
      map(list => list.map(item => ({
          assessmentMonth: item.assessment_month,
          levelValue: item.level_value,
          lift: item.lift
      })))
    )
  }


  getSuccessFee(assessmentMonth: string): Observable<SuccessFeeResponse> {
    return this.http.get<any>(`${this.apiUrl}/success-fee/${assessmentMonth}`).pipe(
     map(item => ({
        successFeeToCharge: item.success_fee_to_charge
      })));
  }

  
  getProjectResultAssessment(assessmentMonth: string): Observable<ProjectResultAssessmentResponse[]> {
    return this.http.get<any[]>(`${this.apiUrl}/project-result-assessment/${assessmentMonth}`).pipe(
      map(list => list.map(item => ({
        grossProfit: item.gross_profit,
        grossProfitBaseline: item.gross_profit_baseline,
        growthValue: item.growth_value,
        growthPercent: item.growth_percent,
        comparisonGroup: item.comparison_group
      })))
    );
  }

  getStationsForAssessment(assessmentMonth: string): Observable<StationsForAssessmentResponse[]> {
    return this.http.get<any[]>(`${this.apiUrl}/stations-assessment/${assessmentMonth}`).pipe(
      map(list => list.map(item => ({
        countTotalStores: item.count_total_stores,
        countStoresRemovedBySss: item.count_stores_removed_by_sss,
        countStoresOutliers: item.count_stores_outliers,
        countStoresAssessed: item.count_stores_assessed,
        comparisonGroup: item.comparison_group,
        comparisonGroupDisplay: item.comparison_group_display
      })))
    );
  }

}
