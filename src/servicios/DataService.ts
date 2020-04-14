import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/retry'; // don't forget the imports
import 'rxjs/add/operator/toPromise';
import { ThinxsysFramework } from '../servicios/ThinxsysFramework';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';


@Injectable()
export class DataService {
    //baseUrl = 'https://cors-anywhere.herokuapp.com/http://204.93.172.4:8010/service1.asmx/'; // <---------- PARA TESTING WEB
    //baseUrl = 'http://localhost:10056/service1.asmx/'; // <---------- PARA TEST
    baseUrl = 'http://204.93.172.4/WSSPEEDV3/service1.asmx/'; // <---------- PARA PRODUCCION

    db: SQLiteObject = null;

    constructor(private httpClient: HttpClient, private thxframework: ThinxsysFramework, private SQLlite: SQLite) {

    }

    // SET Y GET DE LA BASE DE DATOS
    setDatabase(db: SQLiteObject) {
        if (this.db === null) {
            this.db = db;
        }
    }
    getDatabase() {
        return this.db;
    }

    // EJECUTA QUERIES
    sql_command(sql: string, params?: any[]) {
        return this.db.executeSql(sql, params);
    }

    // CONSULTA A LA BD
    getAll(sql: string, params?: any[]) {
        return this.db.executeSql(sql, params)
            .then(response => {
                return Promise.resolve(response);
            })
            .catch(error => Promise.reject(error));
    }
  
    get<T>(url, params): Observable<T> {      
        return this.httpClient
            .get<T>(this.baseUrl + url, { params })
            .retry(1) // Hace 1 intentos extra. <----- // SI ESTAS DEPURANDO UN WEBSERVICE Y LLEGA 2 VECES AL MISMO WS PUEDE QUE SEA POR ESTO.
            .catch((err: HttpErrorResponse) => {
                if (err.error instanceof Error) {
                    // Error local o de conexión
                    this.thxframework.Mensaje('Ocurrió un error: ' + err.error.message, 3000);
                } else {
                    // Error en el servidor
                    this.thxframework.Mensaje('Problema en el servidor cod(' + err.url + err.headers + ', ' + err.statusText + ' - ' + err.error.message + ', ' + err.message + ')', 10000);
                }
                //default
                return Observable.empty<T>();
            });
    }
}
