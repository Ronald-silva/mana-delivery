let cartItems = [];
let total = 0;

function addToCart(item, price) {
    cartItems.push({item, price});
    total += price;
    updateCart();
}

function removeFromCart(index) {
    const removedItem = cartItems.splice(index, 1)[0];
    total -= removedItem.price;
    updateCart();
}

function updateCart() {
    const cartList = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.getElementById('cart-count');
    
    cartList.innerHTML = '';
    cartItems.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <span>${item.item} - R$ ${item.price.toFixed(2)}</span>
            <button class="remove-item" onclick="removeFromCart(${index})">Remover</button>
        `;
        cartList.appendChild(div);
    });
    
    cartTotal.textContent = total.toFixed(2);
    cartCount.textContent = cartItems.length;
}

function toggleCart() {
    const cartModal = document.getElementById('cart-modal');
    cartModal.style.display = cartModal.style.display === 'flex' ? 'none' : 'flex';
}

function closeCartIfClickedOutside(event) {
    const cartContent = document.querySelector('.cart-content');
    if (!cartContent.contains(event.target) && event.target !== document.getElementById('cart-icon')) {
        toggleCart();
    }
}

function toggleCashFields() {
    const paymentMethod = document.getElementById('payment-method').value;
    const cashFields = document.getElementById('cash-payment-fields');
    cashFields.style.display = paymentMethod === 'dinheiro' ? 'block' : 'none';
    if (paymentMethod !== 'dinheiro') {
        document.getElementById('cash-amount').value = '';
        document.getElementById('change-amount').textContent = '0.00';
    }
}

function calculateChange() {
    const cashAmount = parseFloat(document.getElementById('cash-amount').value) || 0;
    const changeAmount = document.getElementById('change-amount');
    if (cashAmount >= total) {
        changeAmount.textContent = (cashAmount - total).toFixed(2);
    } else {
        changeAmount.textContent = '0.00';
    }
}

document.getElementById('delivery-method').addEventListener('change', function() {
    const addressFields = document.getElementById('address-fields');
    addressFields.style.display = this.value === 'entrega' ? 'block' : 'none';
});

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
        pedidoTexto += `- ${item.item}: R$ ${item.price.toFixed(2)}\n`;
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
    const urlWhatsApp = `https://wa.me/${5585991993833}?text=${pedidoCodificado}`;

    window.open(urlWhatsApp, '_blank');

    cartItems = [];
    total = 0;
    updateCart();
    toggleCart();
}