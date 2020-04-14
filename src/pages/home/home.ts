import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
// SERVICIOS
import { ThinxsysFramework } from "../../servicios/ThinxsysFramework";
import { DataService } from "../../servicios/DataService";
import { TraerTodoService } from "../../servicios/TraerTodoService";

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    public obj_usuario: any;
    public showloader = false; 

    constructor(public navCtrl: NavController, public dataservice: DataService, public thxframework: ThinxsysFramework, public traertodo: TraerTodoService) {

    }
}


