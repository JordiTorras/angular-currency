import { Component, OnInit } from '@angular/core';
import {
  CambioService,
  MonedasService,
  MonedasJsonService,
} from 'src/app/services';
import { Moneda } from 'src/app/class';
import { ImporteComponente } from '../input-moneda/ImporteComponente';

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
} from '@fortawesome/free-solid-svg-icons';

// Add icons to the library for convenient access in other components
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.css'],
})
export class PagosComponent implements OnInit {
  monedaLiquidacion: Moneda = new Moneda('USD');
  monedaPago: Moneda = new Moneda('EUR');
  monedaContable: Moneda = new Moneda('ARS');
  pIVA: number;

  listaIVA: { valor: number; descripcion: string }[] = [
    { valor: 0, descripcion: 'Exento de IVA' },
    { valor: 21, descripcion: 'General 21%' },
    { valor: 10.5, descripcion: 'Reducido 10,5%' },
  ];

  private _iliquidacion: ImporteComponente = new ImporteComponente(
    null,
    this.monedaLiquidacion.codigoIso,
    this.monedaPago.codigoIso
  );
  private _ibruto: ImporteComponente = new ImporteComponente(
    null,
    this.monedaPago.codigoIso
  );
  private _ideducible: ImporteComponente = new ImporteComponente(
    null,
    this.monedaPago.codigoIso
  );
  private _icapital: ImporteComponente = new ImporteComponente(
    null,
    this.monedaPago.codigoIso
  );
  private _ibase: ImporteComponente = new ImporteComponente(
    null,
    this.monedaPago.codigoIso
  );
  private _iiva: ImporteComponente = new ImporteComponente(
    null,
    this.monedaPago.codigoIso
  );
  private _ineto: ImporteComponente = new ImporteComponente(
    null,
    this.monedaPago.codigoIso
  );
  private _ifranquicia: ImporteComponente = new ImporteComponente(
    null,
    this.monedaPago.codigoIso
  );
  private _itotal: ImporteComponente = new ImporteComponente(
    null,
    this.monedaPago.codigoIso
  );

  mensajes: { tipo: string; mensaje: string }[] = [];

  constructor(
    public listaMonedas: MonedasService,
    public listaMonedasJson: MonedasJsonService,
    public listacambios: CambioService,
    public library: FaIconLibrary
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
      faCircle
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
     * Datos de la póliza
     */
    this._ideducible.importe = 20;
    this._icapital;
    this.pIVA = 0;
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
    this._ibruto.importe = this.iCapital.importeCambio;

    this.f_calcularTotales();
  }

  f_IFranquiciaModificado(e: any): void {
    //console.log('pagos.componente.ts.f_ILiquidacionModificado: ', e);

    this.iFranquicia.importe = e; // estoy llamando al SETTER
    this._ibruto.importe = this.iFranquicia.importeCambio;

    this.f_calcularTotales();
  }

  f_calcularTotales(): void {
    this.mensajes = [];

    if (this._ibruto.importe != null && this._ibruto.importe != undefined) {
      // Calculo importe base
      // BASE = MIN((MAX(BRUTO - NVL(DEDUCIBLE, 0), 0), NVL(CAPITAL, ∞))

      this._ibase.importe = Math.min(
        this._icapital.importe ? this._icapital.importe : Infinity,
        Math.max(
          this._ibruto.importe - this._ideducible.importe
            ? this._ibruto.importe - this._ideducible.importe
            : 0,
          0
        )
      );

      if (this._ibruto.importe < this._ideducible.importe) {
        this.mensajes.push({ tipo: 'aviso', mensaje: 'Pago 0 por deducible' });
      }

      // Calculo impuestos
      // IMPUESTOS = BASE * PORCENTAJE
      this._iiva.importe = +(
        (this._ibase.importe * this.pIVA) /
        100
      ).toPrecision(this.iBase.moneda.numeroDecimales);

      // Calculo importe neto
      // NETO = BASE + SUM(IMPUESTOS) + SUM(-RETENCIONES)
      this._ineto.importe = this._ibase.importe + this._iiva.importe;

      // Calculo importe total
      // SI (NETO > FRANQUICIA) => TOTAL = NETO  : TOTAL = 0 (retenido por franquicia)
      if (
        this._ineto.importe >=
        (this._ifranquicia.importe ? this._ifranquicia.importe : 0)
      ) {
        this.iTotal.importe = this._ineto.importe;

        if (this._ifranquicia.importe) {
          this.mensajes.push({
            tipo: 'aviso',
            mensaje: 'Pago liberado supera franqucia',
          });
        }
      } else {
        this.iTotal.importe = 0;
        this.mensajes.push({
          tipo: 'aviso',
          mensaje: 'Pago retenido por franquicia',
        });
      }

      this.mensajes.push({ tipo: 'informativo', mensaje: 'Calculo completo' });
    }

    // TODO: Marcar visualmente los topes que no se superan, DEDUCIBLE, CAPITAL, FRANQUICIA

    // TODO: La moneda de pago es EUR pero el simbolo que se muestra es $

    // TODO: Mostrar mensajes de franquicia y deducible aplicados

    // TODO: Crear paquete de instalación

    // TODO: Numeros a letras

    // TODO: Franquicia y Capita Maximo
  }
}
