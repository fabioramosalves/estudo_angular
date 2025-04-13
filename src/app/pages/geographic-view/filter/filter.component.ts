import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
  imports: [CommonModule, FormsModule] 
})
export class FilterComponent {
  mapView: 'heatmap' | 'stations' = 'heatmap'; // Defines current map view
  selectedIndicator = 'growth'; // Default selected indicator

  indicators = [
    { label: 'Gross Profit (R$)', value: 'profit' },
    { label: 'Growth (%)', value: 'growth' },
    { label: 'Volume (m3)', value: 'volume' }
  ];

  regions = ['North', 'Northeast', 'Midwest', 'Southeast', 'South'];
  selectedRegions: string[] = [];

  @Output() filtersApplied = new EventEmitter<any>(); // Emits filters when Apply is clicked

  // Adds or removes region from selection
  toggleRegion(region: string) {
    const index = this.selectedRegions.indexOf(region);
    if (index > -1) this.selectedRegions.splice(index, 1);
    else this.selectedRegions.push(region);
  }

  // Emits selected filters to the parent component
  applyFilters() {
    this.filtersApplied.emit({
      mapView: this.mapView,
      indicator: this.selectedIndicator,
      regions: this.selectedRegions
    });
  }

  // Resets all filters to their default state
  clearFilters() {
    this.selectedRegions = [];
    this.selectedIndicator = 'growth';
    this.mapView = 'heatmap';
  }
}
