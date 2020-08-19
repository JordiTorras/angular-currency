import { Component, OnInit } from '@angular/core';

import { Moneda } from '../../class/moneda';

@Component({
  selector: 'app-input-moneda',
  templateUrl: './input-moneda.component.html',
  styleUrls: ['./input-moneda.component.css'],
})
export class InputMonedaComponent implements OnInit {
  importe: Moneda = new Moneda(10500.5, 'EUR', new Date('20200817'));

  importeTXT: string;
  validar_moneda_regex: string = '^(([0-9]+)((.[0-9]{3})*)?)(,[0-9]{1,2})?$';
  patt = new RegExp(this.validar_moneda_regex, 'g');
  bImporteCorrecto: boolean = true;
  tMensajeError: String;

  constructor() {}

  ngOnInit(): void {}

  f_convertirANumero(): void {
    // Convierte un número el input a formato númerico
    console.log('TXT --> NUMBER');

    // let a = patt.test(this.importeTXT);
    // console.log('importe: ' + this.importeTXT + ' RegExp: ' + a);

    this.bImporteCorrecto = this.patt.test(this.importeTXT);

    if (this.bImporteCorrecto == false) {
      this.tMensajeError = 'formato del importe incorrecto';
    }
  }

  f_convertirATexto(): void {
    // Convierte un número en formato texto 9.999.999,99 en función de la moneda
    console.log('NUMBER --> TXT');

    // pattern="^(?\d+:.\d{3})*\,\d{2}$"
  }

  f_validarTecla(evento: Event): void {
    console.log('Validar Tecla' + evento);
  }
}
