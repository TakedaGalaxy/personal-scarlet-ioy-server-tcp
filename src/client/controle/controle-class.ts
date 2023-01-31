import { Socket } from "net";
import servidor from "../../server";

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

    const dadosTratado = data.toString().split(';').filter((dado) => !!dado).map((dado) => {
      return dado.split(',').reduce((resultado: {
        modelo?: string,
        id?: string,
        idPeriferico?: string,
        dado?: string
      }, campo) => {

        const [chave, valor] = campo.split(':');

        if (chave === "MD")
          resultado.modelo = valor ?? "";

        if (chave === "ID")
          resultado.id = valor ?? "";

        if (chave === "IDP")
          resultado.idPeriferico = valor ?? "";

        if (chave === "DD")
          resultado.dado = valor ?? "";

        return resultado;
      }, {});
    });

    dadosTratado.forEach(dados => {
      const { dado, idPeriferico, modelo, id } = dados;

      if (dado && idPeriferico && modelo)
        servidor.enviarDadoDispositivosConectados(dado, idPeriferico, modelo, id);
        
    });

    console.log(`(${this.endereco})(${this.getId()}) | Dados : `, dadosTratado.map((dado) => JSON.stringify(dado)));
  }

  onClose() {
    console.log(`(${this.endereco})(${this.getId()}) | Fechou conexão`);
  }

  onError(erro: Error) {
    console.log(`(${this.endereco})(${this.getId()}) | Erro : ${erro.name} - ${erro.message}`);
  }

  getId() {
    return `${this.id}:${this.modelo}`;
  }
}
