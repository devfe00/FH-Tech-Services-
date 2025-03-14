const mongoose = require('mongoose');

// URL de conexão ao MongoDB (se estiver usando o MongoDB Atlas, insira a URL do Atlas aqui)
const mongoURI = 'mongodb://localhost:27017/contatoForm'; // Substitua pelo seu URI do MongoDB Atlas se necessário

// Conectar ao banco de dados
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Conectado ao MongoDB com sucesso!'))
  .catch(err => console.log('Erro ao conectar ao MongoDB:', err));
