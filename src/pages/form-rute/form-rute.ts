import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import moment from 'moment';

/**
 * Generated class for the FormRutePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-form-rute',
  templateUrl: 'form-rute.html',
})
export class FormRutePage {
    navController: NavController;
    authForm: FormGroup;
    mydatabase: AngularFireDatabase;
    rutesRef: AngularFireList<any>;
    fechaValue: Date;
    capacidadValue: number;

    constructor(public nav: NavController, public navParams: NavParams, public formBuilder: FormBuilder, public database: AngularFireDatabase, public alertCtrl: AlertController,) {

        this.navController = nav;
        this.mydatabase = this.database;
        this.rutesRef = this.database.list('rutas');

        this.authForm = formBuilder.group({
            inicioRuta: ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(30)])],
            finalRuta: ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(30)])],
            tipoVehiculo: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(10)])],
            capacidad: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(1)])],
            fecha: ['', Validators.compose([Validators.required])],
            descripcion: ['']
        });
    }

    ionViewDidLoad() {
      if (window.localStorage.getItem('uid') == null) {
        this.navController.push('LoginPage');
      }
    }

    onSubmit(data: any): void {
        if(this.authForm.valid) {
          this.rutesRef.push({
            uid: window.localStorage.getItem('uid'),
            nombre: window.localStorage.getItem('name'),
            email: window.localStorage.getItem('email'),
            inicio: data.inicioRuta,
            destino: data.finalRuta,
            tipoVehiculo: data.tipoVehiculo,
            capacidad: parseInt(data.capacidad),
            fecha: moment(data.fecha).locale('es').format('ddd DD[ de ]MMM'),
            hora: moment(data.fecha).locale('es').format('hh:mm a'),
            descripcion: data.descripcion,
            numeroPasajeros:0
          }).then((item) => {
            let newruteModal = this.alertCtrl.create({
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
