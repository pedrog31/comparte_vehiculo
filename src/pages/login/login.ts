import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, Platform, ToastController} from 'ionic-angular';
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
  platform: Platform;
  googlePlus: GooglePlus;

  constructor(public toastCtrl: ToastController,
              public alertCtrl: AlertController,
              public plt: Platform,
              public navCtrl: NavController,
              public navParams: NavParams,
              public gp: GooglePlus) {
      this.platform = plt;
      this.navController = navCtrl;
      this.googlePlus = gp;
      this.googlePlus.trySilentLogin({
          'webClientId': '118760255717-b6f012ri2n40nnsffur0lggogglfan6t.apps.googleusercontent.com',
          'offline': true,
      }).then( res => {
          window.localStorage.setItem('name', res.givenName);
          window.localStorage.setItem('email', res.email);
          window.localStorage.setItem('foto', res.imageUrl);
          const googleCredential = firebase.auth.GoogleAuthProvider
              .credential(res.idToken);

          firebase.auth().signInWithCredential(googleCredential)
              .then( response => {
                  window.localStorage.setItem('uid', response.uid);
                  this.navController.push('HomePage');
                  let toast = this.toastCtrl.create({
                      message: 'Bienvenido de nuevo, ' + res.givenName,
                      duration: 3000,
                      position: 'top'
                  });

                  toast.onDidDismiss(() => {
                      console.log('Dismissed toast');
                  });

                  toast.present();
              })
              .catch(err => {
                  alert(JSON.stringify(err));
              });
      });
      firebase.auth().onAuthStateChanged( user => {
        if (user){
          this.userProfile = user;
        } else {
            this.userProfile = null;
        }
      });

  }
  ionViewDidLoad() {
  }
  /*
  loginUser(): void {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
          .then(res => {
            window.localStorage.setItem('name', res.user.displayName);
            window.localStorage.setItem('email', res.user.email);
            window.localStorage.setItem('uid', res.user.uid);
            window.localStorage.setItem('foto', res.user.photoURL);
            this.navController.push('HomePage');
          });
  }*/


  loginUser(): void {
      this.googlePlus.login({
          'webClientId': '118760255717-b6f012ri2n40nnsffur0lggogglfan6t.apps.googleusercontent.com',
          'offline': true
      }).then( res => {
          if (res.email.indexOf("@udea.edu.co") >= 0) {
              firebase.auth().signInWithEmailAndPassword(res.email, "123456")
                  .then( response => {
                      window.localStorage.setItem('name', res.givenName);
                      window.localStorage.setItem('email', res.email);
                      window.localStorage.setItem('foto', res.imageUrl);
                      const googleCredential = firebase.auth.GoogleAuthProvider
                          .credential(res.idToken);

                      firebase.auth().currentUser.linkWithCredential(googleCredential)
                          .then( response => {
                              window.localStorage.setItem('uid', response.uid);
                              this.navController.push('HomePage');
                          })
                          .catch(err => {
                              if (err.code === "auth/provider-already-linked") {
                                  window.localStorage.setItem('uid', response.uid);
                                  this.navController.push('HomePage');
                              }
                          });
                  })
                  .catch(err => {
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
                      let errorAlert = this.alertCtrl.create({
                          title: 'Error',
                          message: "No tienes acceso a esta aplicación, si crees que es un error comunicate al telefono 2191919.",
                          buttons: [
                              {
                                  text: 'Aceptar'
                              }
                          ]
                      });
                      errorAlert.present( errorAlert );
                  });
          }else {
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
              let errorAlert = this.alertCtrl.create({
                  title: 'Error',
                  message: "Debes iniciar sesión con una cuenta institucional de la Universidad de Antioquia",
                  buttons: [
                      {
                          text: 'Aceptar'
                      }
                  ]
              });
              errorAlert.present( errorAlert );
          }
      });
    }
}
