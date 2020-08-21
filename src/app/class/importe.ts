import { HttpClient } from '@angular/common/http';

export class Importe {
  importe: number;
  moneda: string;
  fechaCambio: Date = new Date();
  tasaCambio: number;
  importeMonCia: number;
  monedaMonCia: string;

  constructor(p_importe: number, p_moneda: string, p_fecha: Date) {
    this.importe = p_importe;
    this.moneda = p_moneda;
    this.monedaMonCia =
      'ARS'; /* Peso Argentino --> moneda por defecto de la instalación */
    this.f_setFechaCambio(p_fecha);
    this.f_calcularMonCia;
  }

  f_setFechaCambio(p_fecha: Date): void {
    this.fechaCambio = p_fecha;
    this.tasaCambio = 1;
    console.log('INICIO f_setFechaCambio');

    console.log('FIN f_setFechaCambio');
  }

  f_calcularMonCia(): void {
    this.importeMonCia = this.importe / this.tasaCambio;
  }
}
