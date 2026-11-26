/* ═══════════════════════════════════════════════════════════════════════════
   LIP VISION — Script do Sistema de Contratos Digitais
   Integração completa com backend, PDF e assinatura digital
   ═══════════════════════════════════════════════════════════════════════════ */

'use strict';

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ══════════════════════════════════════════════════════════════════════════
// CONFIGURAÇÕES
// ══════════════════════════════════════════════════════════════════════════

const CONFIG = {
  WHATSAPP_NUMBER: '5571920029709',
  CONTRATADA_NOME: 'Sanderson Felipe',
  CONTRATADA_NOME_COMPLETO: 'Sanderson Felipe da Silva Ferreira Matos',
  CONTRATO_VERSAO: 'v1.2'
};

// ══════════════════════════════════════════════════════════════════════════
// TOAST
// ══════════════════════════════════════════════════════════════════════════

function showToast(message, type = 'ok') {
  const toast = $('#toast');
  if (!toast) return;
  
  const icon = toast.querySelector('i');
  const msg = toast.querySelector('#toastMsg');
  
  if (msg) msg.textContent = message;
  
  toast.className = `toast toast--${type} show`;
  
  if (icon) {
    icon.className = type === 'ok' ? 'ri-checkbox-circle-line' : 
                     type === 'err' ? 'ri-error-warning-line' : 
                     'ri-information-line';
  }
  
  setTimeout(() => toast.classList.remove('show'), 4000);
}

// ══════════════════════════════════════════════════════════════════════════
// MÁSCARAS DE INPUT
// ══════════════════════════════════════════════════════════════════════════

function mascCPFCNPJ(v) {
  v = v.replace(/\D/g, '');
  if (v.length <= 11) {
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  } else {
    v = v.replace(/^(\d{2})(\d)/, '$1.$2');
    v = v.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    v = v.replace(/\.(\d{3})(\d)/, '.$1/$2');
    v = v.replace(/(\d{4})(\d)/, '$1-$2');
  }
  return v;
}

function mascTel(v) {
  v = v.replace(/\D/g, '').slice(0, 11);
  if (v.length <= 10) {
    return v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
  }
  return v.replace(/(\d{2})(\d{1})(\d{4})(\d{0,4})/, '($1) $2 $3-$4');
}

