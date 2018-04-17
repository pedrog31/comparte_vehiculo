import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { GooglePlus } from '@ionic-native/google-plus';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebaseAuth from 'firebase/app';
import firebase from 'firebase';
import { AuthService, SocialUser } from "angular4-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angular4-social-login";


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
  angularFireAuth: AngularFireAuth;
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
          window.localStorage.setItem('foto', res.user.uid);
          this.navController.push('HomePage');
        });
    } else {
      this.googlePlus.login({
        'webClientId': '118760255717-b6f012ri2n40nnsffur0lggogglfan6t.apps.googleusercontent.com',
        'offline': false
      }).then( res => {
          window.localStorage.setItem('name', res.displayName);
          window.localStorage.setItem('email', res.email);
          const googleCredential = firebase.auth.GoogleAuthProvider
              .credential(res.idToken);

          firebase.auth().signInWithCredential(googleCredential)
              .then( response => {
                this.navController.push('HomePage');
                window.localStorage.setItem('uid', response.uid);})
                window.localStorage.setItem('foto', res.user.uid);
          })
        .catch(err => {
          console.error(err);
        })
    }
  }
}
