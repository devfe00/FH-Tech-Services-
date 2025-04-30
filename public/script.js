function createStars() {
    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars-container';
    document.body.appendChild(starsContainer);
    

    const starCount = 200;
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        
        const size = Math.random() * 2 + 1;
        
        const duration = Math.random() * 3 + 2 + 's';
        const delay = Math.random() * 5 + 's';
        
        star.style.left = `${posX}%`;
        star.style.top = `${posY}%`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.setProperty('--duration', duration);
        star.style.setProperty('--delay', delay);
        
        starsContainer.appendChild(star);
    }
}

function createMeteors() {
    const starsContainer = document.querySelector('.stars-container');
    
    function createMeteor() {
        if (!starsContainer) return;
        
        const meteor = document.createElement('div');
        meteor.className = 'meteor';
        
        const posX = Math.random() * window.innerWidth;
        const posY = Math.random() * (window.innerHeight / 4);
        
        meteor.style.left = `${posX}px`;
        meteor.style.top = `${posY}px`;
        
        const duration = Math.random() * 2 + 1;
        meteor.style.animation = `meteor ${duration}s linear forwards`;
        
        starsContainer.appendChild(meteor);
        
        setTimeout(() => {
            meteor.remove();
        }, duration * 1000);
    }
    
    setInterval(() => {
        createMeteor();
    }, Math.random() * 2000 + 1000);
}

function handleResize() {
    const starsContainer = document.querySelector('.stars-container');
    if (starsContainer) {
        document.body.removeChild(starsContainer);
    }
    createStars();
    createMeteors();
}

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('backgroundCanvas');
    if (canvas) {
        canvas.remove();
    }
    
    createStars();
    createMeteors();
    
    window.addEventListener('resize', handleResize);
});

document.addEventListener('DOMContentLoaded', () => {
    const title = document.querySelector(".fade-in");
    if (title) {
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

document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault(); 
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
            alert(result.message); 
        });
    }
});

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
}
  