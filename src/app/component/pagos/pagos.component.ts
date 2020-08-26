import { Component, OnInit } from '@angular/core';
import {
  CambioService,
  MonedasService,
  MonedasJsonService,
} from 'src/app/services';
import { Moneda } from 'src/app/class';
import { Importe } from 'src/app/class/importe';

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.css'],
})
export class PagosComponent implements OnInit {
  monedaLiquidacion: Moneda = new Moneda('USD');
  monedaPago: Moneda = new Moneda('EUR');
  monedaContable: Moneda = new Moneda('ARS');

  private _iliquidacion: Importe = new Importe(
    null,
    this.monedaLiquidacion.codigoIso,
    this.monedaPago.codigoIso
  );
  private _ibruto: Importe = new Importe(null, this.monedaPago.codigoIso);
  private _ideducible: Importe = new Importe(null, this.monedaPago.codigoIso);
  private _icapital: Importe = new Importe(null, this.monedaPago.codigoIso);
  private _ibase: Importe = new Importe(null, this.monedaPago.codigoIso);
  private _iiva: Importe = new Importe(null, this.monedaPago.codigoIso);
  private _ineto: Importe = new Importe(null, this.monedaPago.codigoIso);
  private _ifranquicia: Importe = new Importe(null, this.monedaPago.codigoIso);
  private _itotal: Importe = new Importe(null, this.monedaPago.codigoIso);

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
  }

  public get iLiquidacion(): Importe {
    return this._iliquidacion;
  }
  public set iLiquidacion(value: Importe) {
    this._iliquidacion = value;
  }

  public get iBruto(): Importe {
    return this._ibruto;
  }
  public set iBruto(value: Importe) {
    this._ibruto = value;
  }

  public get iDeducible(): Importe {
    return this._ideducible;
  }
  public set iDeducible(value: Importe) {
    this._ideducible = value;
  }

  public get iCapital(): Importe {
    return this._icapital;
  }
  public set iCapital(value: Importe) {
    this._icapital = value;
  }
  public get iBase(): Importe {
    return this._ibase;
  }
  public set iBase(value: Importe) {
    this._ibase = value;
  }

  public get iIva(): Importe {
    return this._iiva;
  }
  public set iIva(value: Importe) {
    this._iiva = value;
  }

  public get iNeto(): Importe {
    return this._ineto;
  }
  public set iNeto(value: Importe) {
    this._ineto = value;
  }

  public get iFranquicia(): Importe {
    return this._ifranquicia;
  }
  public set iFranquicia(value: Importe) {
    this._ifranquicia = value;
  }
  public get iTotal(): Importe {
    return this._itotal;
  }
  public set iTtotal(value: Importe) {
    this._itotal = value;
  }

  f_ILiquidacionModificado(e: any): void {
    console.log('modificarImporte: ', e);

    this.iLiquidacion.importe = e; // estoy llamando al SETTER
    this.iBruto.importe = e.toString(); /* la caja de Input es de tipo texto, espera un texto para
    poder darle formato */

    this.f_calcularTotales();
  }

  f_calcularTotales(): void {
    if (this._ibruto.importe != null) {
      /* 
      // Calculo importe base
      // iBase = Max((MAX(BRUTO - NVL(DEDUCIBLE), 0), NVL(CAPITAL))
      this._ibase.importe = Math.max(
        this._icapital.importe ? this._icapital.importe : 0,
        Math.max(
          this._ibruto.importe - this._ideducible.importe
            ? this._ideducible.importe
            : 0,
          0
        )
      );

      // Calculo impuestos

      // Calculo importe total
      this._itotal.importe = this._ibase.importe; */
    }
  }
}
