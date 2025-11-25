const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    // Verifica se o header Authorization existe e começa com "Bearer"
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Pega o token (remove a palavra "Bearer ")
            token = req.headers.authorization.split(' ')[1];

            // Decodifica o token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Encontra o usuário no banco e anexa ao objeto request
            req.user = await User.findById(decoded.id);

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ success: false, message: 'Não autorizado, token falhou' });
        }
    }

    if (!token) {
        res.status(401).json({ success: false, message: 'Não autorizado, sem token' });
    }
};

module.exports = { protect };
