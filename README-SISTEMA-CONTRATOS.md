# SISTEMA DE CONTRATOS DIGITAIS — LIP VISION

Sistema completo de contratos digitais com assinatura eletrônica, painel administrativo e integração WhatsApp.

---

## 🚀 INSTALAÇÃO E CONFIGURAÇÃO

### 1. Instalar Dependências

```bash
npm install
```

### 2. Iniciar o Servidor

```bash
npm start
```

O servidor ficará disponível em: `http://localhost:3000`

---

## 📂 ESTRUTURA DO SISTEMA

```
lipevision-site/
├── server.js                    ← Backend Node.js/Express
├── package.json                 ← Dependências do projeto
├── relatorios.html              ← Painel administrativo
├── contrato.html                ← Formulário de contratação
├── contrato-novo.js             ← Sistema de PDF e assinatura
├── data/                        ← Banco de dados (criado automaticamente)
│   ├── contratos.db            ← SQLite com todos os contratos
│   └── pdfs/                    ← PDFs gerados dos contratos
├── index.html                   ← Site principal
└── README-SISTEMA-CONTRATOS.md  ← Este arquivo
```

---

## 🔐 ACESSO ADMINISTRATIVO

**URL:** `http://localhost:3000/relatorios`

**Senha Inicial:** `2011`

⚠️ **IMPORTANTE:** Altere a senha após o primeiro acesso!

### Como Alterar a Senha

1. Faça login no painel administrativo
2. Clique em "Alterar Senha" no canto superior direito
3. Digite a senha atual (2011) e a nova senha
4. Confirme a alteração

---

## ✍️ COMO FUNCIONA O SISTEMA

### FLUXO COMPLETO

1. **Cliente preenche o formulário** (`contrato.html`)
   - Dados pessoais
   - Informações do evento
   - Valores e pacote contratado
   - Autorização de imagem

2. **Assinatura Digital**
   - Cliente digita o nome completo
   - Confirma que leu e concorda com o contrato
   - Sistema gera representação visual da assinatura em fonte cursiva

3. **Geração Automática do PDF**
   - PDF profissional com todos os dados
   - Duas assinaturas digitais:
     - **Sanderson Felipe** (assinatura padronizada em fonte cursiva)
     - **Cliente** (assinatura gerada com o nome digitado em fonte cursiva)
   - Todas as cláusulas contratuais
   - Número único de identificação
   - Data e hora da assinatura

4. **Armazenamento Seguro**
   - Contrato salvo no banco de dados SQLite
   - PDF armazenado em `data/pdfs/`
   - Registro completo com IP, data/hora e aceite

5. **Notificação WhatsApp** (Automática após configuração)
   - Mensagem enviada para o administrador
   - Dados resumidos do contrato
   - Link para o painel administrativo

6. **Cliente Recebe o PDF**
   - Download automático do PDF
   - WhatsApp abre automaticamente com mensagem para a Lip Vision
   - Cliente confirma a contratação

---

## 🎯 FUNCIONALIDADES DO PAINEL ADMINISTRATIVO

### Dashboard Principal
- Total de contratos assinados
- Contratos do mês atual
- Valor total acumulado

### Gestão de Contratos
- Visualizar todos os contratos
- Buscar por nome, e-mail ou CPF
- Filtrar por mês e ano
- Paginação automática

### Detalhes do Contrato
- Visualizar todos os dados completos
- Baixar PDF individual
- Rastreabilidade completa (IP, data/hora, versão do contrato)

### Segurança
- Autenticação obrigatória
- Sessão protegida (2 horas)
- Rate limiting (proteção contra ataques)
- Senha criptografada (bcrypt)
- Helmet.js para segurança HTTP

---

## 📱 INTEGRAÇÃO WHATSAPP BUSINESS

### Configuração da API WhatsApp

O sistema está preparado para integração com WhatsApp Business API.

#### Opções Recomendadas:

