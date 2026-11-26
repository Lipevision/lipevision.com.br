/* ═══════════════════════════════════════════════════════════════════════════
   LIP VISION — Configuração Supabase
   IMPORTANTE: Substitua com suas credenciais reais do Supabase
   ═══════════════════════════════════════════════════════════════════════════ */

// 🔧 INSTRUÇÕES:
// 1. Crie uma conta em https://supabase.com
// 2. Crie um novo projeto
// 3. Vá em Settings > API
// 4. Copie a URL e a chave pública
// 5. Cole abaixo

const SUPABASE_CONFIG = {
  // URL do projeto (exemplo: https://xyzabc123.supabase.co)
  url: 'SUA_URL_SUPABASE_AQUI',
  
  // Chave pública (anon key) - começa com eyJhbGc...
  anonKey: 'SUA_CHAVE_PUBLICA_AQUI',
  
  // Senha de admin (mantenha segura!)
  adminPassword: '2011'
};

// Validação básica
if (SUPABASE_CONFIG.url === 'SUA_URL_SUPABASE_AQUI') {
  console.warn('⚠️ CONFIGURE O SUPABASE! Leia SOLUCAO-BACKEND.md');
}

// Exportar configuração
window.SUPABASE_CONFIG = SUPABASE_CONFIG;
