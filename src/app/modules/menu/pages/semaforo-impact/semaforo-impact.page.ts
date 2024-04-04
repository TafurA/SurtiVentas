import { Component, OnInit } from '@angular/core';

import { MenuModule } from '@modules/menu/menu.module';

@Component({
  selector: 'app-semaforo-impact',
  templateUrl: './semaforo-impact.page.html',
  styleUrls: ['./semaforo-impact.page.scss'],
  standalone: true,
  imports: [MenuModule]
})
export class SemaforoImpactPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
