import type { NextApiRequest, NextApiResponse } from "next";
import type { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";
import type { CadastroRequisicao } from "../../types/CadastroRequisicao";
import { UsuarioModel } from "../../models/UsuarioModel";
import { conectarMongoDb } from "../../middlewares/conectarMongoDb";
import md5 from 'md5';
import { upload, uploadImagemCosmic } from "../../services/uploadImagemCosmic";
import nc from 'next-connect'

const handler = nc()
    .use(upload.single('flle'))
    .post(async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {

        const usuario = req.body as CadastroRequisicao;
        
        if (!usuario.nome || usuario.nome.length < 2) {
            return res.status(400).json({ erro: 'Nome invalido' });
           
        }

        if (!usuario.email || usuario.email.length < 5
            || !usuario.email.includes('@')
            || !usuario.email.includes('.')) {
            return res.status(400).json({ erro: 'Email invalido' });
            
        }

        if (!usuario.senha || usuario.senha.length < 4) {
            return res.status(400).json({ erro: 'Senha invalida' });
            
        }

        // Validação ja existe usuario com o mesmo email 

        const usuarioComMesmoEmail = await UsuarioModel.find({ email: usuario.email });
        if (usuarioComMesmoEmail && usuarioComMesmoEmail.length > 0) {
            return res.status(400).json({ erro: 'ja existe uma conta com o email informado ' });
        }

        // enviar a imagem do multer para o cosmic
        const image = await uploadImagemCosmic(req);

        // Salvar no banco de dados 
        const usuarioASerSalvo = {
            nome: usuario.nome,
            email: usuario.email,
            senha: md5(usuario.senha),
            avatar: image?.media?.url
        }
        console.log(usuarioASerSalvo)
        await UsuarioModel.create(usuarioASerSalvo);
        return res.status(200).json({ msg: 'Usuário criado com sucesso' });

    });

export const config = {
    api: {
        bodyParse: false
    }
}

export default conectarMongoDb(handler);