// Array para armazenar os itens do carrinho
let cart = [];

// Função para inicializar os eventos
function initializeEvents() {
    console.log('Inicializando eventos...');
    
    // Eventos de seleção de proteínas
    document.querySelectorAll('.protein-checkboxes').forEach(container => {
        container.addEventListener('change', function(e) {
            if (e.target.type === 'checkbox') {
                const checkedBoxes = this.querySelectorAll('input[type="checkbox"]:checked');
                if (checkedBoxes.length > 2) {
                    e.target.checked = false;
                    alert('Você só pode selecionar até 2 proteínas.');
                }
            }
        });
    });
    
    // Eventos dos botões "Adicionar ao Carrinho"
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            console.log('Botão clicado');
            const productCard = this.closest('.product-card');
            const sizeSelect = productCard.querySelector('.size-select');
            const proteinOptions = productCard.querySelector('.protein-options');
            
            if (sizeSelect.value === 'grande-14') {
                const checkedProteins = productCard.querySelectorAll('input[type="checkbox"]:checked');
                if (checkedProteins.length === 0) {
                    alert('Por favor, selecione pelo menos uma proteína para a marmita grande.');
                    return;
                }
            }
            
            addToCart(this);
        });
    });

    // Eventos de mudança de tamanho
    document.querySelectorAll('.size-select').forEach(select => {
        select.addEventListener('change', function() {
            const productCard = this.closest('.product-card');
            const proteinOptions = productCard.querySelector('.protein-options');
            
            if (this.value === 'grande-14') {
                proteinOptions.style.display = 'block';
            } else {
                proteinOptions.style.display = 'none';
                // Desmarca todas as proteínas quando muda para tamanho médio
                productCard.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                    cb.checked = false;
                });
            }
        });
    });

    // Eventos de mudança na segunda proteína
    document.querySelectorAll('.second-protein-select').forEach(select => {
        select.addEventListener('change', function() {
            this.style.borderColor = this.value ? '#ddd' : '#ff4444';
        });
    });

    // Evento do botão do carrinho
    document.getElementById('cartBtn').addEventListener('click', function() {
        console.log('Abrindo carrinho');
        document.getElementById('cartModal').style.display = 'block';
        renderCart();
        setTimeout(atualizarLinkWhatsApp, 100);
    });

    // Evento do botão fechar do modal
    document.querySelector('.close').addEventListener('click', function() {
        console.log('Fechando carrinho');
        document.getElementById('cartModal').style.display = 'none';
    });

    // Evento de mudança do método de pagamento
    document.getElementById('paymentMethod').addEventListener('change', function() {
        const pixSection = document.getElementById('pixPaymentSection');
        const changeDetails = document.getElementById('changeDetails');
        const changeAmount = document.getElementById('changeAmount');
        
        if (this.value === 'pix') {
            pixSection.style.display = 'block';
            changeDetails.style.display = 'none';
            changeAmount.style.display = 'none';
            document.querySelector('.pix-value').textContent = calculateTotal();
        } else if (this.value === 'dinheiro') {
            pixSection.style.display = 'none';
            changeDetails.style.display = 'block';
            changeAmount.style.display = 'block';
            updateChangeAmount();
        } else {
            pixSection.style.display = 'none';
            changeDetails.style.display = 'none';
            changeAmount.style.display = 'none';
        }
    });

    // Evento para copiar chave PIX
    document.getElementById('copyPixKey').addEventListener('click', function() {
        const pixKey = document.querySelector('.pix-key span').textContent;
        navigator.clipboard.writeText(pixKey).then(() => {
            const copyButton = this;
            const originalText = copyButton.textContent;
            copyButton.textContent = 'Copiado!';
            copyButton.style.backgroundColor = '#28a745';
            
            setTimeout(() => {
                copyButton.textContent = originalText;
                copyButton.style.backgroundColor = '';
            }, 2000);
        }).catch(err => {
            console.error('Erro ao copiar:', err);
            alert('Não foi possível copiar a chave PIX. Por favor, copie manualmente.');
        });
    });

    // Evento para upload de comprovante
    document.getElementById('uploadComprovante').addEventListener('click', function() {
        document.getElementById('comprovanteInput').click();
    });

    document.getElementById('comprovanteInput').addEventListener('change', handleComprovanteUpload);

    // Evento para remover comprovante
    document.getElementById('removeComprovante').addEventListener('click', removeComprovante);

    // Evento para atualizar o troco quando o valor em dinheiro mudar
    document.getElementById('changeFor').addEventListener('input', updateChangeAmount);

    // Evento do formulário de checkout
    document.getElementById('checkoutForm').addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Formulário submetido');
        
        const customerName = document.getElementById('customerName').value;
        const deliveryOption = document.getElementById('deliveryOption').value;
        const address = document.getElementById('customerAddress').value;
        const observations = document.getElementById('observations').value;
        const total = calculateTotal();
        const paymentMethod = this.paymentMethod.value;
        const changeFor = document.getElementById('changeFor').value;

        // Monta a mensagem do pedido
        let message = `🏪 *NOVO PEDIDO - MARMITARIA FAMÍLIA*\n`;
        message += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
        
        // Informações do Cliente
        message += `👤 *DADOS DO CLIENTE*\n`;
        message += `*Nome:* ${customerName}\n`;
        message += `*Tipo:* ${deliveryOption === 'entrega' ? '🛵 Delivery' : '🏃 Retirada no Local'}\n`;
        if (deliveryOption === 'entrega' && address) {
            message += `*Endereço:* ${address}\n`;
        }
        message += `\n`;

        // Detalhes do Pedido
        message += `📝 *ITENS DO PEDIDO*\n`;
        cart.forEach((item, index) => {
            message += `*${index + 1}.* ${item.name}\n`;
            message += `   • *Quantidade:* ${item.quantity}x\n`;
            message += `   • *Tamanho:* ${item.size === 'media-12' ? 'Média' : 'Grande'}\n`;
            if (item.proteins && item.proteins.length > 0) {
                message += `   • *Proteínas:* ${item.proteins.join(' + ')}\n`;
            }
            message += `   • *Valor unitário:* R$ ${(item.price/item.quantity).toFixed(2)}\n`;
            message += `   • *Subtotal:* R$ ${item.price.toFixed(2)}\n`;
            message += `\n`;
        });

        // Pagamento
        message += `💰 *FORMA DE PAGAMENTO*\n`;
        let formaPagamento = '';
        switch(paymentMethod) {
            case 'pix':
                formaPagamento = '💠 PIX';
                break;
            case 'cartao':
                formaPagamento = '💳 Cartão (na entrega)';
                break;
            case 'dinheiro':
                formaPagamento = '💵 Dinheiro';
                if (changeFor) {
                    const changeValue = parseFloat(changeFor) - parseFloat(total);
                    message += `*Valor em dinheiro:* R$ ${parseFloat(changeFor).toFixed(2)}\n`;
                    message += `*Troco:* R$ ${changeValue.toFixed(2)}\n`;
                }
                break;
        }
        message += `*Método:* ${formaPagamento}\n\n`;
        
        // Total
        message += `💵 *TOTAL DO PEDIDO*\n`;
        message += `*R$ ${total}*\n`;
        
        // Observações (se houver)
        if (observations) {
            message += `\n📝 *OBSERVAÇÕES*\n`;
            message += `${observations}\n`;
        }

        // Data e Hora
        const now = new Date();
        const dataHora = now.toLocaleString('pt-BR', { 
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        message += `\n⏰ *Pedido realizado em:* ${dataHora}`;

        // Função para enviar para o WhatsApp
        function enviarParaWhatsApp() {
            const phoneNumber = '5531998593531';
            const encodedMessage = encodeURIComponent(message);
            
            // Tenta abrir o WhatsApp Web primeiro
            const whatsappWebLink = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
            
            // Tenta abrir o WhatsApp Desktop/App
            const whatsappAppLink = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
            
            // Tenta abrir o WhatsApp Web
            const webWindow = window.open(whatsappWebLink, '_blank');
            
            // Se não conseguir abrir o WhatsApp Web, tenta o App
            setTimeout(() => {
                if (!webWindow || webWindow.closed) {
                    window.location.href = whatsappAppLink;
                }
            }, 1000);
        }

        // Envia para o WhatsApp
        enviarParaWhatsApp();
        
        // Reseta tudo para um novo pedido
        resetarFormulario();
    });
}

