# TRACK-014: Guia de Uso dos Componentes Mobile

Este documento mostra como aplicar os novos componentes mobile nos formulários existentes.

---

## 1. MobileInput - Exemplo de Uso

### Antes (Input Nativo)

```typescript
<div className="space-y-1">
    <label className="text-xs font-semibold text-slate-500 uppercase">
        Telefone
    </label>
    <input
        name="telefone"
        value={formData.telefone || ''}
        onChange={handlePhoneChange}
        className="w-full h-10 rounded-lg border-gray-300 focus:border-primary focus:ring-primary/20 text-sm px-3"
        placeholder="(00) 00000-0000"
    />
</div>
```

### Depois (MobileInput)

```typescript
import MobileInput from '../../components/Mobile/MobileInput'

<MobileInput
    type="tel"
    label="Telefone"
    name="telefone"
    value={formData.telefone || ''}
    onChange={(val) => setFormData(prev => ({ ...prev, telefone: val }))}
    placeholder="(00) 00000-0000"
/>
```

**Benefícios:**
- ✅ Keyboard `type="tel"` automático
- ✅ Scroll automático quando keyboard abre
- ✅ Touch target ≥44px (h-11)
- ✅ Error handling integrado

---

## 2. Keyboard Types por Campo

### Telefone
```typescript
<MobileInput
    type="tel"
    label="Telefone"
    value={formData.telefone}
    onChange={(val) => setFormData({...formData, telefone: val})}
/>
```

### Email
```typescript
<MobileInput
    type="email"
    label="Email"
    value={formData.email}
    onChange={(val) => setFormData({...formData, email: val})}
/>
```

### CPF/CNPJ (apenas números)
```typescript
<MobileInput
    type="cpf"
    label="CPF"
    value={formData.cpf}
    onChange={(val) => setFormData({...formData, cpf: val})}
    maxLength={14}
/>
```

### Preço/Valor (decimal)
```typescript
<MobileInput
    type="currency"
    label="Preço de Venda"
    value={formData.preco_venda}
    onChange={(val) => setFormData({...formData, preco_venda: val})}
/>
```

### Quantidade (numeric)
```typescript
<MobileInput
    type="number"
    label="Estoque"
    value={formData.estoque}
    onChange={(val) => setFormData({...formData, estoque: val})}
/>
```

---

## 3. Toast - Exemplo de Uso

### Setup do Hook

```typescript
import { useToast } from '../../hooks/useToast'
import Toast from '../../components/Mobile/Toast'

export default function MyForm() {
    const { toast, showSuccess, showError, hideToast } = useToast()
    
    const handleSubmit = async () => {
        try {
            await onSubmit(formData)
            showSuccess('Cliente salvo com sucesso!')
            onClose()
        } catch (error) {
            showError('Erro ao salvar cliente')
        }
    }
    
    return (
        <>
            <form onSubmit={handleSubmit}>
                {/* ... */}
            </form>
            
            <Toast
                message={toast.message}
                type={toast.type}
                visible={toast.visible}
                onClose={hideToast}
            />
        </>
    )
}
```

### Tipos de Toast

```typescript
// Sucesso (verde)
showSuccess('Operação concluída!')

// Erro (vermelho)
showError('Algo deu errado')

// Aviso (amarelo)
showWarning('Atenção necessária')

// Info (azul)
showInfo('Dados atualizados')
```

---

## 4. SwipeableListItem - Exemplo de Uso

### Em Listas Mobile

```typescript
import SwipeableListItem from '../../components/Mobile/SwipeableListItem'
import MobileCard from '../../components/Mobile/MobileCard'

{items.map(item => (
    <SwipeableListItem
        key={item.id}
        onDelete={() => handleDelete(item.id)}
        deleteLabel="Excluir"
        threshold={80}
    >
        <MobileCard
            title={item.nome}
            subtitle={item.email}
            fields={[
                { label: 'Telefone', value: item.telefone }
            ]}
            actions={[
                {
                    icon: 'edit',
                    title: 'Editar',
                    onClick: () => handleEdit(item)
                }
            ]}
        />
    </SwipeableListItem>
))}
```

