import { Component, OnInit } from '@angular/core';

import { MenuModule } from '@modules/menu/menu.module';

@Component({
  selector: 'app-oportunity',
  templateUrl: './oportunity.page.html',
  styleUrls: ['./oportunity.page.scss'],
  standalone: true,
  imports: [MenuModule]
})
export class OportunityPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
