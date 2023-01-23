//Utilizado apenas para teste antes da implementação do banco de dados
export async function verificaBancoDadosPlaceHolder(arg:any, resposta:boolean){
  
  return new Promise ((resolve,reject)=>{
    setTimeout(()=>{

      if(resposta){
        resolve(resposta);
      }

      reject(resposta);

    },500);
  })

}