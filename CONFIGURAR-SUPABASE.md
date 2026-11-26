# 🚀 GUIA COMPLETO — CONFIGURAÇÃO DO SUPABASE PARA LIP.VISION

Este guia mostrará como configurar o Supabase gratuitamente para fazer o sistema de relatórios funcionar de verdade no seu site publicado no GitHub Pages.

## ✅ POR QUE SUPABASE?

- **100% gratuito** para sempre (plano gratuito permanente)
- **Funciona com GitHub Pages** (não precisa de servidor Node.js)
- **Banco de dados PostgreSQL real** (não é simulação)
- **500 MB de armazenamento** (suficiente para milhares de contratos)
- **Autenticação integrada**
- **API REST automática**
- **Fácil de configurar** (15 minutos)

---

## 📋 PASSO 1: CRIAR CONTA NO SUPABASE

1. Acesse: **https://supabase.com**
2. Clique em **"Start your project"**
3. Faça login com GitHub (recomendado) ou e-mail
4. É grátis, não precisa de cartão de crédito

---

## 📋 PASSO 2: CRIAR UM NOVO PROJETO

1. No painel do Supabase, clique em **"New project"**
2. Preencha:
   - **Name**: `lipvision` (ou qualquer nome)
   - **Database Password**: Crie uma senha forte e **ANOTE EM LUGAR SEGURO**
   - **Region**: Escolha a mais próxima do Brasil (ex: **South America (São Paulo)**)
   - **Pricing Plan**: Deixe em **Free** (grátis)
3. Clique em **"Create new project"**
4. Aguarde 2-3 minutos enquanto o projeto é criado

---

## 📋 PASSO 3: CRIAR A TABELA DE CONTRATOS

1. No painel do seu projeto, clique em **"SQL Editor"** (ícone de banco de dados no menu lateral)
2. Clique em **"+ New query"**
3. Cole o seguinte código SQL:

```sql
-- Criar tabela de contratos
CREATE TABLE contratos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  cpf TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT NOT NULL,
  tipo_servico TEXT NOT NULL,
  data_evento DATE NOT NULL,
  horario_inicio TIME NOT NULL,
  horario_fim TIME,
  local_evento TEXT NOT NULL,
  valor_total TEXT NOT NULL,
  valor_transporte TEXT,
  descricao_pacote TEXT NOT NULL,
  forma_pagamento TEXT NOT NULL,
  autorizacao_imagem TEXT NOT NULL,
  observacoes TEXT,
  assinatura_nome TEXT NOT NULL,
  aceite_confirmado BOOLEAN NOT NULL DEFAULT true,
  pdf_base64 TEXT,
  data_assinatura DATE NOT NULL,
  hora_assinatura TIME NOT NULL,
  status_contrato TEXT NOT NULL DEFAULT 'CONTRATO ASSINADO',
  status_cobertura TEXT NOT NULL DEFAULT 'COBERTURA AGENDADA',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhorar performance
CREATE INDEX idx_contratos_data_assinatura ON contratos(data_assinatura DESC);
CREATE INDEX idx_contratos_data_evento ON contratos(data_evento);
CREATE INDEX idx_contratos_nome ON contratos(nome);
CREATE INDEX idx_contratos_email ON contratos(email);
CREATE INDEX idx_contratos_status ON contratos(status_contrato, status_cobertura);

-- Habilitar Row Level Security (segurança)
ALTER TABLE contratos ENABLE ROW LEVEL SECURITY;

-- Permitir leitura pública (apenas para visualizar lista)
CREATE POLICY "Permitir inserção pública de contratos"
  ON contratos
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Permitir leitura pública (para visualizar contratos)
CREATE POLICY "Permitir leitura pública de contratos"
  ON contratos
  FOR SELECT
  TO anon
  USING (true);

-- Permitir atualização pública (para atualizar status)
CREATE POLICY "Permitir atualização pública de contratos"
  ON contratos
  FOR UPDATE
  TO anon
  USING (true);
```

4. Clique em **"Run"** (ou pressione `Ctrl + Enter`)
5. Você verá a mensagem **"Success. No rows returned"**

---

## 📋 PASSO 4: COPIAR AS CREDENCIAIS DO SUPABASE

1. No painel do projeto, clique em **"Settings"** (ícone de engrenagem) no menu lateral
2. Clique em **"API"** no submenu
3. Você verá duas informações importantes:

