import * as mysql2 from "mysql2/promise";
import { erroDB, sucessoCriarTabelaDB, sucessoDeletarTabelaDB, sucessoRelacaoTabelaDB } from "../funcoes-auxiliares";
import ModelInterface from "./interface";

export default class ModelRelacaoModeloPeriferico implements ModelInterface<TypeRelacaoModeloPerifericoRes> {

  bancoRef: mysql2.Connection | undefined;

  constructor(bancoRef?: mysql2.Connection) {
    this.bancoRef = bancoRef;
  }

  async getDado() {
    const [rows] = await this.bancoRef?.query('SELECT * FROM `relacaoModeloPeriferico`') ?? [];
    return rows as TypeRelacaoModeloPerifericoRes;
  }

  async criarTabela() {
    try {
      await this.bancoRef?.query(
        'CREATE TABLE `relacaoModeloPeriferico`(\n' +
        '`modelo` varchar(255),\n' +
        '`perifericos` varchar(255))'
      );

      return sucessoCriarTabelaDB("relacaoModeloPeriferico");
    } catch (erro) { return erroDB(erro); }
  };

  async deletarTabela() {
    try {
      await this.bancoRef?.query('DROP TABLE `relacaoModeloPeriferico`');

      return sucessoDeletarTabelaDB('relacaoModeloPeriferico');
    } catch (erro) { return erroDB(erro); }
  }

  async criarReferencias() {
    try {
      await this.bancoRef?.query('ALTER TABLE `relacaoModeloPeriferico` ADD FOREIGN KEY (`modelo`) REFERENCES `modelos` (`id`)');
      await this.bancoRef?.query('ALTER TABLE `relacaoModeloPeriferico` ADD FOREIGN KEY (`perifericos`) REFERENCES `perifericos` (`id`)');
      return sucessoRelacaoTabelaDB("relacaoModeloPeriferico");
    } catch (erro) { return erroDB(erro) }
  };

}

export type TypeRelacaoModeloPeriferico = {
  modelo: string,
  perifericos: string
}

export type TypeRelacaoModeloPerifericoRes = Array<TypeRelacaoModeloPeriferico>