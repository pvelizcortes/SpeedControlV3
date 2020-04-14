import { CHK_RESPUESTA_obj } from "../objetos/CHK_RESPUESTA";

export interface CHK_RESPUESTA_FINAL_obj {
    ID_CHECKLIST_COMPLETADO: string;
    ID_CHECKLIST: number;
    ID_USUARIO: string;
    ID_PC: number;
    NOMBRE_PC: string;
    GPS: string;
    FECHA_COMPLETADO: string,
    WEBAPP: string;
    OBJ_RESPUESTA: Array<CHK_RESPUESTA_obj>;

}
