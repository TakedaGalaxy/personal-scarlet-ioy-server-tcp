import { Socket } from "net";

export interface estadoType {
  tipo?: string,
  id?: string,
  modelo?: string
}

export interface ClientType  {
  sock:Socket,
  estado: estadoType
}
