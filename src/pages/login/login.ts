import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { GooglePlus } from '@ionic-native/google-plus';
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
  user: SocialUser;
  platform: Platform;
  authService: AuthService;

  constructor(private authS: AuthService, public plt: Platform, public navCtrl: NavController, public navParams: NavParams, private googlePlus: GooglePlus) {
      this.authService = authS;
      this.platform = plt;
      this.navController = navCtrl;
      this.authService.authState.subscribe((user) => {
        this.user = user;
        alert (user)
      });
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
      alert("Browser");
      this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    } else {
      alert("else");
      this.googlePlus.login({
        'webClientId': '400999211901-p8ifa7tc79i7mcok8hdpd1ejcb5s1ek0.apps.googleusercontent.com',
        'offline': false
      }).then( res => {
            this.loginFirebase(res);
          })
        .catch(err =>
          console.error(err));
    }
  }

  loginFirebase( res ): void {
    window.localStorage.setItem('name', res.displayName);
    window.localStorage.setItem('email', res.email);
    const googleCredential = firebase.auth.GoogleAuthProvider
        .credential(res.idToken);

    firebase.auth().signInWithCredential(googleCredential)
        .then( response => {
          this.navController.push('HomePage');
          window.localStorage.setItem('uid', response.uid);})
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
}
