import * as mysql2 from "mysql2/promise";
import { erroDB, sucessoCriarTabelaDB, sucessoDeletarTabelaDB, sucessoRelacaoTabelaDB } from "../funcoes-auxiliares";
import ModelInterface from "./interface";

export default class ModelDadosRecebidos implements ModelInterface<TypeDadosRecebidosRes> {

  bancoRef: mysql2.Connection | undefined;

  constructor(bancoRef?: mysql2.Connection) {
    this.bancoRef = bancoRef;
  }

  async getDado() {
    const [rows] = await this.bancoRef?.query('SELECT * FROM `dadosRecebidos`') ?? [];
    return rows as TypeDadosRecebidosRes;
  }

  async addDados(dados: TypeDadoRecebido) {
    try {

      let {dispositivo, periferico, nome, dado, data, contexto} = dados;

      const dateTime = data.toISOString().slice(0, 19).replace('T', ' ');

      await this.bancoRef?.query(
        `INSERT INTO dadosRecebidos (dispositivo, periferico, nome, dado, data, contexto) ` +
          `VALUE ('${dispositivo}', '${periferico}', '${nome}', '${dado}', '${dateTime}', '${contexto}')`)
      return true;
    }
    catch (erro) { return erroDB(erro) }
  }

  async criarTabela() {
    try {
      await this.bancoRef?.query(
        'CREATE TABLE `dadosRecebidos` (\n' +
        '`dispositivo` varchar(255),\n' +
        '`periferico` varchar(255),\n' +
        '`nome` tinytext,\n' +
        '`dado` tinytext,\n' +
        '`data` datetime,\n' +
        '`contexto` tinytext)'
      );

      return sucessoCriarTabelaDB("dadosRecebidos");
    } catch (erro) { return erroDB(erro); }
  };

  async deletarTabela() {
    try {
      await this.bancoRef?.query('DROP TABLE `dadosRecebidos`');

      return sucessoDeletarTabelaDB('dadosRecebidos');
    } catch (erro) { return erroDB(erro); }
  }

  async criarReferencias() {
    try {
      await this.bancoRef?.query('ALTER TABLE `dadosRecebidos` ADD FOREIGN KEY (`dispositivo`) REFERENCES `dispositivosCriados` (`id`)');
      await this.bancoRef?.query('ALTER TABLE `dadosRecebidos` ADD FOREIGN KEY (`periferico`) REFERENCES `perifericos` (`id`)');
      return sucessoRelacaoTabelaDB("relacaoModeloPeriferico");
    } catch (erro) { return erroDB(erro) }
  };

}

export type TypeDadoRecebido = {
  dispositivo: string,
  periferico: string,
  nome: string,
  dado: string,
  data: Date,
  contexto: string
}

export type TypeDadosRecebidosRes = Array<TypeDadoRecebido>