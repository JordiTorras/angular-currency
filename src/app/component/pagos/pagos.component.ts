import { Component, OnInit } from '@angular/core';
import {
  CambioService,
  MonedasService,
  MonedasJsonService,
} from 'src/app/services';
import { Moneda } from 'src/app/class';
import { Importe } from 'src/app/class/importe';
import { ImporteComponente } from '../input-moneda/ImporteComponente';

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.css'],
})
export class PagosComponent implements OnInit {
  monedaLiquidacion: Moneda = new Moneda('USD');
  monedaPago: Moneda = new Moneda('EUR');
  monedaContable: Moneda = new Moneda('ARS');

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

  constructor(
    public listaMonedas: MonedasService,
    public listaMonedasJson: MonedasJsonService,
    public listacambios: CambioService
  ) {}

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
    console.log('modificarImporte: ', e);

    this.iLiquidacion.importe = e; // estoy llamando al SETTER
    this.iBruto.importe = this.iLiquidacion.importeCambio; /* la caja de Input es de tipo texto, espera un texto para
    poder darle formato */

    this.f_calcularTotales();
  }

  f_calcularTotales(): void {
    if (this._ibruto.importe != null) {
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

      // Calculo impuestos
      // IMPUESTOS = BASE * PORCENTAJE
      this._iiva.importe = +((this._ibase.importe * 21) / 100).toPrecision(
        this.iBase.moneda.numeroDecimales
      );

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
      } else {
        this.iTotal.importe = 0;
      }
    }

    // TODO: Marcar visualmente los topes que no se superan, DEDUCIBLE, CAPITAL, FRANQUICIA

    // TODO: La moneda de pago es EUR pero el simbolo que se muestra es $

    // TODO: Mostrar mensajes de franquicia y deducible aplicados

    // TODO: bloquear campos no editables de la sección de pagos

    // TODO: Al editar deducible / franquicia recalcular totales

    // TODO: IVA, selector de % de IVA
  }
}
