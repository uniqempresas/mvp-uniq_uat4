import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { authService } from '../../../services/authService';

interface ContaReceber {
  id: string;
  descricao: string;
  valor: number;
  data_vencimento: string;
  status: 'pendente' | 'pago' | 'atrasado';
  venda_id: string | null;
  cliente_nome?: string;
}

export function ContasReceberWidget() {
  const [contas, setContas] = useState<ContaReceber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContasReceber();
  }, []);

  const loadContasReceber = async () => {
    try {
      const empresaId = await authService.getEmpresaId();
      if (!empresaId) return;

      const { data, error } = await supabase
        .from('me_contas_receber')
        .select(`
          id,
          descricao,
          valor,
          data_vencimento,
          status,
          venda_id
        `)
        .eq('empresa_id', empresaId)
        .eq('status', 'pendente')
        .order('data_vencimento', { ascending: true })
        .limit(5);

      if (error) throw error;

      const contasFormatadas = (data || []).map((conta: any) => ({
        id: conta.id,
        descricao: conta.descricao,
        valor: conta.valor,
        data_vencimento: conta.data_vencimento,
        status: conta.status,
        venda_id: conta.venda_id,
        cliente_nome: conta.descricao?.includes(' - ') 
          ? conta.descricao.split(' - ')[1] 
          : 'Cliente não identificado'
      }));

      setContas(contasFormatadas);
    } catch (error) {
      console.error('Erro ao carregar contas a receber:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2)}`;
  };

  const contasVenda = contas.filter(c => c.venda_id !== null);
  const totalPendente = contasVenda.reduce((acc, c) => acc + c.valor, 0);

  return (
    <div className="bg-white dark:bg-[#1a2e1f] rounded-xl p-4 md:p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">
            point_of_sale
          </span>
          <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
            Contas a Receber
          </h3>
        </div>
        <div className="text-right">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {contasVenda.length} de vendas
          </span>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {formatCurrency(totalPendente)}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <span className="material-symbols-outlined animate-spin text-primary">
            refresh
          </span>
        </div>
      ) : contasVenda.length > 0 ? (
        <div className="space-y-3">
          {contasVenda.map((conta) => (
            <div 
              key={conta.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#0d1610] rounded-lg hover:bg-gray-100 dark:hover:bg-[#0d1610]/80 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <span className="material-symbols-outlined text-primary shrink-0">
                  point_of_sale
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {conta.descricao}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Vencimento: {formatDate(conta.data_vencimento)}
                    {conta.cliente_nome && ` • ${conta.cliente_nome}`}
                  </p>
                </div>
              </div>
              
              <div className="text-right shrink-0">
                <p className="font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(conta.valor)}
                </p>
                {conta.venda_id && (
                  <a 
                    href={`/sales/history/${conta.venda_id}`}
                    className="text-xs text-primary hover:underline"
                  >
                    Ver venda →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <span className="material-symbols-outlined text-4xl mb-2">
            check_circle
          </span>
          <p className="text-sm">Nenhuma conta pendente de vendas</p>
        </div>
      )}
    </div>
  );
}
