# SPEC Técnica Enriquecida - Sprint 07: Correções Mobile Financeiro + Sistema de Vendas Integrado

Esta especificação provê o roteiro técnico detalhado para a implementação das funcionalidades da Sprint 07, com foco em responsividade mobile e sistema completo de vendas PDV.

---

## 1. Banco de Dados & Esquema de Dados (Supabase)

### 1.1 Nova Coluna em `me_contas_receber`

```sql
-- Migration: 20250217_add_id_venda_to_contas_receber.sql
ALTER TABLE me_contas_receber 
ADD COLUMN IF NOT EXISTS id_venda uuid REFERENCES me_venda(id);

-- Índice para performance
CREATE INDEX IF NOT EXISTS idx_me_contas_receber_id_venda 
ON me_contas_receber(id_venda);
```

### 1.2 Função RPC `registrar_venda`

**Arquivo:** `supabase/migrations/20250217_create_registrar_venda_function.sql`

```sql
CREATE OR REPLACE FUNCTION registrar_venda(
  p_id_empresa uuid,
  p_id_cliente uuid DEFAULT NULL,
  p_valor_total numeric,
  p_forma_pagamento varchar,
  p_data_venda timestamp DEFAULT NOW(),
  p_data_vencimento date DEFAULT NULL,
  p_status varchar DEFAULT 'pendente',
  p_itens jsonb DEFAULT '[]'::jsonb,
  p_observacoes text DEFAULT NULL,
  p_origem varchar DEFAULT 'interna'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_id_venda uuid;
  v_id_conta_receber uuid;
  v_item jsonb;
  v_descricao varchar;
  v_cliente_nome varchar;
BEGIN
  -- Iniciar transação implícita
  
  -- Obter nome do cliente se existir
  IF p_id_cliente IS NOT NULL THEN
    SELECT nome INTO v_cliente_nome 
    FROM me_cliente 
    WHERE id = p_id_cliente AND id_empresa = p_id_empresa;
  END IF;
  
  -- Criar descrição
  v_descricao := 'Venda #' || COALESCE(v_id_venda::text, 'NOVA') || 
                 CASE WHEN v_cliente_nome IS NOT NULL 
                      THEN ' - ' || v_cliente_nome 
                      ELSE '' END;
  
  -- 1. Inserir venda
  INSERT INTO me_venda (
    id_empresa,
    id_cliente,
    valor_total,
    forma_pagamento,
    data_venda,
    data_vencimento,
    status,
    itens,
    observacoes,
    origem
  ) VALUES (
    p_id_empresa,
    p_id_cliente,
    p_valor_total,
    p_forma_pagamento,
    p_data_venda,
    COALESCE(p_data_vencimento, CURRENT_DATE + 30),
    p_status,
    p_itens,
    p_observacoes,
    p_origem
  )
  RETURNING id INTO v_id_venda;
  
  -- Atualizar descrição com ID real
  v_descricao := 'Venda #' || v_id_venda::text || 
                 CASE WHEN v_cliente_nome IS NOT NULL 
                      THEN ' - ' || v_cliente_nome 
                      ELSE '' END;
  
  -- 2. Criar conta a receber
  INSERT INTO me_contas_receber (
    id_empresa,
    id_cliente,
    id_venda,
    valor,
    data_vencimento,
    status,
    forma_pagamento,
    descricao
  ) VALUES (
    p_id_empresa,
    p_id_cliente,
    v_id_venda,
    p_valor_total,
    COALESCE(p_data_vencimento, CURRENT_DATE + 30),
    'pendente',
    p_forma_pagamento,
    v_descricao
  )
  RETURNING id INTO v_id_conta_receber;
  
  -- 3. Atualizar estoque dos produtos
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_itens)
  LOOP
    IF (v_item->>'tipo') = 'produto' THEN
      UPDATE me_produto 
      SET 
        quantidade = quantidade - COALESCE((v_item->>'quantidade')::numeric, 0),
        updated_at = NOW()
      WHERE id = (v_item->>'id_referencia')::uuid 
        AND id_empresa = p_id_empresa;
    END IF;
  END LOOP;
  
  -- Retornar IDs criados
  RETURN jsonb_build_object(
    'success', true,
    'id_venda', v_id_venda,
    'id_conta_receber', v_id_conta_receber,
    'valor_total', p_valor_total
  );
  
EXCEPTION WHEN OTHERS THEN
  -- Transação será automaticamente revertida
  RETURN jsonb_build_object(
    'success', false,
    'error', SQLERRM,
    'detail', SQLSTATE
  );
END;
$$;

-- Permissões
GRANT EXECUTE ON FUNCTION registrar_venda TO authenticated;
GRANT EXECUTE ON FUNCTION registrar_venda TO anon;
```

