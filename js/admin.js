let produtos = [];

// Carregar produtos ao abrir a página
function carregarProdutos() {
    console.log('Carregando produtos...');
    fetch('http://localhost:3000/produtos')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao carregar produtos: ${response.status} - ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            produtos = data;
            console.log('Produtos carregados:', produtos);
            exibirProdutos();
        })
        .catch(error => {
            console.error('Erro ao carregar produtos:', error);
            alert('Não foi possível carregar os produtos. Verifique o console para mais detalhes.');
        });
}

// Exibir produtos na lista
function exibirProdutos() {
    const lista = document.getElementById('produto-lista');
    lista.innerHTML = '';
    produtos.forEach(produto => {
        const div = document.createElement('div');
        div.className = 'produto-item';
        const precoExibido = produto.precoPromocional ? produto.precoPromocional : produto.preco;
        div.innerHTML = `
            <span>${produto.nome} (${produto.categoria}) - R$ ${precoExibido.toFixed(2)} ${produto.disponivel ? '' : '(Indisponível)'}</span>
            <div>
                <button onclick="editarProduto(${produto.id})">Editar</button>
                <button class="remover" onclick="removerProduto(${produto.id})">Remover</button>
            </div>
        `;
        lista.appendChild(div);
    });
}

// Pré-visualizar a imagem selecionada e validar
document.getElementById('produto-imagem').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('imagem-preview');
    const removerBtn = document.getElementById('remover-imagem');

    if (file) {
        if (!file.type.startsWith('image/')) {
            alert('Por favor, selecione um arquivo de imagem (ex.: .jpg, .png).');
            event.target.value = '';
            preview.src = '';
            preview.style.display = 'none';
            removerBtn.style.display = 'none';
            return;
        }

        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            alert('A imagem é muito grande. O tamanho máximo permitido é 5MB.');
            event.target.value = '';
            preview.src = '';
            preview.style.display = 'none';
            removerBtn.style.display = 'none';
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
            removerBtn.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        preview.src = '';
        preview.style.display = 'none';
        removerBtn.style.display = 'none';
    }
});

// Remover a imagem selecionada
function removerImagem() {
    const preview = document.getElementById('imagem-preview');
    const removerBtn = document.getElementById('remover-imagem');
    const imagemInput = document.getElementById('produto-imagem');
    preview.src = '';
    preview.style.display = 'none';
    removerBtn.style.display = 'none';
    imagemInput.value = '';
}

// Salvar ou atualizar produto
function salvarProduto() {
    const id = document.getElementById('produto-id').value;
    const nome = document.getElementById('produto-nome').value;
    const categoria = document.getElementById('produto-categoria').value;
    const descricao = document.getElementById('produto-descricao').value;
    const preco = parseFloat(document.getElementById('produto-preco').value);
    const precoPromocional = document.getElementById('produto-preco-promocional').value ? parseFloat(document.getElementById('produto-preco-promocional').value) : null;
    const disponivel = document.getElementById('produto-disponivel').checked;
    const adicionaisInput = document.getElementById('produto-adicionais').value;
    const imagemInput = document.getElementById('produto-imagem');
    const salvarBtn = document.getElementById('salvar-btn');
    const uploadStatus = document.getElementById('upload-status');

    if (!nome || !preco || !categoria) {
        alert('Por favor, preencha os campos obrigatórios (nome, categoria e preço).');
        return;
    }

    // Processar adicionais
    let adicionais = [];
    if (adicionaisInput) {
        try {
            adicionais = adicionaisInput.split(',').map(item => {
                const [nome, preco] = item.trim().split('-').map(str => str.trim());
                if (!nome || !preco) throw new Error('Formato inválido');
                return { nome, preco: parseFloat(preco) || 0 };
            }).filter(item => item.nome && item.preco > 0);
        } catch (error) {
            alert('Formato inválido para adicionais. Use: Nome - Preço, separados por vírgula (ex.: Bacon - 3.00, Queijo Extra - 2.00).');
            return;
        }
    }

    salvarBtn.disabled = true;
    salvarBtn.textContent = 'Salvando...';
    uploadStatus.style.display = 'block';

    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('categoria', categoria);
    formData.append('descricao', descricao || '');
    formData.append('preco', preco);
    formData.append('precoPromocional', precoPromocional || '');
    formData.append('disponivel', disponivel);
    formData.append('adicionais', JSON.stringify(adicionais));
    if (imagemInput.files[0]) {
        formData.append('imagem', imagemInput.files[0]);
    } else if (id) {
        const produto = produtos.find(p => p.id == id);
        formData.append('imagem', produto.imagem);
    }

    const url = id ? `http://localhost:3000/produtos/${id}` : 'http://localhost:3000/produtos';
    const method = id ? 'PUT' : 'POST';

    console.log('Enviando requisição para:', url);
    console.log('Método:', method);
    console.log('Dados enviados:', [...formData.entries()]);

    fetch(url, {
        method: method,
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erro ao salvar produto: ${response.status} - ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Resposta do servidor:', data);
        alert(id ? 'Produto atualizado com sucesso!' : 'Produto adicionado com sucesso!');
        limparFormulario();
        carregarProdutos();
    })
    .catch(error => {
        console.error('Erro ao salvar produto:', error);
        alert('Erro ao salvar produto. Verifique o console para mais detalhes.');
    })
    .finally(() => {
        salvarBtn.disabled = false;
        salvarBtn.textContent = 'Salvar Produto';
        uploadStatus.style.display = 'none';
    });
}

// Editar produto
function editarProduto(id) {
    const produto = produtos.find(p => p.id === id);
    document.getElementById('produto-id').value = produto.id;
    document.getElementById('produto-nome').value = produto.nome;
    document.getElementById('produto-categoria').value = produto.categoria;
    document.getElementById('produto-descricao').value = produto.descricao;
    document.getElementById('produto-preco').value = produto.preco;
    document.getElementById('produto-preco-promocional').value = produto.precoPromocional || '';
    document.getElementById('produto-disponivel').checked = produto.disponivel;
    document.getElementById('produto-adicionais').value = produto.adicionais && produto.adicionais.length > 0 ? produto.adicionais.map(a => `${a.nome} - ${a.preco}`).join(', ') : '';
    const preview = document.getElementById('imagem-preview');
    const removerBtn = document.getElementById('remover-imagem');
    preview.src = produto.imagem;
    preview.style.display = 'block';
    removerBtn.style.display = 'block';
}

// Remover produto
function removerProduto(id) {
    if (confirm('Tem certeza que deseja remover este produto?')) {
        fetch(`http://localhost:3000/produtos/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao remover produto: ' + response.statusText);
            }
            carregarProdutos();
        })
        .catch(error => {
            console.error('Erro ao remover produto:', error);
            alert('Erro ao remover produto. Verifique o console para mais detalhes.');
        });
    }
}

// Limpar formulário
function limparFormulario() {
    document.getElementById('produto-id').value = '';
    document.getElementById('produto-nome').value = '';
    document.getElementById('produto-categoria').value = '';
    document.getElementById('produto-descricao').value = '';
    document.getElementById('produto-preco').value = '';
    document.getElementById('produto-preco-promocional').value = '';
    document.getElementById('produto-disponivel').checked = true;
    document.getElementById('produto-adicionais').value = '';
    document.getElementById('produto-imagem').value = '';
    const preview = document.getElementById('imagem-preview');
    const removerBtn = document.getElementById('remover-imagem');
    preview.src = '';
    preview.style.display = 'none';
    removerBtn.style.display = 'none';
}

// Carregar produtos ao abrir a página
document.addEventListener('DOMContentLoaded', carregarProdutos);