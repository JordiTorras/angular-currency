import { Component, OnInit } from '@angular/core';
import { MonedasService, CambioService } from './services/index';
import { environment } from './../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'angular-currency';
  ambiente = environment.name;

  // Importamos en el constructor de la aplicación la lista de monedas, hacemos la variable
  // _listaMonedas public para que este disponible para todos los modulos de forma directa.
  constructor(
    public _listaMonedas: MonedasService,
    public _tasasCambio: CambioService
  ) {}

  ngOnInit() {
    // console.log(this._tasasCambio.cambio.EUR);
  }
}
