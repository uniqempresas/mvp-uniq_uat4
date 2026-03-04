import { useState, useEffect } from 'react';
import { salesService } from '../../../services/salesService';
import { VariationSelector } from './VariationSelector';
import type { Product, ProductVariation, Service } from '../../../types/sales';

interface QuickProductGridProps {
  onSelect: (item: Product | Service | ProductVariation) => void;
  type: 'products' | 'services';
}

export function QuickProductGrid({ onSelect, type }: QuickProductGridProps) {
  const [items, setItems] = useState<(Product | Service)[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isVariationModalOpen, setIsVariationModalOpen] = useState(false);

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

  const handleProductClick = (item: Product | Service) => {
    if (item.tipo === 'produto' && item.tipo_produto === 'variavel' && item.variacoes && item.variacoes.length > 0) {
      setSelectedProduct(item);
      setIsVariationModalOpen(true);
    } else {
      onSelect(item);
    }
  };

  const handleVariationSelect = (variation: ProductVariation) => {
    onSelect(variation);
    setIsVariationModalOpen(false);
    setSelectedProduct(null);
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

  const isProductWithVariations = (item: Product | Service): item is Product => {
    return item.tipo === 'produto' && item.tipo_produto === 'variavel' && !!item.variacoes && item.variacoes.length > 0;
  };

  const getProductPrice = (item: Product | Service): string => {
    if (isProductWithVariations(item)) {
      const prices = item.variacoes!.map(v => v.preco);
      const minPrice = Math.min(...prices);
      return `A partir de R$ ${minPrice.toFixed(2)}`;
    }
    return `R$ ${item.preco.toFixed(2)}`;
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => handleProductClick(item)}
            className="group bg-gray-50 dark:bg-[#0d1610] hover:bg-primary/10 dark:hover:bg-primary/20 border border-input-border hover:border-primary/30 rounded-xl p-4 transition-all text-left"
          >
            <div className="flex items-start justify-between mb-2">
              <span className="material-symbols-outlined text-primary opacity-60 group-hover:opacity-100 transition-opacity">
                {item.tipo === 'produto' ? 'package_2' : 'handyman'}
              </span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isProductWithVariations(item) ? 'bg-amber-100 text-amber-700' : 'bg-primary/10 text-primary'}`}>
                {getProductPrice(item)}
              </span>
            </div>

            <p className="text-sm font-medium text-input-text dark:text-white truncate">
              {item.nome}
            </p>

            {isProductWithVariations(item) ? (
              <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">style</span>
                {item.variacoes!.length} opções
              </p>
            ) : !isProductWithVariations(item) && ((item as unknown) as Product).quantidade !== undefined ? (
              <p className="text-xs text-gray-500 mt-1">
                Estoque: {((item as unknown) as Product).quantidade} un
              </p>
            ) : null}

            <div className="mt-2 flex items-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="material-symbols-outlined text-sm">add_circle</span>
              {isProductWithVariations(item) ? 'Escolher opção' : 'Adicionar'}
            </div>
          </button>
        ))}
      </div>

      {selectedProduct && (
        <VariationSelector
          product={selectedProduct}
          isOpen={isVariationModalOpen}
          onClose={() => {
            setIsVariationModalOpen(false);
            setSelectedProduct(null);
          }}
          onSelect={handleVariationSelect}
        />
      )}
    </>
  );
}
