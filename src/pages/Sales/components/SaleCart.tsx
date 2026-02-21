import type { CartItem } from '../../../types/sales';

interface SaleCartProps {
  items: CartItem[];
  onUpdate: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
}

export function SaleCart({ items, onUpdate, onRemove }: SaleCartProps) {
  if (items.length === 0) {
    return (
      <div className="px-4 py-6 text-center">
        <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">
          shopping_cart
        </span>
        <p className="text-gray-500 text-sm">Carrinho vazio</p>
        <p className="text-gray-400 text-xs mt-1">Adicione produtos ou serviços</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-3 space-y-3">
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{item.nome}</p>
            <p className="text-xs text-gray-500">
              R$ {item.preco_unitario.toFixed(2)} / un
            </p>
          </div>
          
          {/* Controles de Quantidade */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdate(item.id, item.quantidade - 1)}
              disabled={item.quantidade <= 1}
              className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center disabled:opacity-50 active:scale-95 transition-transform"
              aria-label="Diminuir quantidade"
            >
              <span className="material-symbols-outlined text-sm">remove</span>
            </button>
            <span className="w-8 text-center font-medium text-sm">{item.quantidade}</span>
            <button
              onClick={() => onUpdate(item.id, item.quantidade + 1)}
              className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center active:scale-95 transition-transform"
              aria-label="Aumentar quantidade"
            >
              <span className="material-symbols-outlined text-sm">add</span>
            </button>
          </div>
          
          {/* Subtotal e Remover */}
          <div className="text-right min-w-[80px]">
            <p className="font-semibold text-sm">
              R$ {item.subtotal.toFixed(2)}
            </p>
            <button
              onClick={() => onRemove(item.id)}
              className="text-xs text-red-500 hover:text-red-700"
            >
              Remover
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
