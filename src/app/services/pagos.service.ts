import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class PagosService {
    constructor(private http: HttpClient) {}

    validarPago() {
        const respuesta: object = {
            warnings: [
                {
                    codigo: 35,
                    mensaje: 'Mensaje de aviso 1',
                },
                {
                    codigo: 67,
                    mensaje: 'Mensaje de aviso 2',
                },
            ],
            errors: [
                {
                    codigo: 70,
                    mensaje: 'Error - 70: Mensaje del error',
                },
            ],
        };

        // simulate http.get()
        // con of({}) devolvemos una respuesta vacia
        return of({ warnings: {}, errors: {} }).pipe(delay(500));
        //return of(respuesta).pipe(delay(500));
    }

    GuardarPago() {
        // simulate http.get()
        return of({ respuesta: 0 }).pipe(delay(500));
    }
}