**Como funciona:**
1. Swipe left no card
2. Background vermelho com "Excluir" aparece
3. Se passar de 80px, confirma delete
4. Se não, volta à posição original

---

## 5. SkeletonCard - Loading States

### Antes (Spinner genérico)

```typescript
{loading && <div className="spinner">Carregando...</div>}
```

### Depois (Skeleton)

```typescript
import SkeletonCard from '../../components/Mobile/SkeletonCard'

{loading ? (
    <>
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
    </>
) : (
    items.map(item => <MobileCard key={item.id} ... />)
)}
```

---

## 6. Touch Optimization CSS

### Adicionar em Botões

```typescript
// Antes
<button className="bg-primary text-white px-4 py-2 rounded-lg">
    Salvar
</button>

// Depois
<button className="bg-primary text-white px-4 py-2 rounded-lg touch-optimized touch-feedback">
    Salvar
</button>
```

**Classes:**
- `.touch-optimized` - Evita double-tap zoom e highlight iOS
- `.touch-feedback` - Scale down em active (0.97)

---

## 7. Exemplo Completo: ClientForm Atualizado

```typescript
import { useState } from 'react'
import MobileInput from '../../components/Mobile/MobileInput'
import { useToast } from '../../hooks/useToast'
import Toast from '../../components/Mobile/Toast'

export default function ClientForm({ isOpen, onClose, onSubmit }) {
    const [formData, setFormData] = useState({ nome: '', email: '', telefone: '' })
    const { toast, showSuccess, showError, hideToast } = useToast()
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        
        try {
            await onSubmit(formData)
            showSuccess('Cliente salvo com sucesso!')
            setTimeout(onClose, 1500) // Aguarda toast
        } catch (error) {
            showError('Erro ao salvar cliente')
        }
    }
    
    if (!isOpen) return null
    
    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-auto">
                    <div className="p-6 border-b">
                        <h3 className="font-bold text-lg">Novo Cliente</h3>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <MobileInput
                            type="text"
                            label="Nome"
                            name="nome"
                            value={formData.nome}
                            onChange={(val) => setFormData({...formData, nome: val})}
                            required
                        />
                        
                        <MobileInput
                            type="email"
                            label="Email"
                            name="email"
                            value={formData.email}
                            onChange={(val) => setFormData({...formData, email: val})}
                        />
                        
                        <MobileInput
                            type="tel"
                            label="Telefone"
                            name="telefone"
                            value={formData.telefone}
                            onChange={(val) => setFormData({...formData, telefone: val})}
                        />
                        
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2 border rounded-lg touch-optimized touch-feedback"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg touch-optimized touch-feedback"
                            >
                                Salvar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            
            <Toast
                message={toast.message}
                type={toast.type}
                visible={toast.visible}
                onClose={hideToast}
            />
        </>
    )
}
```

---

## 8. Checklist de Atualização

Para cada formulário (Client, Product, Service, Supplier, Collaborator):

- [ ] Importar `MobileInput`
- [ ] Importar `useToast` e `Toast`
- [ ] Substituir inputs nativos por `MobileInput` com type correto
- [ ] Adicionar Toast no final do JSX
- [ ] Usar `showSuccess`/`showError` nos handlers
- [ ] Adicionar `.touch-optimized .touch-feedback` nos botões
- [ ] Testar em device mobile

---

## 9. Testes Mobile

### Desktop (DevTools)
1. Abrir DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Selecionar iPhone 12 Pro ou similar
4. Testar teclados e toasts

### Device Real
1. Abrir no smartphone
2. Testar keyboards (tel, email, numeric)
3. Verificar scroll automático
4. Testar swipe gestures
5. Verificar touch feedback (<150ms)

---

**Próximo:** Aplicar mudanças nos 5 formulários principais
