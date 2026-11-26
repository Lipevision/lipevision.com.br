/* ═══════════════════════════════════════════════════════════════════════════
   LIP VISION — Cliente Supabase
   Gerencia autenticação e operações com o banco de dados
   ═══════════════════════════════════════════════════════════════════════════ */

class LipVisionSupabase {
  constructor() {
    this.supabase = null;
    this.isAuthenticated = false;
    this.init();
  }

  // Inicializar cliente Supabase
  init() {
    if (typeof window.SUPABASE_CONFIG === 'undefined') {
      console.error('❌ Configuração Supabase não encontrada!');
      return;
    }

    const { url, anonKey } = window.SUPABASE_CONFIG;

    if (url === 'SUA_URL_SUPABASE_AQUI') {
      console.warn('⚠️ Configure o Supabase em supabase-config.js');
      return;
    }

    // Criar cliente Supabase
    this.supabase = window.supabase.createClient(url, anonKey);
    console.log('✅ Cliente Supabase inicializado');
  }

  // ══════════════════════════════════════════════════════════════════════
  // AUTENTICAÇÃO
  // ══════════════════════════════════════════════════════════════════════

  async login(password) {
    // Validação simples de senha
    // Em produção, use Supabase Auth ou hash no banco
    const { adminPassword } = window.SUPABASE_CONFIG;

    if (password === adminPassword) {
      this.isAuthenticated = true;
      sessionStorage.setItem('lipvision_auth', 'true');
      return { success: true, message: 'Login realizado com sucesso' };
    }

    return { success: false, message: 'Senha incorreta' };
  }

  logout() {
    this.isAuthenticated = false;
    sessionStorage.removeItem('lipvision_auth');
  }

  checkAuth() {
    const auth = sessionStorage.getItem('lipvision_auth');
    this.isAuthenticated = auth === 'true';
    return this.isAuthenticated;
  }

  // ══════════════════════════════════════════════════════════════════════
  // CONTRATOS
  // ══════════════════════════════════════════════════════════════════════

  async criarContrato(dados) {
    if (!this.supabase) {
      throw new Error('Supabase não inicializado');
    }

    const contrato = {
      nome: dados.nome,
      cpf: dados.cpf,
      email: dados.email,
      telefone: dados.telefone,
      tipo_servico: dados.tipoServico,
      data_evento: dados.dataEvento,
      horario_inicio: dados.horarioInicio,
      horario_fim: dados.horarioFim || null,
      local_evento: dados.localEvento,
      valor_total: dados.valorTotal,
      valor_transporte: dados.valorTransporte || null,
      descricao_pacote: dados.descricaoPacote,
      forma_pagamento: dados.formaPagamento,
      autorizacao_imagem: dados.autorizacaoImagem,
      observacoes: dados.observacoes || null,
      assinatura_nome: dados.assinaturaNome,
      aceite_confirmado: dados.aceiteConfirmado,
      pdf_base64: dados.pdfBase64 || null,
      data_assinatura: dados.dataAssinatura,
      hora_assinatura: dados.horaAssinatura,
      status_contrato: 'CONTRATO ASSINADO',
      status_cobertura: 'COBERTURA AGENDADA'
    };

    const { data, error } = await this.supabase
      .from('contratos')
      .insert([contrato])
      .select();

    if (error) {
      console.error('Erro ao criar contrato:', error);
      throw error;
    }

    return { success: true, data: data[0] };
  }

  async listarContratos(filtros = {}) {
    if (!this.checkAuth()) {
      throw new Error('Não autenticado');
    }

    if (!this.supabase) {
      throw new Error('Supabase não inicializado');
    }

    let query = this.supabase
      .from('contratos')
      .select('*')
      .order('data_assinatura', { ascending: false });

    // Aplicar filtros
    if (filtros.search) {
      query = query.or(`nome.ilike.%${filtros.search}%,email.ilike.%${filtros.search}%,cpf.ilike.%${filtros.search}%`);
    }

    if (filtros.mes && filtros.ano) {
      const mesFormatado = filtros.mes.padStart(2, '0');
      query = query.gte('data_assinatura', `${filtros.ano}-${mesFormatado}-01`)
                   .lt('data_assinatura', `${filtros.ano}-${parseInt(mesFormatado) + 1}-01`);
    }

    if (filtros.statusContrato) {
      query = query.eq('status_contrato', filtros.statusContrato);
    }

    if (filtros.statusCobertura) {
      query = query.eq('status_cobertura', filtros.statusCobertura);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erro ao listar contratos:', error);
      throw error;
    }

    return data || [];
  }

