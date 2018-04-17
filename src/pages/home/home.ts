import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import moment, * as moments from 'moment'
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
    this.modalController = mdController;
    this.navController = navCtrl;
    this.mydatabase = this.database;
    this.navParams = navPrms;
    this.rutesRef = this.database.list('rutas');
    this.rutes = this.rutesRef.snapshotChanges()
                  .map(changes => {
                    return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
                  });
  }

  ionViewDidLoad() {
    if (window.localStorage.getItem('uid') == null) {
      this.navController.push('LoginPage');
    }
  }

  createrute(){
    this.modalController.create('FormRutePage').present();
  }

  showrute( rute ) {
    this.modalController.create('ModalInfoPage', {rute}).present();
  }

  removerute( rute ){
    this.rutesRef.remove( rute.key );
  }
}
