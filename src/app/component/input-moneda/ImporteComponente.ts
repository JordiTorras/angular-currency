import { Importe } from 'src/app/class/importe';
import IMask from 'imask';

/**
 * Esta clase da soporte al componenete <app-input-moneda> para gestionar y
 * mostrar los datos por pantalla
 */

export class ImporteComponente extends Importe {
    private _importeMask: string;
    public isTouched: boolean = false;

    constructor(p_importe: number, p_moneda: string, p_monedaCambio?: string, p_fecha?: Date) {
        super(p_importe, p_moneda, p_monedaCambio, p_fecha);
        if (p_importe) {
            this._importeMask = p_importe.toString();
        }
    }

    public set importeMask(val: string) {
        this._importeMask = val;
        super.importe = +this._importeMask;
    }

    public get importeMask() {
        return this._importeMask;
    }

    public set importe(val: number) {
        super.importe = val;
        this.importeMask = val.toString();
        if (val != null) {
            this.isTouched = true;
        }
    }

    public get importe(): number {
        return super.importe;
    }

    public f_printTasaCambio(dec: number): string {
        return super.tasaCambio.toFixed(
            dec ? (super.tasaCambio < 0.1 ? 6 : super.monedaCambio.numeroDecimales) : dec
        );
    }

    public f_printImporte(): string {
        return this.f_printImportes(super.importe, super.moneda.numeroDecimales);
    }

    public f_printImporteCambio(): string {
        return this.f_printImportes(super.importeCambio, super.monedaCambio.numeroDecimales);
    }

    public f_printImportes(p_importe: number, p_numDec: number): string {
        if (p_importe === null || p_importe === undefined) {
            return '';
        } else {
            let mascara = IMask.createMask({
                mask: Number,
                thousandsSeparator: '.',
                scale: super.monedaCambio.numeroDecimales,
                signed: true,
            });
            mascara.resolve(p_importe.toString());
            return mascara.value;
        }
    }
}
