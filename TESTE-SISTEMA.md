# ✅ TESTE COMPLETO DO SISTEMA - LIP VISION

## 🔧 PRÉ-REQUISITOS

Antes de testar, certifique-se de que:

1. ✅ Node.js está instalado
2. ✅ Dependências foram instaladas (`npm install`)
3. ✅ Servidor está rodando (`npm start`)

---

## 🚀 TESTE 1: INICIAR O SERVIDOR

### Passos:

1. Abra o terminal na pasta do projeto
2. Execute:

```bash
npm start
```

### Resultado Esperado:

Você deve ver:

```
╔═══════════════════════════════════════════════════════════╗
║   LIP VISION — Sistema de Contratos Digitais             ║
║   Servidor rodando em: http://localhost:3000             ║
║   Acesso admin: http://localhost:3000/relatorios        ║
║   Senha inicial: 2011                                    ║
╚═══════════════════════════════════════════════════════════╝
✓ Usuário admin criado com senha: 2011
```

**Se aparecer algum erro:**
- Verifique se a porta 3000 está livre
- Verifique se todas as dependências foram instaladas

---

## 🔐 TESTE 2: ACESSO AO PAINEL ADMINISTRATIVO

### Passos:

1. Com o servidor rodando, abra o navegador
2. Acesse: `http://localhost:3000/relatorios`
3. Você verá a tela de login da Lip Vision
4. Digite a senha: **2011** (exatamente esses 4 números)
5. Clique em "Acessar Relatórios"

### Resultado Esperado:

✅ Você deve entrar no painel administrativo
✅ Deve ver o dashboard com estatísticas
✅ Deve ver a lista de contratos (vazia inicialmente)

### ❌ Se aparecer "Erro ao conectar com o servidor":

**Causas possíveis:**

1. **Servidor não está rodando**
   - Volte ao terminal e verifique se o servidor está ativo
   - Se não estiver, execute `npm start`

2. **Porta errada**
   - Verifique se está acessando `http://localhost:3000/relatorios`
   - NÃO use `file:///` (abrir arquivo direto)
   - SEMPRE use `http://localhost:3000`

3. **Senha incorreta**
   - Use exatamente: 2011 (números)
   - Não use letras
   - Não use espaços

---

## ✍️ TESTE 3: CRIAR UM CONTRATO

### Passos:

1. Acesse: `http://localhost:3000/contrato.html`
2. Preencha TODOS os campos obrigatórios:
   - Nome completo
   - CPF/CNPJ
   - E-mail
   - Telefone
   - Tipo de serviço
   - Data do evento
   - Horário de início
   - Local do evento
   - Valor total
   - Descrição do pacote
   - Forma de pagamento

3. Escolha uma opção de autorização de imagem
4. No campo "Digite seu nome completo para assinar", digite seu nome
5. Marque a caixa "Concordo com o contrato"
6. Clique em "Gerar PDF e Enviar pelo WhatsApp"

### Resultado Esperado:

✅ Um PDF será baixado automaticamente
✅ O WhatsApp abrirá com uma mensagem
✅ O contrato será salvo no sistema

---

## 📄 TESTE 4: VERIFICAR ASSINATURAS NO PDF

### Passos:

1. Abra o PDF que foi baixado
2. Vá até a última página
3. Procure a seção "ASSINATURAS"

### Resultado Esperado:

✅ **Lado ESQUERDO:**
- Assinatura cursiva de "Sanderson Felipe" ACIMA da linha
- Nome completo ABAIXO da linha
- Texto "LIPE.VISION"
- Texto "Fotografia Profissional"

✅ **Lado DIREITO:**
- Assinatura cursiva com SEU NOME ACIMA da linha
- Seu nome completo ABAIXO da linha
- Seu CPF/CNPJ
- Texto "Contratante"

### ❌ Se as assinaturas NÃO aparecerem:

Isso NÃO deve mais acontecer. Se acontecer:
1. Limpe o cache do navegador
2. Recarregue a página
3. Tente gerar outro contrato

---

## 👁️ TESTE 5: VISUALIZAR CONTRATO NO PAINEL ADMIN

### Passos:

1. Acesse: `http://localhost:3000/relatorios`
2. Faça login com senha: 2011
3. Você deve ver o contrato que acabou de criar na lista
4. Clique no botão "Ver" ao lado do contrato
5. Uma janela modal abrirá com todos os detalhes
6. Clique em "Baixar PDF"

### Resultado Esperado:

