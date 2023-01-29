export function sucessoCriarTabelaDB(tabela: string) {

  console.log(`Tabela ${tabela} criada !`);

  return true;
}

export function sucessoDeletarTabelaDB(tabela: string) {

  console.log(`Tabela ${tabela} deletada !`);

  return true;
}

export function sucessoRelacaoTabelaDB(tabela: string) {

  console.log(`Tabela ${tabela} criada relacao com sucesso !`);

  return true;
}

export function erroDB(erro: any) {
  const { name, message } = erro as Error;

  console.log(name, message);

  return false;
}

export const funcoesAuxiliaresDB = {
  sucessoCriarTabelaDB,
  sucessoDeletarTabelaDB,
  erroDB
}

export default funcoesAuxiliaresDB;