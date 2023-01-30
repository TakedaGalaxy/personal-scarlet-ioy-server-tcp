import * as mysql2 from 'mysql2/promise';
import { erroDB, sucessoCriarTabelaDB, sucessoDeletarTabelaDB } from '../funcoes-auxiliares';
import ModelInterface from './interface';

export default class ModelModelos implements ModelInterface<TypeModelosRes>{

  bancoRef: mysql2.Connection | undefined;

  constructor(bancoRef?: mysql2.Connection) {
    this.bancoRef = bancoRef;
  }

  async getDado() {
    const [rows] = await this.bancoRef?.query('SELECT * FROM `modelos`') ?? [];
    return rows as TypeModelosRes;
  }

  async criarTabela() {
    try {
      await this.bancoRef?.query(
        'CREATE TABLE `modelos` (\n' +
        '`id` varchar(255) PRIMARY KEY,\n' +
        '`tipo` tinytext,\n' +
        '`descricao` text)'
      )
      return sucessoCriarTabelaDB("modelos");
    }
    catch (erro) { return erroDB(erro); }
  }

  async deletarTabela() {
    try {
      await this.bancoRef?.query('DROP TABLE `modelos`');
      return sucessoDeletarTabelaDB("modelos");
    }
    catch (erro) { return erroDB(erro); }
  }

  criarReferencias = undefined;

}

export type TypeModelo = {
  id: string,
  descricao: string
}

export type TypeModelosRes = Array<TypeModelo>