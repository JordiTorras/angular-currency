import { Component, OnInit } from '@angular/core';

import { Importe } from '../../class/importe';

@Component({
  selector: 'app-input-moneda',
  templateUrl: './input-moneda.component.html',
  styleUrls: ['./input-moneda.component.css'],
})
export class InputMonedaComponent implements OnInit {
  /*
    Patron para validar el formato númerico
    ^(([0-9]+)((.[0-9]{3})*)?)(,[0-9]{1,2})?$
    ^ ... $ --> validar de inicio a fin

    (([0-9]+)((.[0-9]{3})*)?)  --> Validar la parte entera
    (,[0-9]{1,n})?  --> Validar la parte decimal
  */
  validar_moneda_regex: string = '^(([0-9]+)((.[0-9]{3})*)?)(,[0-9]{1,2})?$';
  patt = new RegExp(this.validar_moneda_regex, 'g');

  importe: Importe = new Importe(10500.5, 'EUR', new Date('20200817'));
  importeTXT: string;

  b_importeCorrecto: boolean = true;

  constructor() {}

  ngOnInit(): void {}

  f_convertirANumero(): void {
    // Convierte un número el input a formato númerico
    // console.log('TXT --> NUMBER');

    // let a = patt.test(this.importeTXT);
    // console.log('importe: ' + this.importeTXT + ' RegExp: ' + a);

    this.b_importeCorrecto = this.patt.test(this.importeTXT);
    this.importe.importe = Number(this.importeTXT);

    this.importe.f_calcularMonCia();

    // if (this.bImporteCorrecto == false) {
    //   this.tMensajeError = 'formato del importe incorrecto';
    // }
  }

  f_convertirATexto(): void {
    // Convierte un número en formato texto 9.999.999,99 en función de la moneda
    // console.log('NUMBER --> TXT');
    // pattern="^(?\d+:.\d{3})*\,\d{2}$"
  }

  f_validarTecla(evento: Event): void {
    // console.log('Validar Tecla' + evento);
  }
}
