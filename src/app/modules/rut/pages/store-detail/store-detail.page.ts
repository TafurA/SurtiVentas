declare var google: any;
import { Component, OnInit } from '@angular/core';

import { StoreModel } from '@core/models/store_model';
import { RutModule } from '@modules/rut/rut.module';
import { AlertService } from '@shared/services/alert.service';
import { StoresService } from '@shared/services/stores.service';

@Component({
  selector: 'app-store-detail',
  templateUrl: './store-detail.page.html',
  styleUrls: ['./store-detail.page.scss'],
  standalone: true,
  imports: [RutModule]
})
export class StoreDetailPage implements OnInit {
  protected iconAction: 'i-pencil' | 'i-close' | 'i-disk' = 'i-pencil'
  protected isFormActive: boolean = false
  store: StoreModel = {
    codcli_b: '',
    nomcli_b: '',
    ape1cli_b: '',
    ape2cli_b: '',
    empcli_b: '',
    latcli_b: '',
    loncli_b: '',
    ndicli_b: '',
    barcli_b: '',
    ciudad: '',
  }
  apiKey = 'AIzaSyDLPIRw-kU5wPx3oAJtH3fkdpc865F1UXc';
  oldEmail = ''
  oldPhone = ''
  oldNameTienda = ''
  messageError: boolean = false

  constructor(private _storeService: StoresService, private _alertService: AlertService) {
  }

  ngOnInit() {
    this.getDetailStore()
  }

  geocodeAddress() {
    const address = `${this.store.dircli_b}, ${this.store.barcli_b} ${this.store.ciudad}`;

    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${this.apiKey}`;

    // const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${this.apiKey}`;

    fetch(geocodeUrl)
      .then((response) => response.json())
      .then((data) => this.handleGeocodeResponse(data))
      .catch((error) => console.error('Error al obtener datos:', error));
  }

  handleGeocodeResponse(data: any) {

    if (data.status === 'OK') {
      const { formatted_address, geometry } = data.results[0];
      const { lat, lng } = geometry.location;

      // Mostrar el mapa con un pin en la ubicación
      const mapOptions = {
        center: { lat, lng },
        zoom: 16,
      };
      const map = new google.maps.Map(document.getElementById('map')!, mapOptions);

      const marker = new google.maps.Marker({
        position: { lat, lng },
        map: map,
        title: formatted_address,
        icon: {
          url: 'assets/imgs/pin/pin.svg',
          scaledSize: new google.maps.Size(40, 40),
        } // Ruta al icono personalizado (ubicado en la carpeta assets)
      });

    } else {
      const errorElement = document.createElement('p');
      errorElement.textContent = `Error: ${data.status}`;
    }
  }

  public showEditForm() {
    this.iconAction = 'i-close'
    this.isFormActive = true
  }

  getDetailStore() {
    const cartStoreID: string = localStorage.getItem('CartStoreID')!
    this._storeService.getStoreDetail$(cartStoreID).subscribe({
      next: (res: any) => {
        const dataObject = JSON.parse(res.data)
        this.store = dataObject.data
      },
      complete: () => {
        this.geocodeAddress()
        this.oldEmail! = this.store.emacli_b!
        this.oldPhone! = this.store.telcli_b!
      }
    })
  }

  public showActionToEdit() {
    if (
      this.oldEmail !== this.store.emacli_b
      || this.oldPhone !== this.store.telcli_b
      || this.oldNameTienda !== this.store.empcli_b) {
      this.iconAction = 'i-disk'
      this.isFormActive = true

      if (this.store.telcli_b!.length > 10) {
        this.messageError = true
      } else {
        this.messageError = false
      }
    } else {
      this.iconAction = 'i-pencil'
      this.isFormActive = false
    }
  }

  public showNumbersCel() {
    if (this.store.telcli_b!.length > 10) {
      this.messageError = true
    } else {
      this.messageError = false
    }
  }

  public saveEditForm() {
    if (this.iconAction === 'i-close') {
      this.iconAction = 'i-disk'
      this.isFormActive = false
    } else {
      this._storeService.updateDataStore$(this.store.codcli_b, this.store.emacli_b, this.store.telcli_b, this.store.empcli_b).subscribe({
        next: (res) => {
          const { message } = JSON.parse(res.data)
          this._alertService.showAlert('¡Datos editados correctamente!', message, 'success')
          this.iconAction = 'i-pencil'
          this.isFormActive = false
        }
      })
    }
  }

}
