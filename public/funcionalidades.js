document.addEventListener('DOMContentLoaded', function() {
    const isMobile = (window.innerWidth <= 768) || 
                    (typeof window.orientation !== "undefined") || 
                    (navigator.userAgent.indexOf('IEMobile') !== -1);
    
    // Configurações globais
    const settings = {
        maxStars: isMobile ? 100 : 200,
        maxMeteors: isMobile ? 5 : 10,
        splashDuration: 3000,
        parallaxStrength: 0.5,
        cursorTrailCount: isMobile ? 10 : 20
    };
    
    //Splash Screen
    const splashScreen = document.getElementById('splash-screen');
    const portal = document.getElementById('portal');
    
    // Criar partículas para o splash screen
    createSplashParticles();
    
    // Remover splash screen após o tempo definido
    setTimeout(() => {
        splashScreen.style.opacity = '0';
        setTimeout(() => {
            splashScreen.style.display = 'none';
        }, 1000);
    }, settings.splashDuration);
    
    //Background Canvas com Estrelas e Meteoros
    const canvas = document.getElementById('background-canvas');
    if (!canvas) {
        console.warn('Elemento background-canvas não encontrado');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    let stars = [];
    let meteors = [];
    let mouseX = 0;
    let mouseY = 0;
    
    // Inicializar canvas
    function initCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Criar estrelas
        createStars();
        
        // Iniciar animação
        requestAnimationFrame(animateBackground);
    }
    
    // Função para criar estrelas
    function createStars() {
        stars = [];
        for (let i = 0; i < settings.maxStars; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 2 + 1,
                alpha: Math.random(),
                speed: Math.random() * 0.5
            });
        }
    }
    
    // Função para criar meteoros no canvas
    function createCanvasMeteor() {
        meteors.push({
            x: Math.random() * canvas.width,
            y: 0,
            length: Math.random() * 100 + 50,
            speed: Math.random() * 10 + 5,
            size: Math.random() * 3 + 2
        });
    }
    
    // Animar fundo
    function animateBackground() {
        if (!ctx) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg-color') || '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Desenhar e atualizar estrelas
        drawStars();
        
        // Gerar meteoros ocasionalmente
        if (Math.random() < 0.02) {
            createCanvasMeteor();
        }
        
        // Desenhar e atualizar meteoros
        drawMeteors();
        
        requestAnimationFrame(animateBackground);
    }
    
    // Função para desenhar estrelas
    function drawStars() {
        stars.forEach(star => {
            // Calcular distância do mouse para efeito
            const dx = mouseX - star.x;
            const dy = mouseY - star.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Movimento das estrelas
            if (distance < 100) {
                star.x += dx * 0.01;
                star.y += dy * 0.01;
            }
            
            star.y += star.speed;
            
            // Reposicionar estrelas que saem da tela
            if (star.y > canvas.height) {
                star.y = 0;
                star.x = Math.random() * canvas.width;
            }

            star.alpha = 0.5 + Math.sin(Date.now() * 0.001 + star.radius) * 0.5;
            
            // Desenhar estrela
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
            ctx.fill();
        });
    }
    
    // Desenhar meteoros no canvas
    function drawMeteors() {
        meteors.forEach((meteor, index) => {
            ctx.beginPath();
            ctx.moveTo(meteor.x, meteor.y);
            ctx.lineTo(meteor.x + meteor.size, meteor.y + meteor.length);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.lineWidth = meteor.size;
            ctx.stroke();
            
            meteor.x += meteor.speed;
            meteor.y += meteor.speed;
            
            // Remover meteoros que saem da tela
            if (meteor.y > canvas.height || meteor.x > canvas.width) {
                meteors.splice(index, 1);
            }
        });
    }
    
    // Inicializar canvas após a remoção do splash screen
    setTimeout(initCanvas, settings.splashDuration);
    
    //Parallax e Animações de Entrada
    const sections = document.querySelectorAll('.section');
    
    function checkSections() {
        const triggerBottom = window.innerHeight * 0.8;
        
        sections.forEach(section => {
            if (!section) return;
            
            const sectionTop = section.getBoundingClientRect().top;
            
            if (sectionTop < triggerBottom) {
                section.classList.add('active');
                
                // Animar testemunhos com atraso
                if (section.id === 'depoimentos') {
                    const testimonials = section.querySelectorAll('.testimonial');
                    testimonials.forEach((testimonial, index) => {
                        setTimeout(() => {
                            testimonial.classList.add('active');
                        }, index * 300);
                    });
                }
            }
        });
    }
    
    //Rastro do Cursor (desativado em mobile)
    if (!isMobile) {
        initCursorTrail();
    }
    
    function initCursorTrail() {
        const trails = [];
        
        function createTrailElement() {
            const trail = document.createElement('div');
            trail.className = 'cursor-trail';
            document.body.appendChild(trail);
            return trail;
        }
        
        for (let i = 0; i < settings.cursorTrailCount; i++) {
            trails.push({
                element: createTrailElement(),
                x: 0,
                y: 0,
                age: i * 2,
                active: false
            });
        }
        
        function updateCursorTrail() {
            trails.forEach(trail => {
                if (trail.active) {
                    trail.age += 0.2;
                    const opacity = 1 - (trail.age / 10);
                    const scale = 1 - (trail.age / 10);
                    
                    if (opacity <= 0) {
                        trail.active = false;
                        trail.element.style.opacity = '0';
                    } else {
                        trail.element.style.transform = `translate(${trail.x}px, ${trail.y}px) scale(${scale})`;
                        trail.element.style.opacity = opacity.toString();
                    }
                }
            });
            
            requestAnimationFrame(updateCursorTrail);
        }
        
        updateCursorTrail();
        
        // Atualizar rastro do cursor no movimento do mouse
        document.addEventListener('mousemove', function(e) {
            const inactiveTrail = trails.find(trail => !trail.active);
            if (inactiveTrail) {
                inactiveTrail.x = e.clientX;
                inactiveTrail.y = e.clientY;
                inactiveTrail.age = 0;
                inactiveTrail.active = true;
            }
        });
    }
    
    // 5. Funcionalidades Interativas com Flash e Energia
    const funcionalidades = document.querySelectorAll('.funcionalidade');
    
    funcionalidades.forEach(funcionalidade => {
        if (!funcionalidade) return;
        
        funcionalidade.addEventListener('mouseenter', function() {
            // Efeito flash
            const energyBall = this.querySelector('.energy-ball');
            if (energyBall) {
                energyBall.classList.add('active');
            }
            
            // Som (se ativado)
            if (soundEnabled) {
                const soundId = this.getAttribute('data-sound');
                if (soundId && document.getElementById(soundId)) {
                    document.getElementById(soundId).play();
                }
            }
        });
        
        funcionalidade.addEventListener('mouseleave', function() {
            const energyBall = this.querySelector('.energy-ball');
            if (energyBall) {
                energyBall.classList.remove('active');
            }
        });
    });
    
    // Efeito Meteoro Explosivo em Clique
    document.addEventListener('click', function(e) {
        // Criar vários meteoros no local do clique
        for (let i = 0; i < (isMobile ? 5 : 10); i++) {
            meteors.push({
                x: e.clientX,
                y: e.clientY,
                length: Math.random() * 100 + 20,
                speed: Math.random() * 8 - 4,
                size: Math.random() * 3 + 1
            });
        }
        
        // Som de clique
        if (soundEnabled && document.getElementById('click-sound')) {
            document.getElementById('click-sound').play();
        }
    });
    
    // Controle de Som
    let soundEnabled = false;
    const soundToggle = document.querySelector('.sound-toggle');
    
    if (soundToggle) {
        soundToggle.addEventListener('click', function() {
            soundEnabled = !soundEnabled;
            
            if (soundEnabled) {
                this.innerHTML = '<i class="fas fa-volume-up"></i>';
            } else {
                this.innerHTML = '<i class="fas fa-volume-mute"></i>';
            }
        });
    }
    
    // Mudança de Tema Dinâmica
    let themeState = 0;
    const themeToggle = document.querySelector('.theme-toggle');
    const themes = [
        { bg: '#000', stars: 'rgba(255, 255, 255, 0.8)', accent: 'rgba(142, 45, 226, 0.8)' },
        { bg: '#1a1a2e', stars: 'rgba(255, 215, 0, 0.8)', accent: 'rgba(74, 0, 224, 0.8)' },
        { bg: '#0a0a3a', stars: 'rgba(0, 255, 255, 0.8)', accent: 'rgba(138, 43, 226, 0.8)' }
    ];
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            themeState = (themeState + 1) % themes.length;
            applyTheme(themes[themeState]);
            
            // Som 
            if (soundEnabled && document.getElementById('click-sound')) {
                document.getElementById('click-sound').play();
            }
        });
    }
    
    function applyTheme(theme) {
        document.documentElement.style.setProperty('--bg-color', theme.bg);
        document.documentElement.style.setProperty('--star-color', theme.stars);
        document.documentElement.style.setProperty('--accent-color', theme.accent);
    }
    
    // Efeitos de Scroll
    let lastScrollTop = 0;
    let scrollDirection = 'down';
    
    window.addEventListener('scroll', function() {
        const st = window.pageYOffset || document.documentElement.scrollTop;
        
        if (st > lastScrollTop) {
            scrollDirection = 'down';
        } else {
            scrollDirection = 'up';
        }
        
        lastScrollTop = st <= 0 ? 0 : st;
        
        checkSections();
        
        // Som de scroll (com throttle para não sobrecarregar)
        if (soundEnabled && document.getElementById('scroll-sound')) {
            if (!window.scrollThrottleTimeout) {
                window.scrollThrottleTimeout = setTimeout(function() {
                    document.getElementById('scroll-sound').play();
                    window.scrollThrottleTimeout = null;
                }, 1000);
            }
        }
    });
    
    checkSections();
    
    // Mouse
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Ajustar canvas em redimensionamento
    window.addEventListener('resize', debounce(function() {
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            createStars();
        }
        
        // Reinicializar meteoros 
        if (document.getElementById('meteors-container')) {
            clearInterval(window.meteorInterval);
            initMeteorsAnimation();
        }
    }, 250));
    
    // Criar partículas no splash screen
    function createSplashParticles() {
        const particlesContainer = document.querySelector('.particles');
        if (!particlesContainer) return;
        
        const particleCount = isMobile ? 25 : 50;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = `${Math.random() * 10 + 2}px`;
            particle.style.height = particle.style.width;
            particle.style.background = `hsl(${Math.random() * 60 + 240}, 100%, 70%)`;
            particle.style.borderRadius = '50%';
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.opacity = Math.random().toString();
            
            // Explosão de partículas
            const animDuration = Math.random() * 3 + 2;
            particle.style.animation = `particleMove ${animDuration}s ease-out infinite`;
            
            // Criar keyframes dinâmicos para cada partícula
            const keyframes = `
                @keyframes particleMove {
                    0% { transform: translate(0, 0); opacity: 1; }
                    100% { transform: translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px); opacity: 0; }
                }
            `;
            
            const style = document.createElement('style');
            style.innerHTML = keyframes;
            document.head.appendChild(style);
            
            particlesContainer.appendChild(particle);
        }
    }
    
    // Inicializar animação de meteoros 
    if (document.getElementById('meteors-container')) {
        initMeteorsAnimation();
    }
    
    // Debounce 
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }
});

