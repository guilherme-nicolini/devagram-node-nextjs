import mongoose, { Schema } from "mongoose";
import publicacao from "../pages/api/publicacao";

const PublicacaoSchema = new Schema({
    descricao: { type: String, required: true },
    foto: { type: String, required: true },
    idUsuario: { type: String, required: true },
    data: { type: Date, required: true },
   comentarios : { type: Array, required: true , default:[]},
   likes : { type: Array, required: true , default:[]}
});

export const PublicacaoModel =(mongoose.models.publicacoes ||
   mongoose.model('publicacoes', PublicacaoSchema));