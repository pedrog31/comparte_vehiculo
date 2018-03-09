import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  rutesRef: AngularFireList<any>;
  rutes: Observable<any[]>;
  navParams: NavParams;
  mydatabase: AngularFireDatabase;

  constructor(
    public navCtrl: NavController,
    public navPrms: NavParams,
    public alertCtrl: AlertController,
    public database: AngularFireDatabase
  ) {
    this.mydatabase = this.database;
    this.navParams = navPrms;
    this.rutesRef = this.database.list('rutas');
    this.rutes = this.rutesRef.snapshotChanges()
    .map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });
  }

  createrute(){
    let newruteModal = this.alertCtrl.create({
      title: 'Nueva ruta',
      message: "Gracias por contribuir con el medio ambiente, agrega los datos de la ruta",
      inputs: [
        {
          name: 'nombre',
          placeholder: 'Nombre'
        },
        {
          name: 'inicio',
          placeholder: 'Desde:'
        },
        {
          name: 'destino',
          placeholder: 'Hasta:'
        },
        {
          name: 'tipoVehiculo',
          placeholder: 'Tipo de vehiculo:'
        },
        {
          name: 'capacidad',
          placeholder: 'capacidad:'
        },
        {
          name: 'fecha',
          placeholder: 'Fecha (dia del mes):'
        },
        {
          name: 'hora',
          placeholder: 'Hora de salida:'
        },
        {
          name: 'descripcion',
          placeholder: 'Descripcion... punto de encuentro:'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Guardar',
          handler: data => {
            this.rutesRef.push({
              nombre: data.nombre,
              inicio: data.inicio,
              destino: data.destino,
              tipoVehiculo: data.tipoVehiculo,
              capacidad: data.capacidad,
              fecha: data.fecha,
              hora: data.hora,
              descripcion: data.descripcion,
            });
          }
        }
      ]
    });
    newruteModal.present( newruteModal );
  }

  showrute( rute ) {
    let newruteModal = this.alertCtrl.create({
      title: 'Informacion de la ruta',
      message: "Nombre: " + rute.nombre + "\nInicio: " + rute.inicio + "\nDestino: " + rute.destino + "\nTipo de vehiculo: " + rute.tipoVehiculo +
      "\nCapacidad: " + rute.capacidad + "\nFecha: " + rute.fecha + "\nHora: " + rute.hora + "\nDescripcion: " + rute.descripcion,
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Me sirve esta ruta',
          handler: data => {
            this.addPassenger(rute);
          }
        }
      ]
    });
    newruteModal.present( newruteModal );
  }

  addPassenger(rute) {
    let newPassengerModal = this.alertCtrl.create({
      title: 'Nueva ruta',
      message: "Gracias por contribuir con el medio ambiente, presiona Aceptar para guardar y recuerda estar en el punto de encuentro",
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Aceptar',
          handler: data => {
            let userdata = this.mydatabase.database.ref('/rutas/' + rute.key + '/pasajeros');
            this.rutesRef.update( rute.key,{
              capacidad: rute.capacidad--,
            });
            userdata.push({
              nombre: "data.nombre",
              correo: "data.correo"
            });
          }
        }
      ]
    });
    newPassengerModal.present( newPassengerModal );
  }

  updaterute( rute ){
    this.rutesRef.update( rute.key,{
      inicio: rute.inicio,
      destino: rute.destino,
      tipoVehiculo: rute.tipoVehiculo,
      capacidad: rute.capacidad,
      fecha: rute.fecha,
      descripcion: rute.descripcion,
    });
  }

  removerute( rute ){
    console.log( rute );
    this.rutesRef.remove( rute.key );
  }
}
