import { Component, OnInit } from '@angular/core';
import { MonedasService } from 'src/app/services/monedas.service';
import { CambioService } from 'src/app/services';

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.css'],
})
export class PagosComponent implements OnInit {
  monedaSeleccionada: String = 'EUR';

  constructor(
    public listaMonedas: MonedasService,
    public listacambios: CambioService
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
