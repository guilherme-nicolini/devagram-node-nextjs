import type { NextApiRequest, NextApiResponse } from "next";
import type { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";
import { validarTokenJWT } from "../../middlewares/validarTokenJWT";
import { conectarMongoDb } from "../../middlewares/conectarMongoDb";
import { UsuarioModel } from "../../models/UsuarioModel";
import { SeguidorModel } from "../../models/SeguidorModel";

const endPointSeguir = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
    try {

        if (req.method === 'PUT') {

            const { userId, id } = req?.query;


            // usuario logado/autenticado= quem esta fazendo as ações 
            const usuarioLogado = await UsuarioModel.findById(userId);
            if (!usuarioLogado) {
                return res.status(400).json({ erro: 'Usuario logado não encontrado' })
            }

            //id do usuario  e ser seguido - query
            const usuarioASerSeguido = await UsuarioModel.findById(id)
            if (!usuarioASerSeguido) {
                return res.status(400).json({ erro: 'Usuario a ser seguido não encontrado' })
            }

            //Buscar se eu  logado ja sigo ou não o usuario em questão
            const euJaSigoEsseUsuario = await SeguidorModel
                .find({ usuarioID: usuarioLogado._id, usuarioSeguidoId: usuarioASerSeguido._id });

            if (euJaSigoEsseUsuario && euJaSigoEsseUsuario.length > 0) {
                euJaSigoEsseUsuario.forEach(async (e: any) => await SeguidorModel.findByIdAndDelete({ _id: e._id }));
                
                usuarioLogado.seguindo--;
                await UsuarioModel.findByIdAndUpdate({ _id: usuarioLogado._id },usuarioLogado);
                usuarioASerSeguido.seguidores--;
                await UsuarioModel.findByIdAndUpdate({_id:usuarioASerSeguido._id}, usuarioASerSeguido);
                return res.status(200).json({ msg: 'Deixou de seguir o usuario com sucesso' });
            } else {
                const seguidor = {
                    usuarioId: usuarioLogado._id,
                    usuarioSeguidoId: usuarioASerSeguido._id
                };
                await SeguidorModel.create(seguidor);

                usuarioLogado.seguindo++;

                //ADICONAR UM SEGUINDO NO USUARIO LOGADO
                await UsuarioModel.findByIdAndUpdate({ _id: usuarioLogado._id }, usuarioLogado);
                //ADICONAR UM SEGUIDOR NO USUARIO SEGUIDO
                usuarioASerSeguido.seguidores++;
                await UsuarioModel.findByIdAndUpdate({ _id: usuarioASerSeguido._id }, usuarioASerSeguido);

                return res.status(200).json({ msg: 'Usuario seguido com sucesso' });

            }
        }

        return res.status(405).json({ erro: 'Método informado não existe' })

    } catch (e) {
        console.log(e);
        return res.status(500).json({ erro: 'Erro ao seguir/desguir o  usuario' });
    }
}

export default validarTokenJWT(conectarMongoDb(endPointSeguir));