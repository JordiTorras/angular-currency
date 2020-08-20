import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Moneda } from '../class/moneda';

@Injectable({
  providedIn: 'root',
})
export class MonedasService {
  public monedas: Moneda[] ;
  public cargada: boolean = false;

  constructor(private http: HttpClient) {
    // leemos el fichero json y cargamos la respuesta 'resp' en el array de monedas[]
    http.get('../assets/data/configuracionMonedas.json').subscribe((resp) => {
      this.f_cargarlistaMonedas(resp);
      this.cargada = true;
      console.log(this.monedas);
    });
  }

  private f_cargarlistaMonedas(resp: any) {
    //  con esta instrucción copia directamente el json a la classe, pero no usa el New ¿¿??
    //  funciona incluso siendo las propiedades de la clase privados
    // esta llamada es como si definierasmo this.monedas como monedas: any[] compila
    // pero en ejecución al ser javascript ignora el type y lo trata como un any
    this.monedas = resp;

    

/*     for (let i of resp) {
      console.log(i);
      let a: Moneda = new Moneda(
        i.codigoIso,
        i.codigoMoneda,
        i.nombre,
        i.numeroDecimales,
        i.simbolo
      );
      this.monedas.push(a);
    } */

    // this.monedas.forEach(function (value) {
    //   console.log(value);
    // });
  }
}