// Função para atualizar o carrinho
function updateCart() {
    console.log('Atualizando carrinho');
    updateCartCount();
    renderCart();
}

// Função para atualizar o contador do carrinho
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    console.log('Contador do carrinho atualizado:', totalItems);
}

// Função para renderizar os itens do carrinho
function renderCart() {
    console.log('Renderizando carrinho');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    cartItems.innerHTML = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        
        let itemText = `${item.name} (${item.size})`;
        if (item.proteins && item.proteins.length > 0) {
            itemText += `<br>Proteínas: ${item.proteins.join(' + ')}`;
        }
        itemText += `<br>${item.quantity}x R$ ${(item.price/item.quantity).toFixed(2)} = R$ ${item.price.toFixed(2)}`;
        
        itemElement.innerHTML = `
            <div>${itemText}</div>
            <div class="item-controls">
                <button type="button" onclick="updateItemQuantity(${index}, -1)">-</button>
                <span>${item.quantity}</span>
                <button type="button" onclick="updateItemQuantity(${index}, 1)">+</button>
                <button type="button" onclick="removeFromCart(${index})">Remover</button>
            </div>
        `;
        
        cartItems.appendChild(itemElement);
        total += item.price;
    });
    
    cartTotal.textContent = total.toFixed(2);
    
    // Atualiza o valor na seção PIX se estiver visível
    if (document.getElementById('pixPaymentSection').style.display === 'block') {
        document.querySelector('.pix-value').textContent = total.toFixed(2);
    }
    
    console.log('Carrinho renderizado, total:', total);
}

