import { Socket } from "net";
import bancoDeDados from "../../database";
import servidor from "../../server";

export default class Dispositivo {

  socket: Socket;
  id: string;
  modelo: string;
  endereco: string;

  constructor(socket: Socket, id: string, modelo: string) {
    this.socket = socket;
    this.id = id;
    this.modelo = modelo;
    this.endereco = `${this.socket.remoteAddress}:${this.socket.remotePort}`;
    servidor.addDispositivo(this);
  }

  onData(data: Buffer) {

    const dados = data.toString().split(';').filter((dado) => !!dado).map((dado) => {
      return dado.split(',').reduce((resultado: {
        idPeriferico?: string,
        nome?: string,
        dado?: string,
        data?: string,
        contexto?: string
      }, campo) => {

        const [chave, valor] = campo.split(':');

        let { idPeriferico, nome, dado, data, contexto } = resultado;

        if (!idPeriferico && chave === "IDP") idPeriferico = valor;
        if (!nome && chave === "NM") nome = valor;
        if (!dado && chave === "DD") dado = valor;
        if (!data && chave === "DT") data = valor;
        if (!contexto && chave === "CT") contexto = valor;

        return { idPeriferico, nome, dado, data, contexto };
      }, {});
    });

    console.log(`(${this.endereco})(${this.getIdModelo()}) | Dados : `, dados.map((dadoObj) => {

      const { idPeriferico, contexto, dado, data, nome } = dadoObj;

      const dataAtual = new Date();

      const paraArmazenar = {
        dispositivo: this.id,
        periferico: idPeriferico ?? "",
        nome: nome ?? "",
        dado: dado ?? "",
        data: data ? new Date(data) : dataAtual,
        contexto: contexto ?? ""
      };

      bancoDeDados.addDados(paraArmazenar);

      return JSON.stringify(paraArmazenar);
    }));
  }

  onClose() {
    console.log(`(${this.endereco})(${this.getIdModelo()}) | Fechou conexão`);
    servidor.removeDispositivo(this);
  }

  onError(erro: Error) {
    console.log(`(${this.endereco})(${this.getIdModelo()}) | Erro : ${erro.name} - ${erro.message}`);
  }

  enviarDado(dado: string) {
    this.socket.write(dado, (res) => {
      if (res)
        console.log(res)
    });
  }

  getIdModelo() {
    return `${this.id}:${this.modelo}`;
  }

  getId() {
    return this.id;
  }

  getModelo() {
    return this.modelo;
  }

}