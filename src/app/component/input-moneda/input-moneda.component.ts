import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  SimpleChange,
} from '@angular/core';

import { MonedasJsonService } from 'src/app/services';
import { ImporteComponente } from 'src/app/component/input-moneda/ImporteComponente';
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
  input_importe: number;
  @Input()
  input_moneda: string;
  @Input()
  input_monedaCambio: string;

  @Input()
  input_selectorMoneda: boolean = false;
  //TODO: passar un objecte complexe
  //   @Input()
  //   input_obj_importe: any;

  @Output()
  EventoImporteModificado = new EventEmitter<number>();

  @Output()
  EventoImporteCambiado = new EventEmitter<number>();

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    // console.log(changes);
    // console.log(changes['input_moneda'].currentValue);

    // Recorremos la clase SimpleChange para tratar todos los cambios
    for (const propName in changes) {
      const changedProp = changes[propName];
      //const to = JSON.stringify(changedProp.currentValue);  /* Convierte un javascript object to a json string

      //   console.log(propName);

      switch (propName) {
        case 'input_importe':
          this._importe.importeMask = changedProp.currentValue;
          break;
        case 'input_moneda':
          this.cmoneda = changedProp.currentValue; // usamos el setter

          // TODO: cambiar la mascara en función de la moneda
          /* this.mask = {
            mask: this._importe.moneda.simbolo + ' num',
            blocks: {
              num: {
                // nested masks are available!
                mask: Number,
                thousandsSeparator: '.',
                scale: this._importe.moneda.numeroDecimales,
                normalizeZeros: false,
                padFractionalZeros: true,
              },
            },
          }; */
          break;
        case 'input_monedaCambio':
          this.cmonedaCambio = changedProp.currentValue;
          break;
      }
    }
  }

  public __importe: string; /* Deplecated  */
  public __moneda: string; /* Deplecated  */
  public _importe: ImporteComponente = new ImporteComponente(
    null,
    'ARS' /* moneda por defecto */
  );

  // tenemos que usar una variable string para el ngModel, no podemos usar
  // una variable numero como seria usar importe.importe y asi actualizar
  // directamente la instancia de la clase.

  public mask: any = {
    // https://imask.js.org/guide.html#masked-number
    mask: this._importe.moneda.simbolo + ' num',
    blocks: {
      num: {
        // nested masks are available!
        mask: Number,
        thousandsSeparator: '.',
        scale: this._importe.moneda.numeroDecimales,
        normalizeZeros: false,
        padFractionalZeros: true,
        signed: true,

        // min: 0,
        // max: 10000000000,
      },
    },
  };

  constructor(public listaMonedasJson: MonedasJsonService) {}

  ngOnInit(): void {
    //console.log('ngOnInit');
    //console.log(this.input_importe + ' ' + this.input_moneda);

    if (this.input_importe) {
      this._importe.importe = +this.input_importe;
    }
    if (this.input_moneda) {
      this._importe.moneda = new Moneda(this.input_moneda);
    }
    if (this.input_monedaCambio) {
      this._importe.monedaCambio = new Moneda(this.input_monedaCambio);
    }
    //FIXME: en el OnInit el objete input_obj_importe es un undefined
    //console.log(this.input_obj_importe);
  }

  ngAfterViewInit(): void {
    //console.log('ngAferViewInit');
    //console.log(this.input_importe + ' ' + this.input_moneda);
  }

  public onFocus() {
    //console.log('focus');
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
    // if (this._importe != null) {
    //   let mascara = IMask.createMask(this.mask);
    //   mascara.resolve(this._importe.importeMask);
    // }
    // console.log('masked.value: ' + mascara.value);
    // console.log('masked.unmaskedValue: ' + mascara.unmaskedValue);

    // Emitimos el evento de importe cambiado cuando salimos de la caja
    console.log('onBlur ', this._importe.importe);
    this.EventoImporteCambiado.emit(this._importe.importe);
  }

  public onChange(e: any): void {
    //this.importe.importe = +this.__importe;
    /**
     * no hace falta convertir de string a numero por que tenemos la pripiedad
     * [unmask] a true, es decir devolvemos el valor sin la mascara --> formato numerico
     *
     * para trasnformar un string a numero
     *  var x = "32";
     *  var y: number = +x;
     */
    /**
     * ya no hace falta controlar el evento onChange lo hemos sutituido por las funciones SETTER y GETTER
     * para ello hemos creado una nueva clase ImporteComponente que extiende de Importe, en esta clase
     * hemos creado un nuevo atributo ImporteMask de tipo TXT, se llama Mask pero no contiene la mascara, por que
     * tenemos el atributo [unmask] = true
     *
     * HTML                                             COMPONENTE                         CLASE
     * <input [(ngModel)]="importe.importeMask" /> -->  importe: importeComponente   -->   SET importeMask()
     *
     * de esta forma el ngModel, cuando se actualizar el campo del input llama al SETTER de importe.importeMask
     * directamente, y no tenemos que hacer el paso que haciamos anteriormente
     *
     * * HTML                                             COMPONENTE                         CLASE
     * <input [(ngModel)]="__importe" /> -->  onChange(function() this.importe.importe = +this.__importe;)
     * de esta forma todo el componente muestra la inforamción directamente desde la clase importe
     */

    //console.log('onChange ', this._importe.importe, ' e: ', e);
    this.EventoImporteModificado.emit(this._importe.importe);
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
    this._importe.importe = Number(this.__importe);

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

  public f_monedaModificada(p_cmoneda: string) {
    //this.importe.f_setmoneda(p_cmoneda);
    //this.importe.importe = 19;
    /* this.mask = {
      mask: this.importe.moneda.simbolo + ' num',
      blocks: {
        num: {
          // nested masks are available!
          mask: Number,
          thousandsSeparator: '.',
          scale: this.importe.moneda.numeroDecimales,
          normalizeZeros: false,
          padFractionalZeros: true,
        },
      },
    }; */
  }

  public set cmoneda(val: string) {
    this._importe.moneda = new Moneda(val);
    this._importe.importeMask = this._importe.importe
      ? this._importe.importe.toString()
      : null;
  }

  public get cmoneda(): string {
    return this._importe.moneda.codigoIso;
  }

  public set cmonedaCambio(val: string) {
    this._importe.monedaCambio = new Moneda(val);
    this._importe.importeMask = this._importe.importe
      ? this._importe.importe.toString()
      : null;
  }

  public get cmonedaCambio(): string {
    return this._importe.monedaCambio.codigoIso;
  }
}
