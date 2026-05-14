// client/src/utils/constants.js
export const SOCIOS = ['Pastora Priscila', 'Vinicios', 'Junior'];

export const FORMAS_PAGAMENTO = ['Cash', 'Zelle', 'Cash App', 'Venmo', 'Cartão', 'Banco', 'Outro'];

export const CATEGORIAS_DESPESA = [
  'Máquina',
  'Material DTF',
  'Camisetas',
  'Latas / Embalagem',
  'Adesivos / Rótulos',
  'Frete',
  'Marketing',
  'Software',
  'Outro',
];

export const TIPOS_ATIVIDADE = [
  'Produção',
  'Compra',
  'Venda',
  'Marketing',
  'Organização',
  'Design',
  'Oração',
  'Reunião',
  'Entrega',
  'Outro',
];

export const CATEGORIAS_ESTOQUE = [
  'Camiseta',
  'Filme DTF',
  'Pó DTF',
  'Tinta DTF',
  'Lata',
  'Tampa Easy-Open',
  'Adesivo',
  'Embalagem',
  'Outro',
];

export const UNIDADES_ESTOQUE = ['unidade', 'pacote', 'rolo', 'litro', 'kg', 'caixa'];
export const STATUS_VENDA = ['Pago', 'Pendente', 'Cancelado'];

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Início', icon: '🏠' },
  { id: 'investimentos', label: 'Investir', icon: '💰' },
  { id: 'despesas', label: 'Despesas', icon: '🛒' },
  { id: 'vendas', label: 'Vendas', icon: '🧾' },
  { id: 'atividades', label: 'Atividades', icon: '✅' },
  { id: 'oracoes', label: 'Oração', icon: '🙏' },
  { id: 'estoque', label: 'Estoque', icon: '📦' },
  { id: 'relatorios', label: 'Relatórios', icon: '📊' },
];

export const MODULE_CONFIG = {
  investimentos: { sheet: 'Investimentos', label: 'Investimento', actionAdd: 'addInvestimento' },
  despesas: { sheet: 'Despesas', label: 'Despesa', actionAdd: 'addDespesa' },
  vendas: { sheet: 'Vendas', label: 'Venda', actionAdd: 'addVenda' },
  atividades: { sheet: 'Atividades', label: 'Atividade', actionAdd: 'addAtividade' },
  oracoes: { sheet: 'Oracoes', label: 'Oração', actionAdd: 'addOracao' },
  estoque: { sheet: 'Estoque', label: 'Estoque', actionAdd: 'addEstoque' },
};
