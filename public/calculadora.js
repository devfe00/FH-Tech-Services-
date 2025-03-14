document.addEventListener('DOMContentLoaded', function() {
    // Elementos da interface
    const projectTypeCards = document.querySelectorAll('#project-type .option-card');
    const pagesSlider = document.getElementById('pages-slider');
    const pagesValue = document.getElementById('pages-value');
    const featureCards = document.querySelectorAll('#features .option-card');
    const designCards = document.querySelectorAll('#design .option-card');
    const deadlineSelect = document.getElementById('deadline');
    const totalPriceElement = document.getElementById('total-price');
    const priceBreakdownElement = document.getElementById('price-breakdown');
    const contactButton = document.getElementById('contact-btn');

    // Estado da calculadora
    let calculator = {
        projectType: null,
        pages: 5,
        features: [],
        design: null,
        deadline: 'normal',
        
        // Preços base (podem ser ajustados conforme necessário)
        prices: {
            pagePrice: 150,  // preço por página adicional
        },
        
        // Totais
        totals: {
            projectTypePrice: 0,
            pagesPrice: 0,
            featuresPrice: 0,
            designPrice: 0,
            deadlinePrice: 0,
            total: 0
        }
    };

    // Inicializa o valor exibido do slider
    pagesValue.textContent = pagesSlider.value;

    // Função para atualizar o preço total
    function updateTotalPrice() {
        // Calcula preço do tipo de projeto
        calculator.totals.projectTypePrice = calculator.projectType ? 
            parseInt(document.querySelector(`#project-type .option-card[data-value="${calculator.projectType}"]`).dataset.price) : 0;
        
        // Calcula preço das páginas (preço por página adicional além de 5 páginas que já estão incluídas)
        const additionalPages = Math.max(0, calculator.pages - 5);
        calculator.totals.pagesPrice = additionalPages * calculator.prices.pagePrice;
        
        // Calcula preço das funcionalidades
        calculator.totals.featuresPrice = calculator.features.reduce((total, feature) => {
            const featurePrice = parseInt(document.querySelector(`#features .option-card[data-value="${feature}"]`).dataset.price);
            return total + featurePrice;
        }, 0);
        
        // Calcula preço do design
        calculator.totals.designPrice = calculator.design ? 
            parseInt(document.querySelector(`#design .option-card[data-value="${calculator.design}"]`).dataset.price) : 0;
        
        // Calcula preço do prazo
        calculator.totals.deadlinePrice = parseInt(deadlineSelect.options[deadlineSelect.selectedIndex].dataset.price);
        
        // Calcula total geral
        calculator.totals.total = 
            calculator.totals.projectTypePrice + 
            calculator.totals.pagesPrice + 
            calculator.totals.featuresPrice + 
            calculator.totals.designPrice + 
            calculator.totals.deadlinePrice;
        
        // Atualiza a interface
        totalPriceElement.textContent = `R$ ${calculator.totals.total.toLocaleString('pt-BR')}`;
        
        // Atualiza o detalhamento do preço
        updatePriceBreakdown();
    }
    
    // Função para atualizar o detalhamento do preço
    function updatePriceBreakdown() {
        // Limpa o conteúdo atual
        priceBreakdownElement.innerHTML = '';
        
        // Adiciona os itens do detalhamento
        if (calculator.projectType) {
            const projectTypeCard = document.querySelector(`#project-type .option-card[data-value="${calculator.projectType}"]`);
            addBreakdownItem('Tipo de Projeto: ' + projectTypeCard.querySelector('h3').textContent, 
                            calculator.totals.projectTypePrice);
        }
        
        if (calculator.pages > 5) {
            addBreakdownItem(`Páginas adicionais: ${calculator.pages - 5}`, calculator.totals.pagesPrice);
        }
        
        if (calculator.features.length > 0) {
            calculator.features.forEach(feature => {
                const featureCard = document.querySelector(`#features .option-card[data-value="${feature}"]`);
                const featurePrice = parseInt(featureCard.dataset.price);
                addBreakdownItem('Funcionalidade: ' + featureCard.querySelector('h3').textContent, featurePrice);
            });
        }
        
        if (calculator.design) {
            const designCard = document.querySelector(`#design .option-card[data-value="${calculator.design}"]`);
            addBreakdownItem('Design: ' + designCard.querySelector('h3').textContent, 
                           calculator.totals.designPrice);
        }
        
        if (calculator.deadline !== 'normal' && calculator.totals.deadlinePrice > 0) {
            addBreakdownItem('Prazo: ' + deadlineSelect.options[deadlineSelect.selectedIndex].textContent, 
                           calculator.totals.deadlinePrice);
        }
    }
    
    // Função auxiliar para adicionar um item ao detalhamento
    function addBreakdownItem(label, price) {
        const item = document.createElement('div');
        item.className = 'breakdown-item';
        item.innerHTML = `
            <div>${label}</div>
            <div>R$ ${price.toLocaleString('pt-BR')}</div>
        `;
        priceBreakdownElement.appendChild(item);
    }

    // Event Listeners
    
    // Tipo de Projeto
    projectTypeCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove a seleção anterior
            projectTypeCards.forEach(c => c.classList.remove('selected'));
            
            // Adiciona a seleção atual
            this.classList.add('selected');
            
            // Atualiza o estado
            calculator.projectType = this.dataset.value;
            
            // Atualiza o preço
            updateTotalPrice();
        });
    });
    
    // Número de Páginas
    pagesSlider.addEventListener('input', function() {
        // Atualiza o valor exibido
        pagesValue.textContent = this.value;
        
        // Atualiza o estado
        calculator.pages = parseInt(this.value);
        
        // Atualiza o preço
        updateTotalPrice();
    });
    
    // Funcionalidades
    featureCards.forEach(card => {
        card.addEventListener('click', function() {
            // Toggle da seleção
            this.classList.toggle('selected');
            
            const feature = this.dataset.value;
            
            // Atualiza o estado
            if (this.classList.contains('selected')) {
                // Adiciona a funcionalidade se não existir
                if (!calculator.features.includes(feature)) {
                    calculator.features.push(feature);
                }
            } else {
                // Remove a funcionalidade
                calculator.features = calculator.features.filter(f => f !== feature);
            }
            
            // Atualiza o preço
            updateTotalPrice();
        });
    });
    
    // Design
    designCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove a seleção anterior
            designCards.forEach(c => c.classList.remove('selected'));
            
            // Adiciona a seleção atual
            this.classList.add('selected');
            
            // Atualiza o estado
            calculator.design = this.dataset.value;
            
            // Atualiza o preço
            updateTotalPrice();
        });
    });
    
    // Prazo de Entrega
    deadlineSelect.addEventListener('change', function() {
        // Atualiza o estado
        calculator.deadline = this.value;
        
        // Atualiza o preço
        updateTotalPrice();
    });
    
    // Botão de contato
    contactButton.addEventListener('click', function() {
        if (calculator.totals.total === 0) {
            alert('Por favor, selecione pelo menos um tipo de projeto para continuar.');
            return;
        }
        
        // Aqui você pode implementar o envio do orçamento por e-mail ou redirecionamento para um formulário de contato
        alert('Obrigado pelo interesse! Em breve entraremos em contato para discutir seu projeto.');
        
        // Você pode adicionar código para enviar os dados para um servidor ou integrar com um formulário
        console.log('Dados do orçamento:', {
            projectType: calculator.projectType,
            pages: calculator.pages,
            features: calculator.features,
            design: calculator.design,
            deadline: calculator.deadline,
            totalPrice: calculator.totals.total
        });
    });
});

const isCalculadoraPage = document.querySelector('.calculadora-page');
if (isCalculadoraPage) {
}