✅ Você consegue ver todos os dados do contrato
✅ O PDF baixa corretamente
✅ O PDF contém as duas assinaturas

---

## 📱 TESTE 6: DESIGN RESPONSIVO

### Desktop:

1. Acesse `http://localhost:3000` em um navegador de computador
2. Verifique o menu de navegação no topo
3. O menu deve estar compacto e elegante
4. Todos os itens devem estar em uma única linha

### Mobile:

1. Pressione F12 no navegador (abre DevTools)
2. Clique no ícone de dispositivo móvel (ou pressione Ctrl+Shift+M)
3. Escolha um dispositivo (iPhone, Samsung, etc.)
4. Verifique se:
   - O menu hambúrguer aparece
   - O site está responsivo
   - Nada ultrapassa a largura da tela
   - As fontes estão proporcionais

---

## 🎨 TESTE 7: VERIFICAR TIPOGRAFIA

### Verificações:

✅ Menu de navegação:
- Fonte pequena e elegante
- Espaçamento compacto
- Sem textos muito grossos

✅ Títulos das seções:
- Tamanho proporcional
- Não excessivamente grandes
- Peso tipográfico leve (não muito negrito)

✅ Textos descritivos:
- Legíveis e confortáveis
- Espaçamento adequado

---

## 🔒 TESTE 8: SEGURANÇA

### Teste de Acesso Não Autorizado:

1. Abra uma aba anônima (Ctrl+Shift+N no Chrome)
2. Tente acessar: `http://localhost:3000/api/admin/contratos`
3. Você deve receber erro 401 (Não autenticado)

✅ Se receber erro 401, a segurança está funcionando
❌ Se conseguir ver os contratos, há um problema de segurança

---

## 📊 CHECKLIST FINAL

Marque cada item após testar:

- [ ] Servidor inicia sem erros
- [ ] Login no painel admin funciona com senha 2011
- [ ] Painel administrativo carrega corretamente
- [ ] Consegue criar um novo contrato
- [ ] PDF é gerado e baixado automaticamente
- [ ] Assinatura de Sanderson Felipe aparece ACIMA da linha (lado esquerdo)
- [ ] Assinatura do cliente aparece ACIMA da linha (lado direito)
- [ ] Ambas as assinaturas estão em fonte cursiva elegante
- [ ] WhatsApp abre automaticamente com mensagem
- [ ] Contrato aparece no painel administrativo
- [ ] Consegue visualizar detalhes do contrato no painel
- [ ] Consegue baixar o PDF pelo painel
- [ ] Menu de navegação está compacto e elegante no desktop
- [ ] Site está responsivo no mobile
- [ ] Fontes estão proporcionais e não excessivamente grandes
- [ ] Acesso não autorizado é bloqueado (segurança OK)

---

## 🐛 PROBLEMAS COMUNS E SOLUÇÕES

### "Cannot find module..."

**Solução:**
```bash
npm install
```

### "Port 3000 is already in use"

**Solução Windows:**
```bash
netstat -ano | findstr :3000
taskkill /PID <numero_do_pid> /F
```

### "Erro ao conectar com o servidor" no login

**Soluções:**

1. Verifique se o servidor está rodando
2. Verifique se está acessando via `http://localhost:3000` e NÃO abrindo o arquivo diretamente
3. Limpe o cache do navegador (Ctrl+Shift+Delete)
4. Tente em modo anônimo

### PDF não baixa

**Soluções:**

1. Verifique se o navegador não está bloqueando downloads
2. Verifique se todos os campos obrigatórios foram preenchidos
3. Abra o Console do navegador (F12) e veja se há erros

### Assinaturas não aparecem no PDF

**Isso foi corrigido!** Se ainda acontecer:

1. Pressione Ctrl+F5 para recarregar sem cache
2. Feche e abra o navegador novamente
3. Gere um novo contrato

---

## ✅ TUDO FUNCIONANDO?

Se todos os testes passaram, seu sistema está 100% operacional!

🎉 **Parabéns! O sistema Lip Vision está pronto para uso!**

---

## 📞 PRÓXIMOS PASSOS

Agora que tudo está funcionando localmente, você pode:

1. **Alterar a senha padrão** no painel admin
2. **Configurar WhatsApp Business API** para notificações automáticas
3. **Fazer deploy em produção** (Vercel, Railway, Render)
4. **Configurar backup automático** do banco de dados

Leia `README-SISTEMA-CONTRATOS.md` para instruções avançadas!
