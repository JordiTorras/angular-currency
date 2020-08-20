export class Moneda {
  private Iso: string;
  private codigoMoneda2: number;
  private nombre: string;
  private numeroDecimales: number;
  private simbolo: string;

  constructor(
    p_codigoIso: string,
    p_codigoMoneda2: number,
    p_nombre: string,
    p_numeroDecimales: number,
    p_simbolo: string
  ) {
    this.Iso = p_codigoIso;
    this.codigoMoneda2 = p_codigoMoneda2;
    this.nombre = p_nombre;
    this.numeroDecimales = p_numeroDecimales;
    this.simbolo = p_simbolo;
  }
}
