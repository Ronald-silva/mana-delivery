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
app.use(cors());  // Permitir todas as origens temporariamente para debug
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname, '../')));

// Middleware para adicionar headers de CORS em todas as respostas
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  
  // Responder imediatamente a requisições OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Middleware para garantir que todas as respostas sejam JSON válido
app.use((req, res, next) => {
  const oldJson = res.json;
  res.json = function(data) {
    try {
      // Tentar fazer parse do JSON antes de enviar
      JSON.parse(JSON.stringify(data));
      return oldJson.apply(res, arguments);
    } catch (e) {
      console.error('Erro ao converter resposta para JSON:', e);
      return res.status(500).json({ 
        error: 'Erro interno do servidor',
        message: 'Erro ao processar dados da resposta'
      });
    }
  };
  next();
});

// Timeout para requisições
app.use((req, res, next) => {
  res.setTimeout(120000, () => {
    res.status(504).json({ error: 'Timeout da requisição' });
  });
  next();
});

// Conexão com MongoDB
let db;
const mongoClient = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Conectar ao MongoDB no início
mongoClient.connect()
  .then(() => {
    console.log('Conectado ao MongoDB');
    db = mongoClient.db('sanduiche-do-chefe');
  })
  .catch(error => {
    console.error('Erro ao conectar ao MongoDB:', error);
    process.exit(1); // Encerra o processo se não conseguir conectar
  });

// Garantir que temos conexão antes de qualquer operação
async function getDB() {
  if (!db) {
    await mongoClient.connect();
    db = mongoClient.db('sanduiche-do-chefe');
  }
  return db;
}

// Middleware de autenticação básica
const basicAuth = (req, res, next) => {
  try {
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
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
  } catch (error) {
    console.error('Erro na autenticação:', error);
    return res.status(500).json({ error: 'Erro interno na autenticação' });
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
    const database = await getDB();
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
    
    return res.status(201).json({ 
      success: true,
      produto: { ...novoProduto, _id: result.insertedId }
    });

  } catch (error) {
    console.error('Erro ao criar produto:', error);
    return res.status(500).json({ error: 'Erro ao criar produto' });
  }
});

// Atualizar produto
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
    const database = await getDB();
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

// Iniciar o servidor se não estiver em produção
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
  });
}