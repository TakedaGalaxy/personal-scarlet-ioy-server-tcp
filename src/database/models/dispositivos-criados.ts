import * as mysql2 from 'mysql2/promise';
import { erroDB, sucessoCriarTabelaDB, sucessoDeletarTabelaDB, sucessoRelacaoTabelaDB } from '../funcoes-auxiliares';
import ModelInterface from "./interface";

export default class ModelDispositivosCriados implements ModelInterface<TypeDispositivosCriadosRes>{

  bancoRef: mysql2.Connection | undefined;

  constructor(bancoRef?: mysql2.Connection) {
    this.bancoRef = bancoRef;
  }

  async getDado() {
    const [rows] = await this.bancoRef?.query('SELECT * FROM `dispositivosCriados`') ?? [];
    return rows as TypeDispositivosCriadosRes;
  }

  async addDispositivoCriado(dispositivo: TypeDispositivoCriado) {
    try {
      await this.bancoRef?.query(`INSERT INTO dispositivoscriados (id, modelo) VALUES ('${dispositivo.id}', '${dispositivo.modelo}')`);
      return true;
    }
    catch (erro) { return erroDB(erro); }
  }

  async criarTabela() {
    try {
      await this.bancoRef?.query(
        'CREATE TABLE`dispositivosCriados`(\n' +
        '`id` varchar(255) PRIMARY KEY,\n' +
        '`modelo` varchar(255))'
      );
      return sucessoCriarTabelaDB("dispositivosCriados");
    }
    catch (erro) { return erroDB(erro); }
  };

  async deletarTabela() {
    try {
      await this.bancoRef?.query('DROP TABLE `dispositivosCriados`');
      return sucessoDeletarTabelaDB("dispositivosCriados");
    } catch (erro) { return erroDB(erro); }
  }

  async criarReferencias() {
    try {
      await this.bancoRef?.query('ALTER TABLE `dispositivosCriados` ADD FOREIGN KEY (`modelo`) REFERENCES `modelos` (`id`)');
      return sucessoRelacaoTabelaDB('dispositivosCriados');
    } catch (erro) { return erroDB(erro); }
  };

}

export type TypeDispositivoCriado = {
  id: string,
  modelo: string
}


export type TypeDispositivosCriadosRes = Array<TypeDispositivoCriado>