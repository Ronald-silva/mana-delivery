let cartItems = [];
let total = 0;

// Função para carregar os produtos do servidor
function carregarProdutos() {
    const timestamp = new Date().getTime();
    fetch(`http://localhost:3000/produtos?_=${timestamp}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar produtos: ' + response.statusText);
            }
            return response.json();
        })
        .then(produtos => {
            // Filtrar apenas produtos disponíveis
            const produtosDisponiveis = produtos.filter(produto => produto.disponivel);

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
        })
        .catch(error => {
            console.error('Erro ao carregar produtos:', error);
            alert('Não foi possível carregar o menu. Verifique se o servidor está rodando.');
        });
}

// Função para adicionar ao carrinho
function addToCart(item, price) {
    const existingItem = cartItems.find(cartItem => cartItem.item === item);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push({ item, price, quantity: 1 });
    }
    total += price;
    updateCart();

    const cartIcon = document.getElementById('cart-icon');
    cartIcon.classList.add('cart-added-animation');
}

// Função para remover do carrinho
function removeFromCart(itemName, event) {
    event.stopPropagation();
    const itemIndex = cartItems.findIndex(cartItem => cartItem.item === itemName);
    if (itemIndex !== -1) {
        const item = cartItems[itemIndex];
        total -= item.price;
        item.quantity -= 1;
        if (item.quantity <= 0) {
            cartItems.splice(itemIndex, 1);
        }
        updateCart();
    }
}

// Função otimizada para atualizar o carrinho
function updateCart() {
    const cartList = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.getElementById('cart-count');

    const fragment = document.createDocumentFragment();
    let totalItems = 0;

    cartItems.forEach(item => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        const itemTotalPrice = (item.price * item.quantity).toFixed(2);
        div.innerHTML = `
            <span>${item.item} (${item.quantity}) - R$ ${itemTotalPrice}</span>
            <button class="remove-item" onclick="removeFromCart('${item.item}', event)">Remover</button>
        `;
        fragment.appendChild(div);
        totalItems += item.quantity;
    });

    cartList.innerHTML = '';
    cartList.appendChild(fragment);
    cartTotal.textContent = total.toFixed(2);
    cartCount.textContent = totalItems;
}

// Função para abrir/fechar o carrinho
function toggleCart(event) {
    if (event) event.stopPropagation();
    const cartModal = document.getElementById('cart-modal');
    const isOpen = cartModal.style.display === 'flex';
    cartModal.style.display = isOpen ? 'none' : 'flex';
    if (!isOpen) {
        cartModal.classList.add('modal-open-animation');
    }
}

// Função para fechar o carrinho ao clicar fora
function closeCartIfClickedOutside(event) {
    const cartModal = document.getElementById('cart-modal');
    const cartContent = document.querySelector('.cart-content');
    const cartIcon = document.getElementById('cart-icon');

    if (cartModal.style.display === 'flex' && !cartContent.contains(event.target) && !cartIcon.contains(event.target)) {
        toggleCart();
    }
}

// Função para mostrar/esconder os campos de pagamento em dinheiro
function toggleCashFields() {
    const paymentMethod = document.getElementById('payment-method').value;
    const cashFields = document.getElementById('cash-payment-fields');
    cashFields.style.display = paymentMethod === 'dinheiro' ? 'block' : 'none';
    if (paymentMethod !== 'dinheiro') {
        document.getElementById('cash-amount').value = '';
        document.getElementById('change-amount').textContent = '0.00';
    }
}

// Função para calcular o troco
function calculateChange() {
    const cashAmount = parseFloat(document.getElementById('cash-amount').value) || 0;
    const changeAmount = document.getElementById('change-amount');
    if (cashAmount >= total) {
        changeAmount.textContent = (cashAmount - total).toFixed(2);
    } else {
        changeAmount.textContent = '0.00';
    }
}

// Função para mostrar/esconder os campos de endereço
document.getElementById('delivery-method').addEventListener('change', function() {
    const addressFields = document.getElementById('address-fields');
    addressFields.style.display = this.value === 'entrega' ? 'block' : 'none';
});

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
    cartItems.forEach(item => {
        const itemTotalPrice = (item.price * item.quantity).toFixed(2);
        pedidoTexto += `- ${item.item} (${item.quantity}): R$ ${itemTotalPrice}\n`;
    });
    pedidoTexto += `\n*Total:* R$ ${total.toFixed(2)}\n`;
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

    cartItems = [];
    total = 0;
    updateCart();
    toggleCart();
}

// Carregar produtos ao abrir a página
document.addEventListener('DOMContentLoaded', () => {
    carregarProdutos();
    const cartModal = document.getElementById('cart-modal');
    cartModal.style.display = 'none';
});

// Adicionar evento para fechar o modal ao clicar fora
document.addEventListener('click', closeCartIfClickedOutside);