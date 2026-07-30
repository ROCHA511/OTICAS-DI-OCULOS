import React, { useState } from 'react';
import { X, Upload, CheckCircle2, DollarSign, ArrowUpRight, ArrowDownRight, RefreshCw, FileText } from 'lucide-react';
import { CashFlowEntry, MovementType, PaymentMethod, IncomeCategory, ExpenseCategory, UserRole } from '../../types';

interface NewMovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: Omit<CashFlowEntry, 'id' | 'saldo' | 'createdAt' | 'updatedAt'>) => void;
  defaultType?: MovementType;
  currentEmpresa: string;
  currentFilial: string;
  currentUser: string;
  currentRole: UserRole;
}

const INCOME_CATEGORIES: IncomeCategory[] = [
  'Venda à Vista',
  'Venda Cartão Débito',
  'Venda Cartão Crédito',
  'Pix',
  'Transferência Recebida',
  'Recebimento OS',
  'Recebimento Convênio',
  'Recebimento Particular',
  'Recebimento Parcelado',
  'Aporte de Caixa',
  'Outras Receitas',
];

const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Pagamento Fornecedor',
  'Aluguel',
  'Energia',
  'Internet',
  'Água',
  'Telefone',
  'Marketing',
  'Impostos',
  'Salário',
  'Comissão',
  'Manutenção',
  'Compra de Produtos',
  'Compra de Lentes',
  'Compra de Armações',
  'Retirada Sócio',
  'Sangria',
  'Outras Despesas',
];

const PAYMENT_METHODS: PaymentMethod[] = [
  'Dinheiro',
  'Pix',
  'Cartão Débito',
  'Cartão Crédito',
  'Transferência',
  'Boleto',
  'Cheque',
  'Crediário',
  'Convênio',
];

