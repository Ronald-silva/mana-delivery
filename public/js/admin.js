let produtos = [];
const API_URL = window.location.origin;

// Função auxiliar para fazer requisições autenticadas
async function fetchAuth(url, options = {}) {
    const credentials = btoa('admin:admin123');
    const headers = {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    try {
        const response = await fetch(url, { ...options, headers });
        if (response.status === 401) {
            alert('Sessão expirada. Por favor, faça login novamente.');
            window.location.reload();
            return null;
        }
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
        }
        return response;
    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Erro ao comunicar com o servidor. Por favor, tente novamente.');
        return null;
    }
}

// Carregar produtos ao abrir a página
async function carregarProdutos() {
    console.log('Carregando produtos...');
    try {
        const response = await fetchAuth(`${API_URL}/api/produtos`);
        if (!response) return;
        
        produtos = await response.json();
        console.log('Produtos carregados:', produtos);
        exibirProdutos();
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        alert('Não foi possível carregar os produtos. Por favor, tente novamente mais tarde.');
    }
}

// Exibir produtos na lista
function exibirProdutos() {
    const lista = document.getElementById('produto-lista');
    lista.innerHTML = '';
    produtos.forEach(produto => {
        const div = document.createElement('div');
        div.className = 'produto-item';
        const precoExibido = produto.precoPromocional || produto.preco;
        div.innerHTML = `
            <span>${produto.nome} (${produto.categoria}) - R$ ${precoExibido.toFixed(2)} ${produto.disponivel ? '' : '(Indisponível)'}</span>
            <div>
                <button onclick="editarProduto('${produto._id}')">Editar</button>
                <button class="remover" onclick="removerProduto('${produto._id}')">Remover</button>
            </div>
        `;
        lista.appendChild(div);
    });
}

// Pré-visualizar a imagem selecionada e validar
document.getElementById('produto-imagem').addEventListener('change', async function(event) {
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

        try {
            const base64 = await convertToBase64(file);
            preview.src = base64;
            preview.style.display = 'block';
            removerBtn.style.display = 'block';
        } catch (error) {
            console.error('Erro ao converter imagem:', error);
            alert('Erro ao processar a imagem.');
        }
    } else {
        preview.src = '';
        preview.style.display = 'none';
        removerBtn.style.display = 'none';
    }
});

// Converter arquivo para Base64
function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

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
async function salvarProduto() {
    const nome = document.getElementById('produto-nome').value.trim();
    const categoria = document.getElementById('produto-categoria').value;
    const preco = document.getElementById('produto-preco').value;
    const descricao = document.getElementById('produto-descricao').value.trim();
    const disponivel = document.getElementById('produto-disponivel').checked;
    const salvarBtn = document.getElementById('salvar-btn');

    if (!nome || !categoria || !preco) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    salvarBtn.disabled = true;
    salvarBtn.textContent = 'Salvando...';

    const dadosProduto = {
        nome,
        categoria,
        descricao,
        preco: parseFloat(preco),
        disponivel
    };

    try {
        const response = await fetch(`${API_URL}/api/produtos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa('admin:admin123')
            },
            body: JSON.stringify(dadosProduto)
        });

        if (!response.ok) {
            throw new Error('Erro ao salvar produto: ' + response.status);
        }

        alert('Produto salvo com sucesso!');
        limparFormulario();
        await carregarProdutos();
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao salvar produto. Por favor, tente novamente.');
    } finally {
        salvarBtn.disabled = false;
        salvarBtn.textContent = 'Salvar Produto';
    }
}

// Editar produto
function editarProduto(id) {
    const produto = produtos.find(p => p._id === id);
    if (!produto) {
        console.error('Produto não encontrado:', id);
        return;
    }

    document.getElementById('produto-id').value = produto._id;
    document.getElementById('produto-nome').value = produto.nome;
    document.getElementById('produto-categoria').value = produto.categoria;
    document.getElementById('produto-descricao').value = produto.descricao || '';
    document.getElementById('produto-preco').value = produto.preco;
    document.getElementById('produto-preco-promocional').value = produto.precoPromocional || '';
    document.getElementById('produto-disponivel').checked = produto.disponivel;
    document.getElementById('produto-adicionais').value = produto.adicionais && produto.adicionais.length > 0 ? 
        produto.adicionais.map(a => `${a.nome} - ${a.preco}`).join(', ') : '';
    
    const preview = document.getElementById('imagem-preview');
    const removerBtn = document.getElementById('remover-imagem');
    if (produto.imagem) {
        preview.src = produto.imagem;
        preview.style.display = 'block';
        removerBtn.style.display = 'block';
    }
}

// Remover produto
async function removerProduto(id) {
    if (!confirm('Tem certeza que deseja remover este produto?')) {
        return;
    }

    try {
        const response = await fetchAuth(`${API_URL}/api/produtos/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Erro ao remover produto: ' + response.statusText);
        }

        alert('Produto removido com sucesso!');
        await carregarProdutos();
    } catch (error) {
        console.error('Erro ao remover produto:', error);
        alert('Erro ao remover produto. Verifique o console para mais detalhes.');
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