function mascMoeda(v) {
  v = v.replace(/\D/g, '');
  if (!v) return '';
  const num = parseInt(v, 10) / 100;
  return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ══════════════════════════════════════════════════════════════════════════
// APLICAR MÁSCARAS
// ══════════════════════════════════════════════════════════════════════════

function initMasks() {
  const cpfInput = $('#f-cpf');
  const telInput = $('#f-tel');
  const valorInputs = ['#f-valor', '#f-transp'];
  
  if (cpfInput) cpfInput.addEventListener('input', e => e.target.value = mascCPFCNPJ(e.target.value));
  if (telInput) telInput.addEventListener('input', e => e.target.value = mascTel(e.target.value));
  
  valorInputs.forEach(sel => {
    const el = $(sel);
    if (el) el.addEventListener('input', e => e.target.value = mascMoeda(e.target.value));
  });
}

// ══════════════════════════════════════════════════════════════════════════
// VALIDAÇÃO
// ══════════════════════════════════════════════════════════════════════════

function clearErrors() {
  $$('.field__err').forEach(el => el.textContent = '');
  $$('.err').forEach(el => el.classList.remove('err'));
}

function markError(fieldId, errorId, message) {
  const field = $(fieldId);
  const error = $(errorId);
  
  if (field) field.classList.add('err');
  if (error) error.textContent = message;
}

function validateForm() {
  clearErrors();
  
  let isValid = true;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  const validations = [
    { field: '#f-nome', error: '#e-nome', message: 'Nome obrigatório', check: (v) => v.trim() },
    { field: '#f-cpf', error: '#e-cpf', message: 'CPF/CNPJ obrigatório', check: (v) => v.trim() },
    { field: '#f-email', error: '#e-email', message: 'E-mail inválido', check: (v) => emailRegex.test(v.trim()) },
    { field: '#f-tel', error: '#e-tel', message: 'Telefone obrigatório', check: (v) => v.trim() },
    { field: '#f-tipo', error: '#e-tipo', message: 'Selecione o tipo de serviço', check: (v) => v },
    { field: '#f-data', error: '#e-data', message: 'Data obrigatória', check: (v) => v },
    { field: '#f-inicio', error: '#e-inicio', message: 'Horário obrigatório', check: (v) => v },
    { field: '#f-local', error: '#e-local', message: 'Endereço obrigatório', check: (v) => v.trim() },
    { field: '#f-valor', error: '#e-valor', message: 'Valor obrigatório', check: (v) => v.trim() },
    { field: '#f-pacote', error: '#e-pacote', message: 'Descrição do pacote obrigatória', check: (v) => v.trim() },
    { field: '#f-forma-pag', error: '#e-forma-pag', message: 'Forma de pagamento obrigatória', check: (v) => v },
    { field: '#f-assinatura', error: '#e-assinatura', message: 'Digite seu nome completo para assinar', check: (v) => v.trim() }
  ];
  
  validations.forEach(({ field, error, message, check }) => {
    const el = $(field);
    if (el && !check(el.value)) {
      markError(field, error, message);
      isValid = false;
    }
  });
  
  // Autorização de imagem
  if (!$('input[name="autorizacao"]:checked')) {
    const authErr = $('#e-auth');
    if (authErr) authErr.textContent = 'Selecione uma opção';
    isValid = false;
  }
  
  // Aceite do contrato
  const aceite = $('#aceite');
  if (aceite && !aceite.checked) {
    markError('#aceite', '#e-aceite', 'Você deve concordar com o contrato');
    isValid = false;
  }
  
  return isValid;
}

// ══════════════════════════════════════════════════════════════════════════
// COLETAR DADOS DO FORMULÁRIO
// ══════════════════════════════════════════════════════════════════════════

function collectFormData() {
  const getValue = (id) => {
    const el = $(id);
    return el ? el.value.trim() : '';
  };
  
  const dataEvento = getValue('#f-data');
  let dataFormatada = dataEvento;
  
  if (dataEvento) {
    const [ano, mes, dia] = dataEvento.split('-');
    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                   'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    dataFormatada = `${dia} de ${meses[parseInt(mes) - 1]} de ${ano}`;
  }
  
  const agora = new Date();
  const authRadio = $('input[name="autorizacao"]:checked');
  
  // Gerar número único do contrato
  const contratoNumero = `LV${agora.getFullYear()}${String(agora.getMonth() + 1).padStart(2, '0')}${String(agora.getDate()).padStart(2, '0')}${String(agora.getHours()).padStart(2, '0')}${String(agora.getMinutes()).padStart(2, '0')}${String(agora.getSeconds()).padStart(2, '0')}`;
  
  return {
    // Identificação
    numero: contratoNumero,
    versao: CONFIG.CONTRATO_VERSAO,
    
    // Dados pessoais
    nome: getValue('#f-nome'),
    cpf: getValue('#f-cpf'),
    email: getValue('#f-email'),
    telefone: getValue('#f-tel'),
    
    // Dados do evento
    tipoServico: getValue('#f-tipo'),
    dataEvento: dataEvento,
    dataEventoFormatada: dataFormatada,
    horarioInicio: getValue('#f-inicio'),
    horarioFim: getValue('#f-fim') || '—',
    localEvento: getValue('#f-local'),
    
    // Comercial
    valorTotal: getValue('#f-valor') ? `R$ ${getValue('#f-valor')}` : '—',
    valorTransporte: getValue('#f-transp') ? `R$ ${getValue('#f-transp')}` : '',
    descricaoPacote: getValue('#f-pacote'),
    formaPagamento: getValue('#f-forma-pag'),
    
    // Observações
    observacoes: getValue('#f-obs'),
    
    // Autorização
    autorizacaoImagem: authRadio ? authRadio.value : 'Não informado',
    
    // Assinatura
    assinaturaNome: getValue('#f-assinatura'),
    aceiteConfirmado: $('#aceite')?.checked || false,
    
    // Timestamps
    dataAssinatura: agora.toISOString().split('T')[0],
    horaAssinatura: agora.toTimeString().split(' ')[0],
    timestampCompleto: agora.toLocaleString('pt-BR', { 
      dateStyle: 'full', 
      timeStyle: 'medium' 
    }),
    
    // Contratada
    contratadaNome: CONFIG.CONTRATADA_NOME,
    contratadaNomeCompleto: CONFIG.CONTRATADA_NOME_COMPLETO
  };
}

// ══════════════════════════════════════════════════════════════════════════
// GERAR PDF COM JSPDF
// ══════════════════════════════════════════════════════════════════════════

async function gerarPDF(dados) {
  if (!window.jspdf) {
    throw new Error('Biblioteca jsPDF não carregada');
  }
  
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
  
  // Configurações
  const W = 210, H = 297;
  const mL = 18, mR = 18, mT = 20, mB = 22;
  const TW = W - mL - mR;
  
  // Cores
  const COR_GOLD = [201, 165, 90];
  const COR_BLACK = [10, 10, 10];
  const COR_DARK = [40, 40, 40];
  const COR_LT = [110, 110, 110];
  const COR_LT2 = [160, 160, 160];
  const COR_BG = [248, 248, 248];
  
  let y = mT;
  let pagina = 1;
  
  // ── Helpers ──
  
  function novaLinha(espacoNecessario) {
    if (y + espacoNecessario > H - mB) {
      adicionarRodape();
      doc.addPage();
      pagina++;
      y = mT + 6;
      adicionarCabecalho();
    }
  }
  
  function escrever(texto, x, opts = {}) {
    const {
      tamanho = 9,
      cor = COR_DARK,
      negrito = false,
      entrelinha = 5.6,
      larguraMax = TW,
      alinhamento = 'left'
    } = opts;
    
    doc.setFont('helvetica', negrito ? 'bold' : 'normal');
    doc.setFontSize(tamanho);
    doc.setTextColor(...cor);
    
    const linhas = doc.splitTextToSize(String(texto || ''), larguraMax);
    
    linhas.forEach(linha => {
      novaLinha(entrelinha);
      doc.text(linha, x, y, { align: alinhamento });
      y += entrelinha;
    });
    
    return y;
  }
  
  function linha(cor = [220, 220, 220], espessura = 0.2) {
    doc.setDrawColor(...cor);
    doc.setLineWidth(espessura);
    doc.line(mL, y, W - mR, y);
    y += 1.5;
  }
  
  function adicionarCabecalho() {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...COR_GOLD);
    doc.text('LIPE.VISION', mL, mT - 4);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COR_LT2);
    doc.text('Contrato de Prestação de Serviços Fotográficos', mL + 26, mT - 4);
  }
  
  function adicionarRodape() {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...COR_LT2);
    doc.text('LIPE.VISION — Fotografia Profissional · Salvador, Bahia', mL, H - 12);
    doc.text(`Página ${pagina}`, W - mR, H - 12, { align: 'right' });
    
    doc.setDrawColor(...COR_GOLD);
    doc.setLineWidth(0.4);
    doc.line(mL, H - 15, W - mR, H - 15);
    
    doc.setFontSize(6.5);
    doc.setTextColor(...COR_LT2);
    doc.text(`Versão: ${dados.versao}  |  Nº ${dados.numero}`, mL, H - 8);
  }
  
  // ══════════════════════════════════════════════════════════════════════
  // PÁGINA 1 — CAPA E DADOS
  // ══════════════════════════════════════════════════════════════════════
  
  // Barra dourada superior
  doc.setFillColor(...COR_GOLD);
  doc.rect(0, 0, W, 3, 'F');
  
  // Logo
  y = 24;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(...COR_BLACK);
  doc.text('LIPE', mL, y);
  
  doc.setTextColor(...COR_GOLD);
  doc.text('.VISION', mL + doc.getTextWidth('LIPE'), y);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COR_LT);
  doc.text('Fotografia Profissional · Salvador, Bahia', mL, y + 6);
  
  y += 18;
  linha(COR_GOLD, 0.5);
  y += 4;
  
  // Título
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(...COR_BLACK);
  doc.text('CONTRATO DE PRESTAÇÃO DE SERVIÇOS', mL, y);
  y += 7;
  doc.text('FOTOGRÁFICOS E AUDIOVISUAIS', mL, y);
  y += 5;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COR_LT);
  doc.text(`Contrato com Aceite Eletrônico · Versão ${dados.versao}`, mL, y);
  
  y += 10;
  linha();
  y += 4;
  
  // Box Contratante
  doc.setFillColor(...COR_BG);
  doc.setDrawColor(...COR_GOLD);
  doc.setLineWidth(0.3);
  doc.roundedRect(mL, y, TW, 52, 1.5, 1.5, 'FD');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(...COR_GOLD);
  doc.text('CONTRATANTE', mL + 4, y + 6);
  
  const camposContratante = [
    ['Nome / Razão Social:', dados.nome],
    ['CPF / CNPJ:', dados.cpf],
    ['E-mail:', dados.email],
    ['Telefone:', dados.telefone]
  ];
  
  let cy = y + 12;
  camposContratante.forEach(([label, valor]) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...COR_LT);
    doc.text(label, mL + 4, cy);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COR_DARK);
    doc.text(String(valor), mL + 42, cy);
    
    cy += 7;
  });
  
  y += 57;
  
  // Box Serviço
  doc.setFillColor(...COR_BG);
  doc.roundedRect(mL, y, TW, 52, 1.5, 1.5, 'FD');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(...COR_GOLD);
  doc.text('DADOS DO SERVIÇO', mL + 4, y + 6);
  
  const camposServico = [
    ['Tipo:', dados.tipoServico],
    ['Data:', dados.dataEventoFormatada],
    ['Início:', dados.horarioInicio],
    ['Término:', dados.horarioFim],
    ['Local:', dados.localEvento.length > 45 ? dados.localEvento.slice(0, 43) + '…' : dados.localEvento]
  ];
  
  cy = y + 12;
  camposServico.forEach(([label, valor]) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...COR_LT);
    doc.text(label, mL + 4, cy);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COR_DARK);
    doc.text(String(valor), mL + 28, cy);
    
    cy += 7;
  });
  
  y += 57;
  
  // Box Financeiro
  doc.setFillColor(...COR_BG);
  doc.roundedRect(mL, y, TW, 34, 1.5, 1.5, 'FD');
  
  cy = y + 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(...COR_GOLD);
  doc.text('CONDIÇÕES COMERCIAIS', mL + 4, cy);
  cy += 8;
  
  const camposFinanceiros = [
    ['Valor total:', dados.valorTotal],
    ['Transporte:', dados.valorTransporte || '—']
  ];
  
  camposFinanceiros.forEach(([label, valor]) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...COR_LT);
    doc.text(label, mL + 4, cy);
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...COR_DARK);
    doc.text(String(valor), mL + 36, cy);
    
    cy += 9;
  });
  
  y += 39;
  y += 3;
  
  // Pacote
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...COR_LT);
  doc.text('Pacote/Entregáveis:', mL, y);
  y += 5;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...COR_DARK);
  
  doc.splitTextToSize(dados.descricaoPacote, TW).forEach(linha => {
    doc.text(linha, mL, y);
    y += 5.5;
  });
  
  y += 3;
  
  // Forma de Pagamento
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...COR_LT);
  doc.text('Forma de Pagamento:', mL, y);
  y += 5;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...COR_DARK);
  doc.text(dados.formaPagamento, mL, y);
  y += 8;
  
  adicionarRodape();
  
  // ══════════════════════════════════════════════════════════════════════
  // PÁGINA 2+ — CLÁUSULAS
  // ══════════════════════════════════════════════════════════════════════
  
  doc.addPage();
  pagina++;
  y = mT;
  adicionarCabecalho();
  linha(COR_GOLD, 0.4);
  y += 6;
  
  const clausulas = [
    {
      num: 'Cláusula 1',
      titulo: 'Objeto',
      corpo: 'A LIPE.VISION prestará serviços profissionais de fotografia, filmagem, edição e produção audiovisual, conforme o pacote, orçamento, data, local, duração e entregáveis expressamente acordados com o CONTRATANTE.'
    },
    {
      num: 'Cláusula 2',
      titulo: 'Prazos de Entrega',
      corpo: 'Produções convencionais e serviços de menor complexidade: até 3 dias úteis após a realização. Casamentos, aniversários, chás revelação, ensaios de gestantes e produções de maior complexidade: até 10 dias úteis.'
    },
    {
      num: 'Cláusula 3',
      titulo: 'Pagamento',
      corpo: '50% antecipadamente para confirmação da contratação e reserva da data. 50% restantes após a realização do evento, conforme vencimento definido na proposta. Serviços adicionais dependem de orçamento e aprovação prévia.'
    },
    {
      num: 'Cláusula 4',
      titulo: 'Transporte',
      corpo: 'Despesas de transporte (Uber ou equivalente), de ida e volta, serão custeadas antecipadamente pelo CONTRATANTE, conforme orçamento previamente informado e aprovado.'
    },
    {
      num: 'Cláusula 5',
      titulo: 'Exclusividade em Eventos',
      corpo: 'A LIPE.VISION poderá atender diferentes estabelecimentos, produtores e contratantes, inclusive em boates e casas noturnas, desde que respeitados os compromissos contratuais. A contratação convencional não garante exclusividade.'
    },
    {
      num: 'Cláusula 6',
      titulo: 'Entrega dos Arquivos',
      corpo: 'Materiais disponibilizados digitalmente, preferencialmente via Google Drive. O cliente receberá as informações necessárias para acessar e baixar os arquivos. O período de disponibilidade dos links será informado ao cliente.'
    },
    {
      num: 'Cláusula 7',
      titulo: 'Armazenamento Prolongado',
      corpo: 'O serviço contratado não inclui armazenamento permanente ou ilimitado dos arquivos. Clientes que desejarem manter os arquivos armazenados pela LIPE.VISION poderão contratar um serviço adicional.'
    },
    {
      num: 'Cláusula 8',
      titulo: 'Direitos Autorais e Uso de Imagem',
      corpo: 'Os direitos autorais serão observados conforme a legislação brasileira. O cliente poderá utilizar os materiais entregues dentro das condições de licença acordadas. A utilização pela LIPE.VISION para divulgação comercial, portfólio e redes sociais dependerá de autorização específica e adequada.'
    },
    {
      num: 'Cláusula 9',
      titulo: 'Responsabilidades',
      corpo: 'A LIPE.VISION compromete-se a executar os serviços com profissionalismo e zelo técnico. O CONTRATANTE compromete-se a informar corretamente data, horário, local, necessidades e condições do evento.'
    },
    {
      num: 'Cláusula 10',
      titulo: 'Cancelamento e Reagendamento',
      corpo: 'As condições específicas de cancelamento, reagendamento, despesas e restituições constarão da proposta comercial ou instrumento complementar, respeitando a legislação aplicável e os direitos do consumidor.'
    },
    {
      num: 'Cláusula 11',
      titulo: 'Aceite Eletrônico',
      corpo: 'O CONTRATANTE poderá manifestar concordância com os termos por meio de formulário eletrônico. O sistema registra: versão do contrato aceita, identificação do contratante, data e horário, manifestação expressa de consentimento e elementos técnicos de comprovação disponíveis.'
    }
  ];
  
  clausulas.forEach((clausula, index) => {
    novaLinha(20);
    
    escrever(clausula.num.toUpperCase(), mL, {
      tamanho: 7,
      cor: COR_GOLD,
      negrito: true,
      entrelinha: 5
    });
    
    y += 1;
    
    escrever(clausula.titulo, mL, {
      tamanho: 11,
      cor: COR_BLACK,
      negrito: true,
      entrelinha: 7
    });
    
    y += 1;
    
    escrever(clausula.corpo, mL, {
      tamanho: 9,
      cor: COR_DARK,
      entrelinha: 5.8
    });
    
    y += 4;
    
    if (index < clausulas.length - 1) {
      linha([230, 230, 230], 0.15);
      y += 2;
    }
    
    novaLinha(6);
  });
  
  // ══════════════════════════════════════════════════════════════════════
  // ACEITE ELETRÔNICO
  // ══════════════════════════════════════════════════════════════════════
  
  novaLinha(80);
  y += 8;
  
  escrever('ACEITE ELETRÔNICO', mL, {
    tamanho: 7.5,
    cor: COR_GOLD,
    negrito: true,
    entrelinha: 5
  });
  
  linha(COR_GOLD, 0.4);
  y += 5;
  
  escrever(
    'Declaro que li, compreendi e concordo com todas as condições do contrato de prestação de serviços da LIPE.VISION.',
    mL,
    { tamanho: 9, cor: COR_DARK, entrelinha: 5.8 }
  );
  
  y += 4;
  
  escrever(`Autorização de imagem: ${dados.autorizacaoImagem}`, mL, {
    tamanho: 9,
    cor: COR_DARK,
    entrelinha: 5.8
  });
  
  y += 6;
  
  escrever(`Data e horário do aceite: ${dados.timestampCompleto}`, mL, {
    tamanho: 9,
    cor: COR_LT,
    entrelinha: 5.8
  });
  
  y += 4;
  
  escrever(`Número identificador: ${dados.numero}`, mL, {
    tamanho: 9,
    cor: COR_LT,
    entrelinha: 5.8
  });
  
  y += 4;
  
  escrever(`Versão do contrato: ${dados.versao}`, mL, {
    tamanho: 9,
    cor: COR_LT,
    entrelinha: 5.8
  });
  
  y += 10;
  
  // ══════════════════════════════════════════════════════════════════════
  // ASSINATURAS
  // ══════════════════════════════════════════════════════════════════════
  
  novaLinha(75);
  
  escrever('ASSINATURAS', mL, {
    tamanho: 7.5,
    cor: COR_GOLD,
    negrito: true,
    entrelinha: 5
  });
  
  linha(COR_GOLD, 0.4);
  y += 10;
  
  const larguraColuna = (TW - 10) / 2;
  const col1 = mL;
  const col2 = mL + larguraColuna + 10;
  
  // LIPE.VISION (Contratada) - LADO ESQUERDO
  
  // Assinatura cursiva ACIMA da linha
  doc.setFont('times', 'italic');  // Fonte cursiva elegante
  doc.setFontSize(18);
  doc.setTextColor(...COR_BLACK);
  doc.text(dados.contratadaNome, col1, y + 18);
  
  // Linha de assinatura
  doc.setDrawColor(...COR_LT);
  doc.setLineWidth(0.3);
  doc.line(col1, y + 24, col1 + larguraColuna, y + 24);
  
  // Nome completo ABAIXO da linha
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...COR_BLACK);
  doc.text(dados.contratadaNomeCompleto, col1, y + 29);
  
  // Identificação
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COR_LT);
  doc.text('LIPE.VISION', col1, y + 34);
  doc.text('Fotografia Profissional', col1, y + 38.5);
  
  // CLIENTE (Contratante) - LADO DIREITO
  
  // Assinatura cursiva ACIMA da linha (gerada automaticamente)
  doc.setFont('times', 'italic');  // Fonte cursiva elegante
  doc.setFontSize(18);
  doc.setTextColor(...COR_BLACK);
  const assinaturaTexto = dados.assinaturaNome.length > 28 ? 
    dados.assinaturaNome.slice(0, 26) + '…' : 
    dados.assinaturaNome;
  doc.text(assinaturaTexto, col2, y + 18);
  
  // Linha de assinatura
  doc.setDrawColor(...COR_LT);
  doc.setLineWidth(0.3);
  doc.line(col2, y + 24, col2 + larguraColuna, y + 24);
  
  // Nome completo ABAIXO da linha
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...COR_BLACK);
  doc.text(dados.assinaturaNome, col2, y + 29);
  
  // Identificação
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COR_LT);
  doc.text(`CPF/CNPJ: ${dados.cpf}`, col2, y + 34);
  doc.text('Contratante', col2, y + 38.5);
  
  y += 48;
  
  // Data e local
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...COR_LT);
  
  const dataHoje = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  
  doc.text(`Salvador, Bahia — ${dataHoje}`, mL, y);
  y += 12;
  
  adicionarRodape();
  
  return doc;
}

