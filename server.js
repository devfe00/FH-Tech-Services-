// Importando as dependências
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const SibApiV3Sdk = require('sib-api-v3-sdk');
const path = require('path');

// Criando o app Express
const app = express();

const helmet = require('helmet');

// Em ambiente de desenvolvimento, podemos ser menos restritivos com segurança
if (process.env.NODE_ENV === 'production') {
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', '*'],
        styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://cdn.tailwindcss.com"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.tailwindcss.com", "https://cdnjs.cloudflare.com"],
        connectSrc: ["'self'", "https://cdn.tailwindcss.com", "https://cdnjs.cloudflare.com"],
        fontSrc: ["'self'", "https://cdnjs.cloudflare.com"],
      },
    },
  }));
} else {
  // Em desenvolvimento, vamos desativar o CSP para facilitar o debugging
  app.use(helmet({
    contentSecurityPolicy: false
  }));
}

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configurando para servir arquivos estáticos da pasta 'public' com opções adicionais
app.use(express.static(path.join(__dirname, 'public'), {
  extensions: ['html', 'htm', 'js', 'css', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'WEBP'],
  index: ['index.html', 'index.htm'],
  dotfiles: 'ignore',
  etag: false,
  lastModified: false,
  maxAge: '1d'
}));

// Conectando ao MongoDB
mongoose.connect('mongodb://localhost:27017/contactDB', {
  // Removidas opções depreciadas
})
  .then(() => {
    console.log('Conexão com o MongoDB bem-sucedida!');
  })
  .catch((err) => {
    console.log('Erro ao conectar com o MongoDB:', err);
  });

// Definindo o esquema do MongoDB para armazenar os contatos
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
});

const Contact = mongoose.model('Contact', contactSchema);

// Configurando o Sendinblue (substitua pela sua chave de API)
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = 'COLOCAR CHAVE SENDINBLUE DE VOLTA DEPOIS'; 

// Criando uma instância da API Sendinblue
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// Rota para a página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para a calculadora
app.get('/calculadora', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'calculadora.html'));
});

// Rota para o formulário de contato
app.post('/contact', async (req, res) => {
  const { name, email, subject } = req.body;
  console.log('Dados recebidos:', { name, email, subject });

  // Salvando os dados no MongoDB
  const contact = new Contact({ name, email, subject });
  try {
    await contact.save();

// Enviando o e-mail via Sendinblue
const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
sendSmtpEmail.sender = { email: 'flyhigh.pedidos@gmail.com' }; // Novo e-mail validado
sendSmtpEmail.to = [{ email: 'flyhigh.pedidos@gmail.com' }]; // E-mail de destino
sendSmtpEmail.subject = 'Novo Orçamento Solicitado';
sendSmtpEmail.htmlContent = `<strong>Orçamento Solicitado:</strong><br>
                              Nome: ${name}<br>
                              E-mail: ${email}<br>
                              Assunto: ${subject}`;
sendSmtpEmail.textContent = `Orçamento Solicitado:\nNome: ${name}\nE-mail: ${email}\nAssunto: ${subject}`;


    // Enviando o e-mail
    try {
      const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log('E-mail enviado com sucesso:', data);
      res.send({ message: 'Mensagem recebida e enviada com sucesso!' });
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      res.status(500).send({ message: 'Erro ao enviar e-mail. Tente novamente.' });
    }

  } catch (error) {
    console.error('Erro ao salvar contato no MongoDB:', error);
    res.status(500).send({ message: 'Erro ao salvar os dados. Tente novamente.' });
  }
});

// Iniciando o servidor
app.listen(3000, '0.0.0.0', () => {
  console.log('Servidor rodando na porta 3000');
});