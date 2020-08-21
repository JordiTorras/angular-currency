import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Moneda } from '../class/moneda';
import { MonedasResponse } from '../class/monedas-response';

@Injectable({
  providedIn: 'root',
})
export class MonedasService {
  public monedas: Moneda[] = [];
  public cargada: boolean = false;

  // constructor(private http: HttpClient) {
  //   // leemos el fichero json y cargamos la respuesta 'resp' en el array de monedas[]
  //   //console.log('se ejecuta MonedaService.constructor()');
  //   // realizamos la llamada .get y el .subscribe en la misma llamada para que carge al inicio de la
  //   // aplicaciñón
  //   /*
  //       https://www.youtube.com/watch?v=J2tN5zG0k18&feature=youtu.be

  //       http.get<MonedasResponse>(url)  ==> Para definir que vamos a obtener un typo <MonedasResponse>
  //   */

  //   http
  //     // http.get devuelve un Observable por lo que nos podemos suscribir
  //     .get<MonedasResponse>('../assets/data/configuracionMonedas.json')
  //     // http.pipe permite modificar los datos de salida
  //     .pipe(
  //       // map permite modificar la información que fluye atrabes del observable
  //       // modificamos para cada elemento del array de respuesta (resp.moneda) con el .map
  //       // para que devuelva una instancia de la clase Moneda llamando la funcion
  //       // estatica Moneda.f_monedaDesdeJson

  //       map((resp) => {
  //         return resp.monedas.map((datoJson) =>
  //           Moneda.f_MonedaDesdeJson(datoJson)
  //         );
  //       })
  //     )
  //     // el observable devuelve un Array de instancias de la clase Moneda por que hemos
  //     // modificado el observable con el .pipe(map)
  //     .subscribe((resp) => {
  //       this.monedas = resp;

  //       // con resp.monedas accedemos al elemento monedas de la interface MonedasRequest
  //       // console.log(resp.monedas);
  //       // console.log(resp.monedas[0].codigoIso);

  //       this.cargada = true;
  //       //console.log(this.monedas);
  //     });
  // }

  constructor(private http: HttpClient) {}

  f_obtenerListaMonedas() {
    return this.http
      .get<MonedasResponse>('../assets/data/configuracionMonedas.json')
      .pipe(
        // map permite modificar la información que fluye atrabes del observable
        // modificamos para cada elemento del array de respuesta (resp.moneda) con el .map
        // para que devuelva una instancia de la clase Moneda llamando la funcion
        // estatica Moneda.f_monedaDesdeJson

        map((resp) => {
          return resp.monedas.map((datoJson) =>
            Moneda.f_MonedaDesdeJson(datoJson)
          );
        })
      )
      .toPromise()
      .then((resp) => {
        this.monedas = resp;
        this.cargada = true;
        // console.log(this.monedas);
      });
  }
}
