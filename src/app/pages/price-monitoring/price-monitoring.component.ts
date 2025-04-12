import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatCardModule } from '@angular/material/card'
import { MatTableModule } from '@angular/material/table'
import { MatSortModule } from '@angular/material/sort'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { SelectionModel } from '@angular/cdk/collections'
import { MenuLateralComponent } from '../../components/sidebar-menu/sidebar-menu.component'
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HeaderComponent } from '../../components/header/header.component'
import { TranslateModule } from '@ngx-translate/core'
import { LoadingOverlayComponent } from '../../components/loading/loading.component'
import { MatDialogModule } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatExpansionModule } from '@angular/material/expansion';
import { Observable } from 'rxjs'
import { SliderComponent } from '../../components/slider/slider.component'
import { MultiselectComponent } from '../../components/multi-select/multi-select.component'
import { LoadingService } from '../../services/loading.service'
import { PriceMonitoringModel, PriceMonitoringValues } from '../../models/interfaces/price-monitoring.response'
import { PriceMonitoringService } from '../../services/price-monitoring.service'
import { DynamicNumberPipe } from '../../helpers/pipes/dynamic-number.pipe'
import { CapitalizePipe } from "../../helpers/pipes/capitalize.pipe"
import { PriceMonitoringFiltersType } from '../../models/interfaces/price-monitoring-filters'
import { DatePickerService } from '../../services/data-picker.service'
import { CacheService } from '../../services/cache.service'
import { FileExportService } from '../../services/file-export.service'
import { PriceMonitoringMapper } from '../../mappers/price-monitoring.mapper'
import { MatMenuModule } from '@angular/material/menu'
import { PriceMonitoringCsvHeaderMap } from '../../models/entities/price-monitoring'

const FILE_NAME = 'Price-monitoring';
const INITIAL_PRICE_MONITORING_FILTERS: PriceMonitoringFiltersType = {
  assessment_month: null,
  store_name: null,
  source_store_id: null,
  products: null,
  city: null,
  rec_type: null,
  recommended_value: null,
  applied_value: null,
  recommended_applied_value_diff: null,
  latest_pump_price_within_rec_val: null,
  pump_price_diff: null,
  page_size: 15,
  page: 1
}

type PriceValueKey =
  | 'minRecommendedValue'
  | 'maxRecommendedValue'
  | 'minLatestPumpPriceWithinRecVal'
  | 'maxLatestPumpPriceWithinRecVal'
  | 'minPumpPriceDiff'
  | 'maxPumpPriceDiff'
  | 'minRecommendedAppliedValueDiff'
  | 'maxRecommendedAppliedValueDiff'
  | 'minAppliedValue'
  | 'maxAppliedValue';


@Component({
  selector: 'app-price-monitoring',
  templateUrl: './price-monitoring.component.html',
  styleUrls: ['./price-monitoring.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    MenuLateralComponent,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    LoadingOverlayComponent,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatExpansionModule,
    SliderComponent,
    MultiselectComponent,
    DynamicNumberPipe,
    HeaderComponent,
    CapitalizePipe,
    MatMenuModule,
    MatButtonModule,
],
})
export class PriceMonitoringComponent implements OnInit {
  menuAberto = true

  displayedColumns: string[] = ['storeName', 'sourceStoreId', 'city', 'validityFrom', 'recType', 'productDisplayName', 'recommendedValue',
    'appliedValue', 'recommendedAppliedValueDiff', 'latestPumpPriceWithinRecVal', 'pumpPriceDiff']

  selection = new SelectionModel<PriceMonitoringModel>(true, [])

  paginatedPrecos: any[] = []
  priceMonitoring: PriceMonitoringModel[] = []
  priceMonitoringValues: PriceMonitoringValues[] = []
  itemsPerPage = 15
  itemsPerPageOptions = [5, 10, 15, 20, 30, 50, 100]
  openMenu: boolean = true
  showFilterModal = false
  sortColumn: string = ''
  sortDirection: 'asc' | 'desc' = 'asc'
  showMenu = false;

  //Filtros

  searchControl = new FormControl('');
  postControl = new FormControl('');
  filteredPostos!: Observable<string[]>;
  postosSelecionados: string[] = [];

  PriceMonitoringFilters: PriceMonitoringFiltersType = {
    assessment_month: null,
    store_name: null,
    source_store_id: null,
    products: null,
    city: null,
    rec_type: null,
    recommended_value: null,
    applied_value: null,
    recommended_applied_value_diff: null,
    latest_pump_price_within_rec_val: null,
    pump_price_diff: null,
    page_size: 15,
    page: 1
  }

  priceValues: Record<PriceValueKey, number> = {
    minRecommendedValue: 0,
    maxRecommendedValue: 15,
    minLatestPumpPriceWithinRecVal: 0,
    maxLatestPumpPriceWithinRecVal: 15,
    minPumpPriceDiff: 0,
    maxPumpPriceDiff: 15,
    minRecommendedAppliedValueDiff: -10,
    maxRecommendedAppliedValueDiff: 15,
    minAppliedValue: -10,
    maxAppliedValue: 15
  };

  tipos: string[] = ['gap', 'price']

  loading$: Observable<boolean>

  constructor(
    private priceMonitoringService: PriceMonitoringService,
    private loadingService: LoadingService,
    private datePickerService: DatePickerService,
    public cacheService: CacheService,
    private fileExportService: FileExportService

  ) {
    this.loading$ = this.loadingService.loading$
  }

