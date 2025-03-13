// Importando as dependências
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const twilio = require('twilio');

// Criando o app Express
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Conectando com o MongoDB
mongoose.connect('mongodb://localhost:27017/contactDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Definindo o esquema do MongoDB para armazenar os contatos
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
});

const Contact = mongoose.model('Contact', contactSchema);

// Definindo as credenciais do Twilio (substitua com suas próprias credenciais)
const client = new twilio('ACCOUNT_SID', 'AUTH_TOKEN');

// Rota para o formulário de contato
app.post('/contact', async (req, res) => {
  const { name, email, subject } = req.body;

  // Salvando os dados no MongoDB
  const contact = new Contact({ name, email, subject });
  await contact.save();

  // Enviar a mensagem pelo WhatsApp usando o Twilio
  client.messages.create({
    body: `Novo contato recebido:\nNome: ${name}\nEmail: ${email}\nAssunto: ${subject}`,
    from: 'whatsapp:+14155238886',  // Seu número do Twilio
    to: 'whatsapp:+5511956795412', // Seu número de WhatsApp
  }).then(message => console.log(message.sid));

  // Respondendo ao cliente que a mensagem foi enviada com sucesso
  res.send({ message: 'Mensagem recebida e enviada com sucesso!' });
});

// Iniciando o servidor
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
