import net, { Socket } from "net";
import handlerConexao from "./client";
import { estadoType } from "./client/types";
import * as dotenv from 'dotenv'

dotenv.config();

const host = process.env.HOST ?? "127.0.0.1";
const port = Number(process.env.PORT) ?? 8080;

export const servidorEstado: {
    clientsConectados: Array<{
        sock: Socket,
        estado: estadoType;
    }>
} = {
    clientsConectados: []
};

const server = net.createServer(handlerConexao);

server.listen(port, host, undefined, function () {
    console.log(`Servidor iniciado em (${host}:${port}) !!`);
});