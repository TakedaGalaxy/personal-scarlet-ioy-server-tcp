import { Socket } from "net";
import servidor from "../../server";

export default class Dispositivo {

  socket: Socket;
  id: string;
  modelo: string;
  endereco : string;

  constructor(socket: Socket, id: string, modelo: string) {
    this.socket = socket;
    this.id = id;
    this.modelo = modelo;
    this.endereco = `${this.socket.remoteAddress}:${this.socket.remotePort}`;
    servidor.addDispositivo(this);
  }

  onData(data: Buffer) {
    console.log(`(${this.endereco})(${this.getId()}) | Dados : ${data.toString()}`);
  }

  onClose() {
    console.log(`(${this.endereco})(${this.getId()}) | Fechou conexão`);
    servidor.removeDispositivo(this);
  }

  onError(erro: Error) {
    console.log(`(${this.endereco})(${this.getId()}) | Erro : ${erro.name} - ${erro.message}`);
  }

  getId(){
    return `${this.id}:${this.modelo}`;
  }

}