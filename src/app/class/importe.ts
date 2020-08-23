// import { AppInjector } from 'src/app/app.module';
import { gl_tasas } from 'src/app/services/cambio.service';
import { Moneda } from './moneda';
import IMask from 'imask';

// const servicioTasas = AppInjector.get(CambioService);

export class Importe {
  private _importe: number;
  private _moneda: Moneda;
  private _fechaCambio: Date;
  private _tasaCambio: number;
  private _importeCambio: number;
  private _monedaCambio: Moneda;

  //servicioTasas = AppInjector.get(CambioService);

  constructor(p_importe: number, p_moneda: string, p_fecha?: Date) {
    this._importe = p_importe;
    this._moneda = new Moneda(p_moneda);
    /* Peso Argentino --> moneda por defecto de la instalación */
    this._monedaCambio = new Moneda('ARS');
    this.f_setFechaCambio(p_fecha); // hay que crear una funcion por que no se puede usar el SET
    this.f_obtenerTasaCambio();
  }

  public set importe(val: number) {
    this._importe = val;
    this.f_calcularCambio();
  }

  public get importe() {
    return this._importe;
  }

  public set moneda(val: Moneda) {
    this._moneda = val;
    this.f_obtenerTasaCambio();
  }

  public get moneda(): Moneda {
    return this._moneda;
  }

  public set fechaCambio(val: Date) {
    this.f_obtenerTasaCambio();
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
  }

  public get tasaCambio(): number {
    return this._tasaCambio;
  }

  public f_printTasaCambio(dec: number): string {
    return this.tasaCambio.toFixed(
      dec ? this._monedaCambio.numeroDecimales : dec
    );
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
  }

  public get monedaCambio(): Moneda {
    return this._monedaCambio;
  }

  private f_obtenerTasaCambio(): void {
    if (this._monedaCambio.codigoIso === 'ARS') {
      // Calculamos de la MONEDA a ARS de forma directa
      // No hay una funcion para redondear decimales Math.round() solo redondea a enteros
      // hay que usar .toFixed que transforma el número en una cadena por eso luego hay que
      // volverlo a convertir en númerico con el +(string)
      this._tasaCambio = +(
        1 / gl_tasas.f_obtenerTasa(this._moneda.codigoIso)
      ).toFixed(6);
    } else {
      /**
       * De EUR a USD => EUR --> ARS --> USD
       */
      // EUR a ARS
      let monInicial2monBase: number = +(
        1 / gl_tasas.f_obtenerTasa(this._moneda.codigoIso)
      ).toFixed(6);

      // ARS a USD
      let monBase2monFinal: number = +gl_tasas
        .f_obtenerTasa(this._monedaCambio.codigoIso)
        .toFixed(6);

      this._tasaCambio = monInicial2monBase * monBase2monFinal;
    }

    this.f_calcularCambio();
  }

  private f_calcularCambio(): void {
    if (this._importe == null) {
      this._importeCambio = 0;
    } else {
      this._importeCambio = this._importe * this._tasaCambio;
    }

    this._importeCambio = +this.importeCambio.toFixed(
      this._monedaCambio.numeroDecimales
    );
  }

  public f_printImporte(): string {
    let mascara = IMask.createMask({ mask: Number, thousandsSeparator: '.' });
    mascara.resolve(this._importe.toString());
    return mascara.value;
  }
  
  public f_printImporteCambio(): string {
    let mascara = IMask.createMask({ mask: Number, thousandsSeparator: '.' });
    mascara.resolve(this._importeCambio.toString());
    return mascara.value;
  }
}
