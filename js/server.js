const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');
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

// Rotas
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
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

// API para upload de imagens
app.post('/api/upload', async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'Nenhuma imagem fornecida' });
    }
    const result = await cloudinary.uploader.upload(image, {
      folder: 'sanduiche-chefe'
    });
    res.json(result);
  } catch (error) {
    console.error('Erro ao fazer upload da imagem:', error);
    res.status(500).json({ error: 'Erro ao fazer upload da imagem', details: error.message });
  }
});

// Tratamento de erros global
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
});

// Exportar a instância do app para o Vercel
module.exports = app;