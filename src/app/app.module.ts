import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { IMaskModule } from 'angular-imask';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InputMonedaComponent } from './component/input-moneda/input-moneda.component';
import { PagosComponent } from './component/pagos/pagos.component';
import { CambioService, MonedasService } from './services';

export function f_cargarTasasDeCambio(servicio: CambioService) {
  return () => servicio.f_obtenerTasaDeCambio();
}

export function f_cargarListaMonedas(servicio: MonedasService) {
  return () => servicio.f_obtenerListaMonedas();
}

// export let AppInjector: Injector;

@NgModule({
  declarations: [AppComponent, InputMonedaComponent, PagosComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule, HttpClientModule, IMaskModule],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: f_cargarTasasDeCambio,
      deps: [CambioService],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: f_cargarListaMonedas,
      deps: [MonedasService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule{}
/* export class AppModule {
  constructor(private injector: Injector) {
    AppInjector = this.injector;
  }
}  */
// export class AppModule implements OnInit {
//   constructor(private servicio: CambioService) {

//   }

//   ngOnInit(): void {

//   }
// }




