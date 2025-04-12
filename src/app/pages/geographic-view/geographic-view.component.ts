import { Component } from '@angular/core';
import { MenuLateralComponent } from '../../components/sidebar-menu/sidebar-menu.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-geographic-view',
  standalone: true,
  imports: [CommonModule, MenuLateralComponent],
  templateUrl: './geographic-view.component.html',
  styleUrls: ['./geographic-view.component.css']
})
export class GeographicViewComponent {
  openMenu: boolean = true;
}
