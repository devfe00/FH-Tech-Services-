// Função para criar as estrelas
function createStars() {
    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars-container';
    document.body.appendChild(starsContainer);
    
    // Criar estrelas em diferentes tamanhos
    const starCount = 200;
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Posição aleatória
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        
        // Tamanho aleatório entre 1px e 3px
        const size = Math.random() * 2 + 1;
        
        // Duração e atraso aleatórios para animação
        const duration = Math.random() * 3 + 2 + 's';
        const delay = Math.random() * 5 + 's';
        
        // Aplicar estilos
        star.style.left = `${posX}%`;
        star.style.top = `${posY}%`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.setProperty('--duration', duration);
        star.style.setProperty('--delay', delay);
        
        starsContainer.appendChild(star);
    }
}


// Função para criar meteoros
function createMeteors() {
    const starsContainer = document.querySelector('.stars-container');
    
    // Função para criar um único meteoro
    function createMeteor() {
        if (!starsContainer) return;
        
        const meteor = document.createElement('div');
        meteor.className = 'meteor';
        
        // Posição inicial aleatória no topo da tela
        const posX = Math.random() * window.innerWidth;
        const posY = Math.random() * (window.innerHeight / 4);
        
        meteor.style.left = `${posX}px`;
        meteor.style.top = `${posY}px`;
        
        // Animação com duração aleatória
        const duration = Math.random() * 2 + 1;
        meteor.style.animation = `meteor ${duration}s linear forwards`;
        
        starsContainer.appendChild(meteor);
        
        // Remover o meteoro após a animação terminar
        setTimeout(() => {
            meteor.remove();
        }, duration * 1000);
    }
    
    // Criar meteoros em intervalos aleatórios
    setInterval(() => {
        createMeteor();
    }, Math.random() * 2000 + 1000);
}

// Função para ajustar as estrelas quando a janela é redimensionada
function handleResize() {
    const starsContainer = document.querySelector('.stars-container');
    if (starsContainer) {
        document.body.removeChild(starsContainer);
    }
    createStars();
    createMeteors();
}

// Inicializar quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    // Remover o canvas existente (que não está sendo usado)
    const canvas = document.getElementById('backgroundCanvas');
    if (canvas) {
        canvas.remove();
    }
    
    createStars();
    createMeteors();
    
    // Reagir a redimensionamentos da janela
    window.addEventListener('resize', handleResize);
});

document.addEventListener("DOMContentLoaded", function() {
    const title = document.querySelector(".fade-in");
    const text = title.innerText;
    title.innerText = "";
    
    text.split("").forEach((char, index) => {
        let span = document.createElement("span");
        span.innerText = char;
        span.style.animation = `letterFade 0.05s ease ${index * 0.05}s forwards`;
        title.appendChild(span);
    });
});

/* Animação de letras */
const style = document.createElement("style");
style.innerHTML = `
    @keyframes letterFade {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .fade-in span {
        display: inline-block;
        opacity: 0;
    }
`;
document.head.appendChild(style);

// server.js
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Rota para lidar com o envio do formulário de contato
app.post('/contact', (req, res) => {
  const { name, email, subject } = req.body;

  // Lógica para enviar a mensagem via e-mail ou API
  // Pode ser configurado com Nodemailer ou outro serviço de e-mail

  res.send({ message: 'Mensagem enviada com sucesso!' });
});

// Iniciando o servidor
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});


const mongoose = require('mongoose');

// Exemplo de modelo para armazenar dados de contato
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
});

const Contact = mongoose.model('Contact', contactSchema);

// Salvando dados no banco de dados
app.post('/contact', async (req, res) => {
  const { name, email, subject } = req.body;

  const contact = new Contact({ name, email, subject });
  await contact.save();

  res.send({ message: 'Mensagem armazenada com sucesso!' });
});


const twilio = require('twilio');

const client = new twilio('ACCOUNT_SID', 'AUTH_TOKEN');

client.messages.create({
  body: 'Mensagem de contato recebida!',
  from: 'whatsapp:+14155238886',  // Seu número de WhatsApp do Twilio
  to: 'whatsapp:+5511956795412', // Número de destino (seu número)
})
.then(message => console.log(message.sid));
