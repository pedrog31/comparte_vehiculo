import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController} from 'ionic-angular';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { GooglePlus } from '@ionic-native/google-plus';
import firebase from 'firebase';
import moment from 'moment-timezone';
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
    googlePlus: GooglePlus;
    mUserEmail: String;

  constructor(
    public navCtrl: NavController,
    public navPrms: NavParams,
    public alertCtrl: AlertController,
    public database: AngularFireDatabase,
    public mdController: ModalController,
    public gp: GooglePlus,
  ) {
        this.mUserEmail = window.localStorage.getItem("email");
        this.googlePlus = gp;
        this.rutesRef = this.database.list('rutas',
            ref => ref.orderByChild('timestamp').startAt(moment().valueOf() - 1.8e+6));
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

  sigOut() {
    let sigOut = this.alertCtrl.create({
      title: 'Cerrar sesión',
      message: "Estas seguro que deseas cerrar la sesión de " + this.mUserEmail + "?",
      buttons: [
        {
          text: 'Aceptar',
          handler: data => {
              firebase.auth().signOut().then(msg=> {
                  window.localStorage.removeItem('name');
                  window.localStorage.removeItem('email');
                  window.localStorage.removeItem('foto');
                  window.localStorage.removeItem('uid');
                  this.googlePlus.logout().then(msg => {
                      this.navCtrl.push("LoginPage");
                  })
              }, function(error) {
                  console.log(error.message);
              });
          }
        },
        {
          text: 'Cancelar'
        }
      ]
    });
    sigOut.present( sigOut );
  }

  showProfile() {
    this.navController.push('ProfilePage');
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