// Função para remover item do carrinho
function removeFromCart(index) {
    console.log('Removendo item do carrinho:', index);
    cart.splice(index, 1);
    updateCart();
}

// Função para adicionar item ao carrinho
function addToCart(button) {
    const productCard = button.closest('.product-card');
    const productName = productCard.querySelector('h3').textContent;
    const sizeSelect = productCard.querySelector('.size-select');
    const checkedProteins = productCard.querySelectorAll('input[type="checkbox"]:checked');
    
    let price = parseFloat(button.dataset.price);
    let size = sizeSelect.value;
    
    if (size === 'grande-14') {
        price = 14.00;
        if (checkedProteins.length === 0) {
            alert('Por favor, selecione pelo menos uma proteína para a marmita grande.');
            return;
        }
    }
    
    const selectedProteins = Array.from(checkedProteins).map(cb => cb.value);
    
    const product = {
        name: productName,
        size: size,
        price: price,
        proteins: selectedProteins,
        quantity: 1
    };

    // Procura por um item igual no carrinho
    const existingItemIndex = cart.findIndex(item => 
        item.name === product.name && 
        item.size === product.size && 
        JSON.stringify(item.proteins) === JSON.stringify(product.proteins)
    );

    if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += 1;
        cart[existingItemIndex].price = price * cart[existingItemIndex].quantity;
    } else {
        cart.push(product);
    }
    
    console.log('Produto adicionado:', product);
    updateCart();
}

// Função para gerenciar o upload do comprovante
function handleComprovanteUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('comprovanteImage').src = e.target.result;
            document.getElementById('comprovantePreview').style.display = 'block';
            document.getElementById('paymentConfirmed').checked = true;
        };
        reader.readAsDataURL(file);
    }
}

// Função para remover o comprovante
function removeComprovante() {
    document.getElementById('comprovanteImage').src = '';
    document.getElementById('comprovantePreview').style.display = 'none';
    document.getElementById('comprovanteInput').value = '';
    document.getElementById('paymentConfirmed').checked = false;
}

// Inicializar eventos quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado');
    initializeEvents();
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

