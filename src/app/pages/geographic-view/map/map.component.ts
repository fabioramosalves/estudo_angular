import { Component } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent {
  // Dictionary of indicators by state code (0–100)
  indicadoresPorEstado: { [codigo: string]: number } = {
    '12': 10, // Acre
    '27': 80  // Alagoas
  };

  /**
   * Returns a color from a gradient between light blue and dark blue
   * based on the state's indicator value (0–100).
   */
  getColorForState(codigo: string): string {
    const valor = this.indicadoresPorEstado[codigo] ?? 0;
    const azulClaro = [232, 236, 255]; // Light blue (#e8ecff)
    const azulEscuro = [69, 69, 255];  // Dark blue (#4545ff)

    const r = Math.round(azulClaro[0] + (azulEscuro[0] - azulClaro[0]) * (valor / 100));
    const g = Math.round(azulClaro[1] + (azulEscuro[1] - azulClaro[1]) * (valor / 100));
    const b = Math.round(azulClaro[2] + (azulEscuro[2] - azulClaro[2]) * (valor / 100));

    return `rgb(${r}, ${g}, ${b})`;
  }
}
