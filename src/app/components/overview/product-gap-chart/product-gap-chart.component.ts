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
import { ProductGapResponse  } from '../../../models/interfaces/dashboards.response';
import { DatePickerService } from '../../../services/data-picker.service';
import { DynamicNumberPipe } from '../../../helpers/pipes/dynamic-number.pipe';
import { formatChartData } from '../../../helpers/chart-data-formatter.utils';
import moment from 'moment';
import { LanguageService } from '../../../services/language.service';

@Component({
  selector: 'app-product-gap-chart',
  templateUrl: './product-gap-chart.component.html',
  styleUrl: './product-gap-chart.component.css',
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

export class ProductGapChartComponent implements OnInit {
  readonly DEFAUT_FUEL = 'Gasolina Grid';
  selectedLanguage: string = 'pt';
  selectedDate: string = '2025-01-01';
  selectedProductForGap: string = this.DEFAUT_FUEL;
  selectedProductForMix: string = '';
  dropdownProductGapOpen = false;
  productGapResponse: ProductGapResponse[] = [];
  gapProducts: string[] = [];
  formattedProductGapData!: Record<string, { month: string; treatment: number; control: number }[]>;
  productGapData: { month: string; treatment: number; control: number }[] = [];
  widthGapGrafic: number = 200;
  heightGapGrafic: number = 200;
  linesGapGridY: number[] = [];
  columsGapGridX: number[] = [];
  treatmentPoints: string = '';
  controlPoints: string = '';
  treatmentCircles: { x: number; y: number; value: number }[] = [];
  controlCircles: { x: number; y: number; value: number }[] = [];
  monthAxisX: string[] = [];
  currentMonthIndex = moment().month();
  valueGapAxisY: number[] = [];
  minGapValue: number = -1;
  maxGapValue: number = 1;
  lineMixGridY: number[] = [];
  valuesMixAxisY: number[] = [];
  dropdownResultadoAberto = false;
  hoveredIndex: number | null = null;
  public Math = Math;
  tooltipPosition = { left: 0, top: 0 };

  constructor(
    private _dashboardService: _DashboardService,
    private datePickerService: DatePickerService,
    private languageService: LanguageService,
  ) {
    this.selectedLanguage = localStorage.getItem('appLanguage') || 'pt';
    this.languageService.getLang$().subscribe(lang => {
      this.selectedLanguage = lang;
      this.updateProductGap();
    });
  }

  ngOnInit(): void {
    this.datePickerService.selectedDate$.subscribe(date => {
      this.selectedDate = date;
      this.updateCharts();
    });
  }

  updateCharts(): void {
    this.getProductGap();
  }

  getProductGap() {
    this._dashboardService.getProductGap().subscribe((data: ProductGapResponse[]) => {
      this.productGapResponse = data;
      this.updateProductGap();
    })
  }

  updateProductGap(){
    if(!this.productGapResponse || this.productGapResponse.length === 0) {
      return;
    }
    this.gapProducts = [...new Set(this.productGapResponse.map(item => item.productDisplayName).sort())];
    this.formattedProductGapData = formatChartData(this.selectedLanguage, this.productGapResponse, item => item.appliedPriceGap);
    this.selectedProductForGap = this.DEFAUT_FUEL;
    this.productGapData = this.formattedProductGapData[this.selectedProductForGap];
    this.generateGapGrid();
    this.calculateGapPositions();
  }

  selectProductGap(produto: string, event: MouseEvent) {
    event.stopPropagation();
    this.selectedProductForGap = produto;
    this.dropdownProductGapOpen = false;
    this.productGapData = this.formattedProductGapData[produto];
    this.generateGapGrid();
    this.calculateGapPositions();
  }

  private generateGapGrid(): void {
    this.linesGapGridY = [];
    this.columsGapGridX = [];

    const placeholderMonths = ['', ...this.productGapData.map(p => p.month), ''];
    this.monthAxisX = placeholderMonths;

    const maxValue = Math.max(
      ...this.productGapData.flatMap(p => [p.treatment, p.control])
    );

    const lineNumbers = 5;
    const columnsNumber = placeholderMonths.length;

    this.valueGapAxisY = [];

    for (let i = 0; i <= lineNumbers; i++) {
      const valor = (maxValue / lineNumbers) * i;
      this.valueGapAxisY.unshift(valor);
    }
    const xSpacing = this.widthGapGrafic / (columnsNumber - 1);

    this.linesGapGridY = [];

    for (let i = 0; i <= lineNumbers; i++) {
      const posY = (this.heightGapGrafic / lineNumbers) * i;
      this.linesGapGridY.push(posY);
    }

    for (let i = 0; i < columnsNumber; i++) {
      this.columsGapGridX.push(xSpacing * i);
    }
  }

  private calculateGapPositions(): void {
    const numGridColumns = this.productGapData.length + 2;
    const xSpacing = this.widthGapGrafic / (numGridColumns - 1);
  
    const allValues = this.productGapData.flatMap(p => [p.treatment, p.control]);
  
    const realMin = Math.min(...allValues);
    const realMax = Math.max(...allValues);
  
    const minVisualRange = Math.max(Math.abs(realMax * 0.05), 0.01);
  
    if (realMax - realMin < minVisualRange) {
      this.maxGapValue = realMax + minVisualRange / 2;
      this.minGapValue = realMin - minVisualRange / 2;
    } else {
      this.maxGapValue = Math.ceil(realMax * 100) / 100;
      this.minGapValue = Math.floor(realMin * 100) / 100;
    }
  
    const range = this.maxGapValue - this.minGapValue;
    const ySteps = 5;

    this.valueGapAxisY = [];
    for (let i = 0; i <= ySteps; i++) {
      const stepValue = this.maxGapValue - (range / ySteps) * i;
      this.valueGapAxisY.push(stepValue);
    }
  
    this.lineMixGridY = [];
    for (let i = 0; i <= ySteps; i++) {
      const y = (this.heightGapGrafic / ySteps) * i;
      this.lineMixGridY.push(y);
    }
  
    this.treatmentCircles = [];
    this.treatmentPoints = this.productGapData
      .map((point, index) => {
        const x = (index + 1) * xSpacing;
        const y = this.mapGapToY(point.treatment);
        this.treatmentCircles.push({ x, y, value: point.treatment });
        return `${x}, ${y}`;
      })
      .join(' ');
  
    this.controlCircles = [];
    this.controlPoints = this.productGapData
      .map((point, index) => {
        const x = (index + 1) * xSpacing;
        const y = this.mapGapToY(point.control);
        this.controlCircles.push({ x, y, value: point.control });
        return `${x}, ${y}`;
      })
      .join(' ');
  }

  
  private mapGapToY(value: number): number {
    const top = this.maxGapValue;
    let bottom = this.minGapValue;
  
    const minRange = top * 0.05;
    if (top - bottom < minRange) {
      bottom = top - minRange;
    }
  
    const range = top - bottom;
    const relative = (top - value) / range;
  
    return relative * this.heightGapGrafic;
  }

  tooltipX = 0;
  tooltipY = 0;
  tooltipValue = 0;
  tooltipColor = '';

  toggleDropdownGap() {
    this.dropdownProductGapOpen = !this.dropdownProductGapOpen;
  }

  setHoveredIndex(i: number) {
    this.hoveredIndex = i;
  }
  
  clearHoveredIndex() {
    this.hoveredIndex = null;
  }

  updateTooltipPosition(index: number): void {
    const treatment = this.treatmentCircles[index];
    const control = this.controlCircles[index];
  
    if (!treatment || !control) {
      this.tooltipPosition = { left: 0, top: 0 };
      return;
    }
  
    const offsetX = 2;
    const offsetY = 50;
  
    this.tooltipPosition = {
      left: treatment.x * offsetX,
      top: Math.min(treatment.y, control.y) - offsetY
    };
  }

}