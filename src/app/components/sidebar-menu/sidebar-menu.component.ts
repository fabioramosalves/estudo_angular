import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostBinding, Output, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { Router, RouterModule } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.css'],
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    CommonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatSidenav,
    TranslateModule
  ]
})

export class MenuLateralComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  @Output() menuToggled = new EventEmitter<boolean>();
  isOpened = true;
  
  constructor(private router: Router, private translate: TranslateService) { }

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  toggleMenu() {
    this.isOpened = !this.isOpened;
    this.sidenav.toggle();
    this.menuToggled.emit(this.isOpened);
  }

  ngAfterViewInit() {
    this.sidenav.closedStart.subscribe(() => {
      Promise.resolve().then(() => this.isOpened = false);
    });
    this.sidenav.openedStart.subscribe(() => {
      Promise.resolve().then(() => this.isOpened = true);
    });
  }
}
