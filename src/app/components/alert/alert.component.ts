import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-alert',
  standalone: true,
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
  imports: [CommonModule]
})
export class AlertComponent implements OnInit {
  message = '';
  type = 'info';
  isVisible = false;

  constructor(private alertService: AlertService) {}

  ngOnInit() {
    this.alertService.alertState.subscribe((state) => {
      this.message = state.message;
      this.type = state.type;
      this.isVisible = state.isVisible;
    });
  }
}
