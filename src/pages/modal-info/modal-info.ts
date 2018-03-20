import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, NavParams } from 'ionic-angular';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';

/**
 * Generated class for the ModalInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-info',
  templateUrl: 'modal-info.html',
})
export class ModalInfoPage {
  navController: NavController;
  rute:any;
  owner: boolean;
  primary: boolean;
  mydatabase: AngularFireDatabase;
  pasajeros: Observable<any[]>;
  pasajerosRef: AngularFireList<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public database: AngularFireDatabase) {
    this.navController = navCtrl;
    this.rute = navParams.get('rute');
    this.owner = this.rute.uid == window.localStorage.getItem('uid');
    this.primary = true;
    this.mydatabase = this.database;
  }

  ionViewDidLoad() {
  }

  closeModal () {
    this.navController.pop();
  }

  showPassengers() {
    this.primary = false;
    this.pasajerosRef = this.database.list('/rutas/' + this.rute.key + '/pasajeros');
    this.pasajeros = this.pasajerosRef.snapshotChanges()
                  .map(changes => {
                    return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
                  });
  }

  addNewPassenger() {
    this.primary = false;
    let newPassengerModal = this.alertCtrl.create({
      title: 'Nueva ruta',
      message: "Gracias por contribuir con el medio ambiente, presiona Aceptar para guardar y recuerda estar en el punto de encuentro",
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Aceptar',
          handler: data => {
            let aux: number = this.rute.capacidad - 1;
            this.mydatabase.database.ref('/rutas/' + this.rute.key + '/pasajeros').push({
              nombre: window.localStorage.getItem('name'),
              correo: window.localStorage.getItem('email')
            });
            this.mydatabase.database.ref('/rutas/' + this.rute.key).update({
              capacidad: aux,
            });
          }
        }
      ]
    });
    newPassengerModal.present( newPassengerModal );
  }

}
