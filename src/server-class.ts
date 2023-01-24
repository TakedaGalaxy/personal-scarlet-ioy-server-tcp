import net from "net";
import handlerConexao from "./client";
import { ClientType } from "./types";

export default class Servidor {
  servidorRef: net.Server;
  host: string;
  port: number;
  clientsConectados: Array<ClientType>

  constructor(host: string = "127.0.0.1", port: number = 8080) {
    this.host = host;
    this.port = port;
    this.servidorRef = net.createServer(handlerConexao);
    this.clientsConectados = [];
  }

  iniciar() {
    this.servidorRef.listen(this.port, this.host, undefined, () => {
      console.log(`Servidor iniciado em (${this.host}:${this.port}) !`);
    });
  }

  getClientsConectados() {
    return this.clientsConectados;
  }

  addClient(clientArg: ClientType) {
    this.clientsConectados.push(clientArg);
  }

  removeClient(clientArg: ClientType) {
    this.clientsConectados = this.clientsConectados.filter((client) => client.estado.id !== clientArg.estado.id);
  }

}