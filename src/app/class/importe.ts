// import { AppInjector } from 'src/app/app.module';
import { tasas } from 'src/app/services/cambio.service';

// const servicioTasas = AppInjector.get(CambioService);

export class Importe {
  importe: number;
  moneda: string;
  fechaCambio: Date = new Date();
  tasaCambio: number;
  importeMonCia: number;
  monedaMonCia: string;

  //servicioTasas = AppInjector.get(CambioService);

  constructor(p_importe: number, p_moneda: string, p_fecha: Date) {
    this.importe = p_importe;
    this.moneda = p_moneda;
    this.monedaMonCia =
      'ARS'; /* Peso Argentino --> moneda por defecto de la instalación */
    this.f_setFechaCambio(p_fecha);
    this.f_calcularMonCia;
  }

  f_setFechaCambio(p_fecha: Date): void {
    /*
      Tengo que acceder a los datos del servicio CambioService, pero si inyecto el servicio
      en el constructor, la clase pierde sentido por que hay que pasar un parametro nuevo. 

      uso la solución de crear una variable global que nos permita inyectar el servicio en 
      cualquier parte del codigo

      https://stackoverflow.com/questions/37482460/getting-instance-of-service-without-constructor-injection

      Este ejemplo no me ha servido, despues de modificar el app.module.ts y el importe.ts me daba un warning
      de codigo en circulo
    */

    /*
      Lo segundo que he hecho es trabajar con variables globales, he modificado el cambio.service.ts para 
      exportar una variable 'tasas'  la que le he asignado el CambioService.cambio, esto funciona
      pero no estoy trabajando con la clase, sino con un objeto directamente

      let tasaCambio = tasas[this.moneda];
    */

    /*
      Basandonos en el paso anterior, el objetivo es tener una variable global de tipo CambioService que 
      pueda exportar

      el CambioService crea una variable global de la clase Tasas, que es la que exporto y luego es la 
      que importo donde lo necesito
    */

    this.fechaCambio = p_fecha;
    this.tasaCambio = 1 / tasas.f_obtenerTasa(this.moneda);
  }

  f_calcularMonCia(): void {
    if (this.importe === 0) {
      this.importeMonCia = 0;
    } else {
      this.importeMonCia = this.importe * this.tasaCambio;
    }
  }
}
