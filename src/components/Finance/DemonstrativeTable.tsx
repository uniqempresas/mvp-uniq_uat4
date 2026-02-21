import type { CategoryBreakdown } from '../../pages/Finance/FinanceDashboard';

interface DemonstrativeTableProps {
  revenueBreakdown: CategoryBreakdown[];
  expenseBreakdownDRE: CategoryBreakdown[];
  receitaBruta: number;
  despesasTotais: number;
  lucroLiquido: number;
  margemLucro: number;
  filter: 'todos' | 'pago' | 'pendente';
  onFilterChange: (filter: 'todos' | 'pago' | 'pendente') => void;
}

export function DemonstrativeTable({
  revenueBreakdown,
  expenseBreakdownDRE,
  receitaBruta,
  despesasTotais,
  lucroLiquido,
  margemLucro,
  filter,
  onFilterChange
}: DemonstrativeTableProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-lg font-bold text-gray-900">Demonstrativo Detalhado</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onFilterChange('todos')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${filter === 'todos'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            Tudo
          </button>
          <button
            onClick={() => onFilterChange('pago')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${filter === 'pago'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            Efetivado
          </button>
          <button
            onClick={() => onFilterChange('pendente')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${filter === 'pendente'
              ? 'bg-amber-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            Pendente
          </button>
        </div>
      </div>

      {/* Wrapper com scroll horizontal para mobile */}
      <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-4 md:px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase whitespace-nowrap">Descrição</th>
              <th className="px-4 md:px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase whitespace-nowrap hidden sm:table-cell">%</th>
              <th className="px-4 md:px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase whitespace-nowrap">Valor (R$)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {/* Receitas */}
            <tr className="hover:bg-gray-50 bg-green-50/50">
              <td className="px-4 md:px-6 py-3 md:py-4 text-sm font-bold text-green-900">(+) Receita Operacional Bruta</td>
              <td className="px-4 md:px-6 py-3 md:py-4 text-sm text-right text-green-600 hidden sm:table-cell">100%</td>
              <td className="px-4 md:px-6 py-3 md:py-4 text-sm text-right font-bold text-green-900 whitespace-nowrap">
                {receitaBruta.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </td>
            </tr>
            {revenueBreakdown.length > 0 ? revenueBreakdown.map((item, i) => (
              <tr key={`rev-${i}`} className="hover:bg-gray-50">
                <td className="px-4 md:px-6 py-3 md:py-4 text-sm text-gray-600 pl-8 md:pl-12">{item.nome}</td>
                <td className="px-4 md:px-6 py-3 md:py-4 text-sm text-right text-gray-500 hidden sm:table-cell">{item.percentual.toFixed(1)}%</td>
                <td className="px-4 md:px-6 py-3 md:py-4 text-sm text-right text-gray-600 whitespace-nowrap">
                  {item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
              </tr>
            )) : (
              <tr className="hover:bg-gray-50">
                <td className="px-4 md:px-6 py-3 md:py-4 text-sm text-gray-400 pl-8 md:pl-12" colSpan={3}>Sem receitas no período</td>
              </tr>
            )}

            {/* Despesas */}
            <tr className="hover:bg-gray-50 bg-red-50/50">
              <td className="px-4 md:px-6 py-3 md:py-4 text-sm font-bold text-red-900">(-) Despesas Operacionais</td>
              <td className="px-4 md:px-6 py-3 md:py-4 text-sm text-right text-red-600 hidden sm:table-cell">
                {receitaBruta > 0 ? `${((despesasTotais / receitaBruta) * 100).toFixed(1)}%` : '0%'}
              </td>
              <td className="px-4 md:px-6 py-3 md:py-4 text-sm text-right font-bold text-red-900 whitespace-nowrap">
                ({despesasTotais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})
              </td>
            </tr>
            {expenseBreakdownDRE.length > 0 ? expenseBreakdownDRE.map((item, i) => (
              <tr key={`exp-${i}`} className="hover:bg-gray-50">
                <td className="px-4 md:px-6 py-3 md:py-4 text-sm text-gray-600 pl-8 md:pl-12">{item.nome}</td>
                <td className="px-4 md:px-6 py-3 md:py-4 text-sm text-right text-gray-500 hidden sm:table-cell">{item.percentual.toFixed(1)}%</td>
                <td className="px-4 md:px-6 py-3 md:py-4 text-sm text-right text-gray-600 whitespace-nowrap">
                  ({item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})
                </td>
              </tr>
            )) : (
              <tr className="hover:bg-gray-50">
                <td className="px-4 md:px-6 py-3 md:py-4 text-sm text-gray-400 pl-8 md:pl-12" colSpan={3}>Sem despesas no período</td>
              </tr>
            )}

            {/* Resultado */}
            <tr className="hover:bg-gray-50 bg-blue-50 border-t-2 border-blue-200">
              <td className="px-4 md:px-6 py-3 md:py-4 text-sm font-bold text-blue-900">(=) Resultado Operacional Líquido</td>
              <td className="px-4 md:px-6 py-3 md:py-4 text-sm text-right text-blue-600 font-bold hidden sm:table-cell">
                {receitaBruta > 0 ? `${margemLucro.toFixed(1)}%` : '0%'}
              </td>
              <td className="px-4 md:px-6 py-3 md:py-4 text-sm text-right font-bold text-blue-900 whitespace-nowrap">
                {lucroLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
