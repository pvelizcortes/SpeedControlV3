import { Injectable } from '@angular/core';
import { HttpParams } from "@angular/common/http";
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/toPromise';
import { DataService } from "../servicios/DataService";

@Injectable()
// CAMBIAR AQUI NOMBRE CLASS (1)
export class app_puntos_control {
    constructor(private db: DataService) { }
    // CAMBIAR AQUI EL NOMBRE_TABLA (2) <-------- FIN
    private nombre_tabla: string = "APP_PUNTOS_CONTROL";
    private data_generica: any;

    WS_LISTAR(objeto) {
        let promise = new Promise((resolve, reject) => {
            let params = new HttpParams();
            params = params.append('json', JSON.stringify(objeto));
            this.db.get('LISTAR_' + this.nombre_tabla, params)
                .toPromise()
                .then(
                    res => {
                        this.data_generica = res;
                        resolve(res);
                    }
                )
                .catch(error => {
                    reject(error);
                })
        });
        return promise;
    }

    GET_DATA() {
        return this.data_generica;
    }

    POST_DATA(objeto) {
        let promise = new Promise((resolve) => {
            let params = new HttpParams();
            params = params.append('json', JSON.stringify(objeto));
            console.log(params);
            this.db.get('GUARDAR_' + this.nombre_tabla, params)
                .toPromise()
                .then(
                    res => {
                        resolve(res);
                    }
                );
        });
        return promise;
    }

    DELETE_DATA(objeto) {
        let promise = new Promise((resolve) => {
            let params = new HttpParams();
            params = params.append('json', JSON.stringify(objeto));
            this.db.get('BORRAR_' + this.nombre_tabla, params)
                .toPromise()
                .then(
                    res => {
                        resolve(res);
                    }
                );
        });
        return promise;
    }
}
