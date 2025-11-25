const User = require('../models/User');

// @desc    Registrar usuário
// @route   POST /api/v1/auth/register
// @access  Public
exports.registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // Verifica se o usuário já existe
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ success: false, error: 'Este e-mail já está em uso.' });
        }

        // Criar usuário
        user = await User.create({
            name,
            email,
            password
        });

        sendTokenResponse(user, 201, res);
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Login usuário
// @route   POST /api/v1/auth/login
// @access  Public
exports.loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validar email e senha
        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Por favor forneça email e senha' });
        }

        // Verificar usuário (trazendo o campo password que estava oculto)
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ success: false, error: 'Credenciais inválidas' });
        }

        // Verificar se a senha combina
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Credenciais inválidas' });
        }

        sendTokenResponse(user, 200, res);
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Obter usuário atual
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        data: user
    });
};

// Helper para gerar token e enviar resposta
const sendTokenResponse = (user, statusCode, res) => {
    // Criar token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
        httpOnly: true
    };

    res
        .status(statusCode)
        // .cookie('token', token, options) // Opcional: Se quiser usar cookies no futuro
        .json({
            success: true,
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });
};
