let cart = [];
let cartTotal = 0;

// URL da API - usa o mesmo domínio da página
const API_URL = window.location.origin;

console.log('Hostname:', window.location.hostname);
console.log('API URL:', API_URL);

// Função para carregar os produtos do servidor
async function carregarProdutos() {
    try {
        console.log('Iniciando carregamento de produtos...');
        const response = await fetch('/api/produtos');
        console.log('Resposta recebida:', response);
        
        if (!response.ok) {
            throw new Error('Erro ao carregar produtos: ' + response.statusText);
        }
        
        const produtos = await response.json();
        console.log('Produtos carregados:', produtos);
        
        // Filtrar apenas produtos disponíveis
        const produtosDisponiveis = produtos.filter(produto => produto.disponivel);
        console.log('Produtos disponíveis:', produtosDisponiveis);

        // Agrupar produtos por categoria
        const produtosPorCategoria = produtosDisponiveis.reduce((acc, produto) => {
            if (!acc[produto.categoria]) {
                acc[produto.categoria] = [];
            }
            acc[produto.categoria].push(produto);
            return acc;
        }, {});

        const menuDiv = document.getElementById('menu');
        menuDiv.innerHTML = '';

        // Exibir produtos por categoria
        for (const categoria in produtosPorCategoria) {
            const categoriaDiv = document.createElement('div');
            categoriaDiv.className = 'categoria-section';
            categoriaDiv.innerHTML = `<h2>${categoria}</h2>`;
            const produtosDiv = document.createElement('div');
            produtosDiv.className = 'categoria-produtos';

            produtosPorCategoria[categoria].forEach(produto => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'menu-item';
                const precoExibido = produto.precoPromocional || produto.preco;
                itemDiv.innerHTML = `
                    <img src="${produto.imagem}" alt="${produto.nome}">
                    <div>
                        <h3>${produto.nome}</h3>
                        <p>${produto.descricao}</p>
                        <p>Preço: R$ ${precoExibido.toFixed(2)}</p>
                        <button onclick="addToCart('${produto.nome}', ${precoExibido})">Adicionar ao Carrinho</button>
                    </div>
                `;
                produtosDiv.appendChild(itemDiv);
            });

            categoriaDiv.appendChild(produtosDiv);
            menuDiv.appendChild(categoriaDiv);
        }
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        alert('Não foi possível carregar o menu. Por favor, tente novamente mais tarde.');
    }
}

function addToCart(name, price) {
    // Procura se o item já existe no carrinho
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    cartTotal += price;
    updateCartDisplay();
}

