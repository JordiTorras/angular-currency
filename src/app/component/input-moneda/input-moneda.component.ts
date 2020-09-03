import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    SimpleChange,
    forwardRef,
} from '@angular/core';
import { FormGroupDirective, ControlContainer, FormControl, Validators } from '@angular/forms';

import { MonedasJsonService } from 'src/app/services';
import { ImporteComponente } from 'src/app/component/input-moneda/ImporteComponente';
import { Moneda } from 'src/app/class/moneda';
import { Importe } from 'src/app/class/importe';
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
    //TODO: Como pasar un objeto mas complejo, la clase IMPORTE
    @Input() input_importe: number;
    @Input() input_moneda: string;
    @Input() input_monedaCambio: string;
    @Input() input_fechaCambio: string;

    @Input() input_selectorMoneda: boolean = false;
    @Input() disabled: boolean = false;
    @Input() estiloInput: object;

    @Output() EventoImporteModificado = new EventEmitter<number>();
    @Output() EventoImporteCambiado = new EventEmitter<number>();

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        // console.log('input-moneda', 'ngOnChanges');
        // console.log(changes['input_moneda'].currentValue);

        // Recorremos la clase SimpleChange para tratar todos los cambios
        for (const propName in changes) {
            const changedProp = changes[propName];
            //const to = JSON.stringify(changedProp.currentValue);  /* Convierte un javascript object to a json string

            //   console.log(propName);

            switch (propName) {
                case 'input_importe':
                    this._importe.importeMask = changedProp.currentValue;
                    this._importe.isTouched = true;
                    break;
                case 'input_moneda':
                    this.cmoneda = changedProp.currentValue; // usamos el setter
                    this.f_ActualizarOpcionesMascara(changedProp.currentValue);
                    break;
                case 'input_monedaCambio':
                    this.cmonedaCambio = changedProp.currentValue;
                    this.f_ActualizarOpcionesMascara(changedProp.currentValue);
                    break;
                case 'input_fechaCambio':
                    const d: Date = new Date(changedProp.currentValue);
                    this._importe.fechaCambio = new Date(changedProp.currentValue);
                    break;
            }
        }
    }

    public _importe: ImporteComponente = new ImporteComponente(null, 'ARS');

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
        //console.log('input-moneda.ngOnInit');
        this._importe = new ImporteComponente(
            this.input_importe,
            this.input_moneda,
            this.input_monedaCambio
        );
        this.f_ActualizarOpcionesMascara(this.input_moneda);
    }

    ngAfterViewInit(): void {
        // console.log('input-moneda.ngAferViewInit');
    }

    public onFocus() {
        // console.log('input-moneda.focus');
    }

    public onBlur() {
        // console.log('input-moneda.onBlur');
        this.EventoImporteCambiado.emit(this._importe.importe);
    }

    public f_ActualizarOpcionesMascara(p_moneda: string): void {
        // console.log('input-moneda', 'f_ActualizarOpcionesMascara', 'p_moneda: ', p_moneda);

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

    public set cmoneda(p_moneda: string) {
        // console.log('input-moneda', 'cmoneda', p_moneda);

        // Actualizamos la moneda del importe, esto fuerza al recalculo del importe
        this._importe.moneda = new Moneda(p_moneda);

        // Si el importe ha sido modificado actualizamos el importe del Input, sino
        // mostramos null
        if (this._importe.isTouched) {
            // console.log('input-moneda', 'cmoneda', 'isTOUCHED', this._importe.importe);
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

    // onChange se dispara cuando el valor cambia, es decir despues de salir del campo si el valor ha cambiado
    public onChange(value: any): void {
        // console.log('input-moneda', 'onChange', value, this._importe.importeMask);

        this.EventoImporteModificado.emit(this._importe.importe);
    }

    onInput() {
        this._importe.isTouched = true;
    }
}
