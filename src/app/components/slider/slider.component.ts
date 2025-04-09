import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.css'
})
export class SliderComponent {
  @Input() valorMinimoPermitido: number = 0;
  @Input() valorMaximoPermitido: number = 100;
  @Input() formatoMonetario: boolean = false;
  @Input() step: number = 0.1;

  @Output() rangeChange = new EventEmitter<{ min: number; max: number }>();

  valorMinimoSelecionado!: number;
  valorMaximoSelecionado!: number;

  ngOnInit() {
    this.valorMinimoSelecionado = this.valorMinimoPermitido;
    this.valorMaximoSelecionado = this.valorMaximoPermitido;
  }

  calcularPosicao(valor: number): number {
    const range = this.valorMaximoPermitido - this.valorMinimoPermitido;
    return ((valor - this.valorMinimoPermitido) / range) * 100;
  }

  emitirRange() {
    this.rangeChange.emit({
      min: this.valorMinimoSelecionado,
      max: this.valorMaximoSelecionado
    });
  }
}
