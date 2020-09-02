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
        // simulate http.get()
        return of({ resultado: false }).pipe(delay(500));
    }
}
