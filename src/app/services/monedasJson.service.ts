import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MonedasResponse, MonedaResponse } from '../class/monedas-response';

/**
 * cargamos el resultado del servicio en un array del tipo MonedaResponse;
 */
export let gl_monedasJson: MonedaResponse[];

@Injectable({
  providedIn: 'root',
})
export class MonedasJsonService {
  public monedas: MonedaResponse[] = [];
  public cargada: boolean = false;

  constructor(private http: HttpClient) {}

  f_obtenerListaMonedasJson() {
    return this.http
      .get<MonedasResponse>('../assets/data/configuracionMonedas.json')
      .toPromise()
      .then((resp) => {
        this.monedas = resp.monedas;
        this.cargada = true;
        gl_monedasJson = this.monedas;
        //console.log(gl_monedasJson);
      });
  }

  public f_getDatosMoneda(p_moneda: string): MonedaResponse {
    for (let i = 0; i < this.monedas.length; i++) {
      if (p_moneda === this.monedas[i].codigoIso) {
        return this.monedas[i];
      }
    }
    return null;
  }
}