### 1.3 Estrutura JSON de Itens

```typescript
interface VendaItem {
  tipo: 'produto' | 'servico';
  id_referencia: string; // uuid do produto ou serviço
  nome: string;
  quantidade: number;
  preco_unitario: number;
  subtotal: number;
}

interface VendaPayload {
  id_empresa: string;
  id_cliente?: string;
  valor_total: number;
  forma_pagamento: 'dinheiro' | 'cartao_credito' | 'cartao_debito' | 'pix' | 'boleto' | 'outros';
  data_vencimento?: string; // ISO date
  itens: VendaItem[];
  observacoes?: string;
  origem: 'interna' | 'api' | 'loja_virtual';
}
```

---

## 2. Arquivos Afetados e Novas Implementações

### 2.1 Correções Mobile - Módulo Financeiro

#### [MODIFY] `src/pages/Finance/FinanceDashboard.tsx`

**Mudanças necessárias:**

1. **Grid de KPIs responsivo:**
```tsx
// Antes
<div className="grid grid-cols-3 gap-4">

// Depois  
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

2. **Tamanhos de fonte adaptativos:**
```tsx
// Antes
<span className="text-4xl font-bold">

// Depois
<span className="text-2xl md:text-3xl lg:text-4xl font-bold">
```

3. **Gráficos com scroll horizontal:**
```tsx
<div className="overflow-x-auto pb-4">
  <div className="min-w-[600px]">
    {/* Gráfico aqui */}
  </div>
</div>
```

#### [NEW] `src/components/Finance/KPICard.tsx`

**Props:**
```typescript
interface KPICardProps {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };
  color: 'green' | 'red' | 'blue' | 'purple';
  icon?: string;
  isLoading?: boolean;
}
```

**Estrutura:**
```tsx
export function KPICard({ title, value, trend, color, icon, isLoading }: KPICardProps) {
  return (
    <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm md:text-base text-gray-600">{title}</span>
        {icon && <Icon name={icon} className="w-5 h-5 text-gray-400" />}
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
          {isLoading ? '...' : value}
        </span>
        {trend && (
          <span className={`text-xs md:text-sm ${trendColor[trend.direction]}`}>
            {trend.direction === 'up' ? '↑' : trend.direction === 'down' ? '↓' : '→'} 
            {Math.abs(trend.value)}%
          </span>
        )}
      </div>
    </div>
  );
}
```

#### [MODIFY] `src/components/Finance/DemonstrativeTable.tsx`

**Mudanças:**
```tsx
// Wrapper com scroll
<div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
  <table className="min-w-full">
    {/* Colunas responsivas - esconder em mobile */}
    <th className="hidden md:table-cell">Coluna Secundária</th>
  </table>
</div>
```

### 2.2 Nova Tela de Vendas (PDV)

#### [NEW] `src/pages/Sales/SalesPage.tsx`

**Estrutura da Página:**
```typescript
// Estados
const [cart, setCart] = useState<CartItem[]>([]);
const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
const [dueDate, setDueDate] = useState<Date>(new Date());
const [isSubmitting, setIsSubmitting] = useState(false);

