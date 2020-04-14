import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';
// GLOBALS
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from '@ionic/storage';
import { SQLite } from '@ionic-native/sqlite';
import { Network } from '@ionic-native/network';
// PAGES
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { listachecklistPage } from '../pages/listachecklist/listachecklist';
import { LlenarTodoPage } from '../pages/llenartodo/llenartodo';
import { Checklist1Page } from '../pages/checklist_1/checklist1';
// SERVICES
import { DataService } from '../servicios/DataService';
import { ThinxsysFramework } from '../servicios/ThinxsysFramework';
import { TraerTodoService } from '../servicios/TraerTodoService';
import { ConnectivityService } from '../servicios/Connection';
// SERVICES TABLAS
import { param_personal } from '../servicios_tablas/param_personal';
import { chk_checklist } from '../servicios_tablas/chk_checklist';
import { chk_item } from '../servicios_tablas/chk_item';
import { chk_pregunta } from '../servicios_tablas/chk_pregunta';
import { app_puntos_control } from '../servicios_tablas/app_puntos_control';
import { chk_checklist_categoria } from '../servicios_tablas/chk_checklist_categoria';
import { param_seleccion_multiple } from '../servicios_tablas/param_seleccion_multiple';
import { param_seleccion_multiple_detalle } from '../servicios_tablas/param_seleccion_multiple_det';


@NgModule({
    declarations: [
        MyApp,
        // PAGES
        HomePage,
        LoginPage,
        listachecklistPage,
        LlenarTodoPage,
        Checklist1Page
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        IonicModule.forRoot(MyApp),
        IonicStorageModule.forRoot({
            name: '_bdinventario',
            driverOrder: ['indexeddb', 'sqlite', 'websql']
        })
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        // PAGES
        HomePage,
        listachecklistPage,
        LoginPage,
        LlenarTodoPage,
        Checklist1Page
    ],
    providers: [
        // GLOBAL
        StatusBar,
        SplashScreen,
        SQLite,
        Network,
        // SERVICIOS
        DataService,
        ThinxsysFramework,
        TraerTodoService,
        ConnectivityService,
        // SERVICIOS TABLAS
        param_personal,
        chk_checklist,
        chk_item,
        chk_pregunta,
        app_puntos_control,
        chk_checklist_categoria,
        param_seleccion_multiple_detalle,
        param_seleccion_multiple,
        { provide: ErrorHandler, useClass: IonicErrorHandler }
    ]
})
export class AppModule { }
