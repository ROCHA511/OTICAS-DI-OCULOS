import React, { useState } from 'react';
import {
  DollarSign,
  Plus,
  Percent,
  Tag,
  Target,
  TrendingUp,
  Calculator,
  CheckCircle2,
  Lock,
  Unlock,
  Building2,
  Sliders,
  Layers,
  Sparkles
} from 'lucide-react';
import {
  CommissionRule,
  CommissionMovement,
  CommissionRuleType,
  UserRole
} from '../../types/sellers';

interface CommissionsSubViewProps {
  currentRole: UserRole;
  rules: CommissionRule[];
  movements: CommissionMovement[];
  onSaveRule: (rule: CommissionRule) => void;
  onApproveMovement: (movementId: string) => void;
  onPayMovement: (movementId: string) => void;
}

export const CommissionsSubView: React.FC<CommissionsSubViewProps> = ({
  currentRole,
  rules,
  movements,
  onSaveRule,
  onApproveMovement,
  onPayMovement,
}) => {
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [calcSaleValue, setCalcSaleValue] = useState<number>(3000);
  const [calcPercent, setCalcPercent] = useState<number>(7);
  const [calcResult, setCalcResult] = useState<number>(210);

  // New Rule Form State
  const [ruleTitle, setRuleTitle] = useState('');
  const [ruleType, setRuleType] = useState<CommissionRuleType>('PERCENTUAL');
  const [categoryOrProduct, setCategoryOrProduct] = useState('Armação');
  const [ruleValue, setRuleValue] = useState<number>(5);
  const [ruleValueType, setRuleValueType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
  const [minMargin, setMinMargin] = useState<number>(60);
  const [bonusAmount, setBonusAmount] = useState<number>(300);

  const canManageRules = currentRole === 'CEO';

  const handleCalculate = (val: number, pct: number) => {
    setCalcSaleValue(val);
    setCalcPercent(pct);
    setCalcResult(Math.round((val * (pct / 100)) * 100) / 100);
  };

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleTitle) return;

    const newRule: CommissionRule = {
      id: `rule_${Date.now()}`,
      title: ruleTitle,
      type: ruleType,
      categoryOrProduct,
      value: Number(ruleValue),
      valueType: ruleValueType,
      minMargin: ruleType === 'MARGEM' ? Number(minMargin) : undefined,
      bonusAmount: ruleType === 'META' ? Number(bonusAmount) : undefined,
      active: true,
      createdAt: new Date().toISOString().split('T')[0],
    };

    onSaveRule(newRule);
    setShowRuleModal(false);
    setRuleTitle('');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-black text-[#071D49] uppercase tracking-wider flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-[#C9A96E]" /> Motor de Comissões Flexível ERP Óticas Di Óculos
          </h2>
          <p className="text-xs text-slate-500">
            Regras de comissão por Percentual, Produto Específico, Atingimento de Meta e Margem de Lucro
          </p>
        </div>

        {canManageRules && (
          <button
            onClick={() => setShowRuleModal(true)}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#071D49] hover:bg-[#0B255C] text-[#E8D2A8] font-black text-xs rounded-2xl border-2 border-[#C9A96E] shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4 text-[#C9A96E]" />
            [ NOVA REGRA DE COMISSÃO ]
          </button>
        )}
      </div>

      {/* Interactive Auto Calculator Tool */}
      <div className="bg-gradient-to-r from-[#071D49] via-[#0B255C] to-[#071D49] p-5 rounded-3xl border-2 border-[#C9A96E]/50 text-white shadow-xl space-y-3">
        <div className="flex items-center gap-2 text-[#E8D2A8] font-black text-xs uppercase tracking-wider">
          <Calculator className="w-4 h-4" /> Simulador de Cálculo Automático em Tempo Real
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-300 block mb-1">
              Valor da Venda (R$)
            </label>
            <input
              type="number"
              value={calcSaleValue}
              onChange={(e) => handleCalculate(Number(e.target.value), calcPercent)}
              className="w-full p-2.5 bg-white text-slate-900 font-black rounded-xl text-sm"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-slate-300 block mb-1">
              Percentual (%)
            </label>
            <input
              type="number"
              value={calcPercent}
              onChange={(e) => handleCalculate(calcSaleValue, Number(e.target.value))}
              className="w-full p-2.5 bg-white text-slate-900 font-black rounded-xl text-sm"
            />
          </div>

          <div className="sm:col-span-2 bg-white/10 p-3 rounded-2xl border border-[#C9A96E]/30 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200 uppercase">
              Resultado Comissão Gerada:
            </span>
            <span className="text-2xl font-black text-[#E8D2A8]">
              R$ {calcResult.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Active Commission Rules Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-black text-[#071D49] uppercase tracking-wider flex items-center gap-1.5">
          <Sliders className="w-4 h-4 text-[#C9A96E]" /> Regras de Comissão em Vigor (Motor Ativo)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {rules.map((rule) => {
            const typeBadges = {
              PERCENTUAL: 'bg-blue-100 text-blue-900',
              PRODUTO: 'bg-emerald-100 text-emerald-900',
              META: 'bg-amber-100 text-amber-900',
              MARGEM: 'bg-purple-100 text-purple-900',
            };

            return (
              <div
                key={rule.id}
                className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-2 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase ${
                      typeBadges[rule.type]
                    }`}
                  >
                    {rule.type}
                  </span>
                  <span className="text-[10px] font-extrabold text-emerald-600">
                    Ativa
                  </span>
                </div>

                <h4 className="text-xs font-black text-slate-900 leading-snug">
                  {rule.title}
                </h4>

                <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100 text-xs font-bold text-slate-800">
                  {rule.type === 'PERCENTUAL' && (
                    <span>{rule.categoryOrProduct}: {rule.value}% da Venda</span>
                  )}
                  {rule.type === 'PRODUTO' && (
                    <span>{rule.categoryOrProduct}: R$ {rule.value} Bônus Fixo</span>
                  )}
                  {rule.type === 'META' && (
                    <span>Meta &gt; R$ {rule.targetThreshold?.toLocaleString('pt-BR')}: R$ {rule.bonusAmount} Bônus</span>
                  )}
                  {rule.type === 'MARGEM' && (
                    <span>Margem &gt; {rule.minMargin}%: +{rule.value}% Comissão Extra</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Movements & Payment History Table */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-xs font-black text-[#071D49] uppercase tracking-wider flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-[#C9A96E]" /> Movimentações e Liberações de Comissões
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Total Registros: {movements.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#071D49] text-[#E8D2A8] font-black uppercase text-[10px]">
              <tr>
                <th className="p-3">OS / Data</th>
                <th className="p-3">Vendedor</th>
                <th className="p-3">Cliente</th>
                <th className="p-3">Produto</th>
                <th className="p-3 text-right">Valor Venda</th>
                <th className="p-3 text-right">Comissão (R$)</th>
                <th className="p-3 text-center">Status</th>
                {canManageRules && <th className="p-3 text-center">Ações CEO</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {movements.map((mov) => (
                <tr key={mov.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-mono font-bold text-blue-900">
                    <div>{mov.osNumber}</div>
                    <div className="text-[10px] text-slate-400">{mov.date}</div>
                  </td>
                  <td className="p-3 font-bold text-slate-800">{mov.sellerName}</td>
                  <td className="p-3 text-slate-700">{mov.clientName}</td>
                  <td className="p-3 font-bold text-slate-900 max-w-xs truncate">
                    {mov.productName}
                  </td>
                  <td className="p-3 text-right font-bold text-slate-900">
                    R$ {mov.saleValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-3 text-right font-black text-amber-700">
                    R$ {mov.commissionAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        mov.status === 'PAGO'
                          ? 'bg-emerald-100 text-emerald-800'
                          : mov.status === 'APROVADO'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {mov.status}
                    </span>
                  </td>
                  {canManageRules && (
                    <td className="p-3 text-center">
                      {mov.status === 'PENDENTE' && (
                        <button
                          onClick={() => onApproveMovement(mov.id)}
                          className="px-2.5 py-1 bg-[#071D49] hover:bg-[#0B255C] text-[#E8D2A8] font-black rounded-lg text-[10px] cursor-pointer"
                        >
                          Aprovar
                        </button>
                      )}
                      {mov.status === 'APROVADO' && (
                        <button
                          onClick={() => onPayMovement(mov.id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-lg text-[10px] cursor-pointer"
                        >
                          Pagar
                        </button>
                      )}
                      {mov.status === 'PAGO' && (
                        <span className="text-[10px] text-emerald-600 font-bold flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Pago
                        </span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Rule Modal */}
      {showRuleModal && (
        <div className="fixed inset-0 z-50 bg-[#071D49]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-200 shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-black text-[#071D49] uppercase flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#C9A96E]" /> Configurar Nova Regra de Comissão
              </h3>
              <button
                onClick={() => setShowRuleModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                Fechar
              </button>
            </div>

            <form onSubmit={handleCreateRule} className="space-y-3 text-xs">
              <div>
                <label className="font-extrabold text-slate-700 uppercase block mb-1">
                  Título da Regra
                </label>
                <input
                  type="text"
                  value={ruleTitle}
                  onChange={(e) => setRuleTitle(e.target.value)}
                  placeholder="Ex: Comissão Lentes Multifocais 10%"
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-extrabold text-slate-700 uppercase block mb-1">
                    Tipo de Regra
                  </label>
                  <select
                    value={ruleType}
                    onChange={(e) => setRuleType(e.target.value as CommissionRuleType)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  >
                    <option value="PERCENTUAL">1 - Por Percentual (%)</option>
                    <option value="PRODUTO">2 - Por Produto (Bônus Fixo)</option>
                    <option value="META">3 - Por Meta (Bônus Atingimento)</option>
                    <option value="MARGEM">4 - Por Margem de Lucro</option>
                  </select>
                </div>

                <div>
                  <label className="font-extrabold text-slate-700 uppercase block mb-1">
                    Categoria ou Item
                  </label>
                  <input
                    type="text"
                    value={categoryOrProduct}
                    onChange={(e) => setCategoryOrProduct(e.target.value)}
                    placeholder="Ex: Armação, Multifocal, Varilux XR"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-extrabold text-slate-700 uppercase block mb-1">
                    Valor / Percentual
                  </label>
                  <input
                    type="number"
                    value={ruleValue}
                    onChange={(e) => setRuleValue(Number(e.target.value))}
                    className="w-full p-2.5 bg-amber-50 border border-amber-300 font-black text-amber-900 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-extrabold text-slate-700 uppercase block mb-1">
                    Unidade
                  </label>
                  <select
                    value={ruleValueType}
                    onChange={(e) => setRuleValueType(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  >
                    <option value="PERCENTAGE">Percentual (%)</option>
                    <option value="FIXED">Valor Fixo (R$)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRuleModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#071D49] text-[#E8D2A8] font-black rounded-xl border border-[#C9A96E]"
                >
                  Salvar Regra
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
