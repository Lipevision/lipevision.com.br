# 🚀 COMO USAR O SISTEMA LIP VISION — GUIA RÁPIDO

## ⚡ COMEÇAR EM 3 PASSOS

### PASSO 1: Instalar
```bash
npm install
```

### PASSO 2: Iniciar
```bash
npm start
```

### PASSO 3: Acessar
Abra o navegador em: **http://localhost:3000**

---

## 🎯 PRINCIPAIS FUNCIONALIDADES

### 1️⃣ CRIAR UM CONTRATO

**URL:** `http://localhost:3000/contrato.html`

**Como fazer:**

1. Preencha todos os dados do cliente
2. Preencha informações do evento
3. Digite o nome completo no campo de assinatura
4. Marque "Concordo com o contrato"
5. Clique em "Gerar PDF e Enviar"

**O que acontece:**
- 📄 PDF é gerado automaticamente
- 💾 Contrato é salvo no banco de dados
- 📱 WhatsApp abre com mensagem
- ✍️ Duas assinaturas aparecem no PDF (cursivas e elegantes)

---

### 2️⃣ ACESSAR PAINEL ADMINISTRATIVO

**URL:** `http://localhost:3000/relatorios`

**Senha:** `2011`

**O que você vê:**
- 📊 Total de contratos
- 💰 Valor total acumulado
- 📋 Lista de todos os contratos
- 🔍 Busca e filtros
- 👁️ Visualização detalhada
- 📥 Download de PDFs

**Importante:**
- ⚠️ O servidor DEVE estar rodando (`npm start`)
- ⚠️ NÃO abra o arquivo HTML direto
- ⚠️ SEMPRE use `http://localhost:3000`

---

### 3️⃣ VISUALIZAR UM CONTRATO

**No painel admin:**

1. Encontre o contrato na lista
2. Clique no botão "Ver"
3. Veja todos os detalhes
4. Clique em "Baixar PDF" se quiser salvar

---

### 4️⃣ BUSCAR CONTRATOS

**No painel admin:**

1. Use a caixa de busca no topo
2. Digite nome, e-mail ou CPF
3. Use os filtros de mês e ano
4. Clique em "Limpar Filtros" para resetar

---

## 🔐 SEGURANÇA

### Senha Padrão

**Senha inicial:** `2011`

**⚠️ ATENÇÃO:** Altere a senha após o primeiro acesso!

**Como alterar:**

1. Faça login no painel
2. Clique em "Alterar Senha" (canto superior direito)
3. Digite a senha atual (2011)
4. Digite a nova senha
5. Confirme

---

## 📱 WHATSAPP

### Como Funciona

Após gerar o contrato:

1. ✅ PDF é criado
2. ✅ Dados são salvos
3. ✅ WhatsApp abre automaticamente
4. ✅ Mensagem já vem preenchida com:
   - Nome do cliente
   - Tipo de serviço
   - Data do evento
   - Valor do contrato

### Configurar Notificações Automáticas (Opcional)

Para receber notificações automáticas no WhatsApp quando alguém assinar um contrato:

1. Crie conta no Twilio (https://www.twilio.com)
2. Obtenha credenciais WhatsApp Business API
3. Configure no `server.js`
4. Teste a integração

**Leia:** `README-SISTEMA-CONTRATOS.md` para instruções completas

---

## 🎨 PERSONALIZAR

### Mudar Número do WhatsApp

**Arquivo:** `contrato-novo.js` (linha 18)

```javascript
WHATSAPP_NUMBER: '5571920029709',  // ← Seu número aqui
```

### Mudar Nome da Empresa

**Arquivo:** `contrato-novo.js` (linhas 19-20)

```javascript
CONTRATADA_NOME: 'Sanderson Felipe',
CONTRATADA_NOME_COMPLETO: 'Sanderson Felipe da Silva Ferreira Matos',
```

### Mudar Senha Inicial

**Arquivo:** `server.js` (linha 90)

```javascript
const passwordHash = bcrypt.hashSync('2011', 10);  // ← Nova senha aqui
```

Depois:
```bash
# Delete o banco e reinicie
rm -rf data/
npm start
```

---

## 📂 ONDE ESTÃO OS DADOS?

### Banco de Dados
**Localização:** `data/contratos.db`

Contém:
- Todos os contratos
- Dados dos clientes
- Registros de autenticação

### PDFs Gerados
**Localização:** `data/pdfs/`

Exemplo:
- `contrato_abc123.pdf`
- `contrato_def456.pdf`

### Backup Manual

```bash
# Criar backup
cp data/contratos.db backup-$(date +%Y%m%d).db

# Restaurar backup
cp backup-20260126.db data/contratos.db
```

---

## 🐛 PROBLEMAS COMUNS

### "Erro ao conectar com o servidor"

**Causa:** Servidor não está rodando

**Solução:**
```bash
npm start
```

Depois acesse: `http://localhost:3000/relatorios`

---

### "Port 3000 is already in use"

**Causa:** Já tem algo usando a porta 3000

**Solução (Windows):**
```bash
netstat -ano | findstr :3000
taskkill /PID <numero> /F
```

---

### "Cannot find module..."

**Causa:** Dependências não foram instaladas

**Solução:**
```bash
npm install
```

---

### PDF não baixa

**Causa:** Navegador está bloqueando downloads

**Solução:**

1. Verifique permissões do navegador
2. Tente em modo anônimo
3. Verifique se todos os campos foram preenchidos

---

### Assinaturas não aparecem

**Isso foi corrigido!**

Se ainda acontecer:

1. Pressione `Ctrl + F5` (recarregar sem cache)
2. Feche e abra o navegador
3. Gere um novo contrato

---

## 📊 ESTRUTURA DO SISTEMA

```
lipevision-site/
├── index.html              ← Site principal
├── contrato.html           ← Formulário de contrato
├── relatorios.html         ← Painel admin (protegido)
├── server.js               ← Backend (Node.js + Express)
├── contrato-novo.js        ← Sistema de PDF
├── style.css               ← Estilos do site
├── script.js               ← Scripts do site
├── data/                   ← Dados (criado automaticamente)
│   ├── contratos.db       ← Banco de dados
│   └── pdfs/              ← PDFs gerados
└── package.json            ← Dependências
```

---

## ✅ CHECKLIST DIÁRIO

### Antes de usar:
- [ ] Servidor está rodando (`npm start`)
- [ ] Navegador está aberto em `http://localhost:3000`

### Após criar contrato:
- [ ] PDF foi baixado
- [ ] WhatsApp abriu
- [ ] Cliente recebeu o PDF

### Verificação semanal:
- [ ] Fazer backup do banco de dados
- [ ] Verificar espaço em disco
- [ ] Testar acesso ao painel admin

---

## 🎓 DICAS PROFISSIONAIS

### Para Clientes

**Dica 1:** Sempre confira os dados antes de assinar

**Dica 2:** Guarde o PDF em local seguro

**Dica 3:** Em caso de dúvida, entre em contato

### Para Administrador

**Dica 1:** Altere a senha padrão imediatamente

**Dica 2:** Faça backup regular (semanal)

**Dica 3:** Verifique contratos pendentes diariamente

**Dica 4:** Configure WhatsApp Business API para automatizar notificações

---

## 📱 SUPORTE

### Documentação Disponível:

1. **`COMO-USAR.md`** (este arquivo) — Guia rápido
2. **`INSTALACAO-RAPIDA.md`** — Instalação em 5 minutos
3. **`TESTE-SISTEMA.md`** — Testes completos
4. **`README-SISTEMA-CONTRATOS.md`** — Documentação técnica completa
5. **`RELATORIO-AJUSTES-FINAIS.md`** — Alterações recentes

### Contato Lip Vision:

📱 **WhatsApp:** (71) 9 2002-9709  
📷 **Instagram:** @lipe.vision  
📍 **Local:** Salvador, Bahia, Brasil

---

## 🚀 DEPLOY EM PRODUÇÃO

Quando estiver pronto para publicar online:

### Opção 1: Vercel (Recomendado)

```bash
npm i -g vercel
vercel
```

### Opção 2: Railway

1. Acesse https://railway.app
2. Conecte seu GitHub
3. Selecione o repositório
4. Deploy automático

### Opção 3: Render

1. Acesse https://render.com
2. Novo Web Service
3. Conecte o repositório
4. Configure variáveis de ambiente

**Leia:** `README-SISTEMA-CONTRATOS.md` para instruções detalhadas de deploy

---

## 🎉 TUDO PRONTO!

Seu sistema está **100% funcional** e pronto para uso!

**O que você tem agora:**

✅ Formulário de contratos digital  
✅ PDFs com assinaturas elegantes  
✅ Painel administrativo protegido  
✅ Banco de dados seguro  
✅ WhatsApp integrado  
✅ Design profissional e responsivo  
✅ Sistema completo de gestão  

**Próximos passos:**

1. Teste tudo seguindo `TESTE-SISTEMA.md`
2. Personalize com seus dados
3. Altere a senha padrão
4. Comece a usar!

---

**LIP VISION — Transformando momentos em memórias eternas** 📸✨