function removeFromCart(index) {
    const item = cart[index];
    if (item.quantity > 1) {
        item.quantity -= 1;
        cartTotal -= item.price;
    } else {
        cartTotal -= item.price;
        cart.splice(index, 1);
    }
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotalElement = document.getElementById('cart-total');
    
    // Calcula o total de itens (soma das quantidades)
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartTotalElement.textContent = cartTotal.toFixed(2);
    
    cartItems.innerHTML = '';
    cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            ${item.name} x ${item.quantity} - R$ ${(item.price * item.quantity).toFixed(2)}
            <button onclick="removeFromCart(${index})">Remover</button>
        `;
        cartItems.appendChild(itemElement);
    });
}

function toggleCart() {
    const modal = document.getElementById('cart-modal');
    if (modal.style.display === 'none') {
        modal.style.display = 'flex';
        // Reset dos campos ao abrir o modal
        document.getElementById('delivery-method').value = 'retirada';
        document.getElementById('payment-method').value = 'pix';
        toggleAddressFields();
        toggleCashFields();
    } else {
        modal.style.display = 'none';
    }
}

function closeCartIfClickedOutside(event) {
    const modal = document.getElementById('cart-modal');
    const cartContent = document.querySelector('.cart-content');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// Função para mostrar/esconder os campos de pagamento em dinheiro
function toggleCashFields() {
    const paymentMethod = document.getElementById('payment-method').value;
    const cashFields = document.getElementById('cash-payment-fields');
    
    if (paymentMethod === 'dinheiro') {
        cashFields.style.display = 'block';
        // Adiciona o evento de input para calcular o troco em tempo real
        document.getElementById('cash-amount').addEventListener('input', calculateChange);
    } else {
        cashFields.style.display = 'none';
        document.getElementById('cash-amount').value = '';
        document.getElementById('change-amount').textContent = '0.00';
    }
}

// Função para calcular o troco
function calculateChange() {
    const cashAmount = parseFloat(document.getElementById('cash-amount').value) || 0;
    const changeAmount = document.getElementById('change-amount');
    const change = cashAmount - cartTotal;
    
    if (change >= 0) {
        changeAmount.textContent = change.toFixed(2);
    } else {
        changeAmount.textContent = '0.00';
    }
}

// Função para mostrar/esconder os campos de endereço
function toggleAddressFields() {
    const deliveryMethod = document.getElementById('delivery-method').value;
    const addressField = document.querySelector('.address-field');
    
    if (deliveryMethod === 'entrega') {
        addressField.style.display = 'block';
    } else {
        addressField.style.display = 'none';
        document.getElementById('customer-address').value = '';
    }
}

// Função para inicializar o modal do carrinho
function initializeCartModal() {
    // Configura os eventos dos selects
    document.getElementById('delivery-method').addEventListener('change', toggleAddressFields);
    document.getElementById('payment-method').addEventListener('change', toggleCashFields);
    
    // Esconde os campos condicionais inicialmente
    const addressField = document.querySelector('.address-field');
    const cashFields = document.getElementById('cash-payment-fields');
    
    addressField.style.display = 'none';
    cashFields.style.display = 'none';
}

// Função para finalizar o pedido
function finalizePedido() {
    const deliveryMethod = document.getElementById('delivery-method').value;
    const paymentMethod = document.getElementById('payment-method').value;
    let address = '';
    if (deliveryMethod === 'entrega') {
        address = document.getElementById('customer-address').value;
        if (!address) {
            alert('Por favor, informe o endereço de entrega.');
            return;
        }
    }

    let pedidoTexto = `*Novo Pedido*\n\n`;
    pedidoTexto += `*Itens do Pedido:*\n`;
    cart.forEach(item => {
        pedidoTexto += `- ${item.name} (${item.quantity}): R$ ${item.price.toFixed(2)}\n`;
    });
    pedidoTexto += `\n*Total:* R$ ${cartTotal.toFixed(2)}\n`;
    pedidoTexto += `*Método de Entrega:* ${deliveryMethod === 'entrega' ? 'Entrega a domicílio' : 'Retirada no local'}\n`;
    if (deliveryMethod === 'entrega') {
        pedidoTexto += `*Endereço de Entrega:* ${address}\n`;
    }
    pedidoTexto += `*Forma de Pagamento:* ${paymentMethod}\n`;
    if (paymentMethod === 'dinheiro') {
        const cashAmount = parseFloat(document.getElementById('cash-amount').value) || 0;
        const changeAmount = parseFloat(document.getElementById('change-amount').textContent);
        pedidoTexto += `*Valor em Dinheiro:* R$ ${cashAmount.toFixed(2)}\n`;
        pedidoTexto += `*Troco:* R$ ${changeAmount.toFixed(2)}\n`;
    }

    const pedidoCodificado = encodeURIComponent(pedidoTexto);
    const numeroWhatsApp = '5585991993833';
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${pedidoCodificado}`;

    window.open(urlWhatsApp, '_blank');

    cart = [];
    cartTotal = 0;
    updateCartDisplay();
    toggleCart();
}

// Carregar produtos ao abrir a página
document.addEventListener('DOMContentLoaded', () => {
    carregarProdutos();
    const modal = document.getElementById('cart-modal');
    modal.style.display = 'none';
    initializeCartModal();
});

// Adicionar evento para fechar o modal ao clicar fora
document.addEventListener('click', closeCartIfClickedOutside);