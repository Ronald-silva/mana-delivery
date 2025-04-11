const express = require('express');
const multer = require('multer');
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Configurar o MongoDB
const uri = 'mongodb+srv://<usuario>:<senha>@cluster0.mongodb.net/sanduiche-do-chefe?retryWrites=true&w=majority'; // Substitua pela sua string de conexão
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

app.post('/produtos', upload.single('imagem'), async (req, res) => {
    try {
        const { nome, categoria, descricao, preco, precoPromocional, disponivel, adicionais } = req.body;
        const imagem = req.file ? `img/${req.file.filename}` : 'img/6.webp';

        console.log('Dados recebidos no POST:', req.body);

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
            imagem
        };
        await produtosCollection.insertOne(novoProduto);
        res.status(201).json(novoProduto);
    } catch (error) {
        console.error('Erro ao adicionar produto:', error);
        res.status(500).json({ message: 'Erro ao adicionar produto', error: error.message });
    }
});

app.put('/produtos/:id', upload.single('imagem'), async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { nome, categoria, descricao, preco, precoPromocional, disponivel, adicionais } = req.body;
        const imagem = req.file ? `img/${req.file.filename}` : req.body.imagem;

        console.log('Dados recebidos no PUT:', req.body);

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});