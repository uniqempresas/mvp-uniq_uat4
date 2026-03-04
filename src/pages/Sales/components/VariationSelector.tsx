import { useState } from 'react';
import type { Product, ProductVariation } from '../../../types/sales';

interface VariationSelectorProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (variation: ProductVariation) => void;
}

export function VariationSelector({ product, isOpen, onClose, onSelect }: VariationSelectorProps) {
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | null>(null);

  if (!isOpen || !product.variacoes || product.variacoes.length === 0) return null;

  const handleConfirm = () => {
    if (selectedVariation) {
      onSelect(selectedVariation);
      setSelectedVariation(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-[#1a2e1f] rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Selecionar Variação
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {product.nome}
          </p>
        </div>

        {/* Variations List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {product.variacoes.map((variation) => (
              <button
                key={variation.id}
                onClick={() => setSelectedVariation(variation)}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  selectedVariation?.id === variation.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {Object.entries(variation.atributos).map(([key, value]) => (
                        <span key={key} className="mr-2">
                          <span className="text-gray-500">{key}:</span>{' '}
                          <span className="font-semibold">{value}</span>
                        </span>
                      ))}
                    </p>
                    {variation.sku && (
                      <p className="text-xs text-gray-500 mt-1">SKU: {variation.sku}</p>
                    )}
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      R$ {variation.preco.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Estoque: {variation.quantidade} un
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedVariation}
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Adicionar ao Carrinho
          </button>
        </div>
      </div>
    </div>
  );
}
