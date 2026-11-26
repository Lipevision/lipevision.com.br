/* ═══════════════════════════════════════════════════════════════════════════
   LIP VISION — PAINEL ADMINISTRATIVO COM SUPABASE
   Sistema completo de relatórios funcionando no GitHub Pages
   ═══════════════════════════════════════════════════════════════════════════ */

'use strict';

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

let currentContratoId = null;
let currentPage = 1;
const pageLimit = 20;

// ══════════════════════════════════════════════════════════════════════════
// TOAST
// ══════════════════════════════════════════════════════════════════════════

function showToast(message, type = 'ok') {
  const toast = $('#toast');
  const toastMessage = $('#toastMessage');
  const icon = toast.querySelector('i');
  
  toastMessage.textContent = message;
  toast.className = `toast toast--${type} show`;
  
  if (type === 'ok') {
    icon.className = 'ri-checkbox-circle-line';
  } else if (type === 'err') {
    icon.className = 'ri-error-warning-line';
  }
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

// ══════════════════════════════════════════════════════════════════════════
// VERIFICAR AUTENTICAÇÃO
// ══════════════════════════════════════════════════════════════════════════

function checkAuth() {
  if (!window.lipvisionDB) {
    showToast('Sistema não inicializado. Configure o Supabase.', 'err');
    return false;
  }

  const isAuth = window.lipvisionDB.checkAuth();
  
  if (isAuth) {
    $('#loginScreen').style.display = 'none';
    $('#dashboard').classList.add('show');
    $('#navAdmin').style.display = 'flex';
    loadDashboard();
  } else {
    $('#loginScreen').style.display = 'flex';
    $('#dashboard').classList.remove('show');
    $('#navAdmin').style.display = 'none';
  }
  
  return isAuth;
}

// ══════════════════════════════════════════════════════════════════════════
// LOGIN
// ══════════════════════════════════════════════════════════════════════════

$('#loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const password = $('#password').value.trim();
  const errPassword = $('#errPassword');
  
  errPassword.textContent = '';
  
  if (!password) {
    errPassword.textContent = 'Digite a senha';
    return;
  }
  
  if (!window.lipvisionDB) {
    errPassword.textContent = 'Sistema não configurado. Verifique supabase-config.js';
    return;
  }
  
  try {
    const result = await window.lipvisionDB.login(password);
    
    if (result.success) {
      checkAuth();
    } else {
      errPassword.textContent = 'Senha incorreta';
    }
  } catch (error) {
    console.error('Erro no login:', error);
    errPassword.textContent = 'Erro ao fazer login. Verifique a configuração do Supabase.';
  }
});

// ══════════════════════════════════════════════════════════════════════════
// LOGOUT
// ══════════════════════════════════════════════════════════════════════════

$('#btnLogout').addEventListener('click', () => {
  if (!confirm('Deseja realmente sair?')) return;
  
  window.lipvisionDB.logout();
  location.reload();
});

// ══════════════════════════════════════════════════════════════════════════
// CARREGAR DASHBOARD
// ══════════════════════════════════════════════════════════════════════════

async function loadDashboard() {
  try {
    // Carregar estatísticas
    const stats = await window.lipvisionDB.obterEstatisticas();
    
    $('#statTotal').textContent = stats.totalContratos || '0';
    
    // Contratos do mês atual
    const hoje = new Date();
    const mesAtual = String(hoje.getMonth() + 1).padStart(2, '0');
    const anoAtual = String(hoje.getFullYear());
    
    const contratosMes = await window.lipvisionDB.listarContratos({
      mes: mesAtual,
      ano: anoAtual
    });
    
    $('#statMes').textContent = contratosMes.length || '0';
    
    // Valor total
    $('#statValor').textContent = stats.valorTotal.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    
    // Popular anos no filtro
    const currentYear = new Date().getFullYear();
    const filterAno = $('#filterAno');
    filterAno.innerHTML = '<option value="">Todos os anos</option>';
    for (let year = currentYear; year >= currentYear - 5; year--) {
      const option = document.createElement('option');
      option.value = year;
      option.textContent = year;
      filterAno.appendChild(option);
    }
    
    // Carregar contratos
    await loadContratos();
    
  } catch (error) {
    console.error('Erro ao carregar dashboard:', error);
    showToast('Erro ao carregar dados: ' + error.message, 'err');
  }
}

