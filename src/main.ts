import bandoDeDados from './database';
import servidor from './server';

bandoDeDados.iniciar().then((res)=>{

  servidor.iniciar();
  
});
