import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  urlFoto: String;
  name: String;
  profile: Observable<any>;
  navController : NavController;
  rutescRef: AngularFireList<any>;
  //rutesc: FirebaseListObservable<TaskTemplate[]>;
  rutesvRef: AngularFireList<any>;
  //rutesv: FirebaseListObservable<TaskTemplate[]>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public database: AngularFireDatabase) {
    this.urlFoto = window.localStorage.getItem('foto');
    this.name = window.localStorage.getItem('name');
    this.navController = navCtrl;
    this.rutescRef = this.database.list('rutas', ref => ref.orderByChild('uid').equalTo(window.localStorage.getItem('uid')));
  }

  ionViewDidLoad() {
    if (window.localStorage.getItem('uid') == null) {
      this.navController.push('LoginPage');
    }
    /*this.rutesc = this.rutescRef.snapshotChanges()
                  .map(changes => {
                    return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
                  });*/
  }

  sigout(){
    this.navController.push('LoginPage');
  }

}
