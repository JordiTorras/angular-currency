import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InputMonedaComponent } from './component/input-moneda/input-moneda.component';
import { PagosComponent } from './component/pagos/pagos.component';

@NgModule({
  declarations: [AppComponent, InputMonedaComponent, PagosComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
