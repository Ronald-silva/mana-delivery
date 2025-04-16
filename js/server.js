const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs').promises;

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Configurar o servidor de arquivos estáticos
app.use('/', express.static(path.join(__dirname, '../public')));
app.use('/css', express.static(path.join(__dirname, '../public/css')));
app.use('/js', express.static(path.join(__dirname, '../public/js')));
app.use('/img', express.static(path.join(__dirname, '../public/img')));

// Middleware de autenticação básica
const basicAuth = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Basic ')) {
    return res.status(401).json({ error: 'Autenticação necessária' });
  }
  const base64Credentials = auth.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');
  if (username === 'admin' && password === 'admin123') {
    next();
  } else {
    res.status(401).json({ error: 'Credenciais inválidas' });
  }
};

// Função para ler e escrever dados
async function readData() {
  const data = await fs.readFile(path.join(__dirname, '../public/data.json'), 'utf8');
  return JSON.parse(data);
}

async function writeData(data) {
  await fs.writeFile(path.join(__dirname, '../public/data.json'), JSON.stringify(data, null, 2));
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
  try {
    const data = await readData();
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

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse: http://localhost:${PORT}`);
});

module.exports = app;