// ══════════════════════════════════════════════════════════════════════════
// ENVIAR CONTRATO PARA SUPABASE
// ══════════════════════════════════════════════════════════════════════════

async function enviarContrato(dados, pdfBlob) {
  try {
    // Verificar se o Supabase está disponível
    if (!window.lipvisionDB || !window.lipvisionDB.supabase) {
      throw new Error('Sistema não configurado. Configure o Supabase em supabase-config.js');
    }
    
    // Converter PDF para Base64
    const pdfBase64 = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(pdfBlob);
    });
    
    // Preparar dados para o Supabase
    const payload = {
      nome: dados.nome,
      cpf: dados.cpf,
      email: dados.email,
      telefone: dados.telefone,
      tipoServico: dados.tipoServico,
      dataEvento: dados.dataEvento,
      horarioInicio: dados.horarioInicio,
      horarioFim: dados.horarioFim !== '—' ? dados.horarioFim : null,
      localEvento: dados.localEvento,
      valorTotal: dados.valorTotal,
      valorTransporte: dados.valorTransporte || null,
      descricaoPacote: dados.descricaoPacote,
      formaPagamento: dados.formaPagamento,
      autorizacaoImagem: dados.autorizacaoImagem,
      observacoes: dados.observacoes || null,
      assinaturaNome: dados.assinaturaNome,
      aceiteConfirmado: dados.aceiteConfirmado,
      pdfBase64: pdfBase64,
      dataAssinatura: dados.dataAssinatura,
      horaAssinatura: dados.horaAssinatura
    };
    
    // Salvar no Supabase usando o cliente
    const result = await window.lipvisionDB.criarContrato(payload);
    
    if (!result.success) {
      throw new Error('Erro ao salvar contrato');
    }
    
    return result;
    
  } catch (error) {
    console.error('Erro ao enviar contrato:', error);
    throw error;
  }
}

