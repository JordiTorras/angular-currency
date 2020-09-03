import { Rate } from 'src/app/class/index';
import { formatDate } from '@angular/common';

/*
    Creamos una classe, por que la función de esta clase es gesionar las tasas
    ahora no se implementará pero el objetivo es que el sistema carge las tasas a medida
    que las van solicitando

    y ofrezca las funciones necesarias para tratar las tasas
*/

export class Tasas {
    private tasas: { [key: string]: Rate };

    constructor(tasas: { [key: string]: Rate }) {
        this.tasas = tasas;
    }

    f_obtenerTasa(p_moneda: string, p_fecha: Date): number {
        //FIXME sustituir 'en-US' por el LOCALE
        // console.log('tasas', 'f_obtenerTasa', p_moneda, p_fecha);
        const d: string = formatDate(p_fecha, 'yyyy-MM-dd', 'en-US');
        // console.log('tasas', 'f_obtenerTasa', d, this.tasas[d][p_moneda]);

        if (p_moneda === 'UF') {
            return 0.000377;
        }

        return this.tasas[d][p_moneda];
    }
}
