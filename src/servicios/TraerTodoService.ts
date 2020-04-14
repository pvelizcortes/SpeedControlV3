import { Injectable } from '@angular/core';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/retry'; // don't forget the imports
import 'rxjs/add/operator/toPromise';
import { ThinxsysFramework } from '../servicios/ThinxsysFramework';
import { DataService } from "../servicios/DataService";
// SERVICIOS TABLA
import { chk_checklist } from '../servicios_tablas/chk_checklist';
import { chk_item } from '../servicios_tablas/chk_item';
import { chk_pregunta } from '../servicios_tablas/chk_pregunta';
import { app_puntos_control } from '../servicios_tablas/app_puntos_control';
import { chk_checklist_categoria } from '../servicios_tablas/chk_checklist_categoria';
import { param_seleccion_multiple } from '../servicios_tablas/param_seleccion_multiple';
import { param_seleccion_multiple_detalle } from '../servicios_tablas/param_seleccion_multiple_det';


@Injectable()
export class TraerTodoService {
    constructor(private thxframework: ThinxsysFramework, public dataservice: DataService, public chk_checklist: chk_checklist, public chk_item: chk_item, public chk_pregunta: chk_pregunta, public app_puntos_control: app_puntos_control, public chk_checklist_categoria: chk_checklist_categoria, public param_sm: param_seleccion_multiple, public param_sm_det: param_seleccion_multiple_detalle) {

    }
    // LLAMAR A ESTA FUNCION PARA LLENAR TODO LO DEL USUARIO EN SQLLITE.
    TRAE_TODO(usuario, id_empresa) {
        return new Promise(resolve => {
            
        });

    }

    // ****************************************************************************************************************************************
    // ****************************************************************************************************************************************    
    // DESC:      CHECKLISTS
    // WS:        LISTAR_CHK_CHECKLIST
    // SQLLITE:   CHK_CHECKLIST
    TraerChecklists(usuario) {   // IR AL WEBSERVICES
        return this.chk_checklist.WS_LISTAR({ usuario: usuario })
            .then(_ => (this.GuardarChecklists(_)))
            .catch(error => (this.thxframework.Mensaje("No se pudieron obtener los checklists", 3000)))
            ;
    }
    GuardarChecklists(resp_servidor) {  // GUARDAR EN SQLLITE        
        if (resp_servidor.ok) {
            this.dataservice.sql_command('DELETE FROM CHK_CHECKLIST');
            resp_servidor.objeto_.forEach(x => {
                this.dataservice.sql_command('INSERT INTO CHK_CHECKLIST VALUES (?,?,?,?,?,?,?,?,?,?,?)',
                    [x.ID_CHECKLIST, x.NOMBRE_CHECKLIST, x.COD_CHECKLIST, x.correo_completado, x.GPS, x.separa_item, x.item_encabezado, x.tipo_respuesta, x.ES_PUBLICO, x.ID_CATEGORIA, x.NOMBRE_CATEGORIA])
            });
            return Promise.resolve(true);
        }
        else {
            this.thxframework.Mensaje("No se encontraron Checklists", 2000);
            return Promise.resolve(false);
        }
    }
    // ****************************************************************************************************************************************
    // ****************************************************************************************************************************************

