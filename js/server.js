const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const { MongoClient, ObjectId } = require('mongodb');
const cloudinary = require('cloudinary').v2;

// Carregar variáveis de ambiente
dotenv.config();

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(path.join(__dirname, '../')));

// Conexão com MongoDB
let db;
const mongoClient = new MongoClient(process.env.MONGODB_URI);

async function connectDB() {
  if (!db) {
    try {
      await mongoClient.connect();
      db = mongoClient.db('sanduiche-do-chefe');
      console.log('Conectado ao MongoDB');
    } catch (error) {
      console.error('Erro ao conectar ao MongoDB:', error);
      throw error;
    }
  }
  return db;
}

// Middleware de autenticação básica
const basicAuth = (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth || auth.indexOf('Basic ') === -1) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Admin Access"');
    return res.status(401).json({ message: 'Autenticação necessária' });
  }

  const base64Credentials = auth.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');

  if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASSWORD) {
    next();
  } else {
    res.setHeader('WWW-Authenticate', 'Basic realm="Admin Access"');
    return res.status(401).json({ message: 'Credenciais inválidas' });
  }
};

// Rotas
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// Rota para a página admin com autenticação
app.get('/admin', basicAuth, (req, res) => {
  res.sendFile(path.join(__dirname, '../admin.html'));
});

// API para produtos
app.get('/api/produtos', async (req, res) => {
  try {
    const database = await connectDB();
    const produtos = await database.collection('produtos').find().toArray();
    res.json(produtos);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ error: 'Erro ao buscar produtos', details: error.message });
  }
});

// Criar novo produto
app.post('/api/produtos', basicAuth, async (req, res) => {
  try {
    const database = await connectDB();
    const { nome, categoria, descricao, preco, precoPromocional, disponivel, adicionais, image } = req.body;
    
    let imageUrl = '';
    if (image) {
      const uploadResult = await cloudinary.uploader.upload(image, {
        folder: 'sanduiche-chefe'
      });
      imageUrl = uploadResult.secure_url;
    }

    const novoProduto = {
      nome,
      categoria,
      descricao: descricao || '',
      preco: parseFloat(preco),
      precoPromocional: precoPromocional ? parseFloat(precoPromocional) : null,
      disponivel: disponivel === 'true' || disponivel === true,
      adicionais: adicionais ? JSON.parse(adicionais) : [],
      imagem: imageUrl,
      createdAt: new Date()
    };

    const result = await database.collection('produtos').insertOne(novoProduto);
    res.status(201).json({ ...novoProduto, _id: result.insertedId });
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({ error: 'Erro ao criar produto', details: error.message });
  }
});

// Atualizar produto
app.put('/api/produtos/:id', basicAuth, async (req, res) => {
  try {
    const database = await connectDB();
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

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    res.json({ ...updateData, _id: id });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({ error: 'Erro ao atualizar produto', details: error.message });
  }
});

// Deletar produto
app.delete('/api/produtos/:id', basicAuth, async (req, res) => {
  try {
    const database = await connectDB();
    const { id } = req.params;
    
    const result = await database.collection('produtos').deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    res.status(500).json({ error: 'Erro ao deletar produto', details: error.message });
  }
});

// Tratamento de erros global
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
});

// Exportar a instância do app para o Vercel
module.exports = app;