// ══════════════════════════════════════════════════════════════════════════
// CARREGAR CONTRATOS
// ══════════════════════════════════════════════════════════════════════════

async function loadContratos(page = 1) {
  currentPage = page;
  
  $('#loading').classList.add('show');
  $('#tableWrap').style.display = 'none';
  $('#emptyState').style.display = 'none';
  
  try {
    const filtros = {};
    
    const search = $('#searchInput').value.trim();
    if (search) filtros.search = search;
    
    const mes = $('#filterMes').value;
    const ano = $('#filterAno').value;
    if (mes && ano) {
      filtros.mes = mes;
      filtros.ano = ano;
    }
    
    const contratos = await window.lipvisionDB.listarContratos(filtros);
    
    // Organizar por mês/ano
    const grupos = window.lipvisionDB.organizarPorMesAno(contratos);
    
    renderContratosPorMesAno(grupos);
    
  } catch (error) {
    console.error('Erro ao carregar contratos:', error);
    showToast('Erro ao carregar contratos: ' + error.message, 'err');
    $('#emptyState').style.display = 'block';
  } finally {
    $('#loading').classList.remove('show');
  }
}

// ══════════════════════════════════════════════════════════════════════════
// RENDERIZAR CONTRATOS ORGANIZADOS POR MÊS E ANO
// ══════════════════════════════════════════════════════════════════════════

function renderContratosPorMesAno(grupos) {
  const tbody = $('#contratosTableBody');
  tbody.innerHTML = '';
  
  if (!grupos || grupos.length === 0) {
    $('#emptyState').style.display = 'block';
    return;
  }
  
  $('#tableWrap').style.display = 'block';
  
  // Para cada grupo (mês/ano)
  grupos.forEach(grupo => {
    // Linha de cabeçalho do mês
    const headerRow = document.createElement('tr');
    headerRow.style.background = 'rgba(201,165,90,.08)';
    headerRow.innerHTML = `
      <td colspan="7" style="padding:1.2rem 1rem;border-bottom:2px solid rgba(201,165,90,.3)">
        <strong style="font-size:.9rem;color:var(--gold);letter-spacing:.1em;text-transform:uppercase">
          ${grupo.mesNome} de ${grupo.ano}
        </strong>
        <span style="margin-left:1rem;font-size:.75rem;color:rgba(245,245,245,.45)">
          ${grupo.contratos.length} contrato${grupo.contratos.length !== 1 ? 's' : ''}
        </span>
      </td>
    `;
    tbody.appendChild(headerRow);
    
    // Contratos do mês
    grupo.contratos.forEach(c => {
      const tr = document.createElement('tr');
      
      // Badge de status da cobertura
      let statusBadge = '';
      if (c.status_cobertura === 'COBERTURA AGENDADA') {
        statusBadge = '<span class="status-badge" style="background:rgba(234,179,8,.15);color:#facc15;border-color:rgba(234,179,8,.3)">Agendada</span>';
      } else if (c.status_cobertura === 'COBERTURA FINALIZADA') {
        statusBadge = '<span class="status-badge" style="background:rgba(34,197,94,.15);color:#6fcf97;border-color:rgba(34,197,94,.3)">Finalizada</span>';
      } else if (c.status_contrato === 'CONTRATO CANCELADO') {
        statusBadge = '<span class="status-badge" style="background:rgba(239,68,68,.15);color:#f87171;border-color:rgba(239,68,68,.3)">Cancelado</span>';
      } else {
        statusBadge = '<span class="status-badge">Assinado</span>';
      }
      
      tr.innerHTML = `
        <td><strong>${c.nome}</strong><br/><small style="opacity:.6">${c.email}</small></td>
        <td>${c.tipo_servico}</td>
        <td>${formatDate(c.data_evento)}</td>
        <td style="font-weight:600">${c.valor_total}</td>
        <td>${formatDate(c.data_assinatura)}<br/><small style="opacity:.6">${c.hora_assinatura.substring(0, 5)}</small></td>
        <td>${statusBadge}</td>
        <td class="table-actions">
          <button class="btn btn--outline btn--sm" onclick="viewContrato('${c.id}')" title="Ver detalhes">
            <i class="ri-eye-line"></i>
          </button>
          <button class="btn btn--outline btn--sm" onclick="atualizarStatus('${c.id}')" title="Atualizar status">
            <i class="ri-refresh-line"></i>
          </button>
        </td>
      `;
      
      tbody.appendChild(tr);
    });
  });
}