// Função para atualizar o valor de troco
function updateChangeAmount() {
    const total = parseFloat(calculateTotal());
    const changeFor = parseFloat(document.getElementById('changeFor').value) || 0;
    const changeAmount = document.getElementById('changeAmount');

    if (changeFor > 0) {
        if (changeFor < total) {
            changeAmount.style.color = '#ff4444';
            changeAmount.innerHTML = `Valor insuficiente! O total do pedido é R$ ${total.toFixed(2)}`;
        } else {
            const change = changeFor - total;
            changeAmount.style.color = '#28a745';
            changeAmount.innerHTML = `Troco: R$ ${change.toFixed(2)}`;
        }
        changeAmount.style.display = 'block';
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

// Função para mostrar/esconder seleção de segunda proteína
document.querySelectorAll('.size-select').forEach(select => {
    select.addEventListener('change', function() {
        const secondProteinSelect = this.parentElement.querySelector('.second-protein-select');
        if (this.value === 'grande-14') {
            secondProteinSelect.style.display = 'block';
        } else {
            secondProteinSelect.style.display = 'none';
            secondProteinSelect.value = '';
        }
    });
});

// Função para calcular o total do carrinho
function calculateTotal() {
    return cart.reduce((total, item) => total + item.price, 0).toFixed(2);
}

function updateItemQuantity(index, change) {
    const item = cart[index];
    const newQuantity = item.quantity + change;
    
    if (newQuantity > 0) {
        item.quantity = newQuantity;
        item.price = (item.price/item.quantity) * newQuantity;
        updateCart();
    } else if (newQuantity === 0) {
        removeFromCart(index);
    }
}

// Função para atualizar o link do WhatsApp
function atualizarLinkWhatsApp() {
    const customerName = document.getElementById('customerName').value;
    const deliveryOption = document.getElementById('deliveryOption').value;
    const address = document.getElementById('customerAddress').value;
    const observations = document.getElementById('observations').value;
    const paymentMethod = document.getElementById('paymentMethod').value;
    const changeFor = document.getElementById('changeFor').value;
    const total = calculateTotal();

    // Monta a mensagem do pedido
    let message = `*NOVO PEDIDO*\n\n`;
    message += `*Cliente:* ${customerName}\n`;
    message += `*Tipo:* ${deliveryOption === 'entrega' ? 'Delivery' : 'Retirada'}\n`;
    if (deliveryOption === 'entrega' && address) {
        message += `*Endereço:* ${address}\n`;
    }
    message += `\n*Itens:*\n`;
    
    cart.forEach((item, index) => {
        message += `*${index + 1}.* ${item.name}\n`;
        message += `   • *Quantidade:* ${item.quantity}x\n`;
        message += `   • *Tamanho:* ${item.size === 'media-12' ? 'Média' : 'Grande'}\n`;
        if (item.proteins && item.proteins.length > 0) {
            message += `   • *Proteínas:* ${item.proteins.join(' + ')}\n`;
        }
        message += `   • *Valor:* R$ ${item.price.toFixed(2)}\n\n`;
    });

    message += `*Total:* R$ ${total}\n`;
    message += `*Pagamento:* ${paymentMethod}\n`;
    
    if (paymentMethod === 'dinheiro' && changeFor) {
        const changeValue = parseFloat(changeFor) - parseFloat(total);
        message += `*Valor em dinheiro:* R$ ${parseFloat(changeFor).toFixed(2)}\n`;
        message += `*Troco:* R$ ${changeValue.toFixed(2)}\n`;
    }
    
    if (observations) {
        message += `\n*Observações:*\n${observations}\n`;
    }

    // Codifica a mensagem para URL
    const encodedMessage = encodeURIComponent(message);
    
    // Atualiza o link do WhatsApp
    const whatsappLink = document.getElementById('whatsappLink');
    whatsappLink.href = `https://wa.me/5585991993833?text=${encodedMessage}`;
}

// Atualiza o link do WhatsApp quando o carrinho muda
document.getElementById('cartBtn').addEventListener('click', function() {
    setTimeout(atualizarLinkWhatsApp, 100);
});

// Atualiza o link do WhatsApp quando o formulário muda
document.getElementById('checkoutForm').addEventListener('change', atualizarLinkWhatsApp);
document.getElementById('checkoutForm').addEventListener('input', atualizarLinkWhatsApp);

// Evento do formulário de checkout
document.getElementById('checkoutForm').addEventListener('submit', function(e) {
    e.preventDefault();
    atualizarLinkWhatsApp();
});

function resetarFormulario() {
    // Limpa o carrinho
    cart = [];
    updateCart();

    // Fecha o modal do carrinho
    document.getElementById('cartModal').style.display = 'none';

    // Reseta o formulário de checkout
    document.getElementById('checkoutForm').reset();

    // Reseta todos os selects de tamanho para média
    document.querySelectorAll('.size-select').forEach(select => {
        select.value = 'media-12';
        const productCard = select.closest('.product-card');
        const proteinOptions = productCard.querySelector('.protein-options');
        proteinOptions.style.display = 'none';
    });

    // Desmarca todas as proteínas
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });

    // Reseta as seções de pagamento
    document.getElementById('pixPaymentSection').style.display = 'none';
    document.getElementById('changeDetails').style.display = 'none';
    document.getElementById('changeAmount').style.display = 'none';

    // Limpa o valor do troco
    document.getElementById('changeFor').value = '';
    
    // Reseta o método de pagamento
    document.getElementById('paymentMethod').value = '';

    // Limpa as observações
    document.getElementById('observations').value = '';

    // Atualiza o contador do carrinho
    document.getElementById('cartCount').textContent = '0';
}