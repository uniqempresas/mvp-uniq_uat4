import { useState, useMemo, useCallback } from 'react';
import { salesService } from '../../services/salesService';
import { ProductSearch } from './components/ProductSearch';
import { SaleCart } from './components/SaleCart';
import { CustomerSelector } from './components/CustomerSelector';
import { PaymentSelector } from './components/PaymentSelector';
import { QuickProductGrid } from './components/QuickProductGrid';
import type { CartItem, Product, Service, PaymentMethod, Customer } from '../../types/sales';

// Helper to add days to a date
const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export default function SalesPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [dueDate, setDueDate] = useState<Date>(addDays(new Date(), 1));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'services'>('products');
  const [mobileView, setMobileView] = useState<'catalog' | 'cart'>('catalog');

  // Calcula totais
  const totals = useMemo(() => {
    return cart.reduce((acc, item) => ({
      subtotal: acc.subtotal + item.subtotal,
      quantity: acc.quantity + item.quantidade
    }), { subtotal: 0, quantity: 0 });
  }, [cart]);

  const addToCart = useCallback((item: Product | Service) => {
    setCart(prev => {
      const existingItem = prev.find(
        cartItem => cartItem.id_referencia === item.id && cartItem.tipo === item.tipo
      );
      
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.id_referencia === item.id && cartItem.tipo === item.tipo
            ? {
                ...cartItem,
                quantidade: cartItem.quantidade + 1,
                subtotal: (cartItem.quantidade + 1) * cartItem.preco_unitario
              }
            : cartItem
        );
      }
      
      const newItem: CartItem = {
        id: `${item.id}-${Date.now()}`,
        tipo: item.tipo,
        id_referencia: item.id,
        nome: item.nome,
        quantidade: 1,
        preco_unitario: item.preco,
        subtotal: item.preco
      };
      
      return [...prev, newItem];
    });
    
    // No mobile, quando adiciona item, mostra notificação sutil
    if (window.innerWidth < 768) {
      // Poderia adicionar um toast aqui
    }
  }, []);

  const updateCart = useCallback((itemId: string, quantity: number) => {
    if (quantity < 1) return;
    
    setCart(prev =>
      prev.map(item =>
        item.id === itemId
          ? { ...item, quantidade: quantity, subtotal: quantity * item.preco_unitario }
          : item
      )
    );
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  }, []);

  const finalizeSale = async () => {
    if (cart.length === 0) return;
    
    setIsSubmitting(true);
    try {
      const itens = cart.map(item => ({
        id: item.id,
        tipo: item.tipo,
        id_referencia: item.id_referencia,
        nome: item.nome,
        quantidade: item.quantidade,
        preco_unitario: item.preco_unitario
      }));
      
      await salesService.createSale({
        id_cliente: selectedCustomer?.id,
        valor_total: totals.subtotal,
        forma_pagamento: paymentMethod,
        data_vencimento: dueDate.toISOString().split('T')[0],
        itens,
        origem: 'interna'
      });
      
      // Limpa o carrinho e mostra sucesso
      setCart([]);
      setSelectedCustomer(null);
      setPaymentMethod('pix');
      setDueDate(addDays(new Date(), 1));
      setShowSuccess(true);
      
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Erro ao finalizar venda:', error);
      alert('Erro ao registrar venda. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-full bg-background-light dark:bg-background-dark relative">
      {/* Left Panel - Produtos & Busca */}
      <div className={`${mobileView === 'catalog' ? 'flex' : 'hidden md:flex'} flex-1 flex-col min-w-0 overflow-hidden`}>
        {/* Header com identidade UNIQ */}
        <header className="bg-white dark:bg-[#1a2e1f] border-b border-input-border px-4 md:px-6 py-3 md:py-4 shrink-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 md:h-10 md:w-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 shrink-0">
                <span className="material-symbols-outlined text-white text-xl md:text-2xl">point_of_sale</span>
              </div>
              <div className="min-w-0">
                <h1 className="text-lg md:text-xl font-bold text-input-text dark:text-white truncate">PDV - Venda Rápida</h1>
                <p className="text-xs md:text-sm text-input-placeholder hidden sm:block">Registre vendas de forma ágil</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-[#0d1610] rounded-lg p-1 self-start md:self-auto">
              <button
                onClick={() => setActiveTab('products')}
                className={`px-3 md:px-4 py-1.5 md:py-2 rounded-md text-xs md:text-sm font-medium transition-all ${
                  activeTab === 'products'
                    ? 'bg-white dark:bg-[#1a2e1f] text-primary shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                }`}
              >
                Produtos
              </button>
              <button
                onClick={() => setActiveTab('services')}
                className={`px-3 md:px-4 py-1.5 md:py-2 rounded-md text-xs md:text-sm font-medium transition-all ${
                  activeTab === 'services'
                    ? 'bg-white dark:bg-[#1a2e1f] text-primary shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                }`}
              >
                Serviços
              </button>
            </div>
          </div>
        </header>
        
        {/* Success Message */}
        {showSuccess && (
          <div className="bg-green-100 dark:bg-green-900/30 border-b border-green-200 dark:border-green-800 px-4 md:px-6 py-3 shrink-0">
            <div className="flex items-center gap-2 text-green-800 dark:text-green-400">
              <span className="material-symbols-outlined">check_circle</span>
              <span className="text-sm font-medium">Venda registrada com sucesso!</span>
            </div>
          </div>
        )}
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pb-20 md:pb-0">
          <div className="p-4 md:p-6 space-y-4 md:space-y-6">
            {/* Product Search */}
            <div className="bg-white dark:bg-[#1a2e1f] rounded-xl shadow-sm border border-input-border p-4 md:p-6">
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <span className="material-symbols-outlined text-primary">search</span>
                <h2 className="text-base md:text-lg font-semibold text-input-text dark:text-white">Buscar Item</h2>
              </div>
              <ProductSearch onSelect={addToCart} />
            </div>
            
            {/* Quick Product Grid */}
            <div className="bg-white dark:bg-[#1a2e1f] rounded-xl shadow-sm border border-input-border p-4 md:p-6">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">grid_view</span>
                  <h2 className="text-base md:text-lg font-semibold text-input-text dark:text-white">
                    {activeTab === 'products' ? 'Produtos em Destaque' : 'Serviços Disponíveis'}
                  </h2>
                </div>
                <span className="text-xs md:text-sm text-input-placeholder hidden sm:block">Clique para adicionar ao carrinho</span>
              </div>
              <QuickProductGrid 
                onSelect={addToCart} 
                type={activeTab}
              />
            </div>
          </div>
        </div>
        
        {/* Mobile Cart Button - Fixed Bottom */}
        <div className="md:hidden fixed bottom-4 left-4 right-4 z-20">
          <button
            onClick={() => setMobileView('cart')}
            className="w-full bg-primary text-white py-3 px-4 rounded-xl shadow-lg shadow-primary/30 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined">shopping_cart</span>
              <span className="font-medium">Ver Carrinho</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm opacity-80">{cart.length} itens</span>
              <span className="font-bold">R$ {totals.subtotal.toFixed(2)}</span>
            </div>
          </button>
        </div>
      </div>
      
      {/* Right Panel - Carrinho & Checkout */}
      <div className={`${mobileView === 'cart' ? 'flex' : 'hidden md:flex'} w-full md:w-[420px] lg:w-[480px] bg-white dark:bg-[#1a2e1f] border-l border-input-border flex-col shrink-0 absolute md:relative inset-0 md:inset-auto z-10`}>
        {/* Carrinho Header */}
        <div className="px-4 md:px-6 py-3 md:py-4 border-b border-input-border bg-gray-50 dark:bg-[#0d1610] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">shopping_cart</span>
            <h2 className="text-base md:text-lg font-semibold text-input-text dark:text-white">Carrinho</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs md:text-sm text-input-placeholder">
              {cart.length} {cart.length === 1 ? 'item' : 'itens'}
            </span>
            <button
              onClick={() => setMobileView('catalog')}
              className="md:hidden p-2 text-gray-500 hover:text-gray-700">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>
        
        {/* Scrollable Cart & Payment */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 space-y-4 md:space-y-6">
            {/* Cart Items */}
            <div className="bg-gray-50 dark:bg-[#0d1610] rounded-xl border border-input-border overflow-hidden">
              <SaleCart 
                items={cart} 
                onUpdate={updateCart} 
                onRemove={removeFromCart} 
              />
            </div>
            
            {/* Customer Selector */}
            <div className="bg-gray-50 dark:bg-[#0d1610] rounded-xl border border-input-border overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2e1f]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">person</span>
                  <h3 className="text-sm font-semibold text-input-text dark:text-white">Cliente</h3>
                </div>
              </div>
              <CustomerSelector 
                value={selectedCustomer} 
                onChange={setSelectedCustomer}
              />
            </div>
            
            {/* Payment Selector */}
            <div className="bg-gray-50 dark:bg-[#0d1610] rounded-xl border border-input-border overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2e1f]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">payments</span>
                  <h3 className="text-sm font-semibold text-input-text dark:text-white">Pagamento</h3>
                </div>
              </div>
              <PaymentSelector 
                value={paymentMethod} 
                onChange={setPaymentMethod}
                dueDate={dueDate}
                onDueDateChange={setDueDate}
              />
            </div>
          </div>
        </div>
        
        {/* Fixed Footer com Total */}
        <div className="border-t border-input-border bg-gray-50 dark:bg-[#0d1610] px-4 md:px-6 py-3 md:py-4 shrink-0">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div>
              <span className="text-xs md:text-sm text-input-placeholder">Total ({totals.quantity} {totals.quantity === 1 ? 'item' : 'itens'})</span>
            </div>
            <div className="text-right">
              <span className="text-2xl md:text-3xl font-bold text-input-text dark:text-white">
                R$ {totals.subtotal.toFixed(2)}
              </span>
            </div>
          </div>
          
          <button 
            onClick={finalizeSale}
            disabled={cart.length === 0 || isSubmitting}
            className="w-full h-12 md:h-14 bg-primary hover:bg-primary/90 text-white text-base md:text-lg font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 md:gap-3 transition-all shadow-lg shadow-primary/30"
          >
            {isSubmitting ? (
              <>
                <span className="material-symbols-outlined animate-spin">refresh</span>
                Processando...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">check_circle</span>
                Finalizar Venda
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
