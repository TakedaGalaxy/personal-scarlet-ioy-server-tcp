import { Socket } from "net";

export default class Controlador {

  socket: Socket;
  id: string;
  modelo: string;
  endereco: string;

  constructor(socket: Socket, id: string, modelo: string) {
    this.socket = socket;
    this.id = id;
    this.modelo = modelo;
    this.endereco = `${socket.remoteAddress}:${socket.remotePort}`;
  }

  onData(data: Buffer) {
    console.log(`(${this.endereco})(${this.getId()}) | Dados : ${data.toString()}`);
  }

  onClose() {
    console.log(`(${this.endereco})(${this.getId()}) | Fechou conexão`);
  }

  onError(erro: Error) {
    console.log(`(${this.endereco})(${this.getId()}) | Erro : ${erro.name} - ${erro.message}`);
  }

  getId(){
    return `${this.id}:${this.modelo}`;
  }
}
