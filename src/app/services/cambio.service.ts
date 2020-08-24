import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Rate, RateResponse } from 'src/app/class/cambio-response';
import { Tasas } from 'src/app/class/tasas';

export let gl_tasas: Tasas;

@Injectable({
  providedIn: 'root',
})
export class CambioService {
  public cambio: { [key: string]: Rate };
  public cargada: boolean = false;

  /*
      https://leiva.io/2020/03/29/angular-precargar-datos-antes-de-arrancar/

     Para evitar que los datos se carguen despues de iniciar la aplicación, deberemos registrar
     el servicio CambioService como un PROVIDER con la caracteristica APP_INITIALIZER que hace 
     que la aplicación no se inicie hasta que se recibe la respuesta.

     Antes de la modificación:
     1. INICIO constructor CambioService
     2. FIN constructor CambioService
     3. INICIO f_setFechaCambio
     4  FIN f_setFechaCambio
     5. INICIO f_setFechaCambio
     6. FIN f_setFechaCambio
     7. Angular is running in development mode.
     8. RESPUESTA API
     9. Console log con los datos recibidos

     Despues de la modificación
     1. INICIO constructor CambioService
     2. RESPUESTA API
     3. Console log con los datos recibidos
     4. INICIO f_setFechaCambio
     5  FIN f_setFechaCambio
     6. INICIO f_setFechaCambio
     7. FIN f_setFechaCambio
     8. Angular is running in development mode.
     
  )
  */

  constructor(private http: HttpClient) {}

  f_obtenerTasaDeCambio() {
    // console.log('INICIO constructor CambioService');
    /* return this.http
      .get<RateResponse>(
        'https://api.exchangerate.host/latest?base=ARS&symbols=USD,EUR,ARS,CLP,COP'
      )
      .subscribe((resp) => {
        console.log('RESPUESTA API');
        console.log(resp);

        this.cambio = resp.rates;
        console.log(this.cambio);
      }); */

    /* 
      Se tiene que usar una Promesa y no un Observable para que carge antes de iniciar la
      aplicación (funciona como una llamada sincrona, aunque no lo és, la app espera a 
      recibir la respuesta)
    */
    return this.http
      .get<RateResponse>(
        //'https://api.exchangerate.host/latest?base=ARS&symbols=USD,EUR,ARS,CLP,COP'
        'https://api.exchangerate.host/timeseries?start_date=2020-08-01&end_date=2020-08-21&symbols=USD,EUR,ARS,CLP,COP&base=ARS'
      )
      .toPromise()
      .then((resp) => {
        // console.log('RESPUESTA API');
        // console.log(resp);

        this.cambio = resp.rates;
        this.cargada = true;
        gl_tasas = new Tasas(this.cambio);
      });
  }
}
