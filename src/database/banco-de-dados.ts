import bandoDeDados from ".";
import ModelDadosRecebidos from "./models/dados-recebidos";
import ModelDispositivosCriados from "./models/dispositivos-criados";
import ModelModelos from "./models/modelos";
import ModelPerifericos from "./models/perifericos";
import ModelRelacaoModeloPeriferico from "./models/relacao-modelo-periferico";
import ModelTiposDados from "./models/tipos-dados";

const comando = process.argv.slice(2)?.at(0) ?? "";
const opcao = process.argv.slice(2)?.at(1) ?? "";

if (comando === "criar") {
  (async function () {
    const iniciadoStatus = await bandoDeDados.iniciar()

    if (!iniciadoStatus)
      return;

    const models = [
      new ModelModelos(bandoDeDados.bancoRef),
      new ModelTiposDados(bandoDeDados.bancoRef),
      new ModelPerifericos(bandoDeDados.bancoRef),
      new ModelDispositivosCriados(bandoDeDados.bancoRef),
      new ModelRelacaoModeloPeriferico(bandoDeDados.bancoRef),
      new ModelDadosRecebidos(bandoDeDados.bancoRef)
    ];

    let erro = false;

    for (let i = 0; i < models.length; i++)
      if (!(await models[i].criarTabela())) {
        erro = true;
        break;
      }

    for (let i = 0; i < models.length && !erro; i++) {
      const model = models[i];

      if (model.criarReferencias && !(await model.criarReferencias())) {
        console.log("erro");
        erro = true;
        break;
      }
    }

    if (opcao === "delErr") {
      if (erro) {
        for (let i = models.length - 1; i >= 0; i--)
          await models[i].deletarTabela()
      }
    }

    await bandoDeDados.desconectar();

  })()
}

if (comando === "deletar") {
  (async function () {
    const iniciadoStatus = await bandoDeDados.iniciar()

    if (!iniciadoStatus)
      return;

    const models = [
      new ModelModelos(bandoDeDados.bancoRef),
      new ModelPerifericos(bandoDeDados.bancoRef),
      new ModelDispositivosCriados(bandoDeDados.bancoRef),
      new ModelRelacaoModeloPeriferico(bandoDeDados.bancoRef),
      new ModelDadosRecebidos(bandoDeDados.bancoRef)
    ];

    for (let i = models.length - 1; i >= 0; i--)
      await models[i].deletarTabela()

    await bandoDeDados.desconectar();

  })()
}