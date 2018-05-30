import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { GooglePlus } from '@ionic-native/google-plus';

import firebase from 'firebase';
import { ChatProvider } from '../providers/chat/chat';
import { LoginProvider } from '../providers/login/login';

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
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  declarations: [
    MyApp
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    AngularFireDatabase,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GooglePlus,
    ChatProvider,
    LoginProvider
  ]
})
export class AppModule {}