// ══════════════════════════════════════════════════════════════════════════
// VISUALIZAR CONTRATO
// ══════════════════════════════════════════════════════════════════════════

window.viewContrato = async function(id) {
  currentContratoId = id;
  
  try {
    const c = await window.lipvisionDB.obterContrato(id);
    
    $('#modalBody').innerHTML = `
      <div class="modal__section">
        <h4>Dados do Contratante</h4>
        <div class="modal__grid">
          <div class="modal__field">
            <span class="modal__label">Nome Completo</span>
            <span class="modal__value">${c.nome}</span>
          </div>
          <div class="modal__field">
            <span class="modal__label">CPF/CNPJ</span>
            <span class="modal__value">${c.cpf}</span>
          </div>
          <div class="modal__field">
            <span class="modal__label">E-mail</span>
            <span class="modal__value">${c.email}</span>
          </div>
          <div class="modal__field">
            <span class="modal__label">Telefone</span>
            <span class="modal__value">${c.telefone}</span>
          </div>
        </div>
      </div>
      
      <div class="modal__section">
        <h4>Dados do Evento</h4>
        <div class="modal__grid">
          <div class="modal__field">
            <span class="modal__label">Tipo de Serviço</span>
            <span class="modal__value">${c.tipo_servico}</span>
          </div>
          <div class="modal__field">
            <span class="modal__label">Data do Evento</span>
            <span class="modal__value">${formatDate(c.data_evento)}</span>
          </div>
          <div class="modal__field">
            <span class="modal__label">Horário</span>
            <span class="modal__value">${c.horario_inicio}${c.horario_fim ? ' — ' + c.horario_fim : ''}</span>
          </div>
          <div class="modal__field" style="grid-column:1/-1">
            <span class="modal__label">Local</span>
            <span class="modal__value">${c.local_evento}</span>
          </div>
        </div>
      </div>
      
      <div class="modal__section">
        <h4>Condições Comerciais</h4>
        <div class="modal__grid">
          <div class="modal__field">
            <span class="modal__label">Valor Total</span>
            <span class="modal__value">${c.valor_total}</span>
          </div>
          ${c.valor_transporte ? `
          <div class="modal__field">
            <span class="modal__label">Valor Transporte</span>
            <span class="modal__value">${c.valor_transporte}</span>
          </div>
          ` : ''}
          <div class="modal__field" style="grid-column:1/-1">
            <span class="modal__label">Forma de Pagamento</span>
            <span class="modal__value">${c.forma_pagamento}</span>
          </div>
          <div class="modal__field" style="grid-column:1/-1">
            <span class="modal__label">Descrição do Pacote</span>
            <span class="modal__value">${c.descricao_pacote}</span>
          </div>
        </div>
      </div>
      
      <div class="modal__section">
        <h4>Status</h4>
        <div class="modal__grid">
          <div class="modal__field">
            <span class="modal__label">Status do Contrato</span>
            <span class="modal__value" style="color:var(--gold);font-weight:600">${c.status_contrato}</span>
          </div>
          <div class="modal__field">
            <span class="modal__label">Status da Cobertura</span>
            <span class="modal__value" style="color:var(--gold);font-weight:600">${c.status_cobertura}</span>
          </div>
        </div>
      </div>
      
      <div class="modal__section">
        <h4>Autorização e Observações</h4>
        <div class="modal__field">
          <span class="modal__label">Autorização de Uso de Imagem</span>
          <span class="modal__value">${c.autorizacao_imagem}</span>
        </div>
        ${c.observacoes ? `
        <div class="modal__field">
          <span class="modal__label">Observações</span>
          <span class="modal__value">${c.observacoes}</span>
        </div>
        ` : ''}
      </div>
      
      <div class="modal__section">
        <h4>Assinatura Digital</h4>
        <div class="modal__grid">
          <div class="modal__field">
            <span class="modal__label">Nome Completo Informado</span>
            <span class="modal__value">${c.assinatura_nome}</span>
          </div>
          <div class="modal__field">
            <span class="modal__label">Data e Hora da Assinatura</span>
            <span class="modal__value">${formatDate(c.data_assinatura)} às ${c.hora_assinatura}</span>
          </div>
          <div class="modal__field">
            <span class="modal__label">Aceite Confirmado</span>
            <span class="modal__value">${c.aceite_confirmado ? 'Sim' : 'Não'}</span>
          </div>
        </div>
      </div>
    `;
    
    $('#modalOverlay').classList.add('show');
    
  } catch (error) {
    console.error('Erro ao carregar contrato:', error);
    showToast('Erro ao carregar contrato: ' + error.message, 'err');
  }
};

