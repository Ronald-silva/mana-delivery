const express = require('express');
const multer = require('multer');
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const app = express();

// Update CORS configuration
app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500', 'https://sanduiche-do-chefe-6yrfse9uj-ronalds-projects.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar o MongoDB
const uri = process.env.MONGODB_URI; // Using the connection string from .env
const client = new MongoClient(uri);
let produtosCollection;

async function connectToMongo() {
    try {
        await client.connect();
        console.log('Conectado ao MongoDB');
        const db = client.db('sanduiche-do-chefe');
        produtosCollection = db.collection('produtos');
    } catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error);
    }
}

connectToMongo();

// Caminho absoluto para a raiz do projeto
const rootDir = path.resolve(__dirname, '..');

// Configurar o multer para salvar imagens na pasta img/
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const imgDir = path.join(rootDir, 'img');
        if (!fs.existsSync(imgDir)) {
            fs.mkdirSync(imgDir);
        }
        cb(null, imgDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Servir a pasta img/ como estática
app.use('/img', express.static(path.join(rootDir, 'img')));

// Rotas para produtos
app.get('/produtos', async (req, res) => {
    try {
        const produtos = await produtosCollection.find().toArray();
        res.json(produtos);
    } catch (error) {
        console.error('Erro ao ler produtos:', error);
        res.status(500).json({ message: 'Erro ao ler produtos' });
    }
});

// Configuração do Cloudinary (adicionar após os imports)
cloudinary.config({
    cloud_name: 'dciji3ef9',
    api_key: '223943765953787',
    api_secret: 'EayQvmSktOjzuWKWUI74VL5H_QY'
});

// Modificar a rota POST para usar o Cloudinary
app.post('/produtos', upload.single('imagem'), async (req, res) => {
    try {
        const { nome, categoria, descricao, preco, precoPromocional, disponivel, adicionais } = req.body;
        let imageUrl = 'img/6.webp';

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            imageUrl = result.secure_url;
            // Remover o arquivo temporário após upload
            fs.unlinkSync(req.file.path);
        }

        const produtos = await produtosCollection.find().toArray();
        const novoProduto = {
            id: produtos.length > 0 ? Math.max(...produtos.map(p => p.id)) + 1 : 1,
            nome,
            categoria,
            descricao: descricao || '',
            preco: parseFloat(preco),
            precoPromocional: precoPromocional ? parseFloat(precoPromocional) : null,
            disponivel: disponivel === 'true',
            adicionais: adicionais ? JSON.parse(adicionais) : [],
            imagem: imageUrl
        };
        await produtosCollection.insertOne(novoProduto);
        res.status(201).json(novoProduto);
    } catch (error) {
        console.error('Erro ao adicionar produto:', error);
        res.status(500).json({ message: 'Erro ao adicionar produto', error: error.message });
    }
});

// Modificar a rota PUT também
app.put('/produtos/:id', upload.single('imagem'), async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { nome, categoria, descricao, preco, precoPromocional, disponivel, adicionais } = req.body;
        let imagem = req.body.imagem;

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            imagem = result.secure_url;
            // Remover o arquivo temporário após upload
            fs.unlinkSync(req.file.path);
        }

        const produtoAtualizado = {
            id,
            nome,
            categoria,
            descricao: descricao || '',
            preco: parseFloat(preco),
            precoPromocional: precoPromocional ? parseFloat(precoPromocional) : null,
            disponivel: disponivel === 'true',
            adicionais: adicionais ? JSON.parse(adicionais) : [],
            imagem
        };
        const result = await produtosCollection.updateOne(
            { id: id },
            { $set: produtoAtualizado }
        );
        if (result.matchedCount === 0) {
            res.status(404).json({ message: 'Produto não encontrado' });
        } else {
            res.json(produtoAtualizado);
        }
    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        res.status(500).json({ message: 'Erro ao atualizar produto', error: error.message });
    }
});

app.delete('/produtos/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await produtosCollection.deleteOne({ id: id });
        if (result.deletedCount === 0) {
            res.status(404).json({ message: 'Produto não encontrado' });
        } else {
            res.status(204).send();
        }
    } catch (error) {
        console.error('Erro ao remover produto:', error);
        res.status(500).json({ message: 'Erro ao remover produto' });
    }
});

// Update port configuration
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});