    // DESC:      ITEMS
    // WS:        LISTAR_CHK_ITEM
    // SQLLITE:   CHK_ITEM
    TraerItems(usuario) {   // IR AL WEBSERVICES
        return this.chk_item.WS_LISTAR({ usuario: usuario })
            .then(_ => (this.GuardarItems(_)))
            .catch(error => (this.thxframework.Mensaje("No se pudieron obtener los items", 3000)))
            ;
    }
    GuardarItems(resp_servidor) {  // GUARDAR EN SQLLITE
        if (resp_servidor.ok) {
            this.dataservice.sql_command('DELETE FROM CHK_ITEM');
            resp_servidor.objeto_.forEach(x => {
                this.dataservice.sql_command('INSERT INTO CHK_ITEM VALUES (?,?,?,?,?,?,?)',
                    [x.ID_ITEM, x.ID_CHECKLIST, x.NOMBRE_ITEM, x.COD_ITEM, x.repite_item, x.enc_superior, x.orden])
            });
            return Promise.resolve(true);
        }
        else {
            this.thxframework.Mensaje("No se encontraron Items", 2000);
            return Promise.resolve(false);
        }
    }
    // ****************************************************************************************************************************************
    // ****************************************************************************************************************************************  
    // DESC:      PREGUNTAS
    // WS:        LISTAR_CHK_PREGUNTA
    // SQLLITE:   CHK_PREGUNTA
    TraerPreguntas(usuario) {   // IR AL WEBSERVICES
        return this.chk_pregunta.WS_LISTAR({ usuario: usuario })
            .then(_ => (this.GuardarPreguntas(_)))
            .catch(error => (this.thxframework.Mensaje("No se pudieron obtener las preguntas", 3000)))
            ;
    }
    GuardarPreguntas(resp_servidor) {  // GUARDAR EN SQLLITE
        if (resp_servidor.ok) {
            this.dataservice.sql_command('DELETE FROM CHK_PREGUNTA');
            resp_servidor.objeto_.forEach(x => {
                //id_pregunta, id_item, id_checklist, cod_pregunta, nombre_pregunta, tipo_pregunta, requiere_foto, orden, llenatabla, multiple
                this.dataservice.sql_command('INSERT INTO CHK_PREGUNTA VALUES (?,?,?,?,?,?,?,?,?,?)',
                    [x.ID_PREGUNTA, x.ID_ITEM, x.ID_CHECKLIST, x.COD_PREGUNTA, x.NOMBRE_PREGUNTA, x.TIPO_PREGUNTA, x.REQUIERE_FOTO, x.orden, x.llenatabla, x.MULTIPLE])
            });
            return Promise.resolve(true);
        }
        else {
            this.thxframework.Mensaje("No se encontraron Preguntas", 2000);
            return Promise.resolve(false);
        }
    }
    // ****************************************************************************************************************************************
    // ****************************************************************************************************************************************    
    // DESC:      PUNTOS DE CONTROL
    // WS:        LISTAR_APP_PUNTOS_CONTROL
    // SQLLITE:   APP_PUNTOS_CONTROL
    TraerPuntosControl(usuario) {   // IR AL WEBSERVICES
        return this.app_puntos_control.WS_LISTAR({ usuario: usuario })
            .then(_ => (this.GuardarPuntosControl(_)))
            .catch(error => (this.thxframework.Mensaje("No se pudieron obtener los Puntos de Control", 3000)))
            ;
    }
    GuardarPuntosControl(resp_servidor) {  // GUARDAR EN SQLLITE        
        if (resp_servidor.ok) {
            this.dataservice.sql_command('DELETE FROM APP_PUNTOS_CONTROL');
            resp_servidor.objeto_.forEach(x => {
                this.dataservice.sql_command('INSERT INTO APP_PUNTOS_CONTROL VALUES (?,?)',
                    [x.id_pc, x.nombre_pc])
            });
            return Promise.resolve(true);
        }
        else {
            this.thxframework.Mensaje("No se encontraron Puntos de Control", 2000);
            return Promise.resolve(false);
        }
    }
    // ****************************************************************************************************************************************
    // ****************************************************************************************************************************************    
    // DESC:      CATEGORIAS
    // WS:        LISTAR_CHK_CHECKLIST_CATEGORIA
    // SQLLITE:   CHK_CHECKLIST_CATEGORIA
    TraerCategorias(usuario) {   // IR AL WEBSERVICES
        return this.chk_checklist_categoria.WS_LISTAR({ usuario: usuario })
            .then(_ => (this.GuardarCategorias(_)))
            .catch(error => (this.thxframework.Mensaje("No se pudieron obtener las Categorias", 3000)))
            ;
    }
    GuardarCategorias(resp_servidor) {  // GUARDAR EN SQLLITE        
        if (resp_servidor.ok) {
            this.dataservice.sql_command('DELETE FROM CHK_CHECKLIST_CATEGORIA');

            resp_servidor.objeto_.forEach(x => {
                // id_categoria, cod_categoria, nombre_categoria, lista_correo
                this.dataservice.sql_command('INSERT INTO CHK_CHECKLIST_CATEGORIA VALUES (?,?)',
                    [x.ID_CATEGORIA, x.NOMBRE_CATEGORIA])
            });
            return Promise.resolve(true);
        }
        else {
            this.thxframework.Mensaje("No se encontraron las Categorías", 2000);
            return Promise.resolve(false);
        }
    }
    // ****************************************************************************************************************************************
    // ****************************************************************************************************************************************    
    // DESC:      SELECCION MULTIPLE
    // WS:        LISTAR_PARAM_SELECCION_MULTIPLE
    // SQLLITE:   PARAM_SELECCION_MULTIPLE
    TraerSM(id_empresa) {   // IR AL WEBSERVICES
        return this.param_sm.WS_LISTAR({ id_empresa: id_empresa })
            .then(_ => (this.GuardarSM(_)))
            .catch(error => (this.thxframework.Mensaje("No se pudieron obtener las selecciones multiples", 3000)))
            ;
    }
    GuardarSM(resp_servidor) {  // GUARDAR EN SQLLITE        
        if (resp_servidor.ok) {
            this.dataservice.sql_command('DELETE FROM PARAM_SELECCION_MULTIPLE');
            resp_servidor.objeto_.forEach(x => {
                this.dataservice.sql_command('INSERT INTO PARAM_SELECCION_MULTIPLE VALUES (?,?,?,?,?)',
                    [x.id, x.id_empresa, x.cod_sm, x.nombre_sm, x.id_hijo]);

            });
            return Promise.resolve(true);
        }
        else {
            this.thxframework.Mensaje("No se encontraron las selecciones multiples", 2000);
            return Promise.resolve(false);
        }
    }
    // ****************************************************************************************************************************************
    // ****************************************************************************************************************************************    
    // DESC:      SELECCION MULTIPLE DETALLE
    // WS:        LISTAR_PARAM_SELECCION_MULTIPLE_DETALLE
    // SQLLITE:   PARAM_SELECCION_MULTIPLE_DETALLE
    TraerSM_det(id_empresa) {   // IR AL WEBSERVICES
        return this.param_sm_det.WS_LISTAR({ id_empresa: id_empresa })
            .then(_ => (this.GuardarSM_det(_)))
            .catch(error => (this.thxframework.Mensaje("No se pudieron obtener los items de seleccion multiple", 3000)))
            ;
    }
    GuardarSM_det(resp_servidor) {  // GUARDAR EN SQLLTE        
        if (resp_servidor.ok) {
            this.dataservice.sql_command('DELETE FROM PARAM_SELECCION_MULTIPLE_DETALLE');
            resp_servidor.objeto_.forEach(x => {
                // id, id_sm, valor_item, nombre_item, id_padre, permiso_usuario
                this.dataservice.sql_command('INSERT INTO PARAM_SELECCION_MULTIPLE_DETALLE VALUES (?,?,?,?,?,?)',
                    [x.id, x.id_sm, x.valor_item, x.nombre_item, x.id_padre, x.permiso_usuario]);               
            });
            return Promise.resolve(true);
        }
        else {
            this.thxframework.Mensaje("No se encontraron los items de seleccion multiple", 2000);
            return Promise.resolve(false);
        }
    }
}
