import * as dotenv from 'dotenv'
import Servidor from './server-class';

dotenv.config();

const servidor = new Servidor(process.env.HOST, Number(process.env.PORT));

servidor.iniciar();

export default servidor;