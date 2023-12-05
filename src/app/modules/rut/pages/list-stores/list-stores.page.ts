import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonAccordionGroup, LoadingController, ModalController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
// import { Preferences } from '@capacitor/preferences';

import { RutModule } from '@modules/rut/rut.module';
import { AlertService } from '@shared/services/alert.service';
import { StoresService } from '@shared/services/stores.service';
import { CustomValidator } from '@shared/util/custom-validator';

@Component({
  selector: 'app-list-stores',
  templateUrl: './list-stores.page.html',
  styleUrls: ['./list-stores.page.scss'],
  standalone: true,
  imports: [RutModule]
})
export class ListStoresPage implements OnInit {
  currentRout: any = ''
  isRoutLoaded: boolean = false
  pendingRequest: any[] = []
  isPendingRequest: boolean = false

  @ViewChild('accordionGroup', { static: false }) accordionGroup!: IonAccordionGroup;
  // Define los dos grupos de campos usando FormGroup
  informacionPersonalForm!: FormGroup;
  informacionContactoForm!: FormGroup;
  informacionStoreForm!: FormGroup;
  isNitValue: boolean = false
  isCcValue: boolean = false
  isCcEValue: boolean = false
  isPlusRemove: boolean = false
  test: any = false
  questionId: any = true
  docTypes = [
    {
      id: 'C',
      name: 'Cédula de ciudadanía',
    },
    {
      id: 'N',
      name: 'NIT',
    },
    {
      id: 'CE',
      name: 'Cédula extranjera',
    }
  ];
  apiKey = 'AIzaSyDLPIRw-kU5wPx3oAJtH3fkdpc865F1UXc';
  public newAddressValue = 'La dirección encontrada aparecerá aquí'
  public latLocated = 0
  public longLocated = 0
  private loaderElement: any = ""
  questionClasificationForm = [
    {
      id: 'actividad_principal',
      question: '¿La actividad principal del cliente es vender productos de la canasta básica (alimentos, bebidas, aseo)?',
    },
    {
      id: 'consumo_fuera_pdv',
      question: '¿El 50% de los productos son para consumo fuera del PDV?',
    },
    {
      id: 'pdv_mas_80_por_mayor',
      question: '¿El PDV tiene al menos 80% de sus productos en venta al por mayor?',
    },
    {
      id: 'pdv_80_detras_mostrador',
      question: '¿El PDV vende el 80% de sus productos detrás del mostrador?',
    },
    {
      id: 'pdv_80_alcance_consumidor_una_gondola',
      question: '¿El PDV tiene el 80% de sus productos al alcance de la mano del consumidor y tiene por lo menos 1 góndola?',
    },
    {
      id: 'pdv_100m_cubicos',
      question: '¿El PDV tiene al menos de 100M cúbicos?',
    },
    {
      id: 'two_pasillos_lineal_botellas',
      question: '¿El PDV tiene más de 2 pasillos o el lineal de botellas abierto al consumidor?',
    },
    {
      id: 'cincuenta_minimo_medicamentos',
      question: '¿El PDV tiene como mínimo el 50% de surtido de medicamentos?',
    },
    {
      id: 'cincuenta_minimo_papeleria',
      question: '¿El PDV tiene como mínimo el 50% de surtido de papelería?',
    },
    {
      id: 'cincuenta_minimo_cosmeticos',
      question: '¿El PDV tiene como mínimo el 50% de surtido en cosméticos / cuidado capilar?',
    },
  ]
  topographicCategory = ""
  stepClasification = false
  currentIdClasification = ''
  currentIdValue = ''
  nomenclaturaComplete: any = ""
  addressOne: any[] = []
  addressTwo: any[] = []
  addressThree: any[] = []
  addressBis: any[] = []
  addressOptionalOne: any[] = []
  addressFour: any[] = []
  buttonDeleteAddress: boolean = true
  canDismissModalCreateStore: boolean = false
  selectedFile: any;
  fileUrl!: SafeResourceUrl;

