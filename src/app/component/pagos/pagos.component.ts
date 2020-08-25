import { Component, OnInit } from '@angular/core';
import {
  CambioService,
  MonedasService,
  MonedasJsonService,
} from 'src/app/services';
import { Moneda } from 'src/app/class';
import { Importe } from 'src/app/class/importe';

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.css'],
})
export class PagosComponent implements OnInit {
  monedaLiquidacion: Moneda = new Moneda('EUR');
  monedaPago: Moneda = new Moneda('EUR');
  monedaContable: Moneda = new Moneda('ARS');

  importeLiquidacion: Importe = new Importe(25, 'EUR');

  iTotalLiquidacion: string;

  constructor(
    public listaMonedas: MonedasService,
    public listacambios: CambioService,
    public listaMonedasJson: MonedasJsonService
  ) {}

  ngOnInit(): void {
    //cargamos la lista de monedas
    /* Se inicializa mucho antes que se cargen los datos del json en este punto
      listaMonedas no tiene ningun dato, pero en el momento que se cargan los datos
      listaMonedas tiene datos.
      
      Si ponemos un breakpoint en el servicio, veremos que se carga la pantalla en blanco
      y cuando continuamos una vez llega la respuesta se completan los datos de la lista desplegable
    */
    //console.log(this.listaMonedas);
  }
}
