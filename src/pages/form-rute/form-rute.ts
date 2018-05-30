import { ViewChild, Component, ElementRef} from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import moment from 'moment-timezone';
import { Observable } from 'rxjs/Observable';

declare var google: any;

/**
 * Generated class for the FormRutePage page.
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-form-rute',
  templateUrl: 'form-rute.html',
})
export class FormRutePage {
    @ViewChild('inicioRuta', { read: ElementRef }) inicioRutaReference: ElementRef;
    inicioRutaElement: HTMLInputElement = null;
    @ViewChild('finalRuta', { read: ElementRef }) finalRutaReference: ElementRef;
    finalRutaElement: HTMLInputElement = null;
    navController: NavController;
    authForm: FormGroup;
    mydatabase: AngularFireDatabase;
    rutesRef: AngularFireList<any>;
    fechaValue: Date;
    capacidadValue: number;
    inicioLatLng: any;
    finalLatLng: any;
    inicioName:string;
    finalName:string;
    distance: number;
    ginit: number;
    glast: number;
    ntree: number;
    mName: string;
    minDate: number;

    constructor(public nav: NavController, public navParams: NavParams, public formBuilder: FormBuilder, public database: AngularFireDatabase, public alertCtrl: AlertController) {
        this.minDate = moment().format('YYYY-MM-DD');
        this.navController = nav;
        this.mydatabase = this.database;
        this.rutesRef = this.database.list('rutas');
        this.mName = window.localStorage.getItem('name');
        this.authForm = formBuilder.group({
            inicioRuta: ['', Validators.compose([Validators.required])],
            finalRuta: ['', Validators.compose([Validators.required])],
            tipoVehiculo: ['', Validators.compose([Validators.required])],
            capacidad: ['', Validators.compose([Validators.required, Validators.min(1)])],
            fecha: ['', Validators.compose([Validators.required])],
            descripcion: ['']
        });
    }

    ionViewDidLoad() {
        if (window.localStorage.getItem('uid') == null) {
            this.navController.push('LoginPage');
        }
      if (!!google) {
          this.initAutocomplete();
        } else {
          alert('Something went wrong with the Internet Connection. Please check your Internet.');
        }
    }

    initAutocomplete(): void {
      // reference : https://github.com/driftyco/ionic/issues/7223
      this.inicioRutaElement = this.inicioRutaReference.nativeElement.querySelector('input');
      this.finalRutaElement = this.finalRutaReference.nativeElement.querySelector("input");
      this.createAutocomplete(this.inicioRutaElement).subscribe((location) => {
        this.inicioLatLng = JSON.parse( JSON.stringify(location.geometry.location ) );
        this.inicioName = location.name;
        if (this.finalName) this.calculateDistance();
      });
      this.createAutocomplete(this.finalRutaElement).subscribe((location) => {
        this.finalLatLng = JSON.parse( JSON.stringify(location.geometry.location ) );
        this.finalName = location.name;
        if (this.inicioName) this.calculateDistance();
      });
    }

    createAutocomplete(addressEl: HTMLInputElement): Observable<any> {
      const mBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(6.08032477, -75.7485947),
        new google.maps.LatLng(6.55396191, -75.04958957));
      const options = {
        componentRestrictions: {country: "co"},
        bounds: mBounds
       };
      const autocomplete = new google.maps.places.Autocomplete(addressEl, options);
      return new Observable((sub: any) => {
        google.maps.event.addListener(autocomplete, 'place_changed', () => {
          const place = autocomplete.getPlace();
          if (!place.geometry) alert("No encontramos este lugar :(")
          else {
            sub.next(place);
          }
        });
      });
    }

    calculateDistance(): void {
      const inicio = new google.maps.LatLng(this.inicioLatLng.lat, this.inicioLatLng.lng);
      const final = new google.maps.LatLng(this.finalLatLng.lat, this.finalLatLng.lng);
      const service = new google.maps.DistanceMatrixService();
      service.getDistanceMatrix(
      {
        origins: [inicio],
        destinations: [final],
        travelMode: 'DRIVING'
      }, (response:any, status:any) => {
        if (status === "OK") {
          this.distance = response.rows[0].elements[0].distance.value;
          this.calculateCO2();
        }else this.distance = -1;
      });
    }

    calculateCO2(): void {
      this.distance = this.distance/1000;
      this.ginit = this.distance * 61,95468136;
      this.glast = this.distance * 189,8699521 * 4;
      this.ntree = (this.ginit + this.glast)/2 /27,37850787;
    }

    onSubmit(data: any): void {
        if(this.authForm.valid) {
            let completeDate = data.fecha.split('T');
            let date = completeDate[0].split('-');
            let hour = completeDate[1].split(':');
            let momentTimestamp = moment(date[0] + "-" + date[1] + "-" + date[2] + " " + hour[0] + ":" + hour[1],"YYYY-MM-DD HH:mm").valueOf();
            let newruteModal;
            console.log(momentTimestamp);
            console.log(moment().valueOf());
            if (momentTimestamp > moment().valueOf()) {
                this.rutesRef.push({
                    uid: window.localStorage.getItem('uid'),
                    nombre: window.localStorage.getItem('name'),
                    email: window.localStorage.getItem('email'),
                    inicio: this.inicioName,
                    inicioLatLng: this.inicioLatLng,
                    finalLatLng: this.finalLatLng,
                    destino: this.finalName,
                    tipoVehiculo: data.tipoVehiculo,
                    capacidad: parseInt(data.capacidad),
                    timestamp: momentTimestamp,
                    descripcion: data.descripcion,
                    numeroPasajeros:0,
                    foto: window.localStorage.getItem('foto'),
                    kilometros: this.distance
                }).then((item) => {
                    newruteModal = this.alertCtrl.create({
                        title: 'Nueva ruta',
                        message: "Los datos de la ruta fueron guardados correctamente.",
                        buttons: [
                            {
                                text: 'Aceptar',
                                handler: data => {
                                    this.nav.push('HomePage');
                                }
                            }
                        ]
                    });
                    newruteModal.present( newruteModal );
                })
            }else {
                newruteModal = this.alertCtrl.create({
                    title: 'Error',
                    message: "La fecha de viaje no puede ser anterior a la fecha actual.",
                    buttons: [
                        {
                            text: 'Aceptar'
                        },
                        {
                            text: 'Cancelar',
                            handler: data => {
                                this.nav.push('HomePage');
                            }
                        }
                    ]
                });
                newruteModal.present( newruteModal );
            }
        }
      }

      closeModal () {
        this.navController.pop();
      }

      onSelectChange(selectedValue: String) {
        if (selectedValue === "Carro") {
          this.capacidadValue = 4;
        }else {
          this.capacidadValue = 1;
        }
      }
  }
