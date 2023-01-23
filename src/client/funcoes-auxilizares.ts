import { Socket } from "net";
import { servidorEstado } from "../server";
import { estadoType } from "./types";

export function verificaClient(dados: Buffer, sock: Socket, estadoAtual: estadoType, setEstado: (arg: estadoType) => void) {

  if (estadoAtual.modelo) return true;

  const parametros = dados.toString().split(':');

  if (parametros.length != 2) {
    sock.end("Resposta Invalida !");
    return;
  }

  const [idRecebido, modeloRecebido] = parametros;

  if (!idRecebido || !modeloRecebido) {
    sock.end("Resposta Invalida !");
    return;
  }

  setEstado({
    tipo: 'dispositivo',
    id: idRecebido,
    modelo: modeloRecebido
  })

  servidorEstado.clientsConectados.push({ sock, estado: estadoAtual });

  sock.write("200");

  console.log(servidorEstado.clientsConectados.map((client => { return { id: client.estado.id, modelo: client.estado.modelo } })));

  return false;
}