import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MultiselectComponent } from '../../../components/multi-select/multi-select.component';

import { CacheService } from '../../../services/cache.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../services/language.service';
import { RegionsFiltersType } from '../../../models/interfaces/regions-filters';

@Component({
  standalone: true,
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
  imports: [
    CommonModule,
    FormsModule, 
    MatExpansionModule,
    MultiselectComponent,
    TranslateModule,
  ] 
})
export class FilterComponent {
  selectedLanguage: string = 'pt';
  mapView: 'heatmap' | 'stations' = 'heatmap'; 
  selectedIndicator: string = 'growth';
  selectedRegions: string[] = [];
  indicators: any[] = [];
  regions: any[] = []

  regionsFiltersType: RegionsFiltersType = {
    city: null,
    state: null,
    region: null
  }

  @Output() filtersApplied = new EventEmitter<any>();

  constructor(
    public cacheService: CacheService,
    private translate: TranslateService,
    private languageService: LanguageService,
  ){
    this.selectedLanguage = localStorage.getItem('appLanguage') || 'pt';

    this.languageService.getLang$().subscribe(lang => {
      this.selectedLanguage = lang;
      this.initIndicatorTranslate()
      this.initRegionsTranslate()
    });
  }

  ngOnInit() {
    this.initIndicatorTranslate()
    this.initRegionsTranslate()
  }

  toggleRegion(region: string) {
    const index = this.selectedRegions.indexOf(region);
    if (index > -1) this.selectedRegions.splice(index, 1);
    else this.selectedRegions.push(region);
  }

  applyFilters() {
    this.filtersApplied.emit({
      mapView: this.mapView,
      indicator: this.selectedIndicator,
      regions: this.selectedRegions
    });
  }

  clearFilters() {
    this.selectedRegions = [];
    this.selectedIndicator = 'growth';
    this.mapView = 'heatmap';
  }

  hasItems(field: keyof RegionsFiltersType): boolean {
    const value = this.regionsFiltersType[field];
    return Array.isArray(value) && value.length > 0;
  }

  private initIndicatorTranslate() {
    this.translate.get([
      "GEOGRAPHIC_VIEW.FILTERS.GROSS_PROFIT_RS", 
      "GEOGRAPHIC_VIEW.FILTERS.GROSS_PROFIT_PERCENT", 
      "GEOGRAPHIC_VIEW.FILTERS.VOLUME"
    ]).subscribe(translations => {
      this.indicators = [
        { label: translations["GEOGRAPHIC_VIEW.FILTERS.GROSS_PROFIT_RS"], value: 'profit' },
        { label: translations["GEOGRAPHIC_VIEW.FILTERS.GROSS_PROFIT_PERCENT"], value: 'growth' },
        { label: translations["GEOGRAPHIC_VIEW.FILTERS.VOLUME"], value: 'volume' }
      ];
    });
  }


  private initRegionsTranslate() {
    this.translate.get([
      "GEOGRAPHIC_VIEW.FILTERS.REGIONS.NORTH", 
      "GEOGRAPHIC_VIEW.FILTERS.REGIONS.NORTHEAST", 
      "GEOGRAPHIC_VIEW.FILTERS.REGIONS.MIDWEST",
      "GEOGRAPHIC_VIEW.FILTERS.REGIONS.SOUTHEAST",
      "GEOGRAPHIC_VIEW.FILTERS.REGIONS.SOUTH",
    ]).subscribe(translations => {
      this.regions = [
        { label: translations["GEOGRAPHIC_VIEW.FILTERS.REGIONS.NORTH"], value: 'north' },
        { label: translations["GEOGRAPHIC_VIEW.FILTERS.REGIONS.NORTHEAST"], value: 'northeast' },
        { label: translations["GEOGRAPHIC_VIEW.FILTERS.REGIONS.MIDWEST"], value: 'midwest' },
        { label: translations["GEOGRAPHIC_VIEW.FILTERS.REGIONS.SOUTHEAST"], value: 'southeast' },
        { label: translations["GEOGRAPHIC_VIEW.FILTERS.REGIONS.SOUTH"], value: 'south' }
      ];
    });
  }

  get cityProxy(): string[] {
    return this.regionsFiltersType.city ?? [];
  }

  set cityProxy(value: string[]) {
    this.regionsFiltersType.city = value.length ? value : null;
  }

  get stateProxy(): string[] {
    return this.regionsFiltersType.state ?? [];
  }

  set stateProxy(value: string[]) {
    this.regionsFiltersType.state = value.length ? value : null;
  }

}
