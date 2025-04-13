import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { GeographicViewComponent } from './geographic-view.component';
import { FilterComponent } from './filter/filter.component';
import { MapComponent } from './map/map.component';
import { IndicatorsComponent } from './indicators/indicators.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    GeographicViewComponent,
    FilterComponent,
    MapComponent,
    IndicatorsComponent
  ],
  exports: [
    GeographicViewComponent
  ]
})
export class GeographicViewModule { }
