// Generated by https://quicktype.io
//
// To change quicktype's target language, run command:
//
//   "Set quicktype target language"

// Creamos la interface correspondiente al fichero json que vamos a leer.

// las interfaces es propio de Typescript, en javascript no existen

export interface MonedasResponse {
  monedas: MonedaResponse[];
}

export interface MonedaResponse {
  codigoIso: string;
  codigoMoneda: number;
  simbolo: string;
  prefijo: string;
  sufijo: string;
  numeroDecimales: number;
  nombre: string;
}
