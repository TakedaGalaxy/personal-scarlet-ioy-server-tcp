import { Socket } from "net";
import { verificaBancoDadosPlaceHolder } from "../database/placeholder";
import Dispositivo from "./dispositivo/dispositivo-class";

export default class Cliente {

  socket: Socket;
  endereco:string;

  onData: (arg: Buffer) => void;
  onClose: () => void;
  onError: (arg: Error) => void;

  constructor(socket: Socket) {

    this.onData = this.onDataPadrao;
    this.onClose = this.onClosePadrao;
    this.onError = this.onErrorPadrao;

    this.socket = socket;

    this.endereco = `${this.socket.remoteAddress}:${this.socket.remotePort}`;

    this.socket.on("data", (data: Buffer) => this.onData(data));
    this.socket.on("close", () => this.onClose());
    this.socket.on("error", (erro: Error) => this.onError(erro));

    console.log(`(${this.endereco}) | Conectou !`);

    this.socket.write("I:M");

  }

  onDataPadrao(data: Buffer) {

    const parametros = data.toString()?.split(':');

    if (parametros.length != 2){
      this.fecharConexao("Dado invalido !");
      return;
    }

    const [id, modelo] = parametros;

    if (!(id && modelo)){
      this.fecharConexao("Dado invalido !");
      return;
    }

    verificaBancoDadosPlaceHolder({ id, modelo }, true, "dispositivo")
      .then((resposta) => {

        if (resposta === "dispositivo") {

          const dispositivo = new Dispositivo(this.socket, id, modelo);

          this.onData = (data: Buffer) => { dispositivo.onData(data) };
          this.onClose = () => { dispositivo.onClose() };
          this.onError = (erro: Error) => { dispositivo.onError(erro) };

        }

        if (resposta === "controlador") {

          const controlador = new Dispositivo(this.socket, id, modelo);

          this.onData = (data: Buffer) => { controlador.onData(data) };
          this.onClose = () => { controlador.onClose() };
          this.onError = (erro: Error) => { controlador.onError(erro) };

        }

        this.socket.write("200");

      })
      .catch((resposta) => {
        this.fecharConexao("Falha na validação !");
      });

  }

  onClosePadrao() {
    console.log(`(${this.endereco}) | Conexão fechada`);
  }

  onErrorPadrao(erro: Error) {
    console.log(`(${this.endereco}) | Error : ${erro.name} ${erro.message}`);
  }

  fecharConexao(
    motivo:
      "Dado invalido !" |
      "Falha na validação !" |
      "Sucesso !"
  ) {
    this.socket.end(motivo);
  }
}