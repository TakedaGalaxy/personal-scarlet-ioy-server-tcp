import { Socket } from "net";

export default class Cliente {

  socket: Socket

  constructor(socket: Socket) {
    this.socket = socket;

    this.socket.on("data", this.onData);
    this.socket.on("close", this.onClose);
    this.socket.on("error", this.onError);

    this.socket.write("I:M");
  }

  onData(data: Buffer) {
    console.log(data.toString());
  }

  onClose() {
    console.log("Conexão fechada");
  }

  onError(erro: Error) {
    console.log(erro.message);
  }
}