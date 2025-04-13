import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { ConfigService } from './config.service';
import { PriceMonitoringModel, PriceMonitoringValues } from '../models/interfaces/price-monitoring.response';
import { formatDateTime } from '../helpers/date-utils';

@Injectable({ providedIn: 'root' })
export class PriceMonitoringService {
  private http = inject(HttpClient);
  private configService = inject(ConfigService);
  private apiUrl = this.configService.vibraApiUrl;

  sortedPrices: PriceMonitoringModel[] = []


  getPriceMonitoring(priceMonitoringFilters: any): Observable<PriceMonitoringModel[]> {
    return this.http.post<{ items: any[], totalItems: number }>(`${this.apiUrl}/price-monitoring/json`, priceMonitoringFilters).pipe(
      map(response => response.items.map(item => ({
        assessmentMonth: item.assessment_month,
        storeName: item.store_name,
        sourceStoreId: item.source_store_id,
        city: item.city,
        validityFrom: item.validity_from,
        validityUntil: item.validity_until,
        productDescription: item.product_description,
        productDisplayName: item.product_display_name,
        recType: item.rec_type,
        recommendedValue: item.recommended_value,
        appliedValue: item.applied_value,
        recommendedAppliedValueDiff: item.recommended_applied_value_diff,
        latestPumpPriceWithinRecVal: item.latest_pump_price_within_rec_val,
        pumpPriceDiff: item.pump_price_diff

      })))
    );
  }

  getPriceMonitoringValues(): Observable<PriceMonitoringValues[]> {
    return this.http.get<any[]>(`${this.apiUrl}/price-monitoring/price-values`).pipe(
      map(list => list.map(item => ({
        productDescription: item.product_description,
        productDisplayName: item.product_display_name,
        minRecommendedValue: item.min_recommended_value,
        maxRecommendedValue: item.max_recommended_value,
        maxLatestPumpPriceWithinRecVal: item.max_latest_pump_price_within_rec_val,
        minLatestPumpPriceWithinRecVal: item.min_latest_pump_price_within_rec_val,
        maxPumpPriceDiff: item.max_pump_price_diff,
        minPumpPriceDiff: item.min_pump_price_diff,
        maxRecommendedAppliedValueDiff: item.max_recommended_applied_value_diff,
        minRecommendedAppliedValueDiff: item.min_recommended_applied_value_diff,
        maxAppliedValue: item.max_applied_value,
        minAppliedValue: item.min_applied_value
      })))
    );
  }

  getPriceMonitoringCsv(priceMonitoringFilters: any): void {
    let filtersCopy = { ...priceMonitoringFilters }
    filtersCopy.page = null
    filtersCopy.page_size = null
    this.http.post(`${this.apiUrl}/price-monitoring/csv`, filtersCopy, {
      responseType: 'blob'
    }).subscribe(blob => {
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const formattedData = formatDateTime()
      a.download = `price-monitoring_${formattedData}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
    });
  }

  getPrices(priceMonitoring: PriceMonitoringModel[], pageSize: number, sortColumn: string, sortDirection: 'asc' | 'desc'): Observable<PriceMonitoringModel[]> {
    console.log('priceMonitoring', priceMonitoring);
    let sortedData = [...priceMonitoring];
    if (sortColumn) {
      sortedData.sort((a, b) => {
        let valueA = a[sortColumn as keyof PriceMonitoringModel];
        let valueB = b[sortColumn as keyof PriceMonitoringModel];
        if (typeof valueA === 'string') valueA = valueA.toLowerCase();
        if (typeof valueB === 'string') valueB = valueB.toLowerCase();
        if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
        if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    const startIndex = 0;
    const paginatedData = sortedData.slice(startIndex, startIndex + pageSize);
    return of(paginatedData);
  }

}
