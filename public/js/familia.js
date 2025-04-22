// Array para armazenar os itens do carrinho
let cart = [];

// Função para atualizar o contador do carrinho
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Função para calcular o total do carrinho
function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
}

// Função para renderizar os itens do carrinho no modal
function renderCart() {
    const cartItemsDiv = document.getElementById('cartItems');
    const cartTotalSpan = document.getElementById('cartTotal');
    cartItemsDiv.innerHTML = '';

    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <span>${item.name} (${item.size}) - R$ ${(item.price * item.quantity).toFixed(2)} (${item.quantity}x)</span>
            <div>
                <button onclick="updateQuantity(${index}, -1)">-</button>
                <button onclick="updateQuantity(${index}, 1)">+</button>
                <button onclick="removeFromCart(${index})">Remover</button>
            </div>
        `;
        cartItemsDiv.appendChild(cartItem);
    });

    cartTotalSpan.textContent = calculateTotal();
    updateChangeAmount(); // Atualiza o valor de troco ao renderizar o carrinho
}

// Função para adicionar ou incrementar item no carrinho
function addToCart(name, size, price) {
    const existingItem = cart.find(item => item.name === name && item.size === size);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, size, price, quantity: 1 });
    }

    updateCartCount();
    renderCart();
}

// Função para atualizar a quantidade de um item
function updateQuantity(index, change) {
    const item = cart[index];
    item.quantity += change;

    if (item.quantity <= 0) {
        cart.splice(index, 1);
    }

    updateCartCount();
    renderCart();
}

// Função para remover item do carrinho
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCount();
    renderCart();
}

// Evento para os botões "Adicionar ao Carrinho"
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        const card = button.closest('.product-card');
        const name = card.querySelector('select').dataset.name;
        const select = card.querySelector('.size-select');
        const option = select.value.split('-');
        const size = option[0].charAt(0).toUpperCase() + option[0].slice(1); // Capitaliza "média" ou "grande"
        const price = parseFloat(option[1]);

        addToCart(name, size, price);
    });
});

// Controle do Modal do Carrinho
const cartModal = document.getElementById('cartModal');
const cartBtn = document.getElementById('cartBtn');
const closeModal = document.querySelector('.close');

cartBtn.addEventListener('click', () => {
    cartModal.style.display = 'block';
    renderCart();
});

closeModal.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

// Controle dinâmico do formulário
const deliveryOption = document.getElementById('deliveryOption');
const customerAddressInput = document.getElementById('customerAddress');
const customerAddressLabel = customerAddressInput.previousElementSibling;
const changeSection = document.getElementById('changeSection');
const paymentMethod = document.getElementById('paymentMethod');
const changeDetails = document.getElementById('changeDetails');
const changeForInput = document.getElementById('changeFor');
const changeAmount = document.getElementById('changeAmount');
const changeValue = document.getElementById('changeValue');

// Função para atualizar o valor de troco que o motoboy deve levar
function updateChangeAmount() {
  const total = parseFloat(calculateTotal());
  const changeFor = parseFloat(changeForInput.value) || 0;

  if (paymentMethod.value === 'dinheiro' && deliveryOption.value === 'entrega') {
      changeAmount.style.display = 'block';
      if (changeFor < total) {
          changeAmount.style.color = '#e74c3c';
          changeAmount.innerHTML = `Valor insuficiente! O total do pedido é R$ ${total.toFixed(2)}.`;
      } else if (changeFor > total) {
          const change = (changeFor - total).toFixed(2);
          changeAmount.style.color = '#2ecc71';
          changeAmount.innerHTML = `O motoboy deve levar R$ <span id="changeValue">${change}</span> de troco.`;
      } else {
          changeAmount.style.color = '#2ecc71';
          changeAmount.innerHTML = 'Sem troco necessário.';
      }
  } else {
      changeAmount.style.display = 'none';
  }
}

deliveryOption.addEventListener('change', () => {
    if (deliveryOption.value === 'entrega') {
        customerAddressLabel.style.display = 'block';
        customerAddressInput.style.display = 'block';
        customerAddressInput.setAttribute('required', 'true');
        changeSection.style.display = 'block';
    } else {
        customerAddressLabel.style.display = 'none';
        customerAddressInput.style.display = 'none';
        customerAddressInput.removeAttribute('required');
        changeSection.style.display = 'none';
        changeDetails.style.display = 'none';
        changeAmount.style.display = 'none';
    }
    updateChangeAmount();
});

// Inicialmente, esconde o campo de endereço
customerAddressLabel.style.display = 'none';
customerAddressInput.style.display = 'none';

paymentMethod.addEventListener('change', () => {
    if (paymentMethod.value === 'dinheiro' && deliveryOption.value === 'entrega') {
        changeDetails.style.display = 'block';
        updateChangeAmount();
    } else {
        changeDetails.style.display = 'none';
        changeAmount.style.display = 'none';
    }
});

changeForInput.addEventListener('input', () => {
    updateChangeAmount();
});

// Envio do pedido via WhatsApp
document.getElementById('checkoutForm').addEventListener('submit', (event) => {
    event.preventDefault();

    if (cart.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }

    const customerName = document.getElementById('customerName').value;
    const customerAddress = document.getElementById('customerAddress').value;
    const deliveryOpt = document.getElementById('deliveryOption').value;
    const paymentMeth = document.getElementById('paymentMethod').value;
    const changeFor = parseFloat(document.getElementById('changeFor').value) || 0;
    const total = parseFloat(calculateTotal());

    // Validação para pagamento em dinheiro
    if (paymentMeth === 'dinheiro' && deliveryOpt === 'entrega' && changeFor < total) {
        alert('O valor para troco é insuficiente! Por favor, insira um valor maior ou igual ao total do pedido.');
        return;
    }

    // Montar a mensagem do pedido
    let message = `*Novo Pedido - Marmitaria Família*\n\n`;
    message += `*Cliente:* ${customerName}\n`;
    message += `*Itens do Pedido:*\n`;
    cart.forEach(item => {
        message += `- ${item.name} (${item.size}) - R$ ${(item.price * item.quantity).toFixed(2)} (${item.quantity}x)\n`;
    });
    message += `\n*Total:* R$ ${calculateTotal()}\n`;
    message += `*Opção de Entrega:* ${deliveryOpt === 'entrega' ? 'Entrega a Domicílio' : 'Retirada na Loja'}\n`;

    if (deliveryOpt === 'entrega') {
        if (!customerAddress) {
            alert('Por favor, informe o endereço para entrega!');
            return;
        }
        message += `*Endereço:* ${customerAddress}\n`;
        message += `*Método de Pagamento:* ${paymentMeth === 'dinheiro' ? 'Dinheiro' : paymentMeth === 'pix' ? 'Pix' : 'Cartão'}\n`;
        if (paymentMeth === 'dinheiro') {
            if (changeFor > 0) {
                message += `*Troco para:* R$ ${changeFor.toFixed(2)}\n`;
                if (changeFor > total) {
                    const change = (changeFor - total).toFixed(2);
                    message += `*Troco a ser levado pelo motoboy:* R$ ${change}\n`;
                } else {
                    message += `*Sem troco necessário.*\n`;
                }
            } else {
                message += `*Sem troco necessário.*\n`;
            }
        }
    }

    // Enviar para o WhatsApp
    const whatsappNumber = '+558599898380';
    const whatsappMessage = encodeURIComponent(message);
    const whatsappURL = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${whatsappMessage}`;
    window.open(whatsappURL, '_blank');

    // Limpar o carrinho e o formulário após o envio
    cart = [];
    updateCartCount();
    renderCart();
    document.getElementById('checkoutForm').reset();
    cartModal.style.display = 'none';
    customerAddressLabel.style.display = 'none';
    customerAddressInput.style.display = 'none';
    changeSection.style.display = 'none';
    changeDetails.style.display = 'none';
    changeAmount.style.display = 'none';
});