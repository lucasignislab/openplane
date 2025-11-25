const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

// Carregar variáveis de ambiente
dotenv.config();

// Conectar ao Banco de Dados
connectDB();

const app = express();

// ==========================================
// Middlewares Globais
// ==========================================

// 1. Segurança de Headers HTTP
app.use(helmet());

// 2. Parser de JSON (para ler req.body)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. CORS (Cross-Origin Resource Sharing)
// Permite que apenas nosso Frontend acesse esta API
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));

// 4. Logging (apenas em desenvolvimento)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// 5. Rate Limiting (Substituto Open Source do Arcjet)
// Limita cada IP a 100 requisições por janela de 15 minutos
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Muitas requisições criadas a partir deste IP, tente novamente após 15 minutos.'
});
// Aplicar rate limit a todas as rotas de API
app.use('/api', limiter);

// ==========================================
// Rotas (Montagem)
// ==========================================

// Rota de teste simples para verificar se a API está viva
app.get('/', (req, res) => {
    res.send('API do OpenPlane está rodando... ✈️');
});

// Rotas de Autenticação
app.use('/api/v1/auth', require('./routes/authRoutes'));

// Rotas de Workspaces
app.use('/api/v1/workspaces', require('./routes/workspaceRoutes'));

// Rotas de Projetos
app.use('/api/v1/projects', require('./routes/projectRoutes'));

// Rotas de Estados (Kanban)
app.use('/api/v1/states', require('./routes/stateRoutes'));

// Rotas de Issues (Tarefas)
app.use('/api/v1/issues', require('./routes/issueRoutes'));

// Rotas de Ciclos
app.use('/api/v1/cycles', require('./routes/cycleRoutes'));

// Rotas de Usuários
app.use('/api/v1/users', require('./routes/userRoutes'));

// ==========================================
// Tratamento de Erros Global
// ==========================================

// Middleware para rotas não encontradas (404)
app.use((req, res, next) => {
    const error = new Error(`Não encontrado - ${req.originalUrl}`);
    res.status(404);
    next(error);
});

// Middleware de erro padrão
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

// ==========================================
// Inicialização do Servidor
// ==========================================

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Servidor rodando em modo ${process.env.NODE_ENV} na porta ${PORT}`);
});
