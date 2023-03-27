import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import mongoose from 'mongoose';

export const conectarMongoDb = (handler: NextApiHandler) => async (req: NextApiRequest, res: NextApiResponse) => {

    // verificar se o bd ja esta conectado, se estiver seguir para o endpoint ou próximo midlleware assim :
    if (mongoose.connections[0].readyState) {
        return handler(req, res);
    }
    //    Caso não esteja conectado, vamos conectar
    // obter a variavel de ambiente preenchida no env

    const { DB_CONEXAO_STRING } = process.env;

    //  Env vazia aborta e informar o programador
    if (!DB_CONEXAO_STRING) {
        return res.status(500).json({ erro: 'Env de configuração do bd, não informado' })
    }

    await mongoose.connect(DB_CONEXAO_STRING);
}