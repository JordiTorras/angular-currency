import { Importe } from 'src/app/class/importe';
import IMask from 'imask';
import { ElementSchemaRegistry } from '@angular/compiler';

/**
 * Esta clase da soporte al componenete <app-input-moneda> para gestionar y
 * mostrar los datos por pantalla
 */

export class ImporteComponente extends Importe {
  private _importeMask: string;

  constructor(p_importe: number, p_moneda: string, p_fecha?: Date) {
    super(p_importe, p_moneda, p_fecha);
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
      });
      mascara.resolve(super.importeCambio.toString());
      return mascara.value;
    } else {
      return '';
    }
  }
}
