import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
// SERVICIOS
import { ThinxsysFramework } from "../../servicios/ThinxsysFramework";
import { DataService } from "../../servicios/DataService";
// PAGES
import { Checklist1Page } from "../../pages/checklist_1/checklist1"

@Component({
    selector: 'page-listachecklist',
    templateUrl: 'listachecklist.html'
})
export class listachecklistPage {
    obj_usuario: any;
    data: any;

    constructor(public navCtrl: NavController, public dataservice: DataService, public thxframework: ThinxsysFramework) {
        this.ListarChecklists();
    }

    ListarChecklists() {
        this.dataservice.getAll('SELECT * FROM CHK_CHECKLIST_CATEGORIA')
            .then(results_cat => {
                var len_cat = results_cat.rows.length, i;
                if (len_cat > 0) {
                    let db_json_cat = [];
                    for (i = 0; i < len_cat; i++) {
                        let aux_cont_chk = i; // <---
                        let id_categoria = results_cat.rows.item(aux_cont_chk).id_categoria;
                        let nombre_categoria = results_cat.rows.item(aux_cont_chk).nombre_categoria;
                        this.dataservice.getAll('SELECT * FROM CHK_CHECKLIST WHERE id_categoria = ? order by nombre_checklist ', [id_categoria])
                            .then(results => {
                                var len = results.rows.length, j;
                                if (len > 0) {
                                    let db_json_chk = [];
                                    for (j = 0; j < len; j++) {
                                        db_json_chk.push({
                                            nombre_checklist: results.rows.item(j).nombre_checklist
                                            , id_checklist: results.rows.item(j).id_checklist
                                        })
                                   
                                    }                              
                                    db_json_cat.push({
                                        nombre_categoria: nombre_categoria
                                        , list_checklist: db_json_chk
                                    })                                  
                                }
                            })                        
                    }
                    this.data = db_json_cat;
                }
            })
    }

    open_checklist(chk) {
        this.navCtrl.setRoot(Checklist1Page, { obj_checklist: chk });
    }
}


