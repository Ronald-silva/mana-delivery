let produtos = [];
const API_URL = 'https://sanduiche-do-chefe.vercel.app';

// Função auxiliar para fazer requisições autenticadas
async function fetchAuth(url, options = {}) {
    const credentials = btoa('admin:admin123'); // Credenciais fixas para demonstração
    const headers = {
        'Authorization': `Basic ${credentials}`,
        ...options.headers
    };
    return fetch(url, { ...options, headers });
}

// Carregar produtos ao abrir a página
async function carregarProdutos() {
    console.log('Carregando produtos...');
    try {
        const response = await fetch(`${API_URL}/api/produtos`);
        if (!response.ok) {
            throw new Error(`Erro ao carregar produtos: ${response.status} - ${response.statusText}`);
        }
        produtos = await response.json();
        console.log('Produtos carregados:', produtos);
        exibirProdutos();
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        alert('Não foi possível carregar os produtos. Verifique o console para mais detalhes.');
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
    const id = document.getElementById('produto-id').value;
    const nome = document.getElementById('produto-nome').value;
    const categoria = document.getElementById('produto-categoria').value;
    const descricao = document.getElementById('produto-descricao').value;
    const preco = parseFloat(document.getElementById('produto-preco').value);
    const precoPromocional = document.getElementById('produto-preco-promocional').value ? parseFloat(document.getElementById('produto-preco-promocional').value) : null;
    const disponivel = document.getElementById('produto-disponivel').checked;
    const adicionaisInput = document.getElementById('produto-adicionais').value;
    const preview = document.getElementById('imagem-preview');
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
            });
        } catch (error) {
            alert('Formato inválido para adicionais. Use: Nome - Preço, separados por vírgula (ex.: Bacon - 3.00, Queijo Extra - 2.00).');
            return;
        }
    }

    salvarBtn.disabled = true;
    salvarBtn.textContent = 'Salvando...';
    uploadStatus.style.display = 'block';
    uploadStatus.textContent = 'Preparando dados...';

    try {
        // Comprimir imagem se necessário
        let imageData = preview.src || null;
        if (imageData && imageData.startsWith('data:image')) {
            uploadStatus.textContent = 'Processando imagem...';
            // Se a imagem for muito grande, redimensionar
            const img = new Image();
            img.src = imageData;
            await new Promise((resolve) => {
                img.onload = () => {
                    if (img.width > 800 || img.height > 800) {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        const MAX_SIZE = 800;
                        let width = img.width;
                        let height = img.height;
                        
                        if (width > height) {
                            if (width > MAX_SIZE) {
                                height *= MAX_SIZE / width;
                                width = MAX_SIZE;
                            }
                        } else {
                            if (height > MAX_SIZE) {
                                width *= MAX_SIZE / height;
                                height = MAX_SIZE;
                            }
                        }
                        
                        canvas.width = width;
                        canvas.height = height;
                        ctx.drawImage(img, 0, 0, width, height);
                        imageData = canvas.toDataURL('image/jpeg', 0.8);
                    }
                    resolve();
                };
            });
        }

        uploadStatus.textContent = 'Enviando dados...';

        const produtoData = {
            nome,
            categoria,
            descricao,
            preco,
            precoPromocional,
            disponivel,
            adicionais,
            image: imageData
        };

        const url = id ? `${API_URL}/api/produtos/${id}` : `${API_URL}/api/produtos`;
        const method = id ? 'PUT' : 'POST';

        const response = await fetchAuth(url, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(produtoData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Erro ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Produto salvo:', data);
        alert(id ? 'Produto atualizado com sucesso!' : 'Produto adicionado com sucesso!');
        limparFormulario();
        await carregarProdutos();
    } catch (error) {
        console.error('Erro ao salvar produto:', error);
        alert(`Erro ao salvar produto: ${error.message}`);
    } finally {
        salvarBtn.disabled = false;
        salvarBtn.textContent = 'Salvar Produto';
        uploadStatus.style.display = 'none';
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