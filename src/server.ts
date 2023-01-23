import net, { Socket } from "net";
import handlerConexao from "./client";
import { estadoType } from "./client/types";

const port = 8080;
const host = '127.0.0.1';

const server = net.createServer(handlerConexao);

export const servidorEstado: {
    clientsConectados: Array<{
        sock: Socket,
        estado: estadoType;
    }>
} = {
    clientsConectados : []
};

server.listen(port, host, function () {
    console.log(`Servidor iniciado em ${host}:${port} !`);
});

console.log(process.env.TEST)
