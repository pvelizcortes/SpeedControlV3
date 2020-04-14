import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';
import { ThinxsysFramework } from './ThinxsysFramework';

@Injectable()
export class ConnectivityService {
    constructor(private network: Network, private thx: ThinxsysFramework) {

    }
    // VERIFICA SI HAY CONEXION (network type te dice si es wifi, 3g o 4g, por si llegas a necesitarlo).
    isOnline(): boolean {
        if (this.network.type !== 'none') {        
            return true;
        } else if (this.network.type === 'none') {
            this.thx.Mensaje('No se detecta señal, por favor revise su conexión', 2000);
            return false;
        } else {
            this.thx.Mensaje('No se detecta señal, por favor revise su conexión', 2000);
            return false;
        }
    }

}
