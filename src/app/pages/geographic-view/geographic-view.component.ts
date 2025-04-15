import { Component } from '@angular/core';
import { MenuLateralComponent } from '../../components/sidebar-menu/sidebar-menu.component';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../../components/header/header.component";
import { MapComponent } from './map/map.component';
import { FilterComponent } from './filter/filter.component';
import { Observable } from 'rxjs';
import { LoadingService } from '../../services/loading.service';
import { LoadingOverlayComponent } from '../../components/loading/loading.component';

@Component({
  selector: 'app-geographic-view',
  standalone: true,
  templateUrl: './geographic-view.component.html',
  styleUrls: ['./geographic-view.component.css'],
  imports: [
    CommonModule,
    FilterComponent,
    MapComponent,
    HeaderComponent,
    MenuLateralComponent,
    LoadingOverlayComponent
  ]
})
export class GeographicViewComponent {
  loading$: Observable<boolean>

  constructor(private loadingService: LoadingService,) {
    this.loading$ = this.loadingService.loading$
  }

 }