import { Component, OnInit } from '@angular/core';
import { MonedasService, CambioService } from './services/index';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'angular-currency';

  // Importamos en el constructor de la aplicación la lista de monedas, hacemos la variable
  // _listaMonedas public para que este disponible para todos los modulos de forma directa.
  constructor(
    public _listaMonedas: MonedasService,
    public _listaCambios: CambioService
  ) {}

  ngOnInit() {}
}
