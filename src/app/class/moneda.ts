import { MonedaResponse } from './monedas-response';

export class Moneda {
  /*
        para evitar tener que poner en el constructor la igualación de 
        cada uno de las propiedades de la clase
        this.codigoIso = p_codigoIso 
        podemos definir las propiedades en el constructor
    */

  constructor(
    public codigoIso: string,
    public codigoMoneda: number,
    public nombre: string,
    public numeroDecimales: number,
    public simbolo: string
  ) {}

  /*
    Los metodos staticos se pueden llamar sin tener una instancia de la clase nombreclase.nombremetodo
    Moneda.f_MonedaDesdeJson()
    Crearemos un metodo statico que nos cree un objeto Moneda a partir de los datos del json
    de esta forma si cambia el json, solo deberemos modificar la clase y el metodo estatico
  */
  static f_MonedaDesdeJson(datos: MonedaResponse): Moneda {
    return new Moneda(
      datos.codigoIso,
      datos.codigoMoneda,
      datos.nombre,
      datos.numeroDecimales,
      datos.simbolo
    );
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
}
