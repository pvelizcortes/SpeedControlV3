import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
// SERVICIOS
import { ThinxsysFramework } from "../../servicios/ThinxsysFramework";
import { DataService } from "../../servicios/DataService";
import { param_personal } from '../../servicios_tablas/param_personal';
// PAGES
import { LlenarTodoPage } from '../llenartodo/llenartodo';


@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {
    public showloader = false;
    constructor(public navCtrl: NavController, public menu: MenuController, public personal_service: param_personal, public thxframework: ThinxsysFramework, public dataservice: DataService) {
        this.menu.swipeEnable(false);
    }
    // VARIABLES
    public usuario = {
        usuario: null,
        clave: null
    }
    public data_usuario: any;

    Login() {
        this.showloader = true;
        this.personal_service.LOGIN(this.usuario).then(_ => (this.Login_R(_)));
    }

    Login_R(resp_servidor) {
        try {
            if (resp_servidor.ok) {
                this.data_usuario = resp_servidor.objeto_;
                this.dataservice.sql_command('INSERT INTO USUARIO VALUES (?)', [JSON.stringify(resp_servidor.objeto_[0])])
                    .then(x => {
                        this.thxframework.setGlobalVar('objlogin', resp_servidor.objeto_[0]).then(x => {
                            this.showloader = false;
                            this.navCtrl.setRoot(LlenarTodoPage);
                        });                       
                    });
            }
            else {
                this.thxframework.Mensaje("usuario o contraseña incorrectos", 2000);
                this.showloader = false;
            }
        }
        catch (x) {
            this.thxframework.Mensaje(x, 2000);
            this.showloader = false;
        }
    }

}
