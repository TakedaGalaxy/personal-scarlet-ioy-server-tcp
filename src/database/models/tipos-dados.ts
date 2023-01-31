import * as mysql2 from "mysql2/promise";
import { erroDB, sucessoCriarTabelaDB, sucessoDeletarTabelaDB } from "../funcoes-auxiliares";
import ModelInterface from "./interface";

export default class ModelTiposDados implements ModelInterface<TypeTipoDadoRes> {

  bancoRef: mysql2.Connection | undefined;

  constructor(bancoRef?: mysql2.Connection) {
    this.bancoRef = bancoRef;
  }

  async getDado() {
    const [rows] = await this.bancoRef?.query("SELECT * FROM `tiposDados`") ?? [];
    return rows as TypeTipoDadoRes;
  }

  async criarTabela() {
    try {
      await this.bancoRef?.query(
        'CREATE TABLE `tiposDados` (\n' +
        '`id` varchar(255) PRIMARY KEY,\n' +
        '`min` int,\n' +
        '`max` int)'
      );

      return sucessoCriarTabelaDB("tiposDados");
    }
    catch (erro) { return erroDB(erro); }
  }

  async deletarTabela() {
    try {
      await this.bancoRef?.query('DROP TABLE `tiposDados`');
      return sucessoDeletarTabelaDB("tiposDados");
    }
    catch (erro) { return erroDB(erro) }
  }

  criarReferencias = undefined;

}

export type TypeTipoDado = {
  id: string,
  min: number,
  max: number
};

export type TypeTipoDadoRes = Array<TypeTipoDado>;