1. **Twilio WhatsApp API** (Recomendado)
   - Website: https://www.twilio.com/whatsapp
   - Plano gratuito disponível
   - Fácil integração

2. **MessageBird**
   - Website: https://www.messagebird.com
   - Suporte WhatsApp Business API
   - Preços acessíveis

3. **WhatsApp Business API Oficial**
   - Website: https://developers.facebook.com/docs/whatsapp
   - Requer aprovação do Facebook
   - Mais complexo mas oficial

### Como Configurar (Exemplo com Twilio):

1. Crie uma conta em https://www.twilio.com
2. Obtenha suas credenciais:
   - Account SID
   - Auth Token
   - Número do WhatsApp

3. Adicione as credenciais no servidor:

```javascript
// No arquivo server.js, adicione:

const twilio = require('twilio');
const accountSid = 'SEU_ACCOUNT_SID';
const authToken = 'SEU_AUTH_TOKEN';
const client = twilio(accountSid, authToken);

// Na função de registro de contrato, adicione:

client.messages.create({
  from: 'whatsapp:+14155238886',  // Número do Twilio
  to: 'whatsapp:+5571920029709',  // Seu número
  body: `📄 NOVO CONTRATO ASSINADO\n\n` +
        `Contratante: ${dados.nome}\n` +
        `Serviço: ${dados.tipoServico}\n` +
        `Data: ${dados.dataEvento}\n` +
        `Valor: ${dados.valorTotal}\n\n` +
        `Acesse o painel: http://localhost:3000/relatorios`
});
```

---

## 🛡️ SEGURANÇA E LGPD

### Medidas Implementadas

1. **Autenticação Segura**
   - Senha criptografada com bcrypt
   - Sessões com tempo de expiração
   - Proteção contra força bruta (rate limiting)

2. **Armazenamento Protegido**
   - Banco de dados local (não exposto)
   - PDFs armazenados em diretório privado
   - Acesso apenas via autenticação

3. **Auditoria**
   - Registro de IP e User-Agent
   - Data e hora precisa de cada assinatura
   - Número único de identificação do contrato

4. **Conformidade LGPD**
   - Dados armazenados apenas para fins contratuais
   - Consentimento expresso do cliente
   - Finalidade específica (relação contratual)
   - Dados acessíveis apenas ao administrador autorizado

### Recomendações Adicionais

- **Backup regular** do banco de dados
- **HTTPS obrigatório** em produção
- **Variáveis de ambiente** para credenciais sensíveis
- **Logs de acesso** ao painel administrativo

---

## 🔧 PERSONALIZAÇÃO

### Alterar Número do WhatsApp

No arquivo `contrato-novo.js`, linha 18:

```javascript
const CONFIG = {
  WHATSAPP_NUMBER: '5571920029709',  // ← Altere aqui
  // ...
};
```

### Alterar Nome da Contratada

No mesmo arquivo, linhas 19-20:

```javascript
  CONTRATADA_NOME: 'Sanderson Felipe',
  CONTRATADA_NOME_COMPLETO: 'Sanderson Felipe da Silva Ferreira Matos',
