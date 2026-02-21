import { useState, useEffect } from 'react';
import { salesService } from '../../../services/salesService';
import type { Product, Service } from '../../../types/sales';

interface QuickProductGridProps {
  onSelect: (item: Product | Service) => void;
  type: 'products' | 'services';
}

export function QuickProductGrid({ onSelect, type }: QuickProductGridProps) {
  const [items, setItems] = useState<(Product | Service)[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, [type]);

  const loadItems = async () => {
    setIsLoading(true);
    try {
      const results = await salesService.searchItems('');
      const filtered = type === 'products' 
        ? results.filter(item => item.tipo === 'produto')
        : results.filter(item => item.tipo === 'servico');
      setItems(filtered.slice(0, 12));
    } catch (error) {
      console.error('Erro ao carregar itens:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-100 dark:bg-[#0d1610] rounded-xl p-4 h-24" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <span className="material-symbols-outlined text-4xl mb-2 opacity-50">inventory_2</span>
        <p className="text-sm">Nenhum {type === 'products' ? 'produto' : 'serviço'} cadastrado</p>
        <p className="text-xs opacity-70 mt-1">Use a busca acima para encontrar itens</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item)}
          className="group bg-gray-50 dark:bg-[#0d1610] hover:bg-primary/10 dark:hover:bg-primary/20 border border-input-border hover:border-primary/30 rounded-xl p-4 transition-all text-left"
        >
          <div className="flex items-start justify-between mb-2">
            <span className="material-symbols-outlined text-primary opacity-60 group-hover:opacity-100 transition-opacity">
              {item.tipo === 'produto' ? 'package_2' : 'handyman'}
            </span>
            <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              R$ {item.preco.toFixed(2)}
            </span>
          </div>
          
          <p className="text-sm font-medium text-input-text dark:text-white truncate">
            {item.nome}
          </p>
          
          {'quantidade' in item && item.quantidade !== undefined && (
            <p className="text-xs text-gray-500 mt-1">
              Estoque: {item.quantidade} un
            </p>
          )}
          
          <div className="mt-2 flex items-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="material-symbols-outlined text-sm">add_circle</span>
            Adicionar
          </div>
        </button>
      ))}
    </div>
  );
}
