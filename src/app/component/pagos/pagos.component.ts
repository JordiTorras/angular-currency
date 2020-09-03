import { Component, OnInit } from '@angular/core';
import { CambioService, MonedasService, MonedasJsonService } from 'src/app/services';
import { ImporteComponente } from '../input-moneda/ImporteComponente';
import { PagosService } from 'src/app/services/pagos.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

// Iconos
/**
 * Como instalar
 * https://www.npmjs.com/package/@fortawesome/angular-fontawesome
 *
 * Como usar
 * https://github.com/FortAwesome/angular-fontawesome/blob/HEAD/docs/usage/features.md
 * https://github.com/FortAwesome/angular-fontawesome/blob/HEAD/docs/usage/using-other-styles.md
 */
import {
    faStar,
    faSquare,
    faSpinner,
    faEnvelope,
    faCircle,
    faCheck,
    faExclamation,
    faExclamationCircle,
    faTimes,
    faPlusSquare,
} from '@fortawesome/free-solid-svg-icons';

// Add icons to the library for convenient access in other components
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'app-pagos',
    templateUrl: './pagos.component.html',
    styleUrls: ['./pagos.component.css'],
})
export class PagosComponent implements OnInit {
    @BlockUI() blockUI: NgBlockUI;

    form: FormGroup; // definimos el formulario

    listaIVA: { valor: number; descripcion: string }[] = [
        { valor: 0, descripcion: 'Exento de IVA' },
        { valor: 21, descripcion: 'General 21%' },
        { valor: 10.5, descripcion: 'Reducido 10,5%' },
    ];

    estiloDeducible: {};
    estiloCapital: {};
    estiloFranquicia: {};

    //background-color: rgba(86, 61, 124, 0.05)

    monedaLiquidacion: string = 'USD';
    monedaPago: string = 'EUR';
    monedaContable: string = 'ARS';
    pIVA = 0;

    private _iliquidacion: ImporteComponente;
    private _ibruto: ImporteComponente;
    private _ideducible: ImporteComponente;
    private _icapital: ImporteComponente;
    private _ibase: ImporteComponente;
    private _iiva: ImporteComponente;
    private _ineto: ImporteComponente;
    private _ifranquicia: ImporteComponente;
    private _itotal: ImporteComponente;

    mensajes: { tipo: string; mensaje: string }[] = [];

    constructor(
        public listaMonedas: MonedasService,
        public listaMonedasJson: MonedasJsonService,
        public listacambios: CambioService,
        public library: FaIconLibrary,
        private pagosService: PagosService
    ) {
        // Add multiple icons to the library
        library.addIcons(
            faStar,
            faSquare,
            faSpinner,
            faEnvelope,
            faCheck,
            faExclamation,
            faExclamationCircle,
            faTimes,
            faCircle,
            faPlusSquare
        );
    }

    ngOnInit(): void {
        //cargamos la lista de monedas
        /* Se inicializa mucho antes que se cargen los datos del json en este punto
      listaMonedas no tiene ningun dato, pero en el momento que se cargan los datos
      listaMonedas tiene datos.
      
      Si ponemos un breakpoint en el servicio, veremos que se carga la pantalla en blanco
      y cuando continuamos una vez llega la respuesta se completan los datos de la lista desplegable
    */
        //console.log(this.listaMonedas);

        /**
         * no podemos inicializar los importes hasta que no se ha inicilizado el componente para
         * poder usar el valor de las monedas
         */
        this._iliquidacion = new ImporteComponente(null, this.monedaLiquidacion, this.monedaPago);
        this._ibruto = new ImporteComponente(null, this.monedaPago);
        this._ideducible = new ImporteComponente(20, this.monedaPago);
        this._icapital = new ImporteComponente(null, this.monedaPago);
        this._ibase = new ImporteComponente(null, this.monedaPago);
        this._iiva = new ImporteComponente(null, this.monedaPago);
        this._ineto = new ImporteComponente(null, this.monedaPago);
        this._ifranquicia = new ImporteComponente(null, this.monedaPago);
        this._itotal = new ImporteComponente(null, this.monedaPago);

        /**
         * inicializamos los importes
         */
        //this.form.get('importeLiquidacion').setValue(this._iliquidacion);

        /**
         * Datos de la póliza
         */
        // this._ideducible.importe = 20;
        // this._icapital;
    }

    public get iLiquidacion(): ImporteComponente {
        return this._iliquidacion;
    }
    public set iLiquidacion(value: ImporteComponente) {
        this._iliquidacion = value;
    }

    public get iBruto(): ImporteComponente {
        return this._ibruto;
    }
    public set iBruto(value: ImporteComponente) {
        this._ibruto = value;
    }

    public get iDeducible(): ImporteComponente {
        return this._ideducible;
    }
    public set iDeducible(value: ImporteComponente) {
        this._ideducible = value;
    }

    public get iCapital(): ImporteComponente {
        return this._icapital;
    }
    public set iCapital(value: ImporteComponente) {
        this._icapital = value;
    }
    public get iBase(): ImporteComponente {
        return this._ibase;
    }
    public set iBase(value: ImporteComponente) {
        this._ibase = value;
    }

    public get iIva(): ImporteComponente {
        return this._iiva;
    }
    public set iIva(value: ImporteComponente) {
        this._iiva = value;
    }

