import { Component, OnInit, LOCALE_ID, Inject } from '@angular/core';
import { CambioService, MonedasService, MonedasJsonService } from 'src/app/services';
import { ImporteComponente } from '../input-moneda/ImporteComponente';
import { PagosService } from 'src/app/services/pagos.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { formatDate } from '@angular/common';
import { gl_tasas } from 'src/app/services/cambio.service';

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
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import { RateResponse } from 'src/app/class/cambio-response';
import { Tasas, Moneda } from 'src/app/class';

@Component({
    selector: 'app-pagos',
    templateUrl: './pagos.component.html',
    styleUrls: ['./pagos.component.css'],
})
export class PagosComponent implements OnInit {
    @BlockUI() blockUI: NgBlockUI;

    listaIVA: { valor: number; descripcion: string }[] = [
        { valor: 0, descripcion: 'Exento de IVA' },
        { valor: 21, descripcion: 'General 21%' },
        { valor: 10.5, descripcion: 'Reducido 10,5%' },
    ];

    estiloDeducible: {};
    estiloCapital: {};
    estiloFranquicia: {};

    today: Date = new Date();
    fechaCambioPublica: string;

    private form: {
        fechaCambio: string;
        monedaLiquidacion: string;
        monedaPago: string;
        monedaContable: string;
        pIVA: number;
        iliquidacion: ImporteComponente;
        ibruto: ImporteComponente;
        ideducible: ImporteComponente;
        icapital: ImporteComponente;
        ibase: ImporteComponente;
        iiva: ImporteComponente;
        ineto: ImporteComponente;
        ifranquicia: ImporteComponente;
        itotal: ImporteComponente;
    } = {
        fechaCambio: null,
        monedaLiquidacion: 'USD',
        monedaPago: 'EUR',
        monedaContable: environment.monedaInstalacion,
        pIVA: 0,
        iliquidacion: null,
        ibruto: null,
        ideducible: null,
        icapital: null,
        ibase: null,
        iiva: null,
        ineto: null,
        ifranquicia: null,
        itotal: null,
    };

    mensajes: { tipo: string; mensaje: string }[] = [];

