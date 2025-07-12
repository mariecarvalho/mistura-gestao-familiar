
# Configuração do Backend para Autenticação Completa

## 1. Instalar dependências no backend:

```bash
npm install bcryptjs jsonwebtoken express-rate-limit helmet cors nodemailer passport passport-google-oauth20 express-session
npm install -D @types/bcryptjs @types/jsonwebtoken @types/nodemailer @types/passport @types/passport-google-oauth20 @types/express-session
```

## 2. Configurar variáveis de ambiente (.env):

```
JWT_SECRET=seu_jwt_secret_muito_seguro_aqui_com_pelo_menos_32_caracteres
JWT_EXPIRES_IN=24h
BCRYPT_ROUNDS=12

# Email (usando Gmail como exemplo)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=sua-senha-de-app

# Google OAuth
GOOGLE_CLIENT_ID=seu-google-client-id
GOOGLE_CLIENT_SECRET=seu-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# Session
SESSION_SECRET=seu_session_secret_muito_seguro
```

## 3. Atualizar tabelas do banco de dados:

```sql
-- Adicionar campos para reset de senha
ALTER TABLE public.users ADD COLUMN reset_code VARCHAR(6);
ALTER TABLE public.users ADD COLUMN reset_code_expires TIMESTAMP;
ALTER TABLE public.users ADD COLUMN google_id VARCHAR(255);

-- Índice para google_id
CREATE INDEX idx_users_google_id ON public.users(google_id);
```

## 4. Middleware de autenticação (mesmo anterior):

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

## 5. Configuração do Passport (auth/passport.js):

```javascript
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { Pool } = require('pg');

const pool = new Pool({
  // sua configuração do banco
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Verificar se o usuário já existe
    let userResult = await pool.query(
      'SELECT * FROM users WHERE google_id = $1 OR email = $2',
      [profile.id, profile.emails[0].value]
    );

    if (userResult.rows.length > 0) {
      // Usuário existe, atualizar google_id se necessário
      const user = userResult.rows[0];
      if (!user.google_id) {
        await pool.query(
          'UPDATE users SET google_id = $1 WHERE id = $2',
          [profile.id, user.id]
        );
      }
      return done(null, user);
    } else {
      // Criar novo usuário
      const newUserResult = await pool.query(
        'INSERT INTO users (name, email, google_id, role, is_active) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [profile.displayName, profile.emails[0].value, profile.id, 'volunteer', true]
      );
      return done(null, newUserResult.rows[0]);
    }
  } catch (error) {
    return done(error, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, result.rows[0]);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
```

## 6. Configuração de Email (utils/email.js):

```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendResetCode = async (email, code, name) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Código de Recuperação de Senha - Mistura Acolhe',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f97316;">Recuperação de Senha</h2>
        <p>Olá ${name},</p>
        <p>Você solicitou a recuperação de senha. Use o código abaixo:</p>
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
          <h1 style="color: #f97316; font-size: 32px; margin: 0;">${code}</h1>
        </div>
        <p>Este código expira em 15 minutos.</p>
        <p>Se você não solicitou esta recuperação, ignore este email.</p>
        <hr>
        <p style="color: #6b7280; font-size: 12px;">Mistura Acolhe - Sistema de Gestão Social</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendResetCode };
```

## 7. Rotas de autenticação expandidas (routes/auth.js):