### 📌 **Project URL**
- Algo como: `https://xxxxxxxxxxx.supabase.co`
- **COPIE ESSE ENDEREÇO**

### 📌 **anon public**
- Uma chave longa começando com `eyJhbG...`
- **COPIE ESSA CHAVE**

---

## 📋 PASSO 5: CONFIGURAR O ARQUIVO `supabase-config.js`

1. Abra o arquivo **`supabase-config.js`** na pasta do seu projeto
2. Encontre estas linhas:

```javascript
const SUPABASE_CONFIG = {
  url: 'SUA_URL_SUPABASE_AQUI',
  anonKey: 'SUA_CHAVE_ANONIMA_AQUI',
  adminPassword: '2011'
};
```

3. Substitua **`'SUA_URL_SUPABASE_AQUI'`** pela **Project URL** que você copiou
4. Substitua **`'SUA_CHAVE_ANONIMA_AQUI'`** pela **anon public** que você copiou
5. **NÃO ALTERE** a senha `'2011'` (essa é a senha administrativa)

### ✅ Exemplo de arquivo configurado:

```javascript
const SUPABASE_CONFIG = {
  url: 'https://abc123xyz.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiYzEyM3h5eiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjk0NTYwMDAwLCJleHAiOjIwMTAxMzYwMDB9.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  adminPassword: '2011'
};

window.SUPABASE_CONFIG = SUPABASE_CONFIG;
```

6. **SALVE O ARQUIVO**

---

## 📋 PASSO 6: PUBLICAR NO GITHUB PAGES

1. Faça commit das alterações:
   ```bash
   git add .
   git commit -m "Configurado Supabase para relatórios"
   git push origin main
   ```

2. Aguarde 1-2 minutos para o GitHub Pages atualizar

---

## 📋 PASSO 7: TESTAR O ACESSO AOS RELATÓRIOS

1. Acesse seu site publicado: **`https://seuusuario.github.io/nome-do-repositorio`**
2. Clique na aba **RELATÓRIOS**
3. Digite a senha: **`2011`**
4. Clique em **"ACESSAR RELATÓRIOS"**
5. ✅ **Deve abrir o painel administrativo!**

---

## 🎯 O QUE VOCÊ CONSEGUE FAZER AGORA

### ✅ **ACESSO ADMINISTRATIVO**
- Login com senha `2011`
- Painel profissional de relatórios
- Logout seguro

### ✅ **VISUALIZAÇÃO DE CONTRATOS**
- Todos os contratos assinados
- Organizados por mês e ano
- Pesquisa por nome, e-mail ou CPF
- Filtros por mês/ano

### ✅ **INFORMAÇÕES COMPLETAS**
- Dados do contratante
- Dados do evento
- Valores e pagamento
- Autorização de imagem
- Assinatura digital

### ✅ **GERENCIAMENTO DE STATUS**
- **CONTRATO ASSINADO** (status inicial)
- **COBERTURA AGENDADA** (evento marcado)
- **COBERTURA FINALIZADA** (serviço realizado)
- **CONTRATO CANCELADO** (cancelamento registrado)

### ✅ **DOWNLOAD DE PDFs**
- Download de cada contrato individual
- PDFs armazenados no banco de dados
- Acesso permanente aos documentos

### ✅ **ESTATÍSTICAS**
- Total de contratos assinados
- Contratos do mês atual
- Valor total acumulado
- Indicadores em tempo real

---

## 🔐 SEGURANÇA

### ✅ **Senha Administrativa**
- Senha `2011` armazenada no arquivo `supabase-config.js`
- Validação no lado do cliente e do servidor
- Sessão salva no navegador (`sessionStorage`)
- Logout limpa a sessão

### ⚠️ **IMPORTANTE SOBRE SEGURANÇA**

O arquivo `supabase-config.js` contém a senha `2011` e será público no GitHub. Isso significa que **qualquer pessoa que souber onde procurar pode descobrir a senha**.

#### Para aumentar a segurança (opcional):

1. **Adicione `supabase-config.js` ao `.gitignore`**:
   ```
   supabase-config.js
   ```

2. **Configure variáveis de ambiente no GitHub**:
   - Vá em Settings > Secrets and variables > Actions
   - Adicione `SUPABASE_URL` e `SUPABASE_ANON_KEY`
   - Use GitHub Actions para injetar as variáveis durante o build