// ══════════════════════════════════════════════════════════════════════════
// ATUALIZAR STATUS DA COBERTURA
// ══════════════════════════════════════════════════════════════════════════

window.atualizarStatus = async function(id) {
  const opcoes = [
    'COBERTURA AGENDADA',
    'COBERTURA FINALIZADA',
    'CONTRATO CANCELADO'
  ];
  
  const novoStatus = prompt(
    'Atualizar status da cobertura:\n\n' +
    '1 - COBERTURA AGENDADA\n' +
    '2 - COBERTURA FINALIZADA\n' +
    '3 - CONTRATO CANCELADO\n\n' +
    'Digite o número da opção:'
  );
  
  if (!novoStatus || !['1', '2', '3'].includes(novoStatus.trim())) {
    return;
  }
  
  const statusEscolhido = opcoes[parseInt(novoStatus) - 1];
  
  try {
    if (statusEscolhido === 'CONTRATO CANCELADO') {
      await window.lipvisionDB.atualizarStatusContrato(id, statusEscolhido);
    } else {
      await window.lipvisionDB.atualizarStatusCobertura(id, statusEscolhido);
    }
    
    showToast('Status atualizado com sucesso!', 'ok');
    await loadContratos(currentPage);
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    showToast('Erro ao atualizar status: ' + error.message, 'err');
  }
};

// ══════════════════════════════════════════════════════════════════════════
// DOWNLOAD PDF
// ══════════════════════════════════════════════════════════════════════════

$('#btnDownloadPDF').addEventListener('click', async () => {
  if (!currentContratoId) return;
  
  try {
    const c = await window.lipvisionDB.obterContrato(currentContratoId);
    
    if (c.pdf_base64) {
      // Converter Base64 para download
      const link = document.createElement('a');
      link.href = c.pdf_base64;
      link.download = `Contrato_${c.nome.replace(/\s+/g, '_')}_${c.data_assinatura}.pdf`;
      link.click();
      showToast('PDF baixado com sucesso!', 'ok');
    } else {
      showToast('PDF não disponível para este contrato', 'err');
    }
  } catch (error) {
    console.error('Erro ao baixar PDF:', error);
    showToast('Erro ao baixar PDF: ' + error.message, 'err');
  }
});

// ══════════════════════════════════════════════════════════════════════════
// FECHAR MODAL
// ══════════════════════════════════════════════════════════════════════════

$('#btnCloseModal').addEventListener('click', () => {
  $('#modalOverlay').classList.remove('show');
  currentContratoId = null;
});

$('#btnCloseModalFooter').addEventListener('click', () => {
  $('#modalOverlay').classList.remove('show');
  currentContratoId = null;
});

$('#modalOverlay').addEventListener('click', (e) => {
  if (e.target === $('#modalOverlay')) {
    $('#modalOverlay').classList.remove('show');
    currentContratoId = null;
  }
});

// ══════════════════════════════════════════════════════════════════════════
// REFRESH E FILTROS
// ══════════════════════════════════════════════════════════════════════════

$('#btnRefresh').addEventListener('click', () => loadContratos(currentPage));
$('#btnSearch').addEventListener('click', () => loadContratos(1));
$('#searchInput').addEventListener('keyup', (e) => {
  if (e.key === 'Enter') loadContratos(1);
});
$('#filterMes').addEventListener('change', () => loadContratos(1));
$('#filterAno').addEventListener('change', () => loadContratos(1));
$('#btnClearFilters').addEventListener('click', () => {
  $('#searchInput').value = '';
  $('#filterMes').value = '';
  $('#filterAno').value = '';
  loadContratos(1);
});

// ══════════════════════════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════════════════════════

function formatDate(dateStr) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

// ══════════════════════════════════════════════════════════════════════════
// INICIALIZAÇÃO
// ══════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  // Verificar se Supabase está configurado
  if (!window.SUPABASE_CONFIG || window.SUPABASE_CONFIG.url === 'SUA_URL_SUPABASE_AQUI') {
    showToast('Configure o Supabase em supabase-config.js antes de usar o sistema', 'err');
    $('#loginScreen').style.display = 'flex';
    return;
  }
  
  // Verificar autenticação
  checkAuth();
});
