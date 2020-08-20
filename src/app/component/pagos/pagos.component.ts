import { Component, OnInit } from '@angular/core';
import { MonedasService } from 'src/app/services/monedas.service';

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.css'],
})
export class PagosComponent implements OnInit {
  constructor(public _listaMonedas: MonedasService) {}

  ngOnInit(): void {}
}