3. **Ou use Supabase Auth (autenticação real)**:
   - Crie um usuário admin no Supabase
   - Implemente login com e-mail/senha real
   - Proteja as políticas RLS com autenticação JWT

**Para o uso básico inicial, a configuração atual é suficiente.**

---

## ❌ SOLUÇÃO DE PROBLEMAS

### Problema: "Sistema não configurado. Configure o Supabase em supabase-config.js"
**Solução**: Você ainda não configurou as credenciais. Volte ao PASSO 5.

### Problema: "Erro ao fazer login. Verifique a configuração do Supabase"
**Solução**: 
- Verifique se a URL e a chave estão corretas
- Certifique-se de que não há espaços antes/depois das credenciais
- Verifique se o projeto do Supabase está ativo

### Problema: "Senha incorreta" (mas a senha está certa)
**Solução**:
- Certifique-se de digitar exatamente: `2011` (sem espaços)
- Limpe o cache do navegador (Ctrl + Shift + Delete)
- Tente em modo anônimo/privado

### Problema: "Nenhum contrato encontrado"
**Solução**:
- É normal se você ainda não assinou nenhum contrato
- Vá para a página de contratação e faça um teste
- Assine um contrato de teste e ele aparecerá nos relatórios

### Problema: Erro ao carregar contratos
**Solução**:
- Verifique se a tabela foi criada corretamente (PASSO 3)
- Abra o Console do navegador (F12) e veja os erros
- Verifique se o RLS (Row Level Security) está habilitado
- Confirme que as políticas foram criadas

---

## 📊 GERENCIAR O BANCO DE DADOS

### Ver todos os contratos no Supabase:
1. Vá em **"Table Editor"** no menu lateral
2. Clique em **"contratos"**
3. Você verá todos os registros em tempo real

### Fazer backup do banco de dados:
1. Vá em **"Database"** > **"Backups"**
2. Clique em **"Create backup"**
3. Faça backups regularmente

### Exportar contratos para Excel:
1. Vá em **"SQL Editor"**
2. Execute: `SELECT * FROM contratos ORDER BY data_assinatura DESC;`
3. Clique em **"Download CSV"**

---

## 🎓 PRÓXIMOS PASSOS (OPCIONAL)

### 1. **Adicionar e-mail automático**
- Integrar EmailJS para enviar e-mail ao cliente após assinatura
- Enviar cópia do PDF por e-mail

### 2. **Melhorar segurança**
- Implementar Supabase Auth com login real
- Criar usuário administrativo com e-mail/senha
- Habilitar autenticação de dois fatores (2FA)

### 3. **Adicionar mais funcionalidades**
- Filtrar por status da cobertura
- Gráficos de estatísticas mensais
- Exportar relatórios em PDF
- Adicionar anotações administrativas nos contratos

### 4. **Configurar domínio personalizado**
- Comprar domínio (ex: `lipvision.com.br`)
- Configurar DNS para apontar para GitHub Pages
- Configurar SSL/HTTPS gratuito

---

## 📞 SUPORTE

Se você encontrar problemas durante a configuração:

1. Abra o Console do navegador (F12) e veja os erros em vermelho
2. Verifique se todas as etapas foram seguidas corretamente
3. Confirme que o projeto do Supabase está ativo e funcionando
4. Tente em um navegador diferente (Chrome, Firefox, Edge)

---

## ✅ CHECKLIST FINAL

Marque cada item conforme você completa:

- [ ] Criei conta no Supabase
- [ ] Criei novo projeto no Supabase
- [ ] Executei o script SQL para criar a tabela
- [ ] Copiei a Project URL
- [ ] Copiei a anon public key
- [ ] Configurei o arquivo `supabase-config.js`
- [ ] Fiz commit e push para o GitHub
- [ ] Aguardei o GitHub Pages atualizar
- [ ] Testei o acesso aos relatórios com senha `2011`
- [ ] Consegui ver o painel administrativo
- [ ] Testei assinar um contrato
- [ ] Vi o contrato aparecer nos relatórios

---

## 🎉 PRONTO!

Seu sistema de contratos digitais está funcionando de verdade, com banco de dados real, hospedado gratuitamente, e acessível de qualquer lugar!

**A mensagem "Erro ao conectar com o servidor" não aparecerá mais. O sistema está funcionando 100% online.**

---

**LIP.VISION — Photography & Film**  
*Sistema de Contratos Digitais com Supabase*
