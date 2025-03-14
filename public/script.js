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

document.addEventListener('DOMContentLoaded', () => {
    const title = document.querySelector(".fade-in");
    if (title) {
        // Correção para a linha 100: Verificar se title existe antes de acessar innerText
        const text = title.innerText || title.textContent || "";
        title.innerText = "";
        text.split("").forEach((char, index) => {
            let span = document.createElement("span");
            span.innerText = char;
            span.style.animation = `letterFade 0.05s ease ${index * 0.05}s forwards`;
            title.appendChild(span);
        });
    }
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

// Enviar dados do formulário para o back-end
document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault(); // Evita o envio padrão do formulário
            const formData = new FormData(form);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                subject: formData.get('subject'),
            };

            const response = await fetch('/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            alert(result.message); // Exibe a resposta do servidor
        });
    }
});

// Lógica de modal e cálculo de orçamento
document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('cta-button');
    const modal = document.getElementById('modal');
    
    if (button && modal) {
        button.addEventListener('click', () => {
            modal.style.display = 'block';
        });
        
        window.onclick = function (event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        };
    }
    
    // Correção para a linha 159: Verificar se calculateButton existe antes de adicionar event listener
    const calculateButton = document.getElementById('calculate');
    const result = document.getElementById('result');
    
    if (calculateButton) {
        calculateButton.addEventListener('click', () => {
            const serviceType = document.getElementById('serviceType').value;
            const complexity = parseInt(document.getElementById('complexity').value);
            let basePrice = 0;
            if (serviceType === 'site') basePrice = 1000;
            if (serviceType === 'app') basePrice = 2000;
            if (serviceType === 'loja') basePrice = 1500;
            const finalPrice = basePrice + (complexity * 100);
            
            if (result) {
                result.innerHTML = `💡 Seu orçamento estimado: R$ ${finalPrice}`;
            }
        });
    }
});

if (document.getElementById('contactForm')) {
    // código para o formulário
}
  