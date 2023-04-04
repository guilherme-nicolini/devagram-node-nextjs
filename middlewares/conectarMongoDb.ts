import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import mongoose from 'mongoose';
import type { RespostaPadraoMsg } from '../types/RespostaPadraoMsg';
export const conectarMongoDb = (handler: NextApiHandler) => async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {

    // verificar se o bd ja esta conectado, se estiver seguir para ou endpoint ou próximo midlleware assim :
   if(mongoose.connections[0].readyState) {
        return handler(req, res);
    }

    //    Caso não esteja conectado, vamos conectar
    // obter a variavel de ambiente preenchida no env
    const { DB_CONEXAO_STRING } = process.env;

    //  Env vazia aborta e informar o programador
    if (!DB_CONEXAO_STRING) {
        return res.status(500).json({ erro: 'Env de configuração do banco de dados, não informado' })
    }

    mongoose.connection.on('connected', () => console.log('Banco de dados conectado 🤘'))
    mongoose.connection.on('error', error => console.log(`Ocorreu um erro ao conectar ao banco de dados: ${error}`));

    await mongoose.connect(DB_CONEXAO_STRING);

    //Agora posso seguir para o endpoint, pois estou conectado no banco
 
    return handler(req, res);
    
}

