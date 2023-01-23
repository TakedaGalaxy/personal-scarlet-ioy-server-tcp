import net, { Socket } from "net";
import handlerConexao from "./client";
import { estadoType } from "./client/types";
import * as dotenv from 'dotenv'

dotenv.config();

const host = process.env.HOST ?? "127.0.0.1";
const port = process.env.PORT ?? 8080;

const server = net.createServer(handlerConexao);

export const servidorEstado: {
    clientsConectados: Array<{
        sock: Socket,
        estado: estadoType;
    }>
} = {
    clientsConectados: []
};

server.listen(port, host, function () {
    console.log(`Servidor iniciado em ${host}:${port} !`);
});

