import { Injectable } from "@angular/core";
import { ToastController, LoadingController } from "ionic-angular";
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';

@Injectable()

export class ThinxsysFramework {
    constructor(public toastCtrl: ToastController, public loadingCtrl: LoadingController, public http: HttpClient, private storage: Storage) {

    }

    // VALIDA SI UN CORREO ES CORRECTO
    ValidaMail(search: string): boolean {
        // RETORNA TRUE O FALSE
        var serchfind: boolean;
        var regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        serchfind = regexp.test(search);
        return serchfind
    }

    // ALERTS BONITOS
    Mensaje(mensaje, tiempo) {
        let toast = this.toastCtrl.create({
            message: mensaje,
            duration: tiempo,
            position: 'bottom',
            showCloseButton: true
        });
        toast.present();
    }

    // ESTOS ES COMO LAS VARIABLES DE SESSION, PUEDES GUARDAR CUALQUIER COSA
    // SET
    setGlobalVar(nombre, objeto) {
        return new Promise(resolve => {
            this.storage.set(nombre, objeto).then((val) => {
                resolve(true);
            });
        });

    }
    // GET
    getGlobalVar(nombre): any {
        return new Promise(resolve => {
            this.storage.get(nombre).then((val) => {
                resolve(val);
            });
        });
    }

    // ************************ MAPAS **************************************
    // FUNCIONA CUANDO SON STRING EJ: (1234, -1234)
    GET_LATLON(x) {
        var split_pro = x;
        split_pro = split_pro.replace("(", "");
        split_pro = split_pro.replace(")", "");
        split_pro = split_pro.split(",");
        var lat = split_pro[0];
        var lng = split_pro[1];
        return [lat, lng]
    }
    GET_LAT(x) {
        var split_pro = x;
        split_pro = split_pro.replace("(", "");
        split_pro = split_pro.replace(")", "");
        split_pro = split_pro.split(",");
        var lat = split_pro[0];
        return lat
    }
    GET_LON(x) {
        var split_pro = x;
        split_pro = split_pro.replace("(", "");
        split_pro = split_pro.replace(")", "");
        split_pro = split_pro.split(",");
        var lng = split_pro[1];
        return lng
    }
    // OBTIENE LOS KM DE DISTANCIA EJ: 2,07 km
    GET_KM(_lon1, _lat1, _lon2, _lat2) {
        var lon1 = this.toRadian(_lon1),
            lat1 = this.toRadian(_lat1),
            lon2 = this.toRadian(_lon2),
            lat2 = this.toRadian(_lat2);
        var deltaLat = lat2 - lat1;
        var deltaLon = lon2 - lon1;
        var a = Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLon / 2), 2);
        var c = 2 * Math.asin(Math.sqrt(a));
        var EARTH_RADIUS = 6371;
        var X = parseInt((c * EARTH_RADIUS * 1000).toString());
        return (X / 1000).toString().replace(".", ",");
    }
    toRadian(degree) {
        return degree * Math.PI / 180;
    }

    // GENERA UN ID UNICO
    newGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }



}