// ══════════════════════════════════════════════════════════════════════════
// ABRIR WHATSAPP
// ══════════════════════════════════════════════════════════════════════════

function abrirWhatsApp(dados) {
  const mensagem = `Olá! Acabei de assinar o contrato digital da LIPE.VISION.

📄 *Contrato:* ${dados.numero}
👤 *Nome:* ${dados.nome}
📅 *Evento:* ${dados.tipoServico}
🗓️ *Data:* ${dados.dataEventoFormatada}
💰 *Valor:* ${dados.valorTotal}

O PDF do contrato foi gerado e está disponível no painel administrativo.

Aguardo confirmação! 📸`;

  const url = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, '_blank');
}

// ══════════════════════════════════════════════════════════════════════════
// HANDLER DO FORMULÁRIO
// ══════════════════════════════════════════════════════════════════════════

async function handleSubmit(e) {
  e.preventDefault();
  
  if (!validateForm()) {
    showToast('Por favor, preencha todos os campos obrigatórios', 'err');
    return;
  }
  
  const btnEnviar = $('#btnEnviar');
  if (btnEnviar) btnEnviar.disabled = true;
  
  try {
    showToast('Gerando contrato...', 'info');
    
    // Coletar dados
    const dados = collectFormData();
    
    // Gerar PDF
    const pdfDoc = await gerarPDF(dados);
    const pdfBlob = pdfDoc.output('blob');
    
    // Enviar para o servidor
    showToast('Salvando contrato...', 'info');
    await enviarContrato(dados, pdfBlob);
    
    // Download do PDF
    pdfDoc.save(`Contrato_LipeVision_${dados.numero}.pdf`);
    
    // Abrir WhatsApp
    setTimeout(() => {
      abrirWhatsApp(dados);
      showToast('Contrato registrado com sucesso!', 'ok');
    }, 500);
    
    // Limpar formulário após 2 segundos
    setTimeout(() => {
      $('#contratoForm')?.reset();
      if (btnEnviar) btnEnviar.disabled = false;
    }, 2000);
    
  } catch (error) {
    console.error('Erro ao processar contrato:', error);
    showToast('Erro ao processar contrato. Tente novamente.', 'err');
    if (btnEnviar) btnEnviar.disabled = false;
  }
}

// ══════════════════════════════════════════════════════════════════════════
// INICIALIZAÇÃO
// ══════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  // Aplicar máscaras
  initMasks();
  
  // Handler do formulário
  const form = $('#contratoForm');
  if (form) {
    form.addEventListener('submit', handleSubmit);
  }
  
  // Botões de download (informativos)
  const btnsDownloadInfo = ['#btnDownloadInfo', '#btnDownloadHero', '#btnDownloadContrato'];
  btnsDownloadInfo.forEach(sel => {
    const btn = $(sel);
    if (btn) {
      btn.addEventListener('click', async () => {
        showToast('Gerando PDF informativo...', 'info');
        // Aqui você pode gerar um PDF apenas com as cláusulas, sem dados pessoais
        showToast('Funcionalidade em desenvolvimento', 'info');
      });
    }
  });
  
  // Ano no footer
  const anoAtual = $('#anoAtual');
  if (anoAtual) anoAtual.textContent = new Date().getFullYear();
});
