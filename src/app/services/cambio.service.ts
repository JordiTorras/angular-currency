import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { Rate, RateResponse } from 'src/app/class/cambio-response';
import { Tasas } from 'src/app/class/tasas';
import { delay } from 'rxjs/operators';

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
        //'https://api.exchangerate.host/timeseries?start_date=2020-08-01&end_date=2020-08-21&symbols=USD,EUR,ARS,CLP,COP&base=ARS'

        const fechaFinal: string = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
        let d: Date = new Date();
        const fechaInicial: string = formatDate(d.setDate(d.getDate() - 30), 'yyyy-MM-dd', 'en-US');

        const url: string =
            'https://api.exchangerate.host/timeseries?' +
            'start_date=' +
            fechaInicial +
            '&end_date=' +
            fechaFinal +
            '&symbols=USD,EUR,ARS,CLP,COP' +
            '&base=ARS';

        // console.log(url);

        /* 
      Se tiene que usar una Promesa y no un Observable para que carge antes de iniciar la
      aplicación (funciona como una llamada sincrona, aunque no lo és, la app espera a 
      recibir la respuesta)
    */
        return (
            this.http

                .get<RateResponse>(url)
                //'https://api.exchangerate.host/latest?base=ARS&symbols=USD,EUR,ARS,CLP,COP'
                //'https://api.exchangerate.host/timeseries?start_date=2020-08-01&end_date=2020-08-21&symbols=USD,EUR,ARS,CLP,COP&base=ARS'
                .toPromise()
                .then((resp) => {
                    // console.log('RESPUESTA API');
                    // console.log(resp);

                    this.cambio = resp.rates;
                    this.cargada = true;
                    gl_tasas = new Tasas(this.cambio);
                })
        );
    }

    f_obtenerTasaDeCambioService(p_fecha?: string) {
        //'https://api.exchangerate.host/timeseries?start_date=2020-08-01&end_date=2020-08-21&symbols=USD,EUR,ARS,CLP,COP&base=ARS'

        if (p_fecha) {
            null;
        } else {
            p_fecha = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
        }
        const url: string =
            'https://api.exchangerate.host/timeseries?' +
            'start_date=' +
            p_fecha +
            '&end_date=' +
            p_fecha +
            '&symbols=USD,EUR,ARS,CLP,COP' +
            '&base=ARS';

        // console.log(url);
        // le pongo un delay explicitamente para dar un margen de respuesta y ver como se comporta la aplicación
        return this.http.get<RateResponse>(url).pipe(delay(500));
    }

    f_respuestaTasaDeCambioService(resp: RateResponse) {
        this.cambio = resp.rates;
        this.cargada = true;
        gl_tasas = new Tasas(this.cambio);
    }
}