```javascript
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const passport = require('../auth/passport');
const { sendResetCode } = require('../utils/email');
const { Pool } = require('pg');

const router = express.Router();
const pool = new Pool({
  // sua configuração do banco
});

// Rate limiting
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Muitas tentativas de login. Tente novamente em 15 minutos.' }
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // 3 registros por IP por hora
  message: { error: 'Muitas tentativas de registro. Tente novamente em 1 hora.' }
});

// Função auxiliar para gerar token
const generateToken = (user) => {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

// Função auxiliar para salvar sessão
const saveSession = async (userId, token) => {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await pool.query(
    'INSERT INTO user_sessions (user_id, token_hash, expires_at) VALUES ($1, $2, $3)',
    [userId, token, expiresAt]
  );
  
  // Limpar sessões expiradas
  await pool.query('DELETE FROM user_sessions WHERE expires_at < NOW()');
};

// Login
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    const userResult = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND is_active = true',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const user = userResult.rows[0];

    if (!user.password_hash) {
      return res.status(401).json({ error: 'Usuário deve fazer login com Google' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = generateToken(user);
    await saveSession(user.id, token);

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

// Registro
router.post('/register', registerLimiter, async (req, res) => {
  try {
    const { name, email, password, role = 'volunteer' } = req.body;

    if (password.length < 6) {
      return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres' });
    }

    // Verificar se o usuário já existe
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email já está em uso' });
    }

    // Hash da senha
    const passwordHash = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS));

    // Criar usuário
    const newUser = await pool.query(
      'INSERT INTO users (name, email, password_hash, role, is_active) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role',
      [name, email, passwordHash, role, true]
    );

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      user: newUser.rows[0]
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Solicitar reset de senha
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    const userResult = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND is_active = true',
      [email]
    );

    if (userResult.rows.length === 0) {
      // Por segurança, não revelamos se o email existe ou não
      return res.json({ message: 'Se o email existir, um código foi enviado' });
    }

    const user = userResult.rows[0];
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

    // Salvar código no banco
    await pool.query(
      'UPDATE users SET reset_code = $1, reset_code_expires = $2 WHERE id = $3',
      [resetCode, expiresAt, user.id]
    );

    // Enviar email
    await sendResetCode(user.email, resetCode, user.name);

    res.json({ message: 'Código enviado para o email' });
  } catch (error) {
    console.error('Erro ao enviar código:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Verificar código de reset
router.post('/verify-reset-code', async (req, res) => {
  try {
    const { email, code } = req.body;

    const userResult = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND reset_code = $2 AND reset_code_expires > NOW()',
      [email, code]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: 'Código inválido ou expirado' });
    }

    res.json({ message: 'Código válido' });
  } catch (error) {
    console.error('Erro ao verificar código:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Reset de senha
router.post('/reset-password', async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres' });
    }

    const userResult = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND reset_code = $2 AND reset_code_expires > NOW()',
      [email, code]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: 'Código inválido ou expirado' });
    }

    const user = userResult.rows[0];
    const passwordHash = await bcrypt.hash(newPassword, parseInt(process.env.BCRYPT_ROUNDS));

    // Atualizar senha e limpar código de reset
    await pool.query(
      'UPDATE users SET password_hash = $1, reset_code = NULL, reset_code_expires = NULL WHERE id = $2',
      [passwordHash, user.id]
    );

    // Invalidar todas as sessões do usuário
    await pool.query('DELETE FROM user_sessions WHERE user_id = $1', [user.id]);

    res.json({ message: 'Senha alterada com sucesso' });
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { session: false }),
  async (req, res) => {
    try {
      const user = req.user;
      const token = generateToken(user);
      await saveSession(user.id, token);

      // Redirecionar para o frontend com o token
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?token=${token}`);
    } catch (error) {
      console.error('Erro no callback do Google:', error);
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?error=auth_failed`);
    }
  }
);

// Verificar token (mesmo anterior)
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

// Logout (mesmo anterior)
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

## 8. Configuração principal do app:

```javascript
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const passport = require('./auth/passport');

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// Configurar sessões para o Passport
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

app.use(passport.initialize());
app.use(passport.session());

// Usar as rotas de auth
app.use('/api/auth', require('./routes/auth'));

// Outras rotas...

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## 9. Configurar Google OAuth:

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative a Google+ API
4. Crie credenciais OAuth 2.0
5. Configure as URLs de redirecionamento:
   - `http://localhost:3000/api/auth/google/callback` (desenvolvimento)
   - `https://seudominio.com/api/auth/google/callback` (produção)

## 10. Configurar Email (Gmail):

1. Ative a verificação em duas etapas na sua conta Google
2. Gere uma "Senha de app" específica para o aplicativo
3. Use essa senha no `EMAIL_PASS` do .env

## Recursos de Segurança Implementados:

1. **Hash de senhas com bcrypt** (12 rounds)
2. **Tokens JWT seguros** com expiração
3. **Controle de sessões** no banco de dados
4. **Rate limiting** para login e registro
5. **Códigos de verificação** com expiração (15 min)
6. **OAuth com Google** para login social
7. **Validação de entrada** e sanitização
8. **Emails HTML** para recuperação de senha
9. **Invalidação de sessões** no reset de senha
10. **Headers de segurança** com Helmet.js