// Calcula totais
const totals = useMemo(() => {
  return cart.reduce((acc, item) => ({
    subtotal: acc.subtotal + item.subtotal,
    quantity: acc.quantity + item.quantidade
  }), { subtotal: 0, quantity: 0 });
}, [cart]);
```

**Layout Mobile-First:**
```tsx
<div className="min-h-screen bg-gray-50 flex flex-col">
  {/* Header */}
  <header className="bg-white border-b px-4 py-3 sticky top-0 z-10">
    <h1 className="text-lg font-semibold">Venda Rápida</h1>
  </header>
  
  {/* Scrollable Content */}
  <div className="flex-1 overflow-y-auto">
    <ProductSearch onSelect={addToCart} />
    <SaleCart items={cart} onUpdate={updateCart} onRemove={removeFromCart} />
    <CustomerSelector value={selectedCustomer} onChange={setSelectedCustomer} />
    <PaymentSelector value={paymentMethod} onChange={setPaymentMethod} />
  </div>
  
  {/* Fixed Footer com Total */}
  <footer className="bg-white border-t px-4 py-4 sticky bottom-0">
    <div className="flex items-center justify-between mb-3">
      <span className="text-gray-600">Total</span>
      <span className="text-2xl font-bold">R$ {totals.subtotal.toFixed(2)}</span>
    </div>
    <Button 
      onClick={finalizeSale} 
      disabled={cart.length === 0 || isSubmitting}
      className="w-full h-12 text-base"
    >
      {isSubmitting ? 'Processando...' : 'Finalizar Venda'}
    </Button>
  </footer>
