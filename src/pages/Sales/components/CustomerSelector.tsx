import { useState, useEffect, useCallback } from 'react';
import { salesService } from '../../../services/salesService';
import type { Customer } from '../../../types/sales';

interface CustomerSelectorProps {
  value: Customer | null;
  onChange: (customer: Customer | null) => void;
}

export function CustomerSelector({ value, onChange }: CustomerSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<Customer[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickAddName, setQuickAddName] = useState('');
  const [quickAddPhone, setQuickAddPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearch = useCallback(
    async (term: string) => {
      if (term.length < 2) {
        setSuggestions([]);
        return;
      }
      
      setIsLoading(true);
      try {
        const results = await salesService.searchCustomers(term);
        setSuggestions(results);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
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

  const handleSelect = (customer: Customer) => {
    onChange(customer);
    setSearchTerm('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleQuickAdd = async () => {
    if (!quickAddName.trim()) return;
    
    try {
      const newCustomer = await salesService.quickCreateCustomer({
        nome_cliente: quickAddName.trim(),
        telefone: quickAddPhone.trim() || undefined
      });
      onChange(newCustomer);
      setShowQuickAdd(false);
      setQuickAddName('');
      setQuickAddPhone('');
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      alert('Erro ao cadastrar cliente. Tente novamente.');
    }
  };

  return (
    <div className="border-t border-gray-100">
      {/* Opção de venda avulsa */}
      <div className="px-4 py-3 border-b border-gray-100">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            checked={!value}
            onChange={() => onChange(null)}
            className="w-4 h-4 text-blue-600"
          />
          <span className="text-sm">Venda sem cliente (avulsa)</span>
        </label>
      </div>
      
      {value ? (
        <div className="px-4 py-3 flex items-center justify-between bg-green-50">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-green-600">person</span>
            <div>
              <p className="font-medium text-sm">{value.nome_cliente}</p>
              {value.telefone && (
                <p className="text-xs text-gray-600">{value.telefone}</p>
              )}
            </div>
          </div>
          <button
            onClick={() => onChange(null)}
            className="text-xs text-red-500 hover:text-red-700"
          >
            Trocar
          </button>
        </div>
      ) : (
        <div className="px-4 py-3">
          <label className="flex items-center gap-3 cursor-pointer mb-3">
            <input
              type="radio"
              checked={true}
              readOnly
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-sm">Buscar cliente</span>
          </label>
          
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              search
            </span>
            <input
              type="text"
              placeholder="Buscar cliente por nome ou telefone..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => searchTerm.length >= 2 && setShowSuggestions(true)}
            />
            {isLoading && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined animate-spin text-gray-400">
                refresh
              </span>
            )}
          </div>
          
          {/* Sugestões de clientes */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="mt-2 bg-white rounded-lg shadow-lg border border-gray-100 max-h-60 overflow-y-auto z-20 relative">
              {suggestions.map((customer) => (
                <button
                  key={customer.id}
                  onClick={() => handleSelect(customer)}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 border-b border-gray-50 last:border-0 text-left"
                >
                  <span className="material-symbols-outlined text-gray-400">person</span>
                  <div>
                    <p className="font-medium text-sm">{customer.nome_cliente}</p>
                    {customer.telefone && (
                      <p className="text-xs text-gray-500">{customer.telefone}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
          
          {/* Botão de cadastro rápido */}
          {!showQuickAdd ? (
            <button
              onClick={() => setShowQuickAdd(true)}
              className="mt-3 text-sm text-blue-600 flex items-center gap-1 hover:text-blue-700"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Cadastrar cliente rápido
            </button>
          ) : (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium mb-2">Cadastro rápido</p>
              <input
                type="text"
                placeholder="Nome do cliente *"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 mb-2 text-sm"
                value={quickAddName}
                onChange={(e) => setQuickAddName(e.target.value)}
              />
              <input
                type="tel"
                placeholder="Telefone"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 mb-3 text-sm"
                value={quickAddPhone}
                onChange={(e) => setQuickAddPhone(e.target.value)}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleQuickAdd}
                  disabled={!quickAddName.trim()}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cadastrar
                </button>
                <button
                  onClick={() => {
                    setShowQuickAdd(false);
                    setQuickAddName('');
                    setQuickAddPhone('');
                  }}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Click outside to close suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setShowSuggestions(false)}
        />
      )}
    </div>
  );
}
