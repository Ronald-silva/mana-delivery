const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs').promises;
const compression = require('compression');

const app = express();

// Middleware para evitar cache em desenvolvimento
app.use((req, res, next) => {
    if (req.url.endsWith('.js')) {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
    }
    next();
});

// Configuração do CORS
app.use(cors({
    origin: ['https://sanduiche-do-chefe.onrender.com', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Middleware
app.use(compression()); // Adiciona compressão gzip
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Configurações de segurança básicas
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Log para debug apenas em desenvolvimento
if (process.env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.url}`);
        next();
    });
}

// Cache para arquivos estáticos em produção
const cacheTime = process.env.NODE_ENV === 'production' ? 86400000 : 0; // 1 dia em produção
app.use(express.static(path.join(__dirname, '../public'), {
    maxAge: cacheTime,
    etag: true
}));

// Rota específica para CSS com log
app.get('/css/*', (req, res, next) => {
    console.log('Requisição CSS:', req.path);
    const cssPath = path.join(path.join(__dirname, '../public'), req.path);
    console.log('Caminho do CSS:', cssPath);
    if (fs.existsSync(cssPath)) {
        res.type('text/css');
        next();
    } else {
        console.log('Arquivo CSS não encontrado:', cssPath);
        next();
    }
});

// Middleware de autenticação básica
const basicAuth = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Basic ')) {
    res.set('WWW-Authenticate', 'Basic realm="Admin Area"');
    return res.status(401).json({ error: 'Autenticação necessária' });
  }
  const base64Credentials = auth.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');
  if (username === 'admin' && password === 'admin123') {
    next();
  } else {
    res.set('WWW-Authenticate', 'Basic realm="Admin Area"');
    res.status(401).json({ error: 'Credenciais inválidas' });
  }
};

// Função para ler e escrever dados
async function readData() {
    try {
        console.log('Tentando ler arquivo:', path.join(__dirname, '../public/data.json'));
        const data = await fs.readFile(path.join(__dirname, '../public/data.json'), 'utf8');
        console.log('Dados lidos com sucesso:', data);
        return JSON.parse(data);
    } catch (error) {
        console.error('Erro ao ler dados:', error);
        return { produtos: [] };
    }
}

async function writeData(data) {
    try {
        await fs.writeFile(path.join(__dirname, '../public/data.json'), JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Erro ao escrever dados:', error);
        throw error;
    }
}

// Rotas
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/admin', basicAuth, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/admin.html'));
});

// API para produtos
app.get('/api/produtos', async (req, res) => {
    console.log('Recebida requisição GET /api/produtos');
    try {
        const data = await readData();
        console.log('Enviando produtos:', data.produtos);
        res.json(data.produtos);
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        res.status(500).json({ error: 'Erro ao buscar produtos' });
    }
});

app.post('/api/produtos', basicAuth, async (req, res) => {
  try {
    const { nome, categoria, descricao, preco, disponivel } = req.body;
    if (!nome || !categoria || !preco) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando' });
    }

    const data = await readData();
    const novoProduto = {
      id: data.produtos.length > 0 ? Math.max(...data.produtos.map(p => p.id)) + 1 : 1,
      nome: String(nome).trim(),
      categoria: String(categoria).trim(),
      descricao: descricao ? String(descricao).trim() : '',
      preco: Number(preco),
      disponivel: Boolean(disponivel),
      imagem: '/img/default.jpg'
    };

    data.produtos.push(novoProduto);
    await writeData(data);
    res.status(201).json(novoProduto);
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
});

app.put('/api/produtos/:id', basicAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, categoria, descricao, preco, disponivel } = req.body;

    const data = await readData();
    const index = data.produtos.findIndex(p => p.id === Number(id));
    
    if (index === -1) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    data.produtos[index] = {
      ...data.produtos[index],
      nome: nome || data.produtos[index].nome,
      categoria: categoria || data.produtos[index].categoria,
      descricao: descricao || data.produtos[index].descricao,
      preco: preco ? Number(preco) : data.produtos[index].preco,
      disponivel: disponivel !== undefined ? Boolean(disponivel) : data.produtos[index].disponivel
    };

    await writeData(data);
    res.json(data.produtos[index]);
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
});

app.delete('/api/produtos/:id', basicAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const data = await readData();
    const index = data.produtos.findIndex(p => p.id === Number(id));
    
    if (index === -1) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    data.produtos.splice(index, 1);
    await writeData(data);
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    res.status(500).json({ error: 'Erro ao deletar produto' });
  }
});

// Fallback para 404
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '../public/404.html'));
});

// Tratamento de erros global
app.use((err, req, res, next) => {
    console.error('Erro:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse: http://localhost:${PORT}`);
});

module.exports = app;
