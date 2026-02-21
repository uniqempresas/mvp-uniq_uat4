import type { PaymentMethod } from '../../../types/sales';

interface PaymentSelectorProps {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
  dueDate: Date;
  onDueDateChange: (date: Date) => void;
}

const paymentOptions: { value: PaymentMethod; label: string; icon: string }[] = [
  { value: 'pix', label: 'Pix', icon: 'qr_code_2' },
  { value: 'dinheiro', label: 'Dinheiro', icon: 'payments' },
  { value: 'cartao_credito', label: 'Cartão Crédito', icon: 'credit_card' },
  { value: 'cartao_debito', label: 'Cartão Débito', icon: 'credit_card' },
  { value: 'boleto', label: 'Boleto', icon: 'barcode' },
  { value: 'outros', label: 'Outros', icon: 'more_horiz' },
];

export function PaymentSelector({ value, onChange, dueDate, onDueDateChange }: PaymentSelectorProps) {
  return (
    <div className="px-4 py-3 border-t border-gray-100">
      <p className="text-sm font-medium mb-3">Forma de Pagamento</p>
      <div className="grid grid-cols-3 gap-2">
        {paymentOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`p-3 rounded-lg border text-center transition-colors ${
              value === option.value
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <span className="material-symbols-outlined text-2xl mb-1 block">
              {option.icon}
            </span>
            <span className="text-xs">{option.label}</span>
          </button>
        ))}
      </div>
      
      {/* Data de vencimento */}
      <div className="mt-4">
        <label className="text-sm text-gray-600">Vencimento</label>
        <input
          type="date"
          value={dueDate.toISOString().split('T')[0]}
          onChange={(e) => onDueDateChange(new Date(e.target.value))}
          className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
      </div>
    </div>
  );
}