```

### Adicionar/Modificar Cláusulas

No arquivo `contrato-novo.js`, procure o array `clausulas` (linha ~600) e edite conforme necessário.

### Mudar Senha Inicial do Admin

No arquivo `server.js`, linha ~90:

```javascript
if (adminExists.count === 0) {
  const passwordHash = bcrypt.hashSync('2011', 10);  // ← Altere '2011'
  // ...
}
```

---

## 🚀 DEPLOY EM PRODUÇÃO

### Opção 1: Vercel (Recomendado)

Vercel suporta Node.js e SQLite com persistência via Vercel Postgres ou Neon.

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Opção 2: Railway

Railway oferece hospedagem gratuita para Node.js com banco de dados.

1. Crie uma conta em https://railway.app
2. Conecte seu repositório GitHub
3. Railway detecta automaticamente o Node.js
4. Configure as variáveis de ambiente

### Opção 3: Render

Render oferece plano gratuito com Node.js.

1. Crie uma conta em https://render.com
2. Novo Web Service
3. Conecte o repositório
4. Configuração automática

### Variáveis de Ambiente (Produção)

Crie um arquivo `.env` (nunca commitar):

```env
NODE_ENV=production
PORT=3000
SESSION_SECRET=GERE_UM_SEGREDO_FORTE_AQUI
WHATSAPP_API_KEY=sua_chave_api_aqui
```

---

## 📊 BANCO DE DADOS

### Estrutura

O sistema usa SQLite com as seguintes tabelas:

#### `contratos`
- Dados completos do contrato
- Informações do cliente
- Detalhes do evento
- Valores e pagamento
- Assinatura digital
- Auditoria (IP, data/hora)

#### `admin_users`
- Usuários administrativos
- Senha criptografada

#### `notificacoes_log`
- Log de notificações enviadas
- Status de cada envio

### Backup Manual

```bash
# Criar backup
cp data/contratos.db data/contratos-backup-$(date +%Y%m%d).db

# Restaurar backup
cp data/contratos-backup-20260101.db data/contratos.db
```

---

## 🐛 TROUBLESHOOTING

### Erro: "Cannot find module 'better-sqlite3'"

```bash
npm install
```

### Erro: "Port 3000 is already in use"

Altere a porta no `server.js` ou mate o processo:

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### PDF não está sendo gerado

Certifique-se de que o jsPDF está carregado:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
```

### Senha de admin esquecida

Reinicie o banco de dados (⚠️ perde todos os contratos):

```bash
rm data/contratos.db
npm start
```

Ou altere a senha manualmente via SQL:

```bash
npm install -g sqlite3
sqlite3 data/contratos.db

UPDATE admin_users 
SET password_hash = '$2a$10$HASH_AQUI' 
WHERE username = 'admin';
```

---

## 📝 PRÓXIMAS MELHORIAS

### Planejadas

- [ ] Envio automático de e-mail para o cliente com PDF
- [ ] Integração real com WhatsApp Business API
- [ ] Assinatura digital certificada (ICP-Brasil)
- [ ] Geração de segunda via do contrato
- [ ] Exportação de relatórios em Excel
- [ ] Dashboard com gráficos
- [ ] Multi-idioma (EN/ES)

### Sugestões de Integrações

- **EmailJS** - Envio de e-mails automáticos
- **ZapSign** - Assinatura digital com validade jurídica
- **Supabase** - Banco de dados na nuvem
- **Stripe** - Pagamentos online

---

## 📞 SUPORTE

**Desenvolvido por:** Kiro AI Assistant  
**Para:** Sanderson Felipe — Lip Vision Photography & Film  
**Localização:** Salvador, Bahia, Brasil  

**Contato da Lip Vision:**  
📱 WhatsApp: (71) 9 2002-9709  
📧 E-mail: [via site]  
📷 Instagram: @lipe.vision  

---

## ⚖️ VALIDADE JURÍDICA

### Sobre Assinatura Eletrônica

Este sistema implementa **assinatura eletrônica simples**, conforme Lei 14.063/2020.

**Validade jurídica:**
- ✅ Válido para contratos de prestação de serviços
- ✅ Possui rastreabilidade (IP, data/hora, versão)
- ✅ Manifesta consentimento expresso
- ⚠️ **NÃO é certificado digital ICP-Brasil**

### Upgrade para Assinatura Qualificada

Para assinatura com **validade jurídica reforçada**, considere:

1. **ZapSign** - Assinatura eletrônica qualificada
2. **Clicksign** - Certificado digital
3. **DocuSign** - Padrão internacional

---

## 📄 LICENÇA

© 2026 Lip Vision Photography & Film  
Todos os direitos reservados.

Este sistema foi desenvolvido exclusivamente para uso interno da Lip Vision.

---

**LIP VISION — Transformando momentos em memórias eternas** 📸✨