    constructor(
        public listaMonedas: MonedasService,
        public listaMonedasJson: MonedasJsonService,
        public listaCambios: CambioService,
        public library: FaIconLibrary,
        private pagosService: PagosService,
        @Inject(LOCALE_ID) private locale: string
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

        this.form.fechaCambio = formatDate(Date.now(), 'yyyy-MM-dd', this.locale);
        this.fechaCambioPublica = this.form.fechaCambio;

        this.form.iliquidacion = new ImporteComponente(
            null,
            this.form.monedaLiquidacion,
            this.form.monedaPago
        );
        this.form.ibruto = new ImporteComponente(null, this.form.monedaPago);
        this.form.ideducible = new ImporteComponente(20, this.form.monedaPago);
        this.form.icapital = new ImporteComponente(null, this.form.monedaPago);
        this.form.ibase = new ImporteComponente(null, this.form.monedaPago);
        this.form.iiva = new ImporteComponente(null, this.form.monedaPago);
        this.form.ineto = new ImporteComponente(null, this.form.monedaPago);
        this.form.ifranquicia = new ImporteComponente(null, this.form.monedaPago);
        this.form.itotal = new ImporteComponente(null, this.form.monedaPago);

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

    public get fechaCambio(): string {
        return this.form.fechaCambio;
    }

    public set fechaCambio(value: string) {
        this.form.fechaCambio = value;
    }

    public get monedaLiquidacion(): string {
        return this.form.monedaLiquidacion;
    }
    public set monedaLiquidacion(value: string) {
        this.form.monedaLiquidacion = value;
    }

    public get monedaPago(): string {
        return this.form.monedaPago;
    }
    public set monedaPago(value: string) {
        this.form.monedaPago = value;
    }

    public get monedaContable(): string {
        return this.form.monedaContable;
    }
    public set monedaContable(value: string) {
        this.form.monedaContable = value;
    }

    public get pIVA(): number {
        return this.form.pIVA;
    }
    public set pIVA(value: number) {
        this.form.pIVA = value;
    }

    public get iLiquidacion(): ImporteComponente {
        return this.form.iliquidacion;
    }
    public set iLiquidacion(value: ImporteComponente) {
        this.form.iliquidacion = value;
    }

    public get iBruto(): ImporteComponente {
        return this.form.ibruto;
    }
    public set iBruto(value: ImporteComponente) {
        this.form.ibruto = value;
    }

    public get iDeducible(): ImporteComponente {
        return this.form.ideducible;
    }
    public set iDeducible(value: ImporteComponente) {
        this.form.ideducible = value;
    }

    public get iCapital(): ImporteComponente {
        return this.form.icapital;
    }
    public set iCapital(value: ImporteComponente) {
        this.form.icapital = value;
    }
    public get iBase(): ImporteComponente {
        return this.form.ibase;
    }
    public set iBase(value: ImporteComponente) {
        this.form.ibase = value;
    }

    public get iIva(): ImporteComponente {
        return this.form.iiva;
    }
    public set iIva(value: ImporteComponente) {
        this.form.iiva = value;
    }

    public get iNeto(): ImporteComponente {
        return this.form.ineto;
    }
    public set iNeto(value: ImporteComponente) {
        this.form.ineto = value;
    }

    public get iFranquicia(): ImporteComponente {
        return this.form.ifranquicia;
    }
    public set iFranquicia(value: ImporteComponente) {
        this.form.ifranquicia = value;
    }
    public get iTotal(): ImporteComponente {
        return this.form.itotal;
    }
    public set iTtotal(value: ImporteComponente) {
        this.form.itotal = value;
    }

    f_ILiquidacionModificado(e: number): void {
        //console.log('pagos.componente.ts.f_ILiquidacionModificado: ', e);

        this.iLiquidacion.importe = e; // estoy llamando al SETTER
        // this.form.ibruto.importe = this.iLiquidacion.importeCambio;

        this.f_calcularTotales();
    }

    f_MLiquidacionModificada(e: string): void {
        // console.log('pagos.componente.ts.f_MLiquidacionModificad: ', e);

        this.iLiquidacion.moneda = new Moneda(e);
        this.form.monedaLiquidacion = e;

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
        //if (this.form.ibruto.importeCambio != null && this.form.ibruto.importeCambio != undefined) {
        if (this.form.iliquidacion.importeCambio) {
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

            this.iBruto.importe = this.form.iliquidacion.importeCambio;

            const t1: number =
                this.form.ibruto.importe -
                (this.form.ideducible.importe ? this.form.ideducible.importe : 0);
            const t2: number = Math.max(t1, 0);
            const t3: number = this.form.icapital.importe ? this.form.icapital.importe : Infinity;

            this.form.ibase.importe = Math.min(t3, t2);

            // Calculo impuestos
            // IMPUESTOS = BASE * PORCENTAJE
            this.form.iiva.importe = +(
                (this.form.ibase.importe * this.form.pIVA) /
                100
            ).toPrecision(this.iBase.moneda.numeroDecimales);

            // Calculo importe neto
            // NETO = BASE + SUM(IMPUESTOS) + SUM(-RETENCIONES)
            this.form.ineto.importe = this.form.ibase.importe + this.form.iiva.importe;

            // Calculo importe total
            // SI (NETO > FRANQUICIA) => TOTAL = NETO  : TOTAL = 0 (retenido por franquicia)

            const t4: number = this.form.ifranquicia.importe ? this.form.ifranquicia.importe : 0;

            this.iTotal.importe = this.form.ineto.importe >= t4 ? this.form.ineto.importe : 0;

            /*
                Gestion de los mensajes por pantalla
            */
            this.mensajes = []; // inicializamos vector de mensajes
            this.estiloDeducible = {};
            this.estiloCapital = {};
            this.estiloFranquicia = {};

            if (this.form.ibruto.importe < this.form.ideducible.importe) {
                this.estiloDeducible = {
                    'background-color': 'rgba(255, 255, 0, 0.15)',
                };
                this.mensajes.push({ tipo: 'informativo', mensaje: 'Pago 0 por deducible' });
            }

            if (this.form.icapital.importe) {
                if (t3 /* capital */ < t2 /* aplicado deducible */) {
                    this.estiloCapital = {
                        'background-color': 'rgba(255, 255, 0, 0.15)',
                    };
                    this.mensajes.push({
                        tipo: 'informativo',
                        mensaje: 'Pago ajustado al capital pendiente',
                    });
                }
            }

            if (this.form.ifranquicia.importe) {
                if (this.form.ineto.importe >= t4) {
                    this.mensajes.push({
                        tipo: 'informativo',
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

        // TODO: Numeros a letras

        // TODO: Franquicia y Capita Maximo
    }

    f_submit(event: Event): boolean {
        //event.preventDefault();

        let jsonObj = JSON.stringify(this.form);
        console.warn(jsonObj);

        //('pagos', 'f_submit', 'INICIO llamada servicio');
        this.blockUI.start('Validando pago ...'); //inside method
        this.pagosService.validarPago().subscribe((resp) => this.f_respuestaValidarPago(resp));
        // console.log('pagos', 'f_submit', 'FINAL llamada servicio');

        return true;
    }

    f_respuestaValidarPago(resp: any) {
        this.blockUI.stop();
        // console.log('pagos', 'f_respuestaValidarPago');
        // console.log(resp);

        if (Object.keys(resp.warnings).length > 0 || Object.keys(resp.errors).length > 0) {
            console.error('hay errores');
        } else {
            this.blockUI.start('Guardando datos ...');
            this.pagosService.GuardarPago().subscribe((resp) => this.f_respuestaGuardarPago(resp));
        }
    }

    f_respuestaGuardarPago(resp: any) {
        this.blockUI.stop();
        // console.log('pagos', 'f_respuestaGuardarPago');
    }
    /*
     * //DONE en este punto llamo al servicio para obtener la tasa se cambio, cuando responde el servicio
     * actualizo la fecha 'fechaCambioPublica' para que se propage el cambio a todos los Input-Moneda
     * y para ello tengo que hacer el update de la variable global gl_tasas, esta actualización la deberia
     * realizar el servicio, pero si la susbripcion la deribo al sercicio como podre gestionar desde aqui
     * la respuesta?
     */
    onChangeFecha(e: string) {
        const dateConversion = new Date(e);

        // si la fecha es valida llamamos el servicio
        if (dateConversion.toString() !== 'Invalid Date') {
            this.listaCambios.cargada = false;
            this.listaCambios.f_obtenerTasaDeCambioService(e).subscribe((resp) => {
                this.listaCambios.f_respuestaTasaDeCambioService(resp);
                this.f_respuestaCambioService(resp);
            });
        }
    }

    f_respuestaCambioService(resp: RateResponse) {
        // console.log('pagos', 'f_respuestaCambioService', resp);
        // la fecha de cambio publica es la que propagamos a los input-moneda
        this.fechaCambioPublica = resp.start_date;

        this.iLiquidacion.fechaCambio = new Date(this.fechaCambioPublica);
        this.iBruto.fechaCambio = new Date(this.fechaCambioPublica);
        this.iDeducible.fechaCambio = new Date(this.fechaCambioPublica);
        this.iCapital.fechaCambio = new Date(this.fechaCambioPublica);
        this.iBase.fechaCambio = new Date(this.fechaCambioPublica);
        this.iIva.fechaCambio = new Date(this.fechaCambioPublica);
        this.iFranquicia.fechaCambio = new Date(this.fechaCambioPublica);
        this.iTotal.fechaCambio = new Date(this.fechaCambioPublica);

        this.f_calcularTotales();
    }
}
