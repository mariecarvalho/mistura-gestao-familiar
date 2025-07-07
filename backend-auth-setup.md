
# Configuração do Backend para Autenticação

## 1. Instalar dependências no backend:

```bash
npm install bcryptjs jsonwebtoken express-rate-limit helmet cors
npm install -D @types/bcryptjs @types/jsonwebtoken
```

## 2. Configurar variáveis de ambiente (.env):

```
JWT_SECRET=seu_jwt_secret_muito_seguro_aqui_com_pelo_menos_32_caracteres
JWT_EXPIRES_IN=24h
BCRYPT_ROUNDS=12
```

## 3. Middleware de autenticação (auth.middleware.js):

```javascript
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const pool = new Pool({
  // sua configuração do banco
});

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de acesso requerido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verificar se o token existe na tabela de sessões
    const sessionResult = await pool.query(
      'SELECT us.*, u.* FROM user_sessions us JOIN users u ON us.user_id = u.id WHERE us.token_hash = $1 AND us.expires_at > NOW()',
      [token]
    );

    if (sessionResult.rows.length === 0) {
      return res.status(401).json({ error: 'Token inválido ou expirado' });
    }

    req.user = sessionResult.rows[0];
    next();
  } catch (error) {
    res.status(403).json({ error: 'Token inválido' });
  }
};

module.exports = { authenticateToken };
```

## 4. Rotas de autenticação (routes/auth.js):

```javascript
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { Pool } = require('pg');

const router = express.Router();
const pool = new Pool({
  // sua configuração do banco
});

// Rate limiting para login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 tentativas por IP
  message: { error: 'Muitas tentativas de login. Tente novamente em 15 minutos.' }
});

// Login
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuário
    const userResult = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND is_active = true',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const user = userResult.rows[0];

    // Verificar senha
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Salvar sessão
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas
    await pool.query(
      'INSERT INTO user_sessions (user_id, token_hash, expires_at) VALUES ($1, $2, $3)',
      [user.id, token, expiresAt]
    );

    // Limpar sessões expiradas
    await pool.query('DELETE FROM user_sessions WHERE expires_at < NOW()');

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Verificar token
router.post('/verify', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token requerido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const sessionResult = await pool.query(
      'SELECT us.*, u.name, u.email, u.role FROM user_sessions us JOIN users u ON us.user_id = u.id WHERE us.token_hash = $1 AND us.expires_at > NOW()',
      [token]
    );

    if (sessionResult.rows.length === 0) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    const session = sessionResult.rows[0];
    res.json({
      user: {
        id: session.user_id,
        name: session.name,
        email: session.email,
        role: session.role
      }
    });
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
});

// Logout
router.post('/logout', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      await pool.query('DELETE FROM user_sessions WHERE token_hash = $1', [token]);
    }

    res.json({ message: 'Logout realizado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao fazer logout' });
  }
});

module.exports = router;
```

## 5. Configuração de segurança no app principal:

```javascript
const helmet = require('helmet');
const cors = require('cors');

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Usar as rotas de auth
app.use('/api/auth', require('./routes/auth'));
```

## Recursos de Segurança Implementados:

1. **Hash de senhas com bcrypt** (12 rounds)
2. **Tokens JWT seguros** com expiração
3. **Controle de sessões** no banco de dados
4. **Rate limiting** para prevenir ataques de força bruta
5. **Helmet.js** para headers de segurança
6. **CORS configurado** adequadamente
7. **Validação de tokens** em cada requisição
8. **Limpeza automática** de sessões expiradas