  constructor(
    private _storeService: StoresService,
    private formBuilder: FormBuilder,
    private customValidator: CustomValidator,
    private _alertService: AlertService,
    private modalController: ModalController,
    private loadingCtrl: LoadingController,
    private geolocation: Geolocation,
    private router: Router,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit() { }

  ionViewDidEnter() {
    this.getCurrentRout()
    this.getRequestPendings()

    //tipo
    const mintipoLength = 7;
    //documento
    const mindocLength = 5;
    const maxNitLength = 9;
    const maxdocLength = 12;
    //Nombres y apellidos
    const minNomLength = 3;
    const maxNomLength = 28;
    //Razon Social
    const maxEstablecimiento = 50
    //PATERN NUMBER
    const soloNumeros = "^[0-9]*$";
    //PATTERN LETRAS
    const letras = '[a-zA-Z ]+$';
    const razonSocial = '^[a-zA-Z0-9 .]+$';
    const email = '[^&#$%/!?¡]*';

    this.informacionPersonalForm = this.formBuilder.group({
      docType: ['', Validators.required],
      documentNumber: [
        '',
        [
          Validators.pattern(soloNumeros),
          Validators.minLength(mindocLength),
          Validators.maxLength(maxdocLength)
        ]
      ],
      nit: [
        '',
        [
          Validators.pattern(soloNumeros),
          Validators.minLength(maxNitLength),
          Validators.maxLength(maxNitLength)
        ]
      ],
      documentExrangerNumber: [
        '',
        [
          Validators.pattern(soloNumeros),
          Validators.minLength(4),
          Validators.maxLength(12)
        ]
      ],
      verificationCode: [
        '',
        [
          Validators.pattern(soloNumeros),
          Validators.minLength(1),
          Validators.maxLength(1)
        ]
      ],
      nameStore: [
        '',
        [
          Validators.minLength(minNomLength),
          Validators.maxLength(maxNomLength)
        ]
      ],
      secondNameStore: ['', Validators.minLength(minNomLength)],
      lastName: [
        '',
        [
          Validators.minLength(minNomLength),
          Validators.maxLength(maxNomLength)
        ]
      ],
      secondLastName: [
        '',
        [
          Validators.minLength(minNomLength),
          Validators.maxLength(maxNomLength)
        ]
      ],
    });

    this.informacionContactoForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern(soloNumeros),
          Validators.minLength(mintipoLength),
          Validators.maxLength(maxdocLength)
        ]
      ],
    });

    this.informacionStoreForm = this.formBuilder.group({
      nameStoreForm: ['', [Validators.required, Validators.maxLength(maxEstablecimiento)]],
      address: ['', Validators.required],
      neighborhood: ['', Validators.required],
      city: ['', Validators.required],
      // Puedes agregar más campos relacionados con la información de contacto
    });

  }

  getCurrentRout() {
    const codEmp = localStorage.getItem('codemp_b')!
    this._storeService.getCurrentRout$(codEmp).subscribe({
      next: (res: any) => {
        const { data } = JSON.parse(res.data)
        this.currentRout = data.zonrut_b
      },
      complete: () => this.isRoutLoaded = true
    })
  }

  async onFileSelected2(event: any) {
    const fileInput = event.target;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];

      try {
        const result = await Filesystem.readFile({
          path: file.name,
          // directory: Directory.Data,
        });

        const base64String = result.data;

        // Sanitize the base64 string to use in img src
        this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          'data:image/jpeg;base64,' + base64String
        );

      } catch (error) {
        console.error('Error reading file:', error);
      }
    }
  }

  getRequestPendings() {
    this.pendingRequest = []
    this._storeService.getRequestClient(localStorage.getItem('codemp_b')!).subscribe({
      next: (res) => {
        const { data } = JSON.parse(res.data)
        if (data) {
          this.pendingRequest.push(...data)
        }
      }, complete: () => {
        if (this.pendingRequest.length > 0) {
          this.isPendingRequest = true
        } else {
          this.isPendingRequest = false
        }
      }
    })
  }

  getRequestState(): string[] {
    const requestSet = new Set<string>();
    for (const request of this.pendingRequest) {
      requestSet.add(request.codcli_b!);
    }
    return Array.from(requestSet);
  }

  getProductGroup(codcli_b: string): any[] {
    return this.pendingRequest.filter(request => request.codcli_b === codcli_b);
  }

  toggleDropdown(e: any) {
    e.target.closest(
      '.o-checkout__dropdown'
    ).classList.toggle('is-dropdown-show');
  }

  steps(e: any) {
    const parent = e.target.closest('.o-checkout__dropdown');
    parent.classList.remove('is-dropdown-show')
    parent.classList.add('is-checked')
    const sibling = parent.nextElementSibling

    if (parent.nextElementSibling) {
      sibling.classList.add('is-dropdown-show')
    }
  }

  initFormClasification() {
    const container = document.querySelectorAll(".js-container-clasification")
    container.forEach(c => {
      if (c?.getAttribute("id") == "actividad_principal") {
        c.classList.remove("is-hidden")
        this.stepClasification = true
        this.currentIdClasification = "actividad_principal"
        this.currentIdValue = "SI"
      }
    });
  }

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl
    })

    this.selectedFile = image.dataUrl

    document.querySelector("#supportImg")?.setAttribute("src", this.selectedFile)

    setTimeout(() => {
      this.modalController.dismiss()
    }, 1500);

    // image.webPath will contain a path that can be set as an image src.
    // You can access the original file using image.path, which can be
    // passed to the Filesystem API to read the raw data of the image,
    // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)

    // Can be set to the src of an image now
    // imageElement.src = imageUrl;
  };

  changeClasification(e: any, question: any) {
    this.currentIdClasification = question.id
    this.currentIdValue = e.target.value
    this.stepClasification = false
  }

  // Método para cerrar el modal
  closeModal() {
    this.canDismissModalCreateStore = true
    setTimeout(() => {
      this.modalController.dismiss();
    }, 100);
  }

  saveClasification() {
    if (this.currentIdClasification === "actividad_principal") {
      if (this.currentIdValue == "SI") {
        document.querySelector("#actividad_principal")?.classList.add("is-hidden")
        document.querySelector("#consumo_fuera_pdv")?.classList.remove("is-hidden")
        setTimeout(() => {
          this.currentIdClasification = "consumo_fuera_pdv"
          this.currentIdValue = "SI"
        }, 500)

      } else {
        // INICIA FLUJO DE OTROS
        document.querySelector("#actividad_principal")?.classList.add("is-hidden")
        document.querySelector("#cincuenta_minimo_medicamentos")?.classList.remove("is-hidden")
        setTimeout(() => {
          this.currentIdClasification = "cincuenta_minimo_medicamentos"
          this.currentIdValue = "SI"
        }, 500)
      }
    }

    if (this.currentIdClasification === "consumo_fuera_pdv") {
      if (this.currentIdValue == "SI") {
        document.querySelector("#consumo_fuera_pdv")?.classList.add("is-hidden")
        document.querySelector("#pdv_mas_80_por_mayor")?.classList.remove("is-hidden")
        this.topographicCategory = ""

        setTimeout(() => {
          this.currentIdClasification = "pdv_mas_80_por_mayor"
          this.currentIdValue = "SI"
        }, 500)

      } else {
        this.topographicCategory = "Consumo Local"
      }
    }

    if (this.currentIdClasification === "pdv_mas_80_por_mayor") {
      if (this.currentIdValue == "SI") {
        this.topographicCategory = "Mayorista"
      } else {
        this.topographicCategory = ""
        document.querySelector("#pdv_mas_80_por_mayor")?.classList.add("is-hidden")
        document.querySelector("#pdv_80_detras_mostrador")?.classList.remove("is-hidden")

        setTimeout(() => {
          this.currentIdClasification = "pdv_80_detras_mostrador"
          this.currentIdValue = "SI"
        }, 500)
      }
    }

    if (this.currentIdClasification === "pdv_80_detras_mostrador") {
      if (this.currentIdValue == "SI") {
        this.topographicCategory = "TAT"
      } else {
        this.topographicCategory = ""
        document.querySelector("#pdv_80_detras_mostrador")?.classList.add("is-hidden")
        document.querySelector("#pdv_80_alcance_consumidor_una_gondola")?.classList.remove("is-hidden")

        setTimeout(() => {
          this.currentIdClasification = "pdv_80_alcance_consumidor_una_gondola"
          this.currentIdValue = "SI"
        }, 500)
      }
    }

    if (this.currentIdClasification === "pdv_80_alcance_consumidor_una_gondola") {
      if (this.currentIdValue == "SI") {
        // NUEVAS PREGUNTAS
        document.querySelector("#pdv_80_alcance_consumidor_una_gondola")?.classList.add("is-hidden")
        document.querySelector("#pdv_100m_cubicos")?.classList.remove("is-hidden")

        setTimeout(() => {
          this.currentIdClasification = "pdv_100m_cubicos"
          this.currentIdValue = "SI"
        }, 500)
      } else {
        // INICIA FLUJO DE OTROS
        document.querySelector("#pdv_80_alcance_consumidor_una_gondola")?.classList.add("is-hidden")
        document.querySelector("#cincuenta_minimo_medicamentos")?.classList.remove("is-hidden")
        setTimeout(() => {
          this.currentIdClasification = "cincuenta_minimo_medicamentos"
          this.currentIdValue = "SI"
        }, 500)
      }
    }

    if (this.currentIdClasification === "pdv_100m_cubicos") {
      if (this.currentIdValue == "SI") {
        this.topographicCategory = "ISM"
      } else {
        // PREGUNTAS 
        document.querySelector("#pdv_100m_cubicos")?.classList.add("is-hidden")
        document.querySelector("#two_pasillos_lineal_botellas")?.classList.remove("is-hidden")

        setTimeout(() => {
          this.currentIdClasification = "two_pasillos_lineal_botellas"
          this.currentIdValue = "SI"
        }, 500)
      }
    }

    if (this.currentIdClasification === "two_pasillos_lineal_botellas") {
      if (this.currentIdValue == "SI") {
        this.topographicCategory = "Mini Tipo A"
      } else {
        this.topographicCategory = "Mini Tipo B"
      }
    }

    if (this.currentIdClasification === "cincuenta_minimo_medicamentos") {
      if (this.currentIdValue == "SI") {
        this.topographicCategory = "Drogueria"
      } else {
        // PREGUNTAS 
        document.querySelector("#cincuenta_minimo_medicamentos")?.classList.add("is-hidden")
        document.querySelector("#cincuenta_minimo_papeleria")?.classList.remove("is-hidden")

        setTimeout(() => {
          this.currentIdClasification = "cincuenta_minimo_papeleria"
          this.currentIdValue = "SI"
        }, 500)
      }
    }

    if (this.currentIdClasification === "cincuenta_minimo_papeleria") {
      if (this.currentIdValue == "SI") {
        this.topographicCategory = "Cacharrería"
      } else {
        // PREGUNTAS 
        document.querySelector("#cincuenta_minimo_papeleria")?.classList.add("is-hidden")
        document.querySelector("#cincuenta_minimo_cosmeticos")?.classList.remove("is-hidden")

        setTimeout(() => {
          this.currentIdClasification = "cincuenta_minimo_cosmeticos"
          this.currentIdValue = "SI"
        }, 500)
      }
    }

    if (this.currentIdClasification === "cincuenta_minimo_cosmeticos") {
      if (this.currentIdValue == "SI") {
        this.topographicCategory = "Peluquería / Tienda de belleza"
      } else {
        this.topographicCategory = "Otros"
      }
    }

    this.stepClasification = true
  }

  getAddressNomenclatura() {
    this._storeService.getListNomenclaturas().subscribe({
      next: (res) => {
        const { data } = JSON.parse(res.data)
        this.nomenclaturaComplete = data
      },
      complete: () => {
        this.separateSelectsAddress()
      }
    })
  }

  separateSelectsAddress() {
    this.addressOne = []
    this.addressTwo = []
    this.addressThree = []
    this.addressBis = []
    this.addressFour = []
    this.addressOptionalOne = []

    this.nomenclaturaComplete.forEach(
      (n: any, i: number) => {

        if (n.tipo == "1") {
          this.addressOne.push(n)
        } else if (n.tipo == "5") {
          this.addressOptionalOne.push(n)
        } else if (n.tipo == "3") {
          this.addressTwo.push(n)
        } else if (n.tipo == "6") {
          this.addressBis.push(n)
        } else if (n.tipo == "7") {
          this.addressFour.push(n)
        }

      });
  }

  getAddressCombined(text: any) {
    let addressInput: any = document.querySelector("#address")
    addressInput.value = addressInput.value + text.target.value + " "

    if (this.buttonDeleteAddress)
      this.buttonDeleteAddress = false
  }

  deleteAddress() {
    let addressInput: any = document.querySelector("#address")
    addressInput.value = ""
    this.buttonDeleteAddress = true
  }

  // Función para enviar el formulario
  onSubmit() {
    if (this.informacionPersonalForm.valid) {
      let documentNumberValue = this.informacionPersonalForm.get('documentNumber')
      let { docType, nameStore, secondNameStore, lastName, secondLastName, nit, verificationCode, documentExrangerNumber } = this.informacionPersonalForm.value
      const { email, phone } = this.informacionContactoForm.value
      const { nameStoreForm, address, neighborhood, city } = this.informacionStoreForm.value
      const idSeller = localStorage.getItem('codemp_b')

      if (nit) {
        documentNumberValue?.setValue(`${nit}-${verificationCode}`)
      }

      if (documentExrangerNumber) {
        documentNumberValue?.setValue(`${documentExrangerNumber}`)
      }

      this.showLoader().then(() => {


        if (this.topographicCategory == "Consumo Local") {
          this.topographicCategory = "CL"
        } else if (this.topographicCategory == "Mayorista") {
          this.topographicCategory = "M"
        } else if (this.topographicCategory == "Mini Tipo A") {
          this.topographicCategory = "MTA"
        } else if (this.topographicCategory == "Mini Tipo B") {
          this.topographicCategory = "MTB"
        } else if (this.topographicCategory == "Drogueria") {
          this.topographicCategory = "D"
        } else if (this.topographicCategory == "Cacharrería") {
          this.topographicCategory = "C"
        } else if (this.topographicCategory == "Peluquería / Tienda de belleza") {
          this.topographicCategory = "PTB"
        }

        const idCliente = localStorage.getItem("CartStoreID")
        this._storeService.setClasificationStore$(
          idCliente!,
          this.topographicCategory
        ).subscribe({
          next: (res) => {
            const { response } = JSON.parse(res.data)
            if (response) {
              this.getGeolocation().finally(() => {
                this._storeService.createStore(
                  docType,
                  documentNumberValue?.value,
                  nameStore,
                  secondNameStore,
                  lastName, secondLastName,
                  phone, email,
                  nameStoreForm,
                  this.encodeAddressToSend(),
                  idSeller!,
                  this.latLocated.toString(),
                  this.longLocated.toString(),
                  this.selectedFile
                ).subscribe({
                  next: (res) => {
                    let { response, message } = JSON.parse(res.data)
                    const typeAlert = response ? 'success' : 'error'
                    this.canDismissModalCreateStore = true
                    setTimeout(() => {
                      this.modalController.dismiss().then(() => {
                        this._alertService.showAlert(
                          'Creación de tienda',
                          message,
                          typeAlert
                        )
                      }).finally(() => {
                        if (typeAlert === 'success') {
                          this.informacionPersonalForm.reset()
                          this.informacionContactoForm.reset()
                          this.informacionStoreForm.reset()
                          this.isNitValue = false
                          this.isCcValue = false

                          const container = document.querySelectorAll(".js-container-clasification")
                          container.forEach(c => {
                            c.classList.add("is-hidden")
                          })

                          document.querySelector("#basic")?.classList.add('is-dropdown-show')
                          document.querySelector("#basic")?.classList.remove('is-checked')
                          document.querySelector("#contact")?.classList.remove('is-dropdown-show')
                          document.querySelector("#contact")?.classList.remove('is-checked')
                          document.querySelector("#store")?.classList.remove('is-dropdown-show')
                          document.querySelector("#store")?.classList.remove('is-checked')
                          document.querySelector("#clasification")?.classList.remove('is-dropdown-show')
                          document.querySelector("#clasification")?.classList.remove('is-checked')

                          this.isPlusRemove = true
                          localStorage.setItem("anotherStore", 'true')
                        }
                      })
                    }, 300);
                  },
                  complete: () => {
                    this.loaderElement.dismiss()
                    this.getRequestPendings()
                  },
                  error: (e) => {
                    console.log("QUEQ ERROR ", e)
                  }
                })
              })
            }
          }
        })

      })
    }
  }

  encodeAddressToSend() {
    const { address } = this.informacionStoreForm.value
    return window.btoa(unescape(encodeURIComponent(JSON.stringify(address))))
  }

  checkStepsForms() {
    this.canDismissModalCreateStore = false
    setTimeout(() => {
      if (this.informacionPersonalForm.valid && this.informacionContactoForm.valid && this.informacionStoreForm.valid) {
        document.querySelector("#basic")?.classList.remove('is-dropdown-show')
        document.querySelector("#basic")?.classList.add('is-checked')
        document.querySelector("#contact")?.classList.remove('is-dropdown-show')
        document.querySelector("#contact")?.classList.add('is-checked')
        document.querySelector("#store")?.classList.remove('is-dropdown-show')
        document.querySelector("#store")?.classList.add('is-checked')
      }
      else if (this.informacionPersonalForm.valid && this.informacionContactoForm.valid) {
        document.querySelector("#basic")?.classList.remove('is-dropdown-show')
        document.querySelector("#basic")?.classList.add('is-checked')
        document.querySelector("#contact")?.classList.remove('is-dropdown-show')
        document.querySelector("#contact")?.classList.add('is-checked')
        document.querySelector("#store")?.classList.add('is-dropdown-show')
      } else if (this.informacionPersonalForm.valid) {
        document.querySelector("#basic")?.classList.remove('is-dropdown-show')
        document.querySelector("#basic")?.classList.add('is-checked')
        document.querySelector("#contact")?.classList.add('is-dropdown-show')
      }

      this.initFormClasification()
      this.getAddressNomenclatura()
    }, 200);
  }

  async getGeolocation() {
    await this.geolocation.getCurrentPosition().then((resp: any) => {
      this.latLocated = resp.coords.latitude;
      this.longLocated = resp.coords.longitude;
    }).catch((error: any) => {
      console.log("Error al obtener la ubicación: ", error);
    });
  }

  async showLoader() {
    this.loaderElement = await this.loadingCtrl.create({
      spinner: 'lines',
      showBackdrop: false,
      cssClass: 'o-loader'
    });
    this.loaderElement.present();
  }

  public async getDocType(e: any) {
    let nit = this.informacionPersonalForm.get('nit')!
    let verificationCode = this.informacionPersonalForm.get('verificationCode')!
    let documentNumber = this.informacionPersonalForm.get('documentNumber')!
    let documentENumber = this.informacionPersonalForm.get('documentExrangerNumber')!

    if (e.target.value === 'C') {
      this.isCcValue = true
      this.isNitValue = false
      this.isCcEValue = false
    } else if (e.target.value === 'N') {
      this.isNitValue = true
      this.isCcValue = false
      this.isCcEValue = false
    } else if (e.target.value === 'CE') {
      this.isNitValue = false
      this.isCcValue = false
      this.isCcEValue = true
    }

    nit.setValue('');
    documentNumber.setValue(''); // Restablece a un valor vacío
    documentENumber.setValue(''); // Restablece a un valor vacío
    verificationCode.setValue('');
  }

  protected getErrorField(controlName: any, form: any) {
    return this.customValidator.getError(controlName, form);
  }

  geocodeAddress() {
    const idAddres: any = document.querySelector("#address");
    let address = ''
    if (idAddres) {
      address = idAddres.value!
    }
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
      const { formatted_address, geometry, address_components } = data.results[0];
      const { lat, lng } = geometry.location;
      // Mostrar el mapa con un pin en la ubicación
      const mapOptions = {
        center: { lat, lng },
        zoom: 16,
      };
      const map = new google.maps.Map(document.getElementById('map')!, mapOptions);

      this.informacionStoreForm.patchValue({
        address: formatted_address,
        neighborhood: address_components[2].long_name ? address_components[2].long_name : '',
        city: address_components[4].long_name ? address_components[4].long_name : ''
      });

      const { address } = this.informacionStoreForm.value
      this.newAddressValue = address
      this.longLocated = lng
      this.latLocated = lat

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

  toggleDropdownDos(e: any) {
    e.target.closest(
      '.o-checkout__dropdown'
    ).classList.toggle('is-dropdown-show');
  }



}


