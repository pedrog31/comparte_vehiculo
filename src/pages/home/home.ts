import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  rutesRef: AngularFireList<any>;
  rutes: Observable<any[]>;
  navParams: NavParams;
  navController: NavController;
  mydatabase: AngularFireDatabase;
  modalController: ModalController;

  constructor(
    public navCtrl: NavController,
    public navPrms: NavParams,
    public alertCtrl: AlertController,
    public database: AngularFireDatabase,
    public mdController: ModalController
  ) {
    this.rutesRef = this.database.list('rutas');
    this.modalController = mdController;
    this.navController = navCtrl;
    this.mydatabase = this.database;
    this.navParams = navPrms;
  }

  ionViewDidLoad() {
    if (window.localStorage.getItem('uid') == null) {
      this.navController.push('LoginPage');
    }
    this.rutes = this.rutesRef.snapshotChanges()
                  .map(changes => {
                    return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
                  });
  }

  createrute(){
    this.modalController.create('FormRutePage').present();
    //https://maps.googleapis.com/maps/api/place/autocomplete/json?key=AIzaSyCoj-stUyp8r9gPi6MZN7YyHGnT-eCpx3Q&input=sabaneta&components=country:co
    //https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=bogota&destinations=medellin&key=4bda60ef9d7c7ace61e3c129f00f6ee4f44ad6ef
  }

  showrute( rute ) {
    this.modalController.create('ModalInfoPage', {rute}).present();
  }

  removerute( rute ){
    this.rutesRef.remove( rute.key );
  }
}
