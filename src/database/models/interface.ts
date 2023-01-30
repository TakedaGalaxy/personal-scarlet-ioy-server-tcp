import * as mysql2 from 'mysql2/promise';

export default interface ModelInterface<T> {
  bancoRef: mysql2.Connection | undefined,
  getDado: () => Promise<T>,
  criarTabela: () => Promise<boolean>,
  deletarTabela: () => Promise<boolean>,
  criarReferencias: undefined | (() => Promise<boolean>)
}