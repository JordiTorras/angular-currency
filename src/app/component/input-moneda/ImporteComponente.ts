import { Importe } from 'src/app/class/importe';
import { Moneda } from 'src/app/class/moneda';
import IMask from 'imask';

/**
 * Esta clase da soporte al componenete <app-input-moneda> para gestionar y
 * mostrar los datos por pantalla
 */

export class ImporteComponente extends Importe {
  private _importeMask: string;

  constructor(
    p_importe: number,
    p_moneda: string,
    p_monedaCambio?: string,
    p_fecha?: Date
  ) {
    super(p_importe, p_moneda, p_monedaCambio, p_fecha);
    if (p_importe) {
      this._importeMask = p_importe.toString();
    }
  }

  public set importeMask(val: string) {
    this._importeMask = val;
    super.importe = +this._importeMask;

    // console.log(this._importeMask, this.importeCambio);
  }

  public get importeMask() {
    return this._importeMask;
  }

  public set importe(val: number) {
    super.importe = val;
    this.importeMask = val.toString();
  }

  public get importe(): number {
    return super.importe;
  }

  /**
   * Al crear el metodo set de moneda, a diferencia del set de importe que si funciona directamente
   * se produce un error de ejecución no de compilación en
   * public mask: any = {
   *    mask: this.importe.moneda.simbolo + ' num',   --> Aqui se produce el error
   *
   * ERROR TypeError: Cannot read property 'simbolo' of undefined
   *     at new InputMonedaComponent (input-moneda.component.ts:83)
   *
   *  por que no puede acceder directamente a las propiedad de la clase Moneda mediante el SET,
   *  his.importe.moneda.simbolo
   *  Soluciones crear una función f_setMoneda(val: Moneda) en lugar de un SETTER
   *  o crear SETTERS y GETTERS en la clase moneda.
   *  DONE: crar SETTERS y GETTERS en la clase Moneda
   */
  /*   public f_setmoneda(val: string) {
    super.moneda = new Moneda(val);
    this.importeMask = super.importe ? super.importe.toString() : null;
  } */

  /**
   * he movido los setteres y getters al input-moneda.component.ts
   */
  /* public set cmoneda(val: string) {
    super.moneda = new Moneda(val);
    this.importeMask = super.importe ? super.importe.toString() : null;
  }

  public get cmoneda(): string {
    return super.moneda.codigoIso;
  } */

  public f_printTasaCambio(dec: number): string {
    return super.tasaCambio.toFixed(
      dec
        ? super.tasaCambio < 0.1
          ? 6
          : super.monedaCambio.numeroDecimales
        : dec
    );
  }

  public f_printImporte(): string {
    if (super.importe) {
      let mascara = IMask.createMask({
        mask: Number,
        thousandsSeparator: '.',
        scale: super.moneda.numeroDecimales,
        signed: true,
      });
      mascara.resolve(super.importe.toString());
      return mascara.value;
    } else {
      return '';
    }
  }

  public f_printImporteCambio(): string {
    if (super.importeCambio) {
      let mascara = IMask.createMask({
        mask: Number,
        thousandsSeparator: '.',
        scale: super.monedaCambio.numeroDecimales,
        signed: true,
      });
      mascara.resolve(super.importeCambio.toString());
      return mascara.value;
    } else {
      return '';
    }
  }
}
