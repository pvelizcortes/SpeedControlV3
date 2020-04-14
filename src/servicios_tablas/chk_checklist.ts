import { Injectable } from '@angular/core';
import { HttpParams } from "@angular/common/http";
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/toPromise';
import { DataService } from "../servicios/DataService";
//
import { CHK_RESPUESTA_FINAL_obj } from "../objetos/CHK_RESPUESTA_FINAL";

@Injectable()
// CAMBIAR AQUI NOMBRE CLASS (1)
export class chk_checklist {
    constructor(private db: DataService) { }
    // CAMBIAR AQUI EL NOMBRE_TABLA (2) <-------- FIN
    private nombre_tabla: string = "CHK_CHECKLIST";
    private data_generica: any;

    BuscarRespuesta(id_checklist_completado:string, id_pregunta:number) {
        return new Promise(resolve => {      
            this.db.getAll("SELECT * FROM CHK_CHECKLIST_RESPUESTA WHERE id_checklist_completado = ? and id_pregunta = ?", [id_checklist_completado,id_pregunta])
                .then(results => { 
                    var len = results.rows.length, i;
                    if (len > 0) {                     
                        for (i = 0; i < len; i++) { 
                               resolve(results.rows.item(i).respuesta)                      
                        }                       
                    }
                    else {
                        resolve(null);
                    }
                })
        });
    }

    InsertarRespuesta(obj_checklist: CHK_RESPUESTA_FINAL_obj, id_pregunta, respuesta) {
        return new Promise((resolve, reject) => {
            this.db.getAll("SELECT * FROM CHK_CHECKLIST_RESPUESTA WHERE id_checklist_completado = ? and id_pregunta = ?", [obj_checklist.ID_CHECKLIST_COMPLETADO,id_pregunta])
            .then(results => { 
                var len = results.rows.length, i;
                if (len > 0) {                     
                                        // id_checklist_completado, id_checklist, id_pregunta, respuesta, id_fila
                            this.db.sql_command('UPDATE CHK_CHECKLIST_RESPUESTA SET respuesta = ? WHERE id_checklist_completado = ? and id_pregunta = ?',
                            [respuesta, obj_checklist.ID_CHECKLIST_COMPLETADO, id_pregunta]).then(x => {
                                resolve(true);
                            }).catch(error => {
                                reject(error);                   
                            });              
                }
                else {
                                // INSERT
                                    // id_checklist_completado, id_checklist, id_pregunta, respuesta, id_fila
                            this.db.sql_command('INSERT INTO CHK_CHECKLIST_RESPUESTA VALUES (?,?,?,?,?)',
                            [obj_checklist.ID_CHECKLIST_COMPLETADO, obj_checklist.ID_CHECKLIST, id_pregunta, respuesta, -1]).then(x => {
                                resolve(true);
                            }).catch(error => {
                                reject(error);                   
                            });
                }
            })           
        });
    }

    ListarPuntosControl(): any {
        return new Promise(resolve => {
            this.db.getAll('SELECT * FROM APP_PUNTOS_CONTROL order by nombre_pc ', [])
                .then(results => {
                    var len = results.rows.length, i;
                    if (len > 0) {
                        let array_pc = [];
                        for (i = 0; i < len; i++) {
                            // AGREGA AL ARRAY DE PREGUNTAS                        
                            array_pc.push({
                                id_pc: results.rows.item(i).id_pc
                                , nombre_pc: results.rows.item(i).nombre_pc
                            })
                        }
                        resolve(array_pc);;
                    }
                    else {
                        resolve(null);
                    }
                })
        });
    }

    ListarItems(id_checklist): any {
        return new Promise(resolve => {
            this.db.getAll('SELECT * FROM CHK_ITEM WHERE id_checklist = ? order by orden ', [id_checklist])
                .then(results_item => {
                    var len_item = results_item.rows.length, cont_item;
                    if (len_item > 0) {
                        let array_items = [];
                        for (cont_item = 0; cont_item < len_item; cont_item++) {
                            let aux_cont_item = cont_item;
                            // AGREGA AL ARRAY DE PREGUNTAS   
                            this.db.getAll('SELECT * FROM CHK_PREGUNTA WHERE id_item = ? order by orden', [results_item.rows.item(cont_item).id_item])
                                .then(results_preg => {
                                    var len_preg = results_preg.rows.length, cont_preg;
                                    if (len_preg > 0) {
                                        let array_pregunta = [];
                                        for (cont_preg = 0; cont_preg < len_preg; cont_preg++) {
                                            // AGREGA AL ARRAY DE PREGUNTAS
                                            array_pregunta.push({
                                                id_pregunta: results_preg.rows.item(cont_preg).id_pregunta
                                                , nombre_pregunta: results_preg.rows.item(cont_preg).nombre_pregunta
                                                , id_item: results_preg.rows.item(cont_preg).id_item
                                                , tipo_pregunta: results_preg.rows.item(cont_preg).tipo_pregunta
                                                , requiere_foto: results_preg.rows.item(cont_preg).requiere_foto
                                                , orden: results_preg.rows.item(cont_preg).orden
                                                , llena_tabla: results_preg.rows.item(cont_preg).llena_tabla
                                                , multiple: results_preg.rows.item(cont_preg).multiple
                                                , html_pregunta: ''
                                            })
                                        }
                                        // AGREGA AL ARRAY DE ITEMS                  
                                        array_items.push({
                                            id_item: results_item.rows.item(aux_cont_item).id_item
                                            , nombre_item: results_item.rows.item(aux_cont_item).nombre_item
                                            , repite_item: results_item.rows.item(aux_cont_item).repite_item
                                            , enc_superior: results_item.rows.item(aux_cont_item).enc_superior
                                            , orden: results_item.rows.item(aux_cont_item).orden
                                            , arreglo_pro_pregunta: array_pregunta
                                            , num_preguntas: array_pregunta.length
                                        })
                                    }
                                })
                        }
                        resolve(array_items);
                    }
                })
        });
    }

    LlenarSM(param_pregunta): any {
        return new Promise(resolve => {
            // LLENAR SELECCION MULTIPLE
            let tipo_pregunta = parseInt(param_pregunta.tipo_pregunta);
            if (tipo_pregunta > 3 && tipo_pregunta != 9 && tipo_pregunta != 2041) {
                this.db.getAll('select * from PARAM_SELECCION_MULTIPLE_DETALLE WHERE id_sm = ? order by nombre_item', [tipo_pregunta])
                    .then(results_preg => {
                        let len_preg = results_preg.rows.length, i;
                        if (len_preg > 0) {
                            let array_items_sm = [];
                            for (i = 0; i < len_preg; i++) {
                                array_items_sm.push({
                                    id: results_preg.rows.item(i).id
                                    , id_sm: results_preg.rows.item(i).id_sm
                                    , valor_item: results_preg.rows.item(i).valor_item
                                    , nombre_item: results_preg.rows.item(i).nombre_item
                                    , id_padre: results_preg.rows.item(i).id_padre
                                    , permiso_usuario: results_preg.rows.item(i).permiso_usuario
                                })
                            }
                            resolve(array_items_sm);
                        }
                        else {
                            resolve(null);
                        }
                    });
            }
            else {
                resolve(null);
            }
        });
    }



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
