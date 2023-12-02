import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

if (environment.production) {
  enableProdMode();
  // if ('serviceWorker' in navigator) {
  //   console.log("ASDAD")
  //   window.addEventListener('load', () => {
  //     console.log("CARGO ESTE")
  //     navigator.serviceWorker.register('/ngsw-worker.js')
  //       .then(registration => {
  //         console.log('Service Worker registered: ', registration);
  //         // alert('Service Worker registered: ' + registration)
  //       })
  //       .catch(error => {
  //         console.error('Service Worker registration failed: ', error);
  //         // alert('Service Worker registration failed: ' + error)
  //       });
  //   });
  // }
}
// platformBrowserDynamic().bootstrapModule(AppModule)
//   .catch((err: any) => console.error(err));

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    importProvidersFrom(IonicModule.forRoot({})),
    provideRouter(routes),
  ],
});