</div>
```

#### [NEW] `src/pages/Sales/components/ProductSearch.tsx`

**Funcionalidades:**
- Busca com debounce (300ms)
- Sugestões de produtos e serviços
- Visualização de estoque
- Atalhos de teclado (Enter para selecionar, ESC para fechar)

**Props:**
```typescript
interface ProductSearchProps {
  onSelect: (item: Product | Service) => void;
  idEmpresa: string;
}
```

**UI:**
```tsx
<div className="relative px-4 py-3">
  <div className="relative">
    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
    <input
      type="text"
      placeholder="Buscar produto ou serviço..."
      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  </div>
  
  {/* Dropdown de sugestões */}
  {suggestions.length > 0 && (
    <div className="absolute left-4 right-4 mt-1 bg-white rounded-lg shadow-lg border border-gray-100 max-h-80 overflow-y-auto z-20">
      {suggestions.map((item) => (
        <button
          key={item.id}
          onClick={() => handleSelect(item)}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 border-b border-gray-50 last:border-0"
        >
          <div className="flex items-center gap-3">
            {item.tipo === 'produto' ? (
              <PackageIcon className="w-5 h-5 text-blue-500" />
            ) : (
              <ServiceIcon className="w-5 h-5 text-purple-500" />
            )}
            <div className="text-left">
              <p className="font-medium text-sm">{item.nome}</p>
              {'estoque' in item && (
                <p className="text-xs text-gray-500">
                  Estoque: {item.estoque} un
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
</div>
```

#### [NEW] `src/pages/Sales/components/SaleCart.tsx`

**Props:**
```typescript
interface SaleCartProps {
  items: CartItem[];
  onUpdate: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
}
```

**Item do Carrinho:**
```tsx
<div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
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
      className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center disabled:opacity-50"
    >
      <MinusIcon className="w-4 h-4" />
    </button>
    <span className="w-8 text-center font-medium">{item.quantidade}</span>
    <button
      onClick={() => onUpdate(item.id, item.quantidade + 1)}
      className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center"
    >
      <PlusIcon className="w-4 h-4" />
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
```

#### [NEW] `src/pages/Sales/components/CustomerSelector.tsx`

**Funcionalidades:**
- Busca de clientes existentes
- Cadastro rápido (nome + telefone)
- Venda sem cliente (avulsa)

**Props:**
```typescript
interface CustomerSelectorProps {
  value: Customer | null;
  onChange: (customer: Customer | null) => void;
  idEmpresa: string;
}
```

**UI - Opção de venda avulsa:**
```tsx
<div className="px-4 py-3 border-b border-gray-100">
  <label className="flex items-center gap-3 cursor-pointer">
    <input
      type="radio"
      checked={!value}
      onChange={() => onChange(null)}
      className="w-4 h-4 text-primary-600"
    />
    <span className="text-sm">Venda sem cliente (avulsa)</span>
  </label>
</div>
```

**UI - Busca de cliente:**
```tsx
{value ? (
  <div className="px-4 py-3 flex items-center justify-between bg-green-50">
    <div className="flex items-center gap-3">
      <UserIcon className="w-5 h-5 text-green-600" />
      <div>
        <p className="font-medium text-sm">{value.nome}</p>
        <p className="text-xs text-gray-600">{value.telefone}</p>
      </div>
    </div>
    <button
      onClick={() => onChange(null)}
      className="text-xs text-red-500"
    >
      Trocar
    </button>
  </div>
) : (
  <div className="px-4 py-3">
    <div className="relative">
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder="Buscar cliente..."
        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
    
    {/* Botão de cadastro rápido */}
    <button
      onClick={() => setShowQuickAdd(true)}
      className="mt-2 text-sm text-primary-600 flex items-center gap-1"
    >
      <PlusIcon className="w-4 h-4" />
      Cadastrar cliente rápido
    </button>
  </div>
)}
```

#### [NEW] `src/pages/Sales/components/PaymentSelector.tsx`

**Props:**
```typescript
type PaymentMethod = 'dinheiro' | 'cartao_credito' | 'cartao_debito' | 'pix' | 'boleto' | 'outros';

interface PaymentSelectorProps {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
  dueDate: Date;
  onDueDateChange: (date: Date) => void;
}
```

**Opções de Pagamento:**
```tsx
const paymentOptions: { value: PaymentMethod; label: string; icon: string }[] = [
  { value: 'pix', label: 'Pix', icon: 'QrCodeIcon' },
  { value: 'dinheiro', label: 'Dinheiro', icon: 'BanknoteIcon' },
  { value: 'cartao_credito', label: 'Cartão de Crédito', icon: 'CreditCardIcon' },
  { value: 'cartao_debito', label: 'Cartão de Débito', icon: 'CreditCardIcon' },
  { value: 'boleto', label: 'Boleto', icon: 'BarcodeIcon' },
  { value: 'outros', label: 'Outros', icon: 'MoreHorizontalIcon' },
];
```

**UI:**
```tsx
<div className="px-4 py-3">
  <p className="text-sm font-medium mb-3">Forma de Pagamento</p>
  <div className="grid grid-cols-3 gap-2">
    {paymentOptions.map((option) => (
      <button
        key={option.value}
        onClick={() => onChange(option.value)}
        className={cn(
          "p-3 rounded-lg border text-center transition-colors",
          value === option.value
            ? "border-primary-500 bg-primary-50 text-primary-700"
            : "border-gray-200 hover:border-gray-300"
        )}
      >
        <Icon name={option.icon} className="w-6 h-6 mx-auto mb-1" />
        <span className="text-xs">{option.label}</span>
      </button>
    ))}
  </div>
  
  {/* Data de vencimento */}
  <div className="mt-4">
    <label className="text-sm text-gray-600">Vencimento</label>
    <input
      type="date"
      value={format(dueDate, 'yyyy-MM-dd')}
      onChange={(e) => onDueDateChange(new Date(e.target.value))}
      className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200"
    />
  </div>
</div>
```

### 2.3 Serviços

#### [NEW] `src/services/salesService.ts`

```typescript
import { supabase } from '../lib/supabase';
import type { VendaPayload, VendaResult } from '../types/sales';

export const salesService = {
  /**
   * Busca produtos e serviços para o PDV
   */
  async searchItems(
    idEmpresa: string, 
    searchTerm: string
  ): Promise<(Product | Service)[]> {
    const [productsRes, servicesRes] = await Promise.all([
      supabase
        .from('me_produto')
        .select('id, nome, preco, quantidade')
        .eq('id_empresa', idEmpresa)
        .ilike('nome', `%${searchTerm}%`)
        .limit(5),
      supabase
        .from('me_servico')
        .select('id, nome, preco')
        .eq('id_empresa', idEmpresa)
        .ilike('nome', `%${searchTerm}%`)
        .limit(5)
    ]);

    const products = (productsRes.data || []).map(p => ({ ...p, tipo: 'produto' as const }));
    const services = (servicesRes.data || []).map(s => ({ ...s, tipo: 'servico' as const }));

    return [...products, ...services];
  },

  /**
   * Busca clientes para seleção
   */
  async searchCustomers(
    idEmpresa: string,
    searchTerm: string
  ): Promise<Customer[]> {
    const { data, error } = await supabase
      .from('me_cliente')
      .select('id, nome, telefone, email')
      .eq('id_empresa', idEmpresa)
      .or(`nome.ilike.%${searchTerm}%,telefone.ilike.%${searchTerm}%`)
      .limit(10);

    if (error) throw error;
    return data || [];
  },

  /**
   * Cadastro rápido de cliente
   */
  async quickCreateCustomer(
    idEmpresa: string,
    customer: { nome: string; telefone?: string }
  ): Promise<Customer> {
    const { data, error } = await supabase
      .from('me_cliente')
      .insert({
        id_empresa: idEmpresa,
        nome: customer.nome,
        telefone: customer.telefone,
        origem: 'venda_rapida'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Registra uma venda completa usando a função RPC
   */
  async createSale(payload: VendaPayload): Promise<VendaResult> {
    const { data, error } = await supabase
      .rpc('registrar_venda', {
        p_id_empresa: payload.id_empresa,
        p_id_cliente: payload.id_cliente || null,
        p_valor_total: payload.valor_total,
        p_forma_pagamento: payload.forma_pagamento,
        p_data_vencimento: payload.data_vencimento || null,
        p_itens: JSON.stringify(payload.itens),
        p_observacoes: payload.observacoes || null,
        p_origem: payload.origem
      });

    if (error) throw error;
    if (!data.success) throw new Error(data.error || 'Erro ao registrar venda');

    return data;
  }
};
```

### 2.4 Configurações de Rotas

#### [MODIFY] `src/config/submenus.ts` (linha 29)

```typescript
// Antes
{ icon: 'PointOfSale', label: 'Vendas', href: '#' },

// Depois
{ icon: 'PointOfSale', label: 'Vendas', href: '/sales' },
```

#### [MODIFY] `src/routes/index.tsx`

```typescript
// Adicionar import
import { SalesPage } from '../pages/Sales/SalesPage';

// Adicionar rota
<Route path="/sales" element={<SalesPage />} />
```

### 2.5 Types

#### [NEW] `src/types/sales.ts`

```typescript
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
```

---

## 3. Fluxos Técnicos Detalhados

### 3.1 Fluxo de Correção Mobile Financeiro

```
1. Acessar FinanceDashboard.tsx
   ├─> Identificar grid de KPIs (grid-cols-3)
   ├─> Alterar para grid-cols-1 md:grid-cols-2 lg:grid-cols-3
   ├─> Adicionar breakpoints de fonte (text-2xl md:text-3xl lg:text-4xl)
   └─> Adicionar overflow-x-auto em containers de gráficos

2. Criar KPICard.tsx
   ├─> Props: title, value, trend, color, icon, isLoading
   ├─> Implementar responsividade mobile-first
   └─> Exportar componente reutilizável

3. Modificar DemonstrativeTable.tsx
   ├─> Adicionar wrapper com overflow-x-auto
   ├─> Definir min-width para tabela
   └─> Ocultar colunas secundárias em mobile
```

### 3.2 Fluxo de Registro de Venda

```
1. Usuário acessa /sales
   └─> Carrega SalesPage.tsx com estados vazios

2. Busca de Produto
   ├─> Digita no ProductSearch.tsx
   ├─> Debounce de 300ms
   ├─> Chama salesService.searchItems()
   ├─> Renderiza sugestões
   └─> Ao clicar, adiciona ao cart state

3. Gerenciamento do Carrinho
   ├─> SaleCart.tsx recebe items via props
   ├─> Usuário ajusta quantidade (+/-)
   ├─> Recalcula subtotal automaticamente
   └─> Permite remoção de itens

4. Seleção de Cliente (opcional)
   ├─> CustomerSelector.tsx
   ├─> Busca em me_cliente
   ├─> Ou cadastro rápido
   └─> Atualiza selectedCustomer state

5. Seleção de Pagamento
   ├─> PaymentSelector.tsx
   ├─> Escolhe forma de pagamento
   └─> Define data de vencimento

6. Finalização
   ├─> Valida carrinho não vazio
   ├─> Monta payload VendaPayload
   ├─> Chama salesService.createSale()
   ├─> Executa RPC registrar_venda()
   ├─> Transação:
   │   ├─> Insere em me_venda
   │   ├─> Insere em me_contas_receber (vinculado à venda)
   │   ├─> Atualiza estoque em me_produto
   │   └─> Commit automático
   ├─> Retorna IDs criados
   └─> Redireciona ou limpa formulário
```

### 3.3 Fluxo de API Externa (Preparação)

```
1. Edge Function (futuro)
   POST /functions/v1/registrar-venda-externa
   Headers: { "Authorization": "Bearer <api_key>" }
   Body: { id_empresa, cliente, itens, forma_pagamento, origem }

2. Validação
   ├─> Verifica API Key
   ├─> Valida id_empresa
   └─> Verifica permissões

3. Processamento
   ├─> Mapeia id_externo -> id interno (se necessário)
   ├─> Chama RPC registrar_venda()
   └─> Retorna resultado

4. Resposta
   { success, id_venda, id_conta_receber, valor_total }
```

---

## 4. Plano de Verificação (QA)

### 4.1 Correções Mobile Financeiro

**Testes de Responsividade:**
- [ ] iPhone SE (375px) - Dashboard completo visível
- [ ] iPhone 12 Pro (390px) - Cards empilhados verticalmente
- [ ] Galaxy S8+ (360px) - Fontes legíveis
- [ ] iPad (768px) - 2 colunas de KPIs
- [ ] Desktop (1024px+) - 3 colunas de KPIs

**Checklist Visual:**
- [ ] KPI Cards sem corte de conteúdo
- [ ] Gráficos com scroll horizontal funcional
- [ ] Tabela de demonstrativo com scroll ou cards
- [ ] Touch targets ≥ 44px
- [ ] Contraste de cores adequado

### 4.2 Sistema de Vendas

**Fluxo Completo:**
- [ ] Busca de produtos retorna resultados em < 500ms
- [ ] Adicionar item ao carrinho atualiza total
- [ ] Quantidade editável com controles + e -
- [ ] Remover item atualiza total
- [ ] Seleção de cliente funcional
- [ ] Cadastro rápido de cliente salva no banco
- [ ] Todas as formas de pagamento disponíveis
- [ ] Data de vencimento configurável
- [ ] Botão "Finalizar" desabilitado com carrinho vazio

**Validações:**
- [ ] Carrinho vazio: impedir finalização
- [ ] Estoque insuficiente: alerta e impedir
- [ ] Erro na transação: mensagem clara
- [ ] Sucesso: feedback visual

**Persistência:**
- [ ] Venda registrada em `me_venda`
- [ ] Itens salvos corretamente em JSONB
- [ ] Conta a receber criada vinculada à venda
- [ ] Estoque decrementado
- [ ] Transação rollback em caso de erro

**Mobile:**
- [ ] Interface usável em iPhone SE
- [ ] Teclado não cobre campos
- [ ] Scroll suave em listas longas
- [ ] Botão finalizar acessível

### 4.3 Performance

- [ ] Tempo de busca < 500ms
- [ ] Registro de venda < 2s
- [ ] Não há memory leaks em componentes
- [ ] Re-renders otimizados (useMemo, useCallback)

---

## 5. Considerações Técnicas Adicionais

### 5.1 Segurança da Função RPC

- Usar `SECURITY DEFINER` para executar com privilégios elevados
- Validar `id_empresa` pertence ao usuário autenticado
- Sanitizar inputs antes de inserções
- Log de auditoria para vendas (futuro)

### 5.2 Tratamento de Erros

```typescript
// Estrutura de erro padronizada
try {
  const result = await salesService.createSale(payload);
  toast.success('Venda registrada com sucesso!');
} catch (error) {
  console.error('Erro ao registrar venda:', error);
  toast.error(error.message || 'Erro ao registrar venda. Tente novamente.');
} finally {
  setIsSubmitting(false);
}
```

### 5.3 Otimizações

- Debounce na busca (300ms)
- Virtualização em listas longas (se necessário)
- Lazy loading de componentes
- Cache de resultados de busca (opcional)

### 5.4 Acessibilidade

- Todos os inputs com labels associados
- Focus visível em elementos interativos
- ARIA labels em botões de ícone
- Suporte a navegação por teclado

---

## 6. Métricas de Sucesso

| Métrica | Meta |
|---------|------|
| Tempo médio de venda | < 2 minutos |
| Taxa de erro no registro | < 1% |
| Compatibilidade mobile | 100% |
| Tempo de resposta busca | < 500ms |
| Cobertura de testes | > 80% |

---

**Versão:** 1.0  
**Data:** 17/02/2026  
**Autor:** AI Agent @neo  
**Baseado em:** PRD_Sprint_07.md
