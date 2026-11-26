/* ═══════════════════════════════════════════════════════════════════════════
   LIP VISION — Servidor Backend para Sistema de Contratos Digitais
   Versão: 1.0 · Salvador, Bahia
   ═══════════════════════════════════════════════════════════════════════════ */

const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const Database = require('better-sqlite3');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// ══════════════════════════════════════════════════════════════════════════
// CONFIGURAÇÃO DE SEGURANÇA
// ══════════════════════════════════════════════════════════════════════════

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://cdn.jsdelivr.net"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdn.jsdelivr.net"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdn.jsdelivr.net"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"]
    }
  }
}));

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir arquivos estáticos
app.use(express.static(__dirname));

// ══════════════════════════════════════════════════════════════════════════
// CONFIGURAÇÃO DE SESSÃO
// ══════════════════════════════════════════════════════════════════════════

app.use(session({
  secret: process.env.SESSION_SECRET || 'lip-vision-2011-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 2 // 2 horas
  }
}));

// ══════════════════════════════════════════════════════════════════════════
// RATE LIMITING
// ══════════════════════════════════════════════════════════════════════════

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 tentativas
  message: 'Muitas tentativas de login. Tente novamente em 15 minutos.'
});

const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 30 // 30 requisições por minuto
});

// ══════════════════════════════════════════════════════════════════════════
// INICIALIZAÇÃO DO BANCO DE DADOS
// ══════════════════════════════════════════════════════════════════════════

const dbDir = path.join(__dirname, 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(path.join(dbDir, 'contratos.db'));
db.pragma('journal_mode = WAL'); // Write-Ahead Logging para melhor performance

// Criar tabelas
db.exec(`
  CREATE TABLE IF NOT EXISTS contratos (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    cpf TEXT NOT NULL,
    email TEXT NOT NULL,
    telefone TEXT NOT NULL,
    tipo_servico TEXT NOT NULL,
    data_evento TEXT NOT NULL,
    horario_inicio TEXT NOT NULL,
    horario_fim TEXT,
    local_evento TEXT NOT NULL,
    valor_total TEXT NOT NULL,
    valor_transporte TEXT,
    descricao_pacote TEXT NOT NULL,
    forma_pagamento TEXT NOT NULL,
    autorizacao_imagem TEXT NOT NULL,
    observacoes TEXT,
    assinatura_nome TEXT NOT NULL,
    aceite_confirmado INTEGER NOT NULL DEFAULT 0,
    pdf_path TEXT,
    data_assinatura TEXT NOT NULL,
    hora_assinatura TEXT NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS notificacoes_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    contrato_id TEXT NOT NULL,
    tipo TEXT NOT NULL,
    status TEXT NOT NULL,
    mensagem TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contrato_id) REFERENCES contratos(id)
  );

  CREATE INDEX IF NOT EXISTS idx_contratos_data ON contratos(data_assinatura);
  CREATE INDEX IF NOT EXISTS idx_contratos_nome ON contratos(nome);
`);

// Criar usuário admin padrão se não existir
const adminExists = db.prepare('SELECT COUNT(*) as count FROM admin_users').get();
if (adminExists.count === 0) {
  const passwordHash = bcrypt.hashSync('2011', 10);
  db.prepare('INSERT INTO admin_users (username, password_hash) VALUES (?, ?)').run('admin', passwordHash);
  console.log('✓ Usuário admin criado com senha: 2011');
}

// ══════════════════════════════════════════════════════════════════════════
// MIDDLEWARE DE AUTENTICAÇÃO
// ══════════════════════════════════════════════════════════════════════════

function requireAuth(req, res, next) {
  if (req.session && req.session.isAuthenticated) {
    next();
  } else {
    res.status(401).json({ success: false, message: 'Não autenticado' });
  }
}

// ══════════════════════════════════════════════════════════════════════════
// ROTAS DE AUTENTICAÇÃO
// ══════════════════════════════════════════════════════════════════════════

app.post('/api/auth/login', authLimiter, (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ success: false, message: 'Senha obrigatória' });
    }

    const admin = db.prepare('SELECT * FROM admin_users WHERE username = ?').get('admin');

    if (!admin) {
      return res.status(401).json({ success: false, message: 'Credenciais inválidas' });
    }

    const isValid = bcrypt.compareSync(password, admin.password_hash);

    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Senha incorreta' });
    }

    req.session.isAuthenticated = true;
    req.session.userId = admin.id;

    res.json({ success: true, message: 'Login realizado com sucesso' });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ success: false, message: 'Erro no servidor' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Erro ao fazer logout' });
    }
    res.json({ success: true, message: 'Logout realizado' });
  });
});