// Função para inicializar meteoros 
function initMeteorsAnimation() {
    const meteorsContainer = document.getElementById('meteors-container');
    if (!meteorsContainer) {
        console.warn('Elemento meteors-container não encontrado');
        return;
    }
    
    const isMobile = (window.innerWidth <= 768) || 
                    (typeof window.orientation !== "undefined") || 
                    (navigator.userAgent.indexOf('IEMobile') !== -1);
                    
    const settings = {
        maxMeteors: isMobile ? 5 : 10
    };
    
    let activeMeteors = 0;
    
    function createMeteor() {
        // Limitar número máximo de meteoros simultâneos
        if (activeMeteors >= settings.maxMeteors) return;
        
        activeMeteors++;
        
        const meteor = document.createElement('div');
        meteor.classList.add('meteor');
        
        // Posição aleatória no topo
        const startX = Math.random() * window.innerWidth;
        meteor.style.left = startX + 'px';
        meteor.style.top = '-50px';
        
        // Duração da animação aleatória
        const duration = Math.random() * 3 + 2; 
        meteor.style.animationDuration = duration + 's';
        
        // Tamanho aleatório
        const size = Math.random() * 3 + 1;
        meteor.style.height = size + 'px';
        
        // Ângulo aleatório
        const angle = Math.random() * 20 + 30; 
        meteor.style.transform = `rotate(${angle}deg)`;
        
        meteorsContainer.appendChild(meteor);
        
        // Remover o meteoro após a animação
        setTimeout(() => {
            meteor.remove();
            activeMeteors--;
        }, duration * 1000);
    }

    window.meteorInterval = setInterval(createMeteor, isMobile ? 3000 : 2000);
    
    for (let i = 0; i < (isMobile ? 2 : 5); i++) {
        setTimeout(createMeteor, i * 500);
    }
}