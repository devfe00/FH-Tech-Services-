const mongoose = require('mongoose');

// Definir o modelo da mensagem
const mensagemSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  assunto: {
    type: String,
    required: true,
  },
  mensagem: {
    type: String,
    required: true,
  },
  data: {
    type: Date,
    default: Date.now,
  },
});

// Criar o modelo
const Mensagem = mongoose.model('Mensagem', mensagemSchema);

module.exports = Mensagem;
