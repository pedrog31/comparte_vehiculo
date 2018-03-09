import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GooglePlus } from '@ionic-native/google-plus';
import firebase from 'firebase';
import {Platform} from 'ionic-angular';

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
  myPlatform: String;
  constructor(public platform:Platform, public navCtrl: NavController, public navParams: NavParams, private googlePlus: GooglePlus) {
    if (this.platform.is('core')) {
      this.myPlatform = 'browser';
      console.log('I am on a web browser');
    } else {
      this.navController = navCtrl;
        firebase.auth().onAuthStateChanged( user => {
        if (user){
          this.userProfile = user;
        } else {
            this.userProfile = null;
        }
      });
    }
  }

  loginUser(): void {
    if (this.myPlatform === 'browser') {
      console.log('all good');
    }else {
      this.googlePlus.login({
        'webClientId': '1044703059985-5c10tns57kkase42091f206humip77cn.apps.googleusercontent.com',
        'offline': false
      }).then( res => {
            const googleCredential = firebase.auth.GoogleAuthProvider
                .credential(res.idToken);

            firebase.auth().signInWithCredential(googleCredential)
          .then( response => {
              this.navController.push('HomePage', {
                  userProfile: this.userProfile
              });
          })
        .catch(err =>
          console.error(err));
      })
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

}