    public get iNeto(): ImporteComponente {
        return this._ineto;
    }
    public set iNeto(value: ImporteComponente) {
        this._ineto = value;
    }

    public get iFranquicia(): ImporteComponente {
        return this._ifranquicia;
    }
    public set iFranquicia(value: ImporteComponente) {
        this._ifranquicia = value;
    }
    public get iTotal(): ImporteComponente {
        return this._itotal;
    }
    public set iTtotal(value: ImporteComponente) {
        this._itotal = value;
    }

    f_ILiquidacionModificado(e: any): void {
        //console.log('pagos.componente.ts.f_ILiquidacionModificado: ', e);

        this.iLiquidacion.importe = e; // estoy llamando al SETTER
        this._ibruto.importe = this.iLiquidacion.importeCambio;

        this.f_calcularTotales();
    }

    f_ICapitalModificado(e: any): void {
        //console.log('pagos.componente.ts.f_ILiquidacionModificado: ', e);

        this.iCapital.importe = e; // estoy llamando al SETTER

        this.f_calcularTotales();
    }

    f_IFranquiciaModificado(e: any): void {
        //console.log('pagos.componente.ts.f_ILiquidacionModificado: ', e);

        this.iFranquicia.importe = e; // estoy llamando al SETTER

        this.f_calcularTotales();
    }

    f_calcularTotales(): void {
        if (this._ibruto.importe != null && this._ibruto.importe != undefined) {
            // Calculo importe base
            // BASE = MIN((MAX(BRUTO - NVL(DEDUCIBLE, 0), 0), NVL(CAPITAL, ∞))

            /* this._ibase.importe = Math.min(
                this._icapital.importe ? this._icapital.importe : Infinity,
                Math.max(
                    this._ibruto.importe - this._ideducible.importe
                        ? this._ibruto.importe - this._ideducible.importe
                        : 0,
                    0
                )
            ); */

            const t1: number =
                this._ibruto.importe - (this._ideducible.importe ? this._ideducible.importe : 0);
            const t2: number = Math.max(t1, 0);
            const t3: number = this._icapital.importe ? this._icapital.importe : Infinity;

            this._ibase.importe = Math.min(t3, t2);

            // Calculo impuestos
            // IMPUESTOS = BASE * PORCENTAJE
            this._iiva.importe = +((this._ibase.importe * this.pIVA) / 100).toPrecision(
                this.iBase.moneda.numeroDecimales
            );

            // Calculo importe neto
            // NETO = BASE + SUM(IMPUESTOS) + SUM(-RETENCIONES)
            this._ineto.importe = this._ibase.importe + this._iiva.importe;

            // Calculo importe total
            // SI (NETO > FRANQUICIA) => TOTAL = NETO  : TOTAL = 0 (retenido por franquicia)

            const t4: number = this._ifranquicia.importe ? this._ifranquicia.importe : 0;

            this.iTotal.importe = this._ineto.importe >= t4 ? this._ineto.importe : 0;

            /*
                Gestion de los mensajes por pantalla
            */
            this.mensajes = []; // inicializamos vector de mensajes
            this.estiloDeducible = {};
            this.estiloCapital = {};
            this.estiloFranquicia = {};

            if (this._ibruto.importe < this._ideducible.importe) {
                this.estiloDeducible = {
                    'background-color': 'rgba(255, 255, 0, 0.15)',
                };
                this.mensajes.push({ tipo: 'aviso', mensaje: 'Pago 0 por deducible' });
            }

            if (this._icapital.importe) {
                if (t3 /* capital */ < t2 /* aplicado deducible */) {
                    this.estiloCapital = {
                        'background-color': 'rgba(255, 255, 0, 0.15)',
                    };
                }
            }

            if (this._ifranquicia.importe) {
                if (this._ineto.importe >= t4) {
                    this.mensajes.push({
                        tipo: 'aviso',
                        mensaje: 'Pago liberado supera franqucia',
                    });
                } else {
                    this.estiloFranquicia = {
                        'background-color': 'rgba(255, 255, 0, 0.15)',
                    };
                    this.mensajes.push({
                        tipo: 'aviso',
                        mensaje: 'Pago retenido por franquicia',
                    });
                }
            }
        }

        // TODO: Mostrar mensajes de franquicia y deducible aplicados

        // TODO: Numeros a letras

        // TODO: Franquicia y Capita Maximo
    }

    f_submit(event: Event): boolean {
        /* event.preventDefault();
        // TODO: imprimir datos del formulario
        //console.log(this.form.controls);

        let jsonObj = JSON.stringify(this.form.value);
        console.log(jsonObj);

        console.warn(this.form.value);
        */

        // TODO: implementar servicio de guardado

        console.log('pagos', 'f_submit', 'INICIO llamada servicio');
        this.blockUI.start('Validando pago ...'); //inside method
        this.pagosService.validarPago().subscribe((resp) => this.f_respuestaValidarPago(resp));
        console.log('pagos', 'f_submit', 'FINAL llamada servicio');

        return true;
    }

    f_respuestaValidarPago(resp: any) {
        this.blockUI.stop();
        console.log('pagos', 'f_respuestaValidarPago');
        console.log(resp);

        if (Object.keys(resp.warnings).length > 0 || Object.keys(resp.errors).length > 0) {
            console.log('hay errores');
        } else {
            console.log('no hay errores');
        }
    }
}
