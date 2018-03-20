import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GooglePlus } from '@ionic-native/google-plus';
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

  constructor(public navCtrl: NavController, public navParams: NavParams, private googlePlus: GooglePlus) {
      this.navController = navCtrl;
        firebase.auth().onAuthStateChanged( user => {
        if (user){
          this.userProfile = user;
        } else {
            this.userProfile = null;
        }
      });
  }

  loginUser(): void {
    this.googlePlus.login({
      'webClientId': '1044703059985-5c10tns57kkase42091f206humip77cn.apps.googleusercontent.com',
      'offline': false
    }).then( res => {
          window.localStorage.setItem('name', res.displayName);
          window.localStorage.setItem('email', res.email);
          const googleCredential = firebase.auth.GoogleAuthProvider
              .credential(res.idToken);

          firebase.auth().signInWithCredential(googleCredential)
              .then( response => {
                this.navController.push('HomePage');
                window.localStorage.setItem('uid', response.uid);
        })
      .catch(err =>
        console.error(err));
    }).catch(err =>
      console.error(err));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

}