  ngOnInit(): void {
    this.loadPrices()
    this.PriceMonitoringFilters.recommended_value = null

    this.datePickerService.selectedDate$.subscribe(date => {
      this.PriceMonitoringFilters.assessment_month = date
      this.getPriceMonitoring()
      this.getpriceMonitoringValues()
    })
  }

  getPriceMonitoring(): void {
    this.priceMonitoringService.getPriceMonitoring(this.PriceMonitoringFilters).subscribe((data: PriceMonitoringModel[]) => {
      this.priceMonitoring = data
    })
  }

  getPriceMonitoringCsv(): void{
    this.priceMonitoringService.getPriceMonitoringCsv(this.PriceMonitoringFilters);

  }

  getpriceMonitoringValues(): void {
    this.priceMonitoringService.getPriceMonitoringValues().subscribe((data: PriceMonitoringValues[]) => {
      this.priceMonitoringValues = data
      this.applyProductFilter();
    })
  }

  applyProductFilter(): void {
    const baseList = this.PriceMonitoringFilters.products?.length
      ? this.priceMonitoringValues.filter(item =>
          this.PriceMonitoringFilters.products!.includes(item.productDisplayName)
        )
      : this.priceMonitoringValues;

    if (!baseList.length) return;

    const keys: PriceValueKey[] = [
      'minRecommendedValue',
      'maxRecommendedValue',
      'minLatestPumpPriceWithinRecVal',
      'maxLatestPumpPriceWithinRecVal',
      'minPumpPriceDiff',
      'maxPumpPriceDiff',
      'minRecommendedAppliedValueDiff',
      'maxRecommendedAppliedValueDiff',
      'minAppliedValue',
      'maxAppliedValue'
    ];

    keys.forEach(key => {
      const values = baseList.map(p => p[key]).filter(v => typeof v === 'number') as number[];

      this.priceValues[key] = key.startsWith('min')
        ? Math.min(...values)
        : Math.max(...values);
    });
  }

  applyFilters(): void {
    this.openFilterModal(false)
    this.PriceMonitoringFilters.page = 1
    this.getPriceMonitoring()
  }

  loadPrices(): void {
    this.priceMonitoringService.getPrices(this.priceMonitoring, this.itemsPerPage, this.sortColumn, this.sortDirection)
      .subscribe((data) => {
        this.priceMonitoring = data
      })
  }

  toggleRow(price: PriceMonitoringModel): void {
    if (this.selection.isSelected(price))
      this.selection.deselect(price)
    else
      this.selection.select(price)
  }

  isRowSelected(price: PriceMonitoringModel): boolean {
    return this.selection.isSelected(price)
  }

  toggleAllRows(checked: boolean): void {
    if (checked) {
      this.selection.select(...this.priceMonitoring)
    } else {
      this.selection.clear()
    }
  }

  isAllSelected(): boolean {
    return this.selection.selected.length === this.priceMonitoring.length
  }

  isIndeterminate(): boolean {
    return this.selection.selected.length > 0 && !this.isAllSelected()
  }

  sortData(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc'
    } else {
      this.sortColumn = column
      this.sortDirection = 'asc'
    }

    this.loadPrices()
  }

  onPageChange(page: number): void {
    this.PriceMonitoringFilters.page = page
    this.getPriceMonitoring()
  }

  onItemsPerPageChange(): void {
    this.PriceMonitoringFilters.page_size = this.itemsPerPage
    this.getPriceMonitoring()
  }

  openFilterModal(opt: boolean): void {
    this.showFilterModal = opt
  }

  onRangeChange(val: { min: number; max: number }, name: keyof typeof this.PriceMonitoringFilters) {
   (this.PriceMonitoringFilters[name] as { min: number; max: number }) = val
  }

  selectOptionTipo(option: string) {
    this.PriceMonitoringFilters.rec_type = option
  }

  clearFilters(): void {
    this.PriceMonitoringFilters = structuredClone(INITIAL_PRICE_MONITORING_FILTERS);
    this.getpriceMonitoringValues();
  }

  toggleMenu(): void {
    this.showMenu = !this.showMenu;
  }
  
  download(){
    this.showMenu = false;
    const entityList = PriceMonitoringMapper.toEntities(this.priceMonitoring);
    this.fileExportService.downloadAsCsv(entityList, FILE_NAME, PriceMonitoringCsvHeaderMap);
  }

  downloadCurrentPage(): void {
    this.download();
  }

  downloadFilteredData(): void {
    this.showMenu = false;
    this.getPriceMonitoringCsv();
  }

  hasItems(field: keyof PriceMonitoringFiltersType): boolean {
    const value = this.PriceMonitoringFilters[field];
    return Array.isArray(value) && value.length > 0;
  }

  hasValue(field: keyof PriceMonitoringFiltersType): boolean {
    const value = this.PriceMonitoringFilters[field];
    return !!value && typeof value === 'string';
  }

  onProductsChange(): void {
    this.getpriceMonitoringValues();
  }

  get storeNameProxy(): string[] {
    return this.PriceMonitoringFilters.store_name ?? [];
  }

  set storeNameProxy(value: string[]) {
    this.PriceMonitoringFilters.store_name = value.length ? value : null;
  }

  get productsProxy(): string[] {
    return this.PriceMonitoringFilters.products ?? [];
  }

  set productsProxy(value: string[]) {
    this.PriceMonitoringFilters.products = value.length ? value : null;
  }

  get cityProxy(): string[] {
    return this.PriceMonitoringFilters.city ?? [];
  }

  set cityProxy(value: string[]) {
    this.PriceMonitoringFilters.city = value.length ? value : null;
  }

}
