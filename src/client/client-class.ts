import { Socket } from "net";
import bandoDeDados from "../database";
import { verificaBancoDadosPlaceHolder } from "../database/placeholder";
import Dispositivo from "./dispositivo/dispositivo-class";

export default class Cliente {

  socket: Socket;
  endereco: string;

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

    if (parametros.length != 2) {
      this.fecharConexao("Dado invalido !");
      return;
    }

    const [id, modelo] = parametros;

    if (!(id && modelo)) {
      this.fecharConexao("Dado invalido !");
      return;
    }

    bandoDeDados.getModelos().then((respostaM) => {

      const modeloFiltrado = respostaM.filter(modeloRes => modeloRes.id === modelo).at(0);

      if (!modeloFiltrado) {
        this.fecharConexao("Falha na validação !");
        return;
      }

      bandoDeDados.getDispositivosCriados().then((respostaD) => {

        const dispositivoFiltrado = respostaD.filter(dispositivoCriado => dispositivoCriado.id === id).at(0);

        if (!dispositivoFiltrado) {
          bandoDeDados.addDispositivoCriado({ id, modelo }).then(resposta => {

            if (!resposta) {
              this.fecharConexao("Falha ao adicionar dispositivo !");
              return;
            }

            if (!this.alteraClientParaEspecializado(id, modelo, modeloFiltrado!.tipo))
              this.fecharConexao("Falha na validação !");

          });
          return;
        }

        if (!this.alteraClientParaEspecializado(id, modelo, modeloFiltrado!.tipo))
          this.fecharConexao("Falha na validação !");

      });

    });

  }

  alteraClientParaEspecializado(id: string, modelo: string, tipo: string) {
    if (tipo === "Dispositivo") {
      const dispositivo = new Dispositivo(this.socket, id, modelo);

      this.onData = (data: Buffer) => { dispositivo.onData(data) };
      this.onClose = () => { dispositivo.onClose() };
      this.onError = (erro: Error) => { dispositivo.onError(erro) };

      this.socket.write("200");

      return true;
    }

    if (tipo === "Controlador") {

      const controlador = new Dispositivo(this.socket, id, modelo);

      this.onData = (data: Buffer) => { controlador.onData(data) };
      this.onClose = () => { controlador.onClose() };
      this.onError = (erro: Error) => { controlador.onError(erro) };

      this.socket.write("200");
      return true;
    }

    return false;
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
      "Sucesso !" |
      "Falha ao adicionar dispositivo !"
  ) {
    this.socket.end(motivo);
  }
}