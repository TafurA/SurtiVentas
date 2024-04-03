import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-semaforo-impact',
  templateUrl: './semaforo-impact.page.html',
  styleUrls: ['./semaforo-impact.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class SemaforoImpactPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
