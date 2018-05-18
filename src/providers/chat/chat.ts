import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { Events } from 'ionic-angular';

/*
  Generated class for the ChatProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ChatProvider {
  firebuddychats = firebase.database().ref('/chats');
  rute: any;
  pasajero: any;
  buddymessages = [];

  constructor(public events: Events) {
  }

  initializebuddy(rute, pasajero) {
      this.rute = rute;
      this.pasajero = pasajero;
  }

  addnewmessage(msg) {
    var promise;
    if (this.pasajero != null) {
      promise = new Promise((resolve, reject) => {
        this.firebuddychats.child(this.rute.key).child(this.pasajero.key).push({
          sentby: this.rute.uid,
          message: msg,
          timestamp: firebase.database.ServerValue.TIMESTAMP
        }).then(() => resolve(true))
        })
      }else {
        promise = new Promise((resolve, reject) => {
          this.firebuddychats.child(this.rute.key).child(window.localStorage.getItem('uid')).push({
            sentby: window.localStorage.getItem('uid'),
            message: msg,
            timestamp: firebase.database.ServerValue.TIMESTAMP
          }).then(() => resolve(true))
          })
      }
      return promise;
  }

  getbuddymessages() {
    let temp;
    const uid;
    if (this.pasajero!= null)
      uid = this.pasajero.key;
    else
      uid = window.localStorage.getItem('uid');
    this.firebuddychats.child(this.rute.key).child(uid).on('value', (snapshot) => {
      this.buddymessages = [];
      temp = snapshot.val();
      for (var tempkey in temp) {
        this.buddymessages.push(temp[tempkey]);
      }
      this.events.publish('newmessage');
    })
  }

}
