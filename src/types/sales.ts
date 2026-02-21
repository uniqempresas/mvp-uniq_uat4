export interface CartItem {
  id: string;
  tipo: 'produto' | 'servico';
  id_referencia: string;
  nome: string;
  quantidade: number;
  preco_unitario: number;
  subtotal: number;
}

export interface VendaPayload {
  id_empresa: string;
  id_cliente?: string;
  valor_total: number;
  forma_pagamento: 'dinheiro' | 'cartao_credito' | 'cartao_debito' | 'pix' | 'boleto' | 'outros';
  data_vencimento?: string;
  itens: Omit<CartItem, 'subtotal'>[];
  observacoes?: string;
  origem: 'interna' | 'api' | 'loja_virtual';
}

export interface VendaResult {
  success: boolean;
  id_venda: string;
  id_conta_receber: string;
  valor_total: number;
  error?: string;
  detail?: string;
}

export interface Product {
  id: string;
  nome: string;
  preco: number;
  quantidade: number;
  tipo: 'produto';
}

export interface Service {
  id: string;
  nome: string;
  preco: number;
  tipo: 'servico';
}

export interface Customer {
  id: string;
  nome_cliente: string;
  telefone?: string;
  email?: string;
}

export type PaymentMethod = 'dinheiro' | 'cartao_credito' | 'cartao_debito' | 'pix' | 'boleto' | 'outros';
