import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, ViewEncapsulation, HostListener } from '@angular/core';
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
import { GrossProfitMixResponse, ProjectResultAssessmentResponse } from '../../../models/interfaces/dashboards.response';
import { DatePickerService } from '../../../services/data-picker.service';
import { DynamicNumberPipe } from '../../../helpers/pipes/dynamic-number.pipe';
import { formatChartData } from '../../../helpers/chart-data-formatter.utils';
import { GrossProfitGroup } from '../../../models/interfaces/dashboards';
import { LanguageService } from '../../../services/language.service';

@Component({
  selector: 'app-gross-profit-mix-chart',
  templateUrl: './gross-profit-mix-chart.component.html',
  styleUrl: './gross-profit-mix-chart.component.css',
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


export class GrossProfitMixChartComponent implements OnInit {
  readonly DEFAUT_FUEL = 'Gasolina Grid';
  grossProfitMixResponse: GrossProfitMixResponse[] = []
  selectedLanguage: string = 'pt'
  selectedDate: string = '2025-01-01'
  products: string[] = []
  produtsMix: string[] = [];
  selectedProductForMix: string = this.DEFAUT_FUEL;
  formattedChartData!: Record<string, { month: string; treatment: number; control: number }[]>;
  mixGrossProfitDada: { month: string; treatment: number; control: number }[] = [];
  dropdownMixOpen: boolean = false;
  heightdMixGrafic: number = 200;
  widthMixGrafic:  number = 350;
  lineMixGridY: number[] = [];
  columsMixGridX: number[] = [];
  valuesMixAxisY: number[] = [];
  maxValueMixGrafic: number = 1;
  maxValueGapGrafic: number = 1;
  visibleDetails: any;
  upsideGrossProfit: number = 0.0;

  tooltipData = {
    visible: false,
    x: 0,
    y: 0,
    treatment: 0,
    control: 0
  };

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

  grossProfitData: ProjectResultAssessmentResponse[] = []
  
  constructor(
    private _dashboardService: _DashboardService,
    private datePickerService: DatePickerService,
    private languageService: LanguageService
  ) {
    this.selectedLanguage = localStorage.getItem('appLanguage') || 'pt';
    this.languageService.getLang$().subscribe(lang => {
      this.selectedLanguage = lang;
      this.updateGrossProfitMix();
    });
  }

  ngOnInit(): void {
    this.datePickerService.selectedDate$.subscribe(date => {
      this.selectedDate = date;
      this.updateCharts();
    });
  }

  updateCharts(): void {
    this.getGrossProfitMix();
  }

  getGrossProfitMix() {
    this._dashboardService.getGrossProfitMix().subscribe((data: GrossProfitMixResponse[]) => {
      this.grossProfitMixResponse = data;
      this.updateGrossProfitMix();
    });
  }

  updateGrossProfitMix(){
    this.products = this.produtsMix = [...new Set(this.grossProfitMixResponse.map(item => item.productDisplayName).sort())];
    this.selectedProductForMix = this.produtsMix[0];
    this.formattedChartData =  formatChartData(this.selectedLanguage, this.grossProfitMixResponse, item => item.share);
    this.selectedProductForMix = this.DEFAUT_FUEL;
    this.mixGrossProfitDada = this.formattedChartData[this.selectedProductForMix ];
    this.generateMixGrafic();
  }

  selectProductMix(produto: string, event: MouseEvent) {
    event.stopPropagation();
    this.selectedProductForMix = produto;
    this.dropdownMixOpen = false;
    this.mixGrossProfitDada = this.formattedChartData[produto];
    this.generateMixGrafic();
  }

  toggleDropdownMix() {
    this.dropdownMixOpen = !this.dropdownMixOpen;
  }

  generateMixGrafic(): void {
    if(!this.mixGrossProfitDada)
      return;
    
    this.lineMixGridY = [];
    this.columsMixGridX = [];

    const linesNumber = 5;
    const columnsNumber = this.mixGrossProfitDada.length;

    const maxTreatment = Math.max(...this.mixGrossProfitDada.map(item => item.treatment));
    const maxControl = Math.max(...this.mixGrossProfitDada.map(item => item.control));

    this.valuesMixAxisY = [];
    for (let i = 0; i <= linesNumber; i++) {
      this.maxValueMixGrafic = Math.ceil(Math.max(maxTreatment, maxControl) / 10) * 10;
      const valor = (this.maxValueMixGrafic / linesNumber) * i;
      this.valuesMixAxisY.push(valor);
      this.lineMixGridY.push(this.heightdMixGrafic - (this.heightdMixGrafic / linesNumber) * i);
    }

    for (let i = 0; i < columnsNumber; i++) {
      this.columsMixGridX.push((this.widthMixGrafic / columnsNumber) * i + 20);
    }
  }


  showTooltip(event: MouseEvent, item: any) {
    const svg = (event.target as SVGElement).closest('svg');
    const rect = svg?.getBoundingClientRect();
    if (!rect) return;

    this.tooltipData = {
      visible: true,
      x: event.clientX - rect.left + 10,
      y: event.clientY - rect.top - 50,
      treatment: item.treatment,
      control: item.control
    };
  }

  hideTooltip() {
    this.tooltipData.visible = false;
  }


  toggleDetails(): void {
    this.visibleDetails = !this.visibleDetails;
  }

  get isNegative(): boolean {
    return this.upsideGrossProfit < 0 || Object.is(this.upsideGrossProfit, -0);
  }

  @HostListener('document:click', ['$event'])
  fecharDropdownSeClicarFora(event: Event) {
    const dropdown = document.querySelector('.custom-dropdown');
    if (dropdown && !dropdown.contains(event.target as Node)) {
      this.dropdownMixOpen = false;
    }
  }

  @HostListener('document:click', ['$event'])
  fecharDropdownSeClicarMixFora(event: Event) {
    const dropdown = document.querySelector('.custom-dropdown-mix');
    if (dropdown && !dropdown.contains(event.target as Node)) {
      this.dropdownMixOpen = false;
    }
  }
}