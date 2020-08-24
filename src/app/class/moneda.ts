import { MonedaResponse } from './monedas-response';
import { gl_monedasJson } from 'src/app/services/monedasJson.service';

export class Moneda {
  /*
        para evitar tener que poner en el constructor la igualación de 
        cada uno de las propiedades de la clase
        this.codigoIso = p_codigoIso 
        podemos definir las propiedades en el constructor
    */
  public codigoIso: string;
  public codigoMoneda: number;
  public nombre: string;
  public numeroDecimales: number;
  public simbolo: string;
  public prefijo: string;
  public sufijo: string;

  constructor(public p_codigoIso: string) {
    this.codigoIso = p_codigoIso;

    this.f_getDatosMoneda(p_codigoIso);
  }

  /*
    Los metodos staticos se pueden llamar sin tener una instancia de la clase nombreclase.nombremetodo
    Moneda.f_MonedaDesdeJson()
    Crearemos un metodo statico que nos cree un objeto Moneda a partir de los datos del json
    de esta forma si cambia el json, solo deberemos modificar la clase y el metodo estatico
  */
  static f_MonedaDesdeJson(datos: MonedaResponse): Moneda {
    let a = new Moneda(datos.codigoIso);
    a.codigoMoneda = datos.codigoMoneda;
    a.nombre = datos.nombre;
    a.numeroDecimales = datos.numeroDecimales;
    a.simbolo = datos.simbolo;
    a.prefijo = datos.prefijo;
    a.sufijo = datos.sufijo;
    return a;
  }

  // En el tutorial lo trata como un Objeto generico pero no se que diferencia hay con
  // tratarlo como un MonedaResponse, supongo por si no hay la interface creada
  /* static f_MonedaDesdeJson(datos: Object): Moneda {
    return new Moneda(
      datos['codigoIso'],
      datos['codigoMoneda'],
      datos['nombre'],
      datos['numeroDecimales'],
      datos['simbolo']
    );
  } */

  private f_getDatosMoneda(p_codigoIso: string): void {
    for (let i = 0; i < gl_monedasJson.length; i++) {
      if (p_codigoIso === gl_monedasJson[i].codigoIso) {
        this.codigoMoneda = gl_monedasJson[i].codigoMoneda;
        this.nombre = gl_monedasJson[i].nombre;
        this.numeroDecimales = gl_monedasJson[i].numeroDecimales;
        this.simbolo = gl_monedasJson[i].simbolo;
        this.prefijo = gl_monedasJson[i].prefijo;
        this.sufijo = gl_monedasJson[i].sufijo;
      }
    }
  }
}