export const NewMovementModal: React.FC<NewMovementModalProps> = ({
  isOpen,
  onClose,
  onSave,
  defaultType = 'entrada',
  currentEmpresa,
  currentFilial,
  currentUser,
  currentRole,
}) => {
  const [type, setType] = useState<MovementType>(defaultType);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState<string>(new Date().toLocaleTimeString('pt-BR', { hour12: false }));
  const [empresa, setEmpresa] = useState<string>(currentEmpresa);
  const [filial, setFilial] = useState<string>(currentFilial);
  const [usuario, setUsuario] = useState<string>(currentUser);
  const [category, setCategory] = useState<string>(defaultType === 'entrada' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]);
  const [description, setDescription] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Pix');
  const [observacao, setObservacao] = useState<string>('');
  const [comprovanteName, setComprovanteName] = useState<string | null>(null);

  if (!isOpen) return null;

  // Role check: Auditor read-only
  if (currentRole === 'AUDITOR') {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-200 shadow-2xl text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
            <X className="w-6 h-6" />
          </div>
          <h3 className="text-base font-black text-slate-900">Acesso Restrito</h3>
          <p className="text-xs text-slate-600">
            O perfil <span className="font-bold text-amber-800">AUDITOR</span> possui permissão de apenas leitura. Não é permitido criar novas movimentações.
          </p>
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-[#0B1E36] text-white font-bold rounded-xl text-xs hover:bg-[#112d52]"
          >
            Entendido
          </button>
        </div>
      </div>
    );
  }

  const handleTypeChange = (newType: MovementType) => {
    setType(newType);
    if (newType === 'entrada') {
      setCategory(INCOME_CATEGORIES[0]);
    } else if (newType === 'saida') {
      setCategory(EXPENSE_CATEGORIES[0]);
    } else {
      setCategory('Transferência Entre Filiais');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount.replace(',', '.'));
    if (isNaN(numericAmount) || numericAmount <= 0) {
      alert('Por favor, informe um valor válido maior que zero.');
      return;
    }

    if (!description.trim()) {
      alert('Por favor, digite uma descrição para a movimentação.');
      return;
    }

    const isEntrada = type === 'entrada';
    const isSaida = type === 'saida';

    onSave({
      empresa,
      filial,
      usuario,
      date,
      time,
      type,
      category,
      description: description.trim(),
      paymentMethod,
      entrada: isEntrada ? numericAmount : 0,
      saida: isSaida ? numericAmount : type === 'transferencia' ? numericAmount : 0,
      amount: numericAmount,
      observacao: observacao.trim() || undefined,
      comprovanteUrl: comprovanteName ? `https://storage.opticadioculos.com.br/comprovantes/${comprovanteName}` : undefined,
      status: 'confirmado',
    });

    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setComprovanteName(e.target.files[0].name);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FAF8F5] border border-[#C5A880]/40 rounded-[24px] max-w-xl w-full shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#0B1E36] text-white flex items-center justify-between border-b border-[#C5A880]/30">
          <div className="flex items-center space-x-2.5">
            <div className={`p-2 rounded-xl text-white font-bold ${
              type === 'entrada' ? 'bg-emerald-600' : type === 'saida' ? 'bg-rose-600' : 'bg-amber-600'
            }`}>
              {type === 'entrada' ? <ArrowUpRight className="w-5 h-5" /> : type === 'saida' ? <ArrowDownRight className="w-5 h-5" /> : <RefreshCw className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-sm font-black tracking-wide uppercase">
                {type === 'entrada' ? 'Lançar Nova Entrada' : type === 'saida' ? 'Lançar Nova Saída' : 'Lançar Transferência de Caixa'}
              </h2>
              <p className="text-[10px] text-amber-200/80 font-medium">
                Óticas Di Óculos Prime - Lançamento Financeiro Automático
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Type Toggle Tabs */}
        <div className="p-4 bg-white border-b border-[#C5A880]/20 flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleTypeChange('entrada')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all border ${
              type === 'entrada'
                ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <ArrowUpRight className="w-4 h-4" /> Nova Entrada (+)
          </button>

          <button
            type="button"
            onClick={() => handleTypeChange('saida')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all border ${
              type === 'saida'
                ? 'bg-rose-600 text-white border-rose-700 shadow-sm'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <ArrowDownRight className="w-4 h-4" /> Nova Saída (-)
          </button>

          <button
            type="button"
            onClick={() => handleTypeChange('transferencia')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all border ${
              type === 'transferencia'
                ? 'bg-amber-600 text-white border-amber-700 shadow-sm'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <RefreshCw className="w-4 h-4" /> Transferência
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Data
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Hora
              </label>
              <input
                type="time"
                step="1"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Empresa
              </label>
              <select
                value={empresa}
                onChange={(e) => setEmpresa(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-2 text-xs text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
              >
                <option value="Óticas Di Óculos Prime">Óticas Di Óculos Prime</option>
                <option value="Óticas Di Óculos LTDA">Óticas Di Óculos LTDA</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Filial
              </label>
              <select
                value={filial}
                onChange={(e) => setFilial(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-2 text-xs text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
              >
                <option value="Matriz Centro">Matriz Centro</option>
                <option value="Shopping Prime">Shopping Prime</option>
                <option value="Zona Sul">Zona Sul</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Usuário
              </label>
              <input
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
                className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Tipo / Categoria
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
              >
                {type === 'entrada' &&
                  INCOME_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                {type === 'saida' &&
                  EXPENSE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                {type === 'transferencia' && (
                  <option value="Transferência Entre Filiais">
                    Transferência Entre Filiais / Caixas
                  </option>
                )}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Forma de Pagamento
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
              >
                {PAYMENT_METHODS.map((pm) => (
                  <option key={pm} value={pm}>
                    {pm}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Descrição Detalhada
              </label>
              <input
                type="text"
                placeholder="Ex: Pagamento da OS-2026-042 ou Compra de Acetato"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Valor (R$)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">R$</span>
                <input
                  type="text"
                  placeholder="0,00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 font-black focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Observações Adicionais
            </label>
            <textarea
              rows={2}
              placeholder="Detalhes adicionais, notas explicativas ou autorizações..."
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
            />
          </div>

          {/* Anexar Comprovante */}
          <div className="bg-white border border-dashed border-[#C5A880]/50 rounded-xl p-3 text-center">
            <label className="cursor-pointer flex flex-col items-center justify-center space-y-1">
              <Upload className="w-5 h-5 text-[#C5A880]" />
              <span className="text-xs font-bold text-slate-700">
                {comprovanteName ? `Comprovante: ${comprovanteName}` : 'Anexar Comprovante / Recibo (PDF ou Imagem)'}
              </span>
              <span className="text-[10px] text-slate-400">Clique para selecionar o arquivo</span>
              <input type="file" accept="image/*,application/pdf" className="hidden" onChange={handleFileChange} />
            </label>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end space-x-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`px-6 py-2.5 text-xs font-black text-white rounded-xl shadow-md transition-all flex items-center gap-2 uppercase tracking-wider ${
                type === 'entrada' ? 'bg-emerald-600 hover:bg-emerald-700' : type === 'saida' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-amber-600 hover:bg-amber-700'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" /> SALVAR MOVIMENTAÇÃO
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
