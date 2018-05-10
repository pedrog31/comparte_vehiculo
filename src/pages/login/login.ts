import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { GooglePlus } from '@ionic-native/google-plus';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase';


/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  userProfile: any = null;
  navController: NavController;
  platform: Platform;
  googlePlus: GooglePlus;

  constructor(public plt: Platform, public navCtrl: NavController, public navParams: NavParams, public afAuth: AngularFireAuth, public gp: GooglePlus) {
      this.platform = plt;
      this.navController = navCtrl;
      this.googlePlus = gp;
      firebase.auth().onAuthStateChanged( user => {
        if (user){
          this.userProfile = user;
        } else {
            this.userProfile = null;
        }
      });

  }

  loginUser(): void {
    if(this.platform.is('core') || this.platform.is('mobileweb')) {
      this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .then(res => {
          window.localStorage.setItem('name', res.user.displayName);
          window.localStorage.setItem('email', res.user.email);
          window.localStorage.setItem('uid', res.user.uid);
          window.localStorage.setItem('foto', res.user.photoURL);
          this.navController.push('HomePage');
        });
    } else {
      this.googlePlus.login({
        'webClientId': '118760255717-b6f012ri2n40nnsffur0lggogglfan6t.apps.googleusercontent.com',
        'offline': false
      }).then( res => {
          window.localStorage.setItem('name', res.displayName);
          window.localStorage.setItem('email', res.email);
          window.localStorage.setItem('foto', res.imageUrl);
          const googleCredential = firebase.auth.GoogleAuthProvider
              .credential(res.idToken);

          firebase.auth().signInWithCredential(googleCredential)
              .then( response => {
                window.localStorage.setItem('uid', response.uid);
                this.navController.push('HomePage');
          })
        .catch(err => {
          console.error(err);
        });
      });
    }
  }
}
