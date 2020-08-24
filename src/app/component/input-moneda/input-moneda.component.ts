import {
  Component,
  OnInit,
  Input,
  Output,
  OnChanges,
  SimpleChange,
} from '@angular/core';

import { Importe } from 'src/app/class/importe';
import { Moneda } from 'src/app/class/moneda';
// Usamos directamente la libreria javascript, no se como importarla de angular-imask
import IMask from 'imask';

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
  b_importeCorrecto: boolean = true;

  //TODO: L'hi passar un objecte moneda?, si pero aleshores el SimpleChange no funciona
  // consultar https://www.it-swarm.dev/es/angular/como-detectar-cuando-un-valor-de-input-cambia-en-angular/827413320/
  @Input()
  input_moneda: string;

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    console.log(changes);
    console.log(changes['input_moneda'].currentValue);

    // Recorremos la clase SimpleChange para tratar todos los cambios
    for (const propName in changes) {
      const changedProp = changes[propName];
      //const to = JSON.stringify(changedProp.currentValue);  /* Convierte un javascript object to a json string

      switch (propName) {
        case 'input_moneda':
          this.importe.moneda = new Moneda(changedProp.currentValue);
          if (this.__importe != null) {
            this.__importe = this.importe.importe.toString(); // actualizamos el importe
          }
          break;
      }
    }
  }

  public __importe: string;
  public importe: Importe = new Importe(0, 'EUR');

  // tenemos que usar una variable string para el ngModel, no podemos usar
  // una variable numero como seria usar importe.importe y asi actualizar
  // directamente la instancia de la clase.

  public mask: any = {
    // https://imask.js.org/guide.html#masked-number
    mask: this.importe.moneda.simbolo + ' num',
    blocks: {
      num: {
        // nested masks are available!
        mask: Number,
        thousandsSeparator: '.',
        scale: this.importe.moneda.numeroDecimales,
        normalizeZeros: false,
        //padFractionalZeros: true,

        min: 0,
        max: 10000000000,
      },
    },
  };

  ngOnInit(): void {}

  public onFocus() {
    console.log('focus');
  }

  public onBlur() {
    /* podemos usar la libreria imask para formatear sin necesidad de la UI 
    EJEMPLO:
        var masked = IMask.createMask({
          mask: '+7 (000) 000-00-00',
          // ...and other options
        });
        var maskedValue = masked.resolve('71234567890');

        // mask keeps state after resolving
        console.log(masked.value); // same as maskedValue
        // get unmasked value
        console.log(masked.unmaskedValue);
    */
    let mascara = IMask.createMask(this.mask);
    mascara.resolve(this.importe.importe.toString());
    // console.log('masked.value: ' + mascara.value);
    // console.log('masked.unmaskedValue: ' + mascara.unmaskedValue);
  }

  public onChange(e): void {
    this.importe.importe = +this.__importe;
    /**
     * no hace falta convertir de string a numero por que tenemos la pripiedad
     * [unmask] a true, es decir devolvemos el valor sin la mascara --> formato numerico
     *
     * para trasnformar un string a numero
     *  var x = "32";
     *  var y: number = +x;
     */
  }

  /** 
   * Funciones es deshuso pero las dejo por los ejemplos de 
   * validacion con patrones RegEx    
  } */

  f_convertirANumero(): void {
    // Convierte un número el input a formato númerico
    // console.log('TXT --> NUMBER');

    // let a = patt.test(this.importeTXT);
    // console.log('importe: ' + this.importeTXT + ' RegExp: ' + a);

    this.b_importeCorrecto = this.patt.test(this.__importe);
    this.importe.importe = Number(this.__importe);

    //this.importe.f_calcularCambio();

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

  public onComplete() {}
}
