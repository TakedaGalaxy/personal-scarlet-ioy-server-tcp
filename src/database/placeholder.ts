//Utilizado apenas para teste antes da implementação do banco de dados
export async function verificaBancoDadosPlaceHolder(arg: any, conclusao: boolean, resposta: any) {

  return new Promise((resolve, reject) => {
    setTimeout(() => {

      if (conclusao) {
        resolve(resposta);
      }

      reject(resposta);

    }, 500);
  })

}