  async obterContrato(id) {
    if (!this.checkAuth()) {
      throw new Error('Não autenticado');
    }

    if (!this.supabase) {
      throw new Error('Supabase não inicializado');
    }

    const { data, error } = await this.supabase
      .from('contratos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao obter contrato:', error);
      throw error;
    }

    return data;
  }

  async atualizarStatusCobertura(id, novoStatus) {
    if (!this.checkAuth()) {
      throw new Error('Não autenticado');
    }

    if (!this.supabase) {
      throw new Error('Supabase não inicializado');
    }

    const { data, error } = await this.supabase
      .from('contratos')
      .update({ status_cobertura: novoStatus })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Erro ao atualizar status:', error);
      throw error;
    }

    return { success: true, data: data[0] };
  }

  async atualizarStatusContrato(id, novoStatus) {
    if (!this.checkAuth()) {
      throw new Error('Não autenticado');
    }

    if (!this.supabase) {
      throw new Error('Supabase não inicializado');
    }

    const { data, error } = await this.supabase
      .from('contratos')
      .update({ status_contrato: novoStatus })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Erro ao atualizar status:', error);
      throw error;
    }

    return { success: true, data: data[0] };
  }

  // ══════════════════════════════════════════════════════════════════════
  // ESTATÍSTICAS
  // ══════════════════════════════════════════════════════════════════════

  async obterEstatisticas() {
    if (!this.checkAuth()) {
      throw new Error('Não autenticado');
    }

    if (!this.supabase) {
      throw new Error('Supabase não inicializado');
    }

    // Total de contratos
    const { count: totalContratos } = await this.supabase
      .from('contratos')
      .select('*', { count: 'exact', head: true });

    // Contratos assinados
    const { count: contratosAssinados } = await this.supabase
      .from('contratos')
      .select('*', { count: 'exact', head: true })
      .eq('status_contrato', 'CONTRATO ASSINADO');

    // Coberturas agendadas
    const { count: coberturasAgendadas } = await this.supabase
      .from('contratos')
      .select('*', { count: 'exact', head: true })
      .eq('status_cobertura', 'COBERTURA AGENDADA');

    // Coberturas finalizadas
    const { count: coberturasFinalizadas } = await this.supabase
      .from('contratos')
      .select('*', { count: 'exact', head: true })
      .eq('status_cobertura', 'COBERTURA FINALIZADA');

    // Contratos cancelados
    const { count: contratosCancelados } = await this.supabase
      .from('contratos')
      .select('*', { count: 'exact', head: true })
      .eq('status_contrato', 'CONTRATO CANCELADO');

    // Valor total (precisamos buscar todos para somar)
    const { data: contratos } = await this.supabase
      .from('contratos')
      .select('valor_total');

    let valorTotal = 0;
    if (contratos) {
      valorTotal = contratos.reduce((total, c) => {
        const valor = c.valor_total.replace(/[^\d,]/g, '').replace(',', '.');
        return total + (parseFloat(valor) || 0);
      }, 0);
    }

    return {
      totalContratos: totalContratos || 0,
      contratosAssinados: contratosAssinados || 0,
      coberturasAgendadas: coberturasAgendadas || 0,
      coberturasFinalizadas: coberturasFinalizadas || 0,
      contratosCancelados: contratosCancelados || 0,
      valorTotal: valorTotal
    };
  }

  // ══════════════════════════════════════════════════════════════════════
  // ORGANIZAÇÃO POR MÊS/ANO
  // ══════════════════════════════════════════════════════════════════════

  organizarPorMesAno(contratos) {
    const grupos = {};

    contratos.forEach(contrato => {
      const data = new Date(contrato.data_assinatura + 'T00:00:00');
      const mes = data.getMonth();
      const ano = data.getFullYear();
      const chave = `${ano}-${mes}`;

      if (!grupos[chave]) {
        grupos[chave] = {
          ano,
          mes,
          mesNome: this.obterNomeMes(mes),
          contratos: []
        };
      }

      grupos[chave].contratos.push(contrato);
    });

    // Converter objeto em array e ordenar
    return Object.values(grupos).sort((a, b) => {
      if (a.ano !== b.ano) return b.ano - a.ano;
      return b.mes - a.mes;
    });
  }

  obterNomeMes(mes) {
    const meses = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return meses[mes];
  }
}

// Instância global
window.lipvisionDB = new LipVisionSupabase();
