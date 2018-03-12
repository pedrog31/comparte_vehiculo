import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';

@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class MyApp {
  rootPage = 'LoginPage';

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
  ) {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
    });
  }
}
