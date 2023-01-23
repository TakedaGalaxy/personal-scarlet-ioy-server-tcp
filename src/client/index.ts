import { Socket } from "net";
import { servidorEstado } from "../server";
import { verificaClient } from "./funcoes-auxilizares";
import { estadoType } from "./types";

export default function handlerConexao(socket:Socket){

  const estado: estadoType = {};

  const setEstado = (novoEstado: estadoType) => {
      estado.tipo = novoEstado.tipo;
      estado.id = novoEstado.id;
      estado.modelo = novoEstado.modelo;
      return;
  }

  console.log(`cliente conectado : ${socket.remoteAddress}:${socket.remotePort}`);

  const eventData = socket.on('data', function (data) {

      if (!verificaClient(data, socket, estado, setEstado)) return;

      console.log(`Id : ${estado.id}, modelo : ${estado.modelo}, dados : ${data.toString()}`)

  });

  socket.on('close', function () {

      if (estado.id) {
        servidorEstado.clientsConectados = servidorEstado.clientsConectados.filter((client) => {
              return client.estado.id !== estado.id;
          });
          console.log(servidorEstado.clientsConectados);
      }

      console.log(`Client ${socket.remoteAddress}:${socket.remotePort} finalizou a conexão !`);
  });

  socket.on('error', function (error) {

      if (estado.id) {
        servidorEstado.clientsConectados = servidorEstado.clientsConectados.filter((client) => {
              return client.estado.id !== estado.id;
          });
          console.log(servidorEstado.clientsConectados);
      }

      console.error(`Client ${socket.remoteAddress}:${socket.remotePort} teve um erro : ${error}`);
  });

  socket.write("I:M");

};