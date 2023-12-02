import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { register } from 'swiper/element/bundle';
import SwiperCore, { EffectCoverflow, SwiperOptions } from 'swiper';

// Initi swiper global
register();
// Install the Coverflow module
SwiperCore.use([EffectCoverflow]);

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class AppComponent {
  constructor() { }
}
