import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';

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

    constructor(public nav: NavController, public navParams: NavParams, public formBuilder: FormBuilder, public database: AngularFireDatabase, public alertCtrl: AlertController,) {

        this.navController = nav;
        this.mydatabase = this.database;
        this.rutesRef = this.database.list('rutas');

        this.authForm = formBuilder.group({
            inicioRuta: ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(30)])],
            finalRuta: ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(30)])],
            tipoVehiculo: ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(30)])],
            capacidad: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(1)])],
            fecha: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(2)])],
            hora: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(10)])],
            descripcion: ['']
        });
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
            fecha: data.fecha,
            hora: data.hora,
            descripcion: data.descripcion,
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
  }
