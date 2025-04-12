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
import {  ParticipatingStationsResponse } from '../../../models/interfaces/dashboards.response';
import { DatePickerService } from '../../../services/data-picker.service';
import { LoadingService } from '../../../services/loading.service';
import { DynamicNumberPipe } from '../../../helpers/pipes/dynamic-number.pipe';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-participanting-stations',
  templateUrl: './participanting-stations.component.html',
  styleUrls: ['./participanting-stations.component.css'],
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

export class ParticipantingStationsComponent implements OnInit {
  selectedLanguage: string = 'pt'
  selectedDate: string = '2025-01-01'
  participatingStations: ParticipatingStationsResponse | null = null
  funnelSizeTotal = 0;
  funnelSizeRecomendacao = 0;
  funnelSizeCompra = 0;
  private baseSize = 180;
  
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
    this.getParticipatingStations();
  }

 private getParticipatingStations() {
    this.DashboardService.getParticipatingStations(this.selectedDate).subscribe((data: ParticipatingStationsResponse) => {
      this.participatingStations = data;
      this.updateCircleSizes();
    });
  }

  private updateCircleSizes(): void {
      this.cleanFunnelChart();
    if (!this.participatingStations) return;

    const maxValue = Math.max(
      this.participatingStations.countTgStoresWithTransactions,
      this.participatingStations.countStoresProjectTg,
      this.participatingStations.countStoresProject
    );

    if(maxValue){
      this.funnelSizeTotal = this.baseSize * (this.participatingStations.countStoresProject / maxValue);
      this.funnelSizeRecomendacao = this.baseSize * (this.participatingStations.countStoresProjectTg / maxValue);
      this.funnelSizeCompra = this.baseSize * (this.participatingStations.countTgStoresWithTransactions / maxValue);
    }
  }

  private cleanFunnelChart(){
    this.funnelSizeTotal = 0;
    this.funnelSizeRecomendacao = 0;
    this.funnelSizeCompra = 0;
  }

}