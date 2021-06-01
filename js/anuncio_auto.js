import {Anuncio} from './anuncio.js'

export function Anuncio_Auto(id, titulo, transaccion, descripcion, precio, num_puertas, num_KMs,potencia){
    Anuncio.call(this, id, titulo, transaccion, descripcion, precio);
    this.num_puertas = num_puertas;
    this.num_KMs = num_KMs;
    this.potencia = potencia;
}