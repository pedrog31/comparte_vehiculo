import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, IonicPageModule } from 'ionic-angular';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { GooglePlus } from '@ionic-native/google-plus';

import firebase from 'firebase';

export const firebaseConfig = {
    apiKey: "AIzaSyCnaI6yDjH0lbS5ZXqKDz4d4D1bIf0GRdk",
    authDomain: "udea-comparte-vehiculo.firebaseapp.com",
    databaseURL: "https://udea-comparte-vehiculo.firebaseio.com",
    projectId: "udea-comparte-vehiculo",
    storageBucket: "",
    messagingSenderId: "118760255717"
};
firebase.initializeApp(firebaseConfig);

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    SplashScreen,
    StatusBar,
    AngularFireDatabase,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GooglePlus
  ]
})
export class AppModule {}
