import type { NextApiResponse } from "next";
import type { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";
import nc from 'next-connect';
import { upload, uploadImagemCosmic } from "../../services/uploadImagemCosmic";
import { conectarMongoDb } from "../../middlewares/conectarMongoDb";
import { validarTokenJWT } from "../../middlewares/validarTokenJWT";
import { PublicacaoModel } from "../../models/publicacaoModel";
import { UsuarioModel } from "../../models/UsuarioModel";

const handler = nc()
    .use(upload.single('file'))
    .post(async (req: any, res: NextApiResponse<RespostaPadraoMsg>) => {

        try {

            const { userId } = req.query;
            const usuario = await UsuarioModel.findById(userId);
            if (!usuario) {
                return res.status(400).json({ erro: 'Usuário não encontrado' });
            }

            if (!req || !req.body) {
                return res.status(400).json({ erro: 'Parametros de entrada não informado' })
            }
            const { descricao } = req?.body;

            if (!descricao || descricao.length < 2) {
                return res.status(400).json({ erro: "Descrição não é válida " });
            }
            if (!req.file) {
                return res.status(400).json({ erro: "Imagem é Obrigatória " });
            }

            const image = await uploadImagemCosmic(req);
            const publicacao = {
                idUsuario: usuario._id,
                descricao,
                foto: image.media.url,
                data: new Date()
            }

            await PublicacaoModel.create(publicacao);

            return res.status(200).json({ msg: " Publicação criada com sucesso " });

        } catch (e) {
            console.log(e)
            return res.status(400).json({ erro: 'Erro ao cadastrar usuario' })
        }


    });

export const config = {
    api: {
        bodyParser: false
    }
}

export default validarTokenJWT(conectarMongoDb(handler));

