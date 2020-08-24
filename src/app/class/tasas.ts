import { Rate } from 'src/app/class/index';

/*
    Creamos una classe, por que la función de esta clase es gesionar las tasas
    ahora no se implementará pero el objetivo es que el sistema carge las tasas a medida
    que las van solicitando

    y ofrezca las funciones necesarias para tratar las tasas
*/

export class Tasas {
  private tasas: { [key: string]: Rate };

  constructor(tasas: { [key: string]: Rate }) {
    this.tasas = tasas;
  }

  f_obtenerTasa(p_moneda: string): number {
    if (p_moneda === 'UF') {
      return 0.000377;
    }
    return this.tasas['2020-08-21'][p_moneda];
  }
}
