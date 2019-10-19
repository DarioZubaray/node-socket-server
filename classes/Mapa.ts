import { Marcador } from "./Marcador";

export class Mapa {
    public marcadores: Marcador[] = [];

    constructor() {}

    getMarcadores() {
        return this.marcadores;
    }

    agregarMarcador(marcador: Marcador) {
        this.marcadores.push(marcador);
    }

    borrarMarcador(id: string) {
        this.marcadores = this.marcadores.filter(mar => mar.id !== id);
        return this.getMarcadores();
    }

    moverMarcador(marcador: Marcador) {
        for(const i in this.marcadores) {
            if (this.marcadores[i].id === marcador.id ) {
                this.marcadores[i].lat = marcador.lat;
                this.marcadores[i].lng = marcador.lng;
                break;
            }
        }
    }
}