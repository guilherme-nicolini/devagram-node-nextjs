import type { NextApiRequest, NextApiResponse } from 'next';
import { conectarMongoDb } from '../../../middlewares/conectarMongoDb';
import { respotaPadraoMsg } from '../../../middlewares/types/respostaPadraoMsg';
const endpointLogin = (
    req: NextApiRequest,
    res: NextApiResponse<respotaPadraoMsg>
) => {
    if (req.method === 'POST') {
        const { login, senha } = req.body;

        if (login === 'admin@admin.com' &&
            senha === "admin@123") {
            return res.status(200).json({ msg: "Usuário autenticado com sucesso" })
        }
        return res.status(400).json({ erro: "Usuário não encontrado" })
    }
    return res.status(405).json({ erro: 'Método informado não é válido' });
}
export default conectarMongoDb(endpointLogin);