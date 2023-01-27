import * as dotenv from 'dotenv'
dotenv.config();
import Servidor from './server-class';

const servidor = new Servidor(process.env.HOST, Number(process.env.PORT));

export default servidor;
