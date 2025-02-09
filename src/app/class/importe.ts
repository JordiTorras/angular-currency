// import { AppInjector } from 'src/app/app.module';
import { gl_tasas } from 'src/app/services/cambio.service';
import { Moneda } from './moneda';
import { environment } from 'src/environments/environment';
// import IMask from 'imask';

// const servicioTasas = AppInjector.get(CambioService);

export class Importe {
    private _importe: number;
    private _moneda: Moneda;
    private _fechaCambio: Date;
    private _tasaCambio: number;
    private _importeCambio: number;
    private _monedaCambio: Moneda;
    //   private _importeMask: string;

    //servicioTasas = AppInjector.get(CambioService);

    constructor(p_importe: number, p_moneda: string, p_monedaCambio?: string, p_fecha?: Date) {
        this._importe = p_importe;
        this._moneda = new Moneda(p_moneda);

        if (p_monedaCambio) {
            //TODO: provocar una excepción, verificar que la moneda exista en el constructor de Moneda
            this._monedaCambio = new Moneda(p_monedaCambio);
        } else {
            /* Peso Argentino --> moneda por defecto de la instalación */
            this._monedaCambio = new Moneda(environment.monedaInstalacion);
        }
        this.f_setFechaCambio(p_fecha); // hay que crear una funcion por que no se puede usar el SET
        this.f_obtenerTasaCambio();
        this._importeCambio = this.f_calcularCambio(p_importe);
        // console.log('constructor importe' + ' ' + this._importe);
    }

    public set importe(val: number) {
        this._importe = val;
        this._importeCambio = this.f_calcularCambio(this._importe);
    }

    public get importe() {
        return this._importe;
    }

    public set moneda(val: Moneda) {
        // Calculamos el importe en la nueva moneda
        const monedaTemporal: Moneda = this.monedaCambio;

        // Calculamos el importe en la nueva moneda
        this.f_obtenerTasaCambio(this._moneda.codigoIso, val.codigoIso);
        this._monedaCambio = val;
        this._importe = +this.f_calcularCambio(this._importe);

        // Asignamos la nueva moneda, recuperamos la moneda de cambio original
        // y recalculamos el importe de cambio
        this._moneda = val;
        this._monedaCambio = monedaTemporal;
        this.f_obtenerTasaCambio();
        this._importeCambio = this.f_calcularCambio(this._importe);
    }

    public get moneda(): Moneda {
        return this._moneda;
    }

    public set fechaCambio(val: Date) {
        this._fechaCambio = val;
        this.f_obtenerTasaCambio();
        this._importeCambio = this.f_calcularCambio(this._importe);
    }

    public get fechaCambio(): Date {
        return this._fechaCambio;
    }

    private f_setFechaCambio(p_fecha: Date): void {
        if (p_fecha == null) {
            this._fechaCambio = new Date();
        } else {
            this._fechaCambio = p_fecha;
        }
    }

    public set tasaCambio(val: number) {
        /**
         * Si permitimos cambiar la tasa de cambio deberiamos desactivar la
         * obtencion de la tasa de forma automatica desactivando la función
         * f_obtenerTasaCambio() con un booleano
         */
        this._tasaCambio = val;
        this._fechaCambio = new Date();
        this._importeCambio = this.f_calcularCambio(this._importe);
    }

    public get tasaCambio(): number {
        return this._tasaCambio;
    }

    // public set importeCambio(val: number) {
    //   this._importeCambio = val;
    // }

    public get importeCambio() {
        return this._importeCambio;
    }

    public set monedaCambio(val: Moneda) {
        this._monedaCambio = val;
        this.f_obtenerTasaCambio();
        this._importeCambio = this.f_calcularCambio(this._importe);
    }

    public get monedaCambio(): Moneda {
        return this._monedaCambio;
    }

    private f_obtenerTasaCambio(p_monedaOrigen?: string, p_monedaDestino?: string): void {
     /*    console.log(
            'importe',
            'obtenerTasaCambio',
            p_monedaOrigen,
            p_monedaDestino,
            this._fechaCambio
        ); */

        if (p_monedaOrigen == null) {
            p_monedaOrigen = this._moneda.codigoIso;
        }
        if (p_monedaDestino == null) {
            p_monedaDestino = this._monedaCambio.codigoIso;
        }

        if (p_monedaDestino === environment.monedaInstalacion) {
            // Calculamos de la MONEDA a ARS de forma directa
            // No hay una funcion para redondear decimales Math.round() solo redondea a enteros
            // hay que usar .toFixed que transforma el número en una cadena por eso luego hay que
            // volverlo a convertir en númerico con el +(string)
            this._tasaCambio = +(
                1 / gl_tasas.f_obtenerTasa(p_monedaOrigen, this._fechaCambio)
            ).toFixed(6);
        } else {
            /**
             * De EUR a USD => EUR --> ARS --> USD
             */
            // EUR a ARS
            let monInicial2monBase: number = +(
                1 / gl_tasas.f_obtenerTasa(p_monedaOrigen, this._fechaCambio)
            ).toFixed(6);

            // ARS a USD
            let monBase2monFinal: number = +gl_tasas
                .f_obtenerTasa(p_monedaDestino, this._fechaCambio)
                .toFixed(6);

            this._tasaCambio = monInicial2monBase * monBase2monFinal;
        }
    }

    private f_calcularCambio(p_importe: number): number {
        if (p_importe == null) {
            return null;
        } else {
            p_importe = +(p_importe * this._tasaCambio).toFixed(this._monedaCambio.numeroDecimales);

            return p_importe;
        }
    }
}
