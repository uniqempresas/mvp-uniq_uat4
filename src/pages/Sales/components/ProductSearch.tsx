import { useState, useEffect, useCallback } from 'react';
import { salesService } from '../../../services/salesService';
import type { Product, Service } from '../../../types/sales';

interface ProductSearchProps {
  onSelect: (item: Product | Service) => void;
}

export function ProductSearch({ onSelect }: ProductSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<(Product | Service)[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const debouncedSearch = useCallback(
    async (term: string) => {
      if (term.length < 2) {
        setSuggestions([]);
        return;
      }
      
      setIsLoading(true);
      try {
        const results = await salesService.searchItems(term);
        setSuggestions(results);
      } catch (error) {
        console.error('Erro ao buscar itens:', error);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      debouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, debouncedSearch]);

  const handleSelect = (item: Product | Service) => {
    onSelect(item);
    setSearchTerm('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="relative px-4 py-3">
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          search
        </span>
        <input
          type="text"
          placeholder="Buscar produto ou serviço..."
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowSuggestions(true);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => searchTerm.length >= 2 && setShowSuggestions(true)}
        />
        {isLoading && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined animate-spin text-gray-400">
            refresh
          </span>
        )}
      </div>
      
      {/* Dropdown de sugestões */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute left-4 right-4 mt-1 bg-white rounded-lg shadow-lg border border-gray-100 max-h-80 overflow-y-auto z-20">
          {suggestions.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelect(item)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 border-b border-gray-50 last:border-0 text-left"
            >
              <div className="flex items-center gap-3">
                <span className={`material-symbols-outlined ${item.tipo === 'produto' ? 'text-blue-500' : 'text-purple-500'}`}>
                  {item.tipo === 'produto' ? 'package_2' : 'handyman'}
                </span>
                <div>
                  <p className="font-medium text-sm">{item.nome}</p>
                  {'quantidade' in item && (
                    <p className="text-xs text-gray-500">
                      Estoque: {item.quantidade} un
                    </p>
                  )}
                </div>
              </div>
              <span className="font-semibold text-sm">
                R$ {item.preco.toFixed(2)}
              </span>
            </button>
          ))}
        </div>
      )}
      
      {/* Click outside to close */}
      {showSuggestions && suggestions.length > 0 && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setShowSuggestions(false)}
        />
      )}
    </div>
  );
}
