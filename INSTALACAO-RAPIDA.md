# ⚡ INSTALAÇÃO RÁPIDA — SISTEMA DE CONTRATOS LIP VISION

## 🎯 PASSO A PASSO (5 minutos)

### 1️⃣ Instalar Node.js (se ainda não tiver)

Baixe e instale: https://nodejs.org (versão LTS recomendada)

### 2️⃣ Abrir o Terminal no Projeto

**Windows:** Clique com botão direito na pasta `lipevision-site` → "Abrir no Terminal"

**VS Code:** Abra a pasta no VS Code e pressione `Ctrl + '` (abre o terminal integrado)

### 3️⃣ Instalar Dependências

```bash
npm install
```

Aguarde alguns segundos enquanto as dependências são baixadas...

### 4️⃣ Iniciar o Servidor

```bash
npm start
```

Você verá a mensagem:

```
╔═══════════════════════════════════════════════════════════╗
║   LIP VISION — Sistema de Contratos Digitais             ║
║   Servidor rodando em: http://localhost:3000             ║
║   Acesso admin: http://localhost:3000/relatorios        ║
║   Senha inicial: 2011                                    ║
╚═══════════════════════════════════════════════════════════╝
```

### 5️⃣ Acessar o Sistema

Abra seu navegador e visite:

- **Site Principal:** http://localhost:3000
- **Formulário de Contrato:** http://localhost:3000/contrato.html
- **Painel Administrativo:** http://localhost:3000/relatorios

---

## 🔐 PRIMEIRO ACESSO AO PAINEL ADMIN

1. Acesse: http://localhost:3000/relatorios
2. Digite a senha: **2011**
3. **IMPORTANTE:** Após entrar, clique em "Alterar Senha" e defina uma nova senha!

---

## ✅ TESTE COMPLETO

### Teste 1: Criar um Contrato

1. Vá para: http://localhost:3000/contrato.html
2. Preencha todos os campos obrigatórios
3. Digite seu nome completo no campo de assinatura
4. Marque a caixa "Concordo com o contrato"
5. Clique em "Gerar PDF e Enviar pelo WhatsApp"
6. O PDF será baixado automaticamente
7. O WhatsApp abrirá com a mensagem

### Teste 2: Visualizar no Painel Admin

1. Acesse: http://localhost:3000/relatorios
2. Faça login com a senha
3. Veja o contrato que você acabou de criar
4. Clique em "Ver" para ver todos os detalhes
5. Clique em "Baixar PDF" para baixar o documento

---

## 🎨 PERSONALIZAR

### Mudar o número do WhatsApp

Edite o arquivo `contrato-novo.js`, linha 18:

```javascript
WHATSAPP_NUMBER: '5571920029709',  // ← Coloque seu número aqui
```

### Mudar a senha inicial do admin

Edite o arquivo `server.js`, linha ~90:

```javascript
const passwordHash = bcrypt.hashSync('2011', 10);  // ← Troque '2011'
```

Depois delete a pasta `data/` e reinicie o servidor.

---

## 🐛 PROBLEMAS COMUNS

### "npm: command not found"
→ Node.js não está instalado. Instale de https://nodejs.org

### "Port 3000 is already in use"
→ Já tem algo rodando na porta 3000. Mate o processo:

**Windows:**
```bash
netstat -ano | findstr :3000
taskkill /PID <numero_do_pid> /F
```

### PDF não está sendo gerado
→ Certifique-se de que está usando um navegador moderno (Chrome, Firefox, Edge atualizado)

---

## 📱 PRÓXIMOS PASSOS

Depois que tudo estiver funcionando localmente, você pode:

1. **Configurar WhatsApp Business API** (veja o README completo)
2. **Fazer deploy em produção** (Vercel, Railway, Render)
3. **Adicionar envio automático de e-mail** (EmailJS)
4. **Implementar backup automático** do banco de dados

Leia o arquivo `README-SISTEMA-CONTRATOS.md` para instruções completas!

---

## 🆘 PRECISA DE AJUDA?

WhatsApp Lip Vision: (71) 9 2002-9709

---

**LIP VISION** — Transformando momentos em memórias eternas 📸✨
