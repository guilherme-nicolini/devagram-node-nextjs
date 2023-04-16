import type { NextApiRequest, NextApiResponse } from "next";
import type { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";
import { conectarMongoDb } from "../../middlewares/conectarMongoDb";
import { validarTokenJWT } from "../../middlewares/validarTokenJWT";
import { UsuarioModel } from "../../models/UsuarioModel";
import { politicaCORS } from "../../middlewares/politicaCORS";


const pesquisaEndPOint = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg | any[]>) => {
    try {
        if (req.method === 'GET') {

            if (req?.query?.id) {
                const usuariosEncontrado = await UsuarioModel.findById(req?.query?.id)
                if (!usuariosEncontrado) {
                    return res.status(400).json({ erro: 'Usuario não encontrado' });
                }
                usuariosEncontrado.senha = null
                return res.status(200).json(usuariosEncontrado);
            } else {
                const { filtro } = req.query;
                if (!filtro || filtro.length < 2) {
                    return res.status(400).json({ erro: 'Informar pelo menos 2 caracteres para a busca ' });
                }
                

                const usuariosEncontrado = await UsuarioModel.find({
                    $or: [{ nome: { $regex: filtro, $options: 'i' } },
                    { email: { $regex: filtro, $options: 'i' } }]
                });
                return res.status(200).json(usuariosEncontrado)
            }

        }
        return res.status(405).json({ erro: 'Método informado não é válido' });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ erro: 'Não foi possível pesquisar usuário' + e });
    }
}

export default politicaCORS(validarTokenJWT(conectarMongoDb(pesquisaEndPOint)));