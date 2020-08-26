// import { AppInjector } from 'src/app/app.module';
import { gl_tasas } from 'src/app/services/cambio.service';
import { Moneda } from './moneda';
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

  constructor(p_importe: number, p_moneda: string, p_fecha?: Date) {
    this._importe = p_importe;
    this._moneda = new Moneda(p_moneda);
    /* Peso Argentino --> moneda por defecto de la instalación */
    this._monedaCambio = new Moneda('ARS');
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
    this.f_obtenerTasaCambio(this._moneda.codigoIso, val.codigoIso);
    this._importe = this.f_calcularCambio(this._importe);

    // Asignamos la nueva moneda
    this._moneda = val;
    this.f_obtenerTasaCambio();
    this._importeCambio = this.f_calcularCambio(this._importe);
  }

  public get moneda(): Moneda {
    return this._moneda;
  }

  public set fechaCambio(val: Date) {
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

  private f_obtenerTasaCambio(
    p_monedaOrigen?: string,
    p_monedaDestino?: string
  ): void {
    if (p_monedaOrigen == null) {
      p_monedaOrigen = this._moneda.codigoIso;
    }
    if (p_monedaDestino == null) {
      p_monedaDestino = this._monedaCambio.codigoIso;
    }

    if (p_monedaDestino === 'ARS') {
      // Calculamos de la MONEDA a ARS de forma directa
      // No hay una funcion para redondear decimales Math.round() solo redondea a enteros
      // hay que usar .toFixed que transforma el número en una cadena por eso luego hay que
      // volverlo a convertir en númerico con el +(string)
      this._tasaCambio = +(1 / gl_tasas.f_obtenerTasa(p_monedaOrigen)).toFixed(
        6
      );
    } else {
      /**
       * De EUR a USD => EUR --> ARS --> USD
       */
      // EUR a ARS
      let monInicial2monBase: number = +(
        1 / gl_tasas.f_obtenerTasa(p_monedaOrigen)
      ).toFixed(6);

      // ARS a USD
      let monBase2monFinal: number = +gl_tasas
        .f_obtenerTasa(p_monedaDestino)
        .toFixed(6);

      this._tasaCambio = monInicial2monBase * monBase2monFinal;
    }
  }

  private f_calcularCambio(p_importe: number): number {
    if (p_importe == null) {
      return null;
    } else {
      p_importe = p_importe * this._tasaCambio;

      return +p_importe.toFixed(this._monedaCambio.numeroDecimales);
    }
  }

  /* public f_printTasaCambio(dec: number): string {
    return this.tasaCambio.toFixed(
      dec
        ? this.tasaCambio < 0.1
          ? 6
          : this._monedaCambio.numeroDecimales
        : dec
    );
  }

  public f_printImporte(): string {
    let mascara = IMask.createMask({
      mask: Number,
      thousandsSeparator: '.',
      scale: this._moneda.numeroDecimales,
    });
    mascara.resolve(this._importe.toString());
    return mascara.value;
  }

  public f_printImporteCambio(): string {
    let mascara = IMask.createMask({
      mask: Number,
      thousandsSeparator: '.',
      scale: this._monedaCambio.numeroDecimales,
    });
    mascara.resolve(this._importeCambio.toString());
    return mascara.value;
  } */

  /* public set importeMask(val: string) {
    this._importeMask = val;
    this._importe = +this._importeMask;
    this._importeCambio = this.f_calcularCambio(this._importe);

    console.log(this._importeMask + ' ' + this._importe);
  }

  public get importeMask() {
    return this._importeMask;
  } */
}
