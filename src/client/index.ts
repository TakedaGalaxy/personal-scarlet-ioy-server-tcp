import { Socket } from "net";
import Cliente from "./client-class";

export default function handlerConexao(socket:Socket){

    const client = new Cliente(socket);

};