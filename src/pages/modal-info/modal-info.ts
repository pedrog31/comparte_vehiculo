import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, NavParams } from 'ionic-angular';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
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
  subscribed: boolean;
  mydatabase: AngularFireDatabase;
  pasajeros: Observable<any[]>;
  pasajerosRef: AngularFireList<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public database: AngularFireDatabase) {
    this.navController = navCtrl;
    this.rute = navParams.get('rute');
    this.owner = this.rute.uid == window.localStorage.getItem('uid');
    if (this.rute.numeroPasajeros > 0)
      this.subscribed = JSON.stringify(this.rute.pasajeros).indexOf(window.localStorage.getItem('uid')) > -1;
    else
      this.subscribed = false;
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

  addNewPassengerInfo() {
    this.primary = false;
  }

  deleteRute() {
    this.mydatabase.database.ref('/rutas/' + this.rute.key).remove().then((item) => {
      alert("Ruta eliminada correctamente");
      this.navController.pop();
    })
  }

  addNewPassenger() {
    let aux: number = this.rute.capacidad - 1;
    let aux2: number = this.rute.numeroPasajeros + 1;
    this.mydatabase.database.ref('/rutas/' + this.rute.key + '/pasajeros/' + window.localStorage.getItem('uid')).update({
      nombre: window.localStorage.getItem('name'),
      correo: window.localStorage.getItem('email'),
      foto: window.localStorage.getItem('foto')
    }).then((item) => {
      this.subscribed = true;
      this.mydatabase.database.ref('/rutas/' + this.rute.key).update({
        capacidad: aux,
        numeroPasajeros: aux2
      });
      this.navController.pop();
    })
  }

}
