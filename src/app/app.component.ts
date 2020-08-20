import { Component } from '@angular/core';
import { MonedasService } from './services/monedas.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'angular-currency';

  // Importamos en el constructor de la aplicación la lista de monedas, hacemos la variable
  // _listaMonedas public para que este disponible para todos los modulos de forma directa.
  constructor(public _listaMonedas: MonedasService) {}
}
