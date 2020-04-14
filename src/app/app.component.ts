import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
// PAGES
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { listachecklistPage } from '../pages/listachecklist/listachecklist';
import { LlenarTodoPage } from '../pages/llenartodo/llenartodo';
// SERVICES
import { DataService } from "../servicios/DataService";
import { ThinxsysFramework } from "../servicios/ThinxsysFramework";

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;
    rootPage: any = LoginPage;
    pages: Array<{ title: string, component: any, icon: string }>;
    public showloader = false;

    public user: any;
    public database: any;

    constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private sqlite: SQLite, public dataservice: DataService, private thxframework: ThinxsysFramework) {
        this.showloader = true;
        this.user = { nombre_usuario: '', nombre_empresa: '' };
        this.initializeApp();
        // used for an example of ngFor and navigation
        this.pages = [
            { title: 'HOME', component: HomePage, icon: 'fa fa-home' },
            { title: 'FORMULARIOS', component: listachecklistPage, icon: 'fa fa-tasks' },
            { title: 'VER SUBIDOS', component: HomePage, icon: 'fa fa-check-square' },
            { title: 'PENDIENTES POR SUBIR', component: HomePage, icon: 'fa fa-eye' },
            { title: 'SUBIR PENDIENTES', component: HomePage, icon: 'fa fa-upload' },
            { title: 'ACTUALIZAR', component: LlenarTodoPage, icon: 'fa fa-sync' },
            { title: 'CERRAR SESIÓN', component: LoginPage, icon: 'fa fa-lock' }
        ];
    }

    initializeApp() {
        this.platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            this.sqlite.create({
                name: 'speedcontrol.db',
                location: 'default'
            })
                .then((tx: SQLiteObject) => {
                    this.dataservice.setDatabase(tx);
                    // USUARIO
                    this.dataservice.sql_command('CREATE TABLE IF NOT EXISTS USUARIO (json)');
                    // CHECKLISTS
                    this.dataservice.sql_command('CREATE TABLE IF NOT EXISTS CHK_CHECKLIST_CATEGORIA (id_categoria, nombre_categoria)');
                    this.dataservice.sql_command('CREATE TABLE IF NOT EXISTS CHK_CHECKLIST (id_checklist, nombre_checklist, cod_checklist, correo_completado, gps, separa_item, item_encabezado, tipo_respuesta, es_publico, id_categoria,nom_categoria)');
                    this.dataservice.sql_command('CREATE TABLE IF NOT EXISTS CHK_ITEM (id_item, id_checklist, nombre_item, cod_item, repite_item, enc_superior, orden)');
                    this.dataservice.sql_command('CREATE TABLE IF NOT EXISTS CHK_PREGUNTA (id_pregunta, id_item, id_checklist, cod_pregunta, nombre_pregunta, tipo_pregunta, requiere_foto, orden,llenatabla,multiple)');
                    // SELECCIONES MULTIPLES Y FILTROS
                    this.dataservice.sql_command('CREATE TABLE IF NOT EXISTS PARAM_SELECCION_MULTIPLE (id, id_empresa, cod_sm, nombre_sm, id_hijo)');
                    this.dataservice.sql_command('CREATE TABLE IF NOT EXISTS PARAM_SELECCION_MULTIPLE_DETALLE (id, id_sm, valor_item, nombre_item, id_padre, permiso_usuario)');
                    this.dataservice.sql_command('CREATE TABLE IF NOT EXISTS FILTRA_SM (id, id_sm1, id_sm2)');
                    this.dataservice.sql_command('CREATE TABLE IF NOT EXISTS FILTRA_SM_DET (id_detalle, id_sm1, id_sm2, id_smdet1, id_smdet2)');
                    // CHECKLIST COMPLETADOS Y RESPUESTAS
                    this.dataservice.sql_command('CREATE TABLE IF NOT EXISTS CHECKLIST_COMPLETADOS (id_checklist_completado, id_empresa, id_checklist, id_usuario, id_pc, gps, fecha_completado, completado)'); // 0 No se completo // 1 Se completo // 2 Se subió
                    this.dataservice.sql_command('CREATE TABLE IF NOT EXISTS CHK_CHECKLIST_RESPUESTA (id_checklist_completado, id_checklist, id_pregunta, respuesta, id_fila)');
                    this.dataservice.sql_command('CREATE TABLE IF NOT EXISTS FOTOS_PREGUNTAS (id_checklist_completado, nombre_foto, id_pregunta, foto)');                 
                    // PUNTO DE CONTROL
                    this.dataservice.sql_command('CREATE TABLE IF NOT EXISTS APP_PUNTOS_CONTROL (id_pc, nombre_pc)');

                    // VER SI HAY USUARIO CREADO
                    this.dataservice.getAll('SELECT * FROM USUARIO')
                        .then(results => {
                            var len = results.rows.length, i;
                            if (len > 0) {
                                for (i = 0; i < len; i++) {
                                    this.thxframework.setGlobalVar('objlogin', JSON.parse(results.rows.item(i).json))
                                        .then(x => {
                                            this.showloader = false;
                                            this.nav.setRoot(HomePage);
                                        })
                                };
                            }
                            else {
                                this.showloader = false;
                            }
                        })
                })
                .catch(e => console.log(e));
        });
    }

    openPage(page) {
        if (page.title == "Cerrar Sesión") {
            this.dataservice.sql_command('DELETE FROM USUARIO').then(x => {
                this.nav.setRoot(LoginPage);
            })
        }
        else {
            this.nav.setRoot(page.component);
        }
    }
}
