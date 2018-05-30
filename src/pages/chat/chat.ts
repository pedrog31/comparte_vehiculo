import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Content } from 'ionic-angular';
import { ChatProvider } from '../../providers/chat/chat';
import firebase from 'firebase';
/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  navController: NavController;
  @ViewChild('content') content: Content;
  rute: any;
  pasajero: any;
  newmessage;
  allmessages = [];
  photoURL;
  uid:String;
  constructor(public navCtrl: NavController, public navParams: NavParams, public chatservice: ChatProvider,
              public events: Events, public zone: NgZone) {
    this.navController = navCtrl;
    this.uid = window.localStorage.getItem('uid');
    this.rute = this.chatservice.rute;
    this.pasajero = this.chatservice.pasajero;
    this.photoURL = firebase.auth().currentUser.photoURL;
    this.scrollto();
    this.events.subscribe('newmessage', () => {
      this.allmessages = [];
      this.zone.run(() => {
        this.allmessages = this.chatservice.buddymessages;
      })
    })
  }

    ionViewDidLoad() {
        if (window.localStorage.getItem('uid') == null) {
            this.navController.push('LoginPage');
        }
    }

  addmessage() {
    this.chatservice.addnewmessage(this.newmessage).then(() => {
      this.content.scrollToBottom();
      this.newmessage = '';
    })
  }

  ionViewDidEnter() {
    this.chatservice.getbuddymessages();
  }

  scrollto() {
    setTimeout(() => {
      this.content.scrollToBottom();
    }, 1000);
  }

}
