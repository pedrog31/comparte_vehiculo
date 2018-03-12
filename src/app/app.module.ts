import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, IonicPageModule } from 'ionic-angular';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { GooglePlus } from '@ionic-native/google-plus';

import firebase from 'firebase';

export const firebaseConfig = {
  apiKey: "AIzaSyCZFCsFiZ3IHDWNsYd1XOLNrn6RR-0tAAU",
    authDomain: "comparte-vehiculo.firebaseapp.com",
    databaseURL: "https://comparte-vehiculo.firebaseio.com",
    projectId: "comparte-vehiculo",
    storageBucket: "comparte-vehiculo.appspot.com",
    messagingSenderId: "1044703059985"
};
firebase.initializeApp(firebaseConfig);

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig,'demo104'),
    AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    SplashScreen,
    StatusBar,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GooglePlus
  ]
})
export class AppModule {}
