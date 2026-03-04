import { supabase } from '../lib/supabase';
import { authService } from './authService';
import type { VendaPayload, VendaResult, Product, Service, Customer } from '../types/sales';

export const salesService = {
  /**
   * Busca produtos e serviços para o PDV
   */
  async searchItems(
    searchTerm: string
  ): Promise<(Product | Service)[]> {
    const idEmpresa = await authService.getEmpresaId();
    if (!idEmpresa) return [];

    // Build queries - se searchTerm vazio, não aplica filtro ilike
    let productsQuery = supabase
      .from('me_produto')
      .select('id, nome_produto, preco, estoque_atual, tipo')
      .eq('empresa_id', idEmpresa);

    let servicesQuery = supabase
      .from('me_servico')
      .select('id, nome_servico, preco, duracao_minutos')
      .eq('empresa_id', idEmpresa);

    // Aplica filtro apenas se houver termo de busca
    if (searchTerm && searchTerm.trim() !== '') {
      productsQuery = productsQuery.ilike('nome_produto', `%${searchTerm}%`);
      servicesQuery = servicesQuery.ilike('nome_servico', `%${searchTerm}%`);
    }

    const [productsRes, servicesRes] = await Promise.all([
      productsQuery.limit(12),
      servicesQuery.limit(12)
    ]);

    // Buscar variações para produtos do tipo 'variavel'
    const produtosComVariacoes = (productsRes.data || []).filter(p => p.tipo === 'variavel');
    const produtosSimples = (productsRes.data || []).filter(p => p.tipo !== 'variavel');

    // Buscar variações dos produtos
    let variacoesData: any[] = [];
    if (produtosComVariacoes.length > 0) {
      const produtoIds = produtosComVariacoes.map(p => p.id);
      const { data: variacoes } = await supabase
        .from('me_produto_variacao')
        .select('id, produto_pai_id, sku, preco_varejo, estoque_atual, atributos')
        .in('produto_pai_id', produtoIds);
      variacoesData = variacoes || [];
    }

    // Mapear produtos simples
    const simplesProducts = produtosSimples.map(p => ({
      id: String(p.id),
      nome: p.nome_produto,
      preco: Number(p.preco) || 0,
      quantidade: p.estoque_atual || 0,
      tipo: 'produto' as const,
      tipo_produto: 'simples' as const
    }));

    // Mapear produtos com variações
    const variavelProducts = produtosComVariacoes.map(p => {
      const produtoVariacoes = variacoesData
        .filter(v => v.produto_pai_id === p.id)
        .map(v => ({
          id: v.id,
          produto_pai_id: String(p.id),
          nome: `${p.nome_produto} - ${Object.values(v.atributos || {}).join(', ')}`,
          sku: v.sku,
          preco: Number(v.preco_varejo) || 0,
          quantidade: v.estoque_atual || 0,
          atributos: v.atributos || {}
        }));

      return {
        id: String(p.id),
        nome: p.nome_produto,
        preco: 0,
        quantidade: p.estoque_atual || 0,
        tipo: 'produto' as const,
        tipo_produto: 'variavel' as const,
        variacoes: produtoVariacoes
      };
    });

    const services = (servicesRes.data || []).map(s => ({
      ...s,
      id: String(s.id),
      nome: s.nome_servico,
      tipo: 'servico' as const
    }));

    return [...simplesProducts, ...variavelProducts, ...services];
  },

  /**
   * Busca clientes para seleção
   */
  async searchCustomers(
    searchTerm: string
  ): Promise<Customer[]> {
    const idEmpresa = await authService.getEmpresaId();
    if (!idEmpresa) return [];
    const { data, error } = await supabase
      .from('me_cliente')
      .select('id, nome_cliente, telefone, email')
      .eq('empresa_id', idEmpresa)
      .or(`nome_cliente.ilike.%${searchTerm}%,telefone.ilike.%${searchTerm}%`)
      .limit(10);

    if (error) throw error;
    return data || [];
  },

  /**
   * Cadastro rápido de cliente
   */
  async quickCreateCustomer(
    customer: { nome_cliente: string; telefone?: string }
  ): Promise<Customer> {
    const idEmpresa = await authService.getEmpresaId();
    if (!idEmpresa) throw new Error('Empresa não encontrada');
    const { data, error } = await supabase
      .from('me_cliente')
      .insert({
        empresa_id: idEmpresa,
        nome_cliente: customer.nome_cliente,
        telefone: customer.telefone,
        origem: 'venda_rapida'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Registra uma venda completa usando a função RPC
   */
  async createSale(payload: Omit<VendaPayload, 'id_empresa'>): Promise<VendaResult> {
    const idEmpresa = await authService.getEmpresaId();
    if (!idEmpresa) throw new Error('Empresa não encontrada');

    // Parâmetros conforme a função RPC atualizada
    // p_itens precisa ser um array/object, não uma string JSON
    const { data, error } = await supabase
      .rpc('registrar_venda', {
        p_empresa_id: idEmpresa,
        p_valor_total: payload.valor_total,
        p_forma_pagamento: payload.forma_pagamento,
        p_cliente_id: payload.id_cliente || null,
        p_data_vencimento: payload.data_vencimento || null,
        p_status: 'pendente',
        p_itens: payload.itens,
        p_observacoes: payload.observacoes || null,
        p_origem: payload.origem
      });

    if (error) throw error;
    if (!data.success) throw new Error(data.error || 'Erro ao registrar venda');

    return data;
  }
};
