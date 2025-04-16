const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const { MongoClient, ObjectId } = require('mongodb');
const cloudinary = require('cloudinary').v2;

// Carregar variáveis de ambiente
dotenv.config();

// Configurar Cloudinary com timeout aumentado
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  timeout: 120000 // 2 minutos
});

const app = express();

// Middleware com limites aumentados
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// SERVIR ARQUIVOS ESTÁTICOS DA PASTA "public"
// Como server.js está em "js/", usamos ../public para ir para a raiz
app.use(express.static(path.join(__dirname, '../public')));

// Middleware para adicionar headers de CORS (opcional)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Conexão com MongoDB
let db;
const mongoClient = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true
  },
  tls: true,
  tlsAllowInvalidCertificates: false,
  tlsAllowInvalidHostnames: false,
  retryWrites: true,
  retryReads: true,
  maxPoolSize: 10,
  minPoolSize: 5
});

mongoClient.connect()
  .then(() => {
    console.log('MongoDB conectado com sucesso');
    db = mongoClient.db('sanduiche-do-chefe');
  })
  .catch(error => {
    console.error('Erro ao conectar ao MongoDB:', error);
    console.error('Detalhes do erro:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    process.exit(1);
  });

async function getDB() {
  if (!db) {
    await mongoClient.connect();
    db = mongoClient.db('sanduiche-do-chefe');
  }
  return db;
}

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
    const database = await getDB();
    const produtos = await database.collection('produtos').find().toArray();
    res.json(produtos);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ error: 'Erro ao buscar produtos', details: error.message });
  }
});

app.post('/api/produtos', basicAuth, async (req, res) => {
  try {
    const { nome, categoria, descricao, preco, disponivel } = req.body;
    if (!nome || !categoria || !preco) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando' });
    }
    const database = await getDB();
    const novoProduto = {
      nome: String(nome).trim(),
      categoria: String(categoria).trim(),
      descricao: descricao ? String(descricao).trim() : '',
      preco: Number(preco),
      disponivel: Boolean(disponivel),
      createdAt: new Date()
    };
    const result = await database.collection('produtos').insertOne(novoProduto);
    res.status(201).json({ success: true, produto: { ...novoProduto, _id: result.insertedId } });
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
});

app.put('/api/produtos/:id', basicAuth, async (req, res) => {
  try {
    const database = await getDB();
    const { id } = req.params;
    const { nome, categoria, descricao, preco, precoPromocional, disponivel, adicionais, image } = req.body;
    let imageUrl = '';
    if (image) {
      const uploadResult = await cloudinary.uploader.upload(image, {
        folder: 'sanduiche-chefe'
      });
      imageUrl = uploadResult.secure_url;
    }
    const updateData = {
      nome,
      categoria,
      descricao: descricao || '',
      preco: parseFloat(preco),
      precoPromocional: precoPromocional ? parseFloat(precoPromocional) : null,
      disponivel: disponivel === 'true' || disponivel === true,
      adicionais: adicionais ? JSON.parse(adicionais) : [],
      updatedAt: new Date()
    };
    if (imageUrl) {
      updateData.imagem = imageUrl;
    }
    const result = await database.collection('produtos').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    if (result.matchedCount === 0) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json({ _id: id, ...updateData });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({ error: 'Erro ao atualizar produto', details: error.message });
  }
});

app.delete('/api/produtos/:id', basicAuth, async (req, res) => {
  try {
    const database = await getDB();
    const { id } = req.params;
    const result = await database.collection('produtos').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Produto não encontrado' });
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    res.status(500).json({ error: 'Erro ao deletar produto', details: error.message });
  }
});

// Fallback para 404
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '../public/404.html'));
});

// Iniciar o servidor (sempre, independentemente do ambiente)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse: http://localhost:${PORT}`);
});

// Exporta o app (caso seja necessário para testes)
module.exports = app;