app.get('/api/auth/check', (req, res) => {
  if (req.session && req.session.isAuthenticated) {
    res.json({ authenticated: true });
  } else {
    res.json({ authenticated: false });
  }
});

app.post('/api/auth/change-password', requireAuth, (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Senhas obrigatórias' });
    }

    if (newPassword.length < 4) {
      return res.status(400).json({ success: false, message: 'Nova senha deve ter no mínimo 4 caracteres' });
    }

    const admin = db.prepare('SELECT * FROM admin_users WHERE id = ?').get(req.session.userId);
    
    if (!bcrypt.compareSync(currentPassword, admin.password_hash)) {
      return res.status(401).json({ success: false, message: 'Senha atual incorreta' });
    }

    const newHash = bcrypt.hashSync(newPassword, 10);
    db.prepare('UPDATE admin_users SET password_hash = ? WHERE id = ?').run(newHash, req.session.userId);

    res.json({ success: true, message: 'Senha alterada com sucesso' });
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    res.status(500).json({ success: false, message: 'Erro no servidor' });
  }
});

// ══════════════════════════════════════════════════════════════════════════
// ROTAS DE CONTRATOS
// ══════════════════════════════════════════════════════════════════════════

app.post('/api/contratos', apiLimiter, (req, res) => {
  try {
    const {
      nome, cpf, email, telefone, tipoServico, dataEvento, horarioInicio, horarioFim,
      localEvento, valorTotal, valorTransporte, descricaoPacote, formaPagamento,
      autorizacaoImagem, observacoes, assinaturaNome, aceiteConfirmado, pdfBase64
    } = req.body;

    // Validações básicas
    if (!nome || !cpf || !email || !telefone || !tipoServico || !dataEvento || 
        !horarioInicio || !localEvento || !valorTotal || !descricaoPacote || 
        !formaPagamento || !autorizacaoImagem || !assinaturaNome || !aceiteConfirmado) {
      return res.status(400).json({ success: false, message: 'Todos os campos obrigatórios devem ser preenchidos' });
    }

    // Gerar ID único
    const id = uuidv4();
    
    // Data e hora atual
    const now = new Date();
    const dataAssinatura = now.toISOString().split('T')[0];
    const horaAssinatura = now.toTimeString().split(' ')[0];

    // IP e User Agent (para auditoria)
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent') || '';

    // Salvar PDF se fornecido
    let pdfPath = null;
    if (pdfBase64) {
      const pdfDir = path.join(__dirname, 'data', 'pdfs');
      if (!fs.existsSync(pdfDir)) {
        fs.mkdirSync(pdfDir, { recursive: true });
      }
      
      const pdfFileName = `contrato_${id}.pdf`;
      pdfPath = path.join('data', 'pdfs', pdfFileName);
      
      const base64Data = pdfBase64.replace(/^data:application\/pdf;base64,/, '');
      fs.writeFileSync(path.join(__dirname, pdfPath), base64Data, 'base64');
    }

    // Inserir no banco de dados
    const stmt = db.prepare(`
      INSERT INTO contratos (
        id, nome, cpf, email, telefone, tipo_servico, data_evento, horario_inicio, horario_fim,
        local_evento, valor_total, valor_transporte, descricao_pacote, forma_pagamento,
        autorizacao_imagem, observacoes, assinatura_nome, aceite_confirmado, pdf_path,
        data_assinatura, hora_assinatura, ip_address, user_agent
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id, nome, cpf, email, telefone, tipoServico, dataEvento, horarioInicio, horarioFim || null,
      localEvento, valorTotal, valorTransporte || null, descricaoPacote, formaPagamento,
      autorizacaoImagem, observacoes || null, assinaturaNome, aceiteConfirmado ? 1 : 0, pdfPath,
      dataAssinatura, horaAssinatura, ipAddress, userAgent
    );

    // Log de notificação (simulado - será integrado com WhatsApp)
    db.prepare(`
      INSERT INTO notificacoes_log (contrato_id, tipo, status, mensagem)
      VALUES (?, ?, ?, ?)
    `).run(id, 'whatsapp', 'pendente', 'Aguardando integração WhatsApp Business API');

    res.json({
      success: true,
      message: 'Contrato registrado com sucesso',
      contratoId: id
    });

  } catch (error) {
    console.error('Erro ao registrar contrato:', error);
    res.status(500).json({ success: false, message: 'Erro ao processar contrato' });
  }
});

// ══════════════════════════════════════════════════════════════════════════
// ROTAS ADMINISTRATIVAS
// ══════════════════════════════════════════════════════════════════════════

app.get('/api/admin/dashboard', requireAuth, (req, res) => {
  try {
    const stats = {
      totalContratos: db.prepare('SELECT COUNT(*) as count FROM contratos').get().count,
      contratosMesAtual: db.prepare(`
        SELECT COUNT(*) as count FROM contratos 
        WHERE strftime('%Y-%m', data_assinatura) = strftime('%Y-%m', 'now')
      `).get().count,
      valorTotalContratos: db.prepare('SELECT SUM(CAST(REPLACE(REPLACE(valor_total, "R$ ", ""), ".", "") AS REAL) / 100) as total FROM contratos').get().total || 0
    };

    res.json({ success: true, stats });
  } catch (error) {
    console.error('Erro ao buscar dashboard:', error);
    res.status(500).json({ success: false, message: 'Erro ao carregar dashboard' });
  }
});

app.get('/api/admin/contratos', requireAuth, (req, res) => {
  try {
    const { search, mes, ano, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM contratos WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (nome LIKE ? OR email LIKE ? OR cpf LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (mes && ano) {
      query += ' AND strftime("%Y-%m", data_assinatura) = ?';
      params.push(`${ano}-${mes.padStart(2, '0')}`);
    }

    query += ' ORDER BY data_assinatura DESC, hora_assinatura DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const contratos = db.prepare(query).all(...params);
    
    const countQuery = query.split('ORDER BY')[0].replace('SELECT *', 'SELECT COUNT(*) as total');
    const total = db.prepare(countQuery).get(...params.slice(0, -2)).total;

    res.json({
      success: true,
      contratos,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar contratos:', error);
    res.status(500).json({ success: false, message: 'Erro ao carregar contratos' });
  }
});

app.get('/api/admin/contratos/:id', requireAuth, (req, res) => {
  try {
    const contrato = db.prepare('SELECT * FROM contratos WHERE id = ?').get(req.params.id);
    
    if (!contrato) {
      return res.status(404).json({ success: false, message: 'Contrato não encontrado' });
    }

    res.json({ success: true, contrato });
  } catch (error) {
    console.error('Erro ao buscar contrato:', error);
    res.status(500).json({ success: false, message: 'Erro ao carregar contrato' });
  }
});

app.get('/api/admin/contratos/:id/pdf', requireAuth, (req, res) => {
  try {
    const contrato = db.prepare('SELECT pdf_path FROM contratos WHERE id = ?').get(req.params.id);
    
    if (!contrato || !contrato.pdf_path) {
      return res.status(404).json({ success: false, message: 'PDF não encontrado' });
    }

    const pdfPath = path.join(__dirname, contrato.pdf_path);
    
    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({ success: false, message: 'Arquivo PDF não encontrado' });
    }

    res.download(pdfPath);
  } catch (error) {
    console.error('Erro ao baixar PDF:', error);
    res.status(500).json({ success: false, message: 'Erro ao baixar PDF' });
  }
});

// ══════════════════════════════════════════════════════════════════════════
// ROTA DE CONFIGURAÇÃO WHATSAPP (PLACEHOLDER)
// ══════════════════════════════════════════════════════════════════════════

app.post('/api/admin/whatsapp/config', requireAuth, (req, res) => {
  try {
    const { phoneNumber, apiToken } = req.body;
    
    // TODO: Implementar integração com WhatsApp Business API
    // Sugestões: Twilio, MessageBird, ou WhatsApp Business API oficial
    
    res.json({
      success: true,
      message: 'Configuração salva. Integração WhatsApp será ativada em breve.',
      info: 'Configure credenciais da API WhatsApp Business para ativar notificações automáticas'
    });
  } catch (error) {
    console.error('Erro ao configurar WhatsApp:', error);
    res.status(500).json({ success: false, message: 'Erro ao salvar configuração' });
  }
});

// ══════════════════════════════════════════════════════════════════════════
// ROTAS ESTÁTICAS
// ══════════════════════════════════════════════════════════════════════════

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/contrato', (req, res) => {
  res.sendFile(path.join(__dirname, 'contrato.html'));
});

app.get('/relatorios', (req, res) => {
  res.sendFile(path.join(__dirname, 'relatorios.html'));
});

// ══════════════════════════════════════════════════════════════════════════
// INICIALIZAÇÃO DO SERVIDOR
// ══════════════════════════════════════════════════════════════════════════

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════════════════════╗
║                                                                           ║
║   LIP VISION — Sistema de Contratos Digitais                             ║
║   Servidor rodando em: http://localhost:${PORT}                              ║
║                                                                           ║
║   Acesso admin: http://localhost:${PORT}/relatorios                          ║
║   Senha inicial: 2011                                                     ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nEncerrando servidor...');
  db.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\nEncerrando servidor...');
  db.close();
  process.exit(0);
});
