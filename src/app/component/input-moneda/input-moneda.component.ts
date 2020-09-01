import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    SimpleChange,
    forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { MonedasJsonService } from 'src/app/services';
import { ImporteComponente } from 'src/app/component/input-moneda/ImporteComponente';
import { Moneda } from 'src/app/class/moneda';
import { Importe } from 'src/app/class/importe';
import IMask from 'imask';

@Component({
    selector: 'app-input-moneda',
    templateUrl: './input-moneda.component.html',
    styleUrls: ['./input-moneda.component.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputMonedaComponent),
            multi: true,
        },
    ],
})
export class InputMonedaComponent implements OnInit, ControlValueAccessor {
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
    // @Input()
    // input_importe: number;
    @Input() input_moneda: string;
    @Input() input_monedaCambio: string;

    @Input() input_selectorMoneda: boolean = false;
    //TODO: passar un objecte complexe
    //   @Input()
    //   input_obj_importe: any;
    @Input()
    input_disabled: boolean = false;

    @Output()
    EventoImporteModificado = new EventEmitter<number>();

    @Output()
    EventoImporteCambiado = new EventEmitter<number>();

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        console.log('input-moneda.ngOnChanges');
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

    public _importe: ImporteComponente = new ImporteComponente(
        null,
        'ARS' /* FIXME: moneda por defecto */
    );

    // tenemos que usar una variable string para el ngModel, no podemos usar
    // una variable numero como seria usar importe.importe y asi actualizar
    // directamente la instancia de la clase.

    public mask = IMask.createMask({
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
                signed: false,

                min: 0,
                max: 1000000000000,
            },
        },
    });

    constructor(public listaMonedasJson: MonedasJsonService) {}

    ngOnInit(): void {
        console.log('input-moneda.ngOnInit');
    }

    ngAfterViewInit(): void {
        console.log('input-moneda.ngAferViewInit');
    }

    public onFocus() {
        console.log('input-moneda.focus');
    }

    public onBlur() {
        console.log('input-moneda.onBlur');
        this.EventoImporteCambiado.emit(this._importe.importe);
    }

    public onChangeMoneda(p_moneda: string): void {
        console.log('input-moneda.onChangeMoneda p_moneda: ', p_moneda);

        // el SETTER cmoneda se encarga de recalcular el importe, ahora hay que darle el formato
        // segun la nueva moneda (prefijo y decimales)

        const moneda = new Moneda(p_moneda);

        this.mask.updateOptions({
            mask: moneda.simbolo + ' num',
            blocks: {
                num: {
                    mask: Number,
                    thousandsSeparator: '.',
                    scale: moneda.numeroDecimales,
                    normalizeZeros: false,
                    padFractionalZeros: false,
                    signed: false,

                    min: 0,
                    max: 1000000000000,
                },
            },
        });
    }

    public onComplete() {}

    public set cmoneda(val: string) {
        this._importe.moneda = new Moneda(val);
        if (this._importe.importeMask != null) {
            // si el campo INPUT ha sido modificado por el usuario
            this._importe.importeMask =
                this._importe.importe != NaN ? this._importe.importe.toString() : null;
        }
    }

    public get cmoneda(): string {
        return this._importe.moneda.codigoIso;
    }

    public set cmonedaCambio(val: string) {
        this._importe.monedaCambio = new Moneda(val);

        if (this._importe.importeMask != null) {
            this._importe.importeMask =
                this._importe.importe != NaN ? this._importe.importe.toString() : null;
        }
    }

    public get cmonedaCambio(): string {
        return this._importe.monedaCambio.codigoIso;
    }

    /**
     *
     * esta funcion se llama cada vez que se hace un set en el campo
     */
    // writeValue(value: any): void {
    //     console.log('input-moneda', 'writeValue', value);
    //     if (value) {
    //         //console.log('writeValue.valor: ', p_importe);
    //         this._importe = new ImporteComponente(
    //             value.importe,
    //             value.moneda.codigoIso,
    //             value.monedaCambio.codigoIso
    //         );
    //     }
    // }

    writeValue(value: any): void {
        // console.log('writeValue');
        // if (value) {
        //     this.value = value || '';
        // } else {
        //     this.value = '';
        // }
    }

    registerOnChange(fn: any): void {
        console.log('registerOnChange');
        this.onChange = fn;
    }

    // onChange se dispara cuando el valor cambia, es decir despues de salir del campo si el valor ha cambiado
    public onChange(value: any): void {
        console.log('input-moneda', 'onChange', value, this._importe.importeMask);

        //this.EventoImporteModificado.emit(this._importe.importe);
    }

    registerOnTouched(fn: any): void {
        console.log('registerOnTouched');
        this.onTouch = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        console.log('setDisableStat');
        this.isDisabled = isDisabled;
    }

    onTouch = () => {
        console.log('onTouch');
    };

    isDisabled: boolean;

    // onInput se dispara cada vez que pulsamos una tecla, pero el valor del campo  this._importe.importeMask
    // contiene un valor menos, no esta actualizado a la ultima posición
    // ejemplo hemos escrito 1234 --> input-moneda onInput value:  "$ 1234"  importeMask:  "123"
    onInput(value: string) {
        console.log(
            'input-moneda',
            'onInput',
            'value: ',
            value,
            ' importeMask: ',
            this._importe.importeMask
        );
        // value contiene el valor formateado a texto, con el separador de miles 82.399,34

        this.onTouch();
        this.onChange(value);
    }
}
