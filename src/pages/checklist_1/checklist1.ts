import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
// SERVICIOS
import { ThinxsysFramework } from "../../servicios/ThinxsysFramework";
import { DataService } from "../../servicios/DataService";
import { chk_checklist } from "../../servicios_tablas/chk_checklist"
// OBJETOS
import { CHK_RESPUESTA_FINAL_obj } from "../../objetos/CHK_RESPUESTA_FINAL";
// PAGES
import { listachecklistPage } from '../listachecklist/listachecklist';

@Component({
    selector: 'page-checklist1',
    templateUrl: 'checklist1.html'
})
export class Checklist1Page {
    // DATAS
    data_items: any;
    data_pc: any;
    // OBJETOS
    obj_checklist: any;
    obj_item: any;
    obj_pregunta: any;
    data_pregunta_select: any;
    // CONTADOR PARA RECORRER PREGUNTAS    
    contador_pregunta: number;
    // MOSTRAR OCULTAR ITEM Y PREGUNTA
    div_seleccion_puntocontrol = true;
    div_seleccion_items = false;
    div_pregunta = false;
    // OBJETO FINAL
    obj_respuesta_final = <CHK_RESPUESTA_FINAL_obj>{};
    // RESPUESTA_AUX  
    respuesta_aux: any;

    constructor(public navParams: NavParams, public navCtrl: NavController, public dataservice: DataService, public thxframework: ThinxsysFramework, public chk_service: chk_checklist, public alertCtrl: AlertController) {
        this.obj_checklist = navParams.get('obj_checklist');
        this.obj_respuesta_final.ID_CHECKLIST = this.obj_checklist.id_checklist;
        this.obj_respuesta_final.ID_CHECKLIST_COMPLETADO = thxframework.newGuid();
        // PUNTOS DE CONTROL Y CHECKLIST
        chk_service.ListarPuntosControl().then(x => {
            this.data_pc = x;
        })
        chk_service.ListarItems(this.obj_checklist.id_checklist).then(x => {
            this.data_items = x;
        });
    }

    CrearCompletado() {
        // id_checklist_completado, id_empresa, id_checklist, id_usuario, id_pc, gps, fecha_completado, completado
        this.thxframework.getGlobalVar('objlogin').then(x => {
            this.dataservice.sql_command('INSERT INTO CHECKLIST_COMPLETADOS VALUES (?,?,?,?,?,?,?,?)',
                [this.obj_respuesta_final.ID_CHECKLIST_COMPLETADO, x.id_empresa, this.obj_checklist.id_checklist, x.ID_USUARIO, this.obj_respuesta_final.ID_PC, 'n/a', new Date().toJSON("dd/MM/yyyy HH:mm"), 0]).then(x => {
                }).catch(x => {
                    this.thxframework.Mensaje("Error: " + JSON.stringify(x), 4000);
                });
        })
    }

    ir_puntocontrol(pc) {
        this.obj_respuesta_final.ID_PC = pc.id_pc;
        this.obj_respuesta_final.NOMBRE_PC = pc.nombre_pc;
        this.CrearCompletado();
        //
        this.div_seleccion_items = true;
        this.div_seleccion_puntocontrol = false;
    }

    ir_item(item) {
        this.respuesta_aux = null;
        this.obj_item = item;
        this.contador_pregunta = 0;
        this.obj_pregunta = this.obj_item.arreglo_pro_pregunta[this.contador_pregunta];
        this.LlenaSeleccionMultiple();
        this.chk_service.BuscarRespuesta(this.obj_respuesta_final.ID_CHECKLIST_COMPLETADO,this.obj_pregunta.id_pregunta).then(x => {
            this.respuesta_aux = x;
        });
        //
        this.div_pregunta = true;
        this.div_seleccion_items = false;
    }

    GuardarPregunta() {
        // NO SE RESPONDIO NADA
        if (this.respuesta_aux == null) {
            this.thxframework.Mensaje("No se respondió la pregunta", 3000);
        }
        else {
            // VERIFICAR SI NECESITA FOTO
            if (this.obj_pregunta.requiere_foto == "1") {
                this.thxframework.Mensaje("Esta pregunta requiere tomar una foto", 3000);
            }
            // GUARDAR RESPUESTA:            
            this.chk_service.InsertarRespuesta(this.obj_respuesta_final, this.obj_pregunta.id_pregunta, this.respuesta_aux).then(_resp => {
                this.NextPreg();
            }).catch(error => {
                this.thxframework.Mensaje(JSON.stringify(error), 4000);
            });

        }
    }
    // LLENAR SELECCION MULTIPLE
    LlenaSeleccionMultiple() {
        this.chk_service.LlenarSM(this.obj_item.arreglo_pro_pregunta[this.contador_pregunta])
            .then(resp => {
                this.data_pregunta_select = resp;
            });
    }

    // VOLVER A LOS FORMULARIOS
    ListarFormularios() {
        let alert = this.alertCtrl.create({
            title: 'Salir sin guardar',
            message: '¿Está seguro/a de salir sin guardar?',
            buttons: [
                {
                    text: 'Volver',
                    role: 'cancel',
                    handler: () => {}
                },
                {
                    text: 'Salir',
                    handler: () => {
                        this.navCtrl.setRoot(listachecklistPage);
                    }
                }
            ]
        });
        alert.present();
    }

    // GUARDAR FINAL
    GuardarFormulario() {
        let alert = this.alertCtrl.create({
            title: 'Finalizar y Guardar',
            message: '¿Está seguro/a de finalizar el formulario actual?',
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                    handler: () => {
                    }
                },
                {
                    text: 'Finalizar',
                    handler: () => {
                        this.TestFin();
                    }
                }
            ]
        });
        alert.present();
    }
    // TEST FIN
    TestFin(){
        this.dataservice.getAll("SELECT * FROM CHK_CHECKLIST_RESPUESTA WHERE id_checklist_completado = ? ", [this.obj_respuesta_final.ID_CHECKLIST_COMPLETADO])
        .then(results => { 
            var len = results.rows.length, i;
            if (len > 0) {                     
                for (i = 0; i < len; i++) { 
                    alert(JSON.stringify(results.rows.item(i)));                                          
                }                       
            }
            else {
              
            }
        })
    }
    // NEXT
    NextPreg() {
        this.respuesta_aux = null;
        this.contador_pregunta++;
        if (this.contador_pregunta == this.obj_item.num_preguntas) {
            this.div_seleccion_items = true;
            this.div_pregunta = false;
        }
        else {
            this.obj_pregunta = this.obj_item.arreglo_pro_pregunta[this.contador_pregunta];
            this.LlenaSeleccionMultiple();
            this.chk_service.BuscarRespuesta(this.obj_respuesta_final.ID_CHECKLIST_COMPLETADO,this.obj_pregunta.id_pregunta).then(x => {
                this.respuesta_aux = x;
            });
        }
    }
    // BACK
    BackPreg() {
        this.respuesta_aux = null;
        this.contador_pregunta--;
        if (this.contador_pregunta < 0) {
            this.div_seleccion_items = true;
            this.div_pregunta = false;
        }
        else {
            this.obj_pregunta = this.obj_item.arreglo_pro_pregunta[this.contador_pregunta];
            this.LlenaSeleccionMultiple();            
            this.chk_service.BuscarRespuesta(this.obj_respuesta_final.ID_CHECKLIST_COMPLETADO,this.obj_pregunta.id_pregunta).then(x => {
                this.respuesta_aux = x;
            });
        }
    }   
}


