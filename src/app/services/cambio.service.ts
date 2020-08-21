import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CambioService {
  
  constructor(private http: HttpClient) {
    console.log('INICIO constructor CambioService');
    http
      .get(
        'https://api.exchangerate.host/latest?base=ARS&symbols=USD,EUR,ARS,CLP,COP'
      )
      .subscribe((resp) => {
        console.log('RESPUESTA API');
        console.log(resp);
      });
    console.log('FIN constructor CambioService');
  }
}
