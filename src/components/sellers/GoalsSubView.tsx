import React, { useState } from 'react';
import {
  Target,
  Plus,
  BarChart2,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Award,
  Layers,
  Sparkles
} from 'lucide-react';
import { SellerGoal, UserRole, Seller } from '../../types/sellers';

interface GoalsSubViewProps {
  currentRole: UserRole;
  goals: SellerGoal[];
  sellers: Seller[];
  onSaveGoal: (goal: SellerGoal) => void;
}

export const GoalsSubView: React.FC<GoalsSubViewProps> = ({
  currentRole,
  goals,
  sellers,
  onSaveGoal,
}) => {
  const [showNewGoalModal, setShowNewGoalModal] = useState(false);
  const [selectedSellerId, setSelectedSellerId] = useState(sellers[0]?.id || '');
  const [period, setPeriod] = useState<'Diária' | 'Semanal' | 'Mensal' | 'Anual'>('Mensal');
  const [targetValue, setTargetValue] = useState<number>(30000);
  const [targetSalesCount, setTargetSalesCount] = useState<number>(20);
  const [targetMultifocalCount, setTargetMultifocalCount] = useState<number>(10);
  const [targetTreatmentsCount, setTargetTreatmentsCount] = useState<number>(15);

  const canCreateGoals = currentRole === 'CEO' || currentRole === 'GERENTE';

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const sellerObj = sellers.find((s) => s.id === selectedSellerId);
    if (!sellerObj) return;

    const newGoal: SellerGoal = {
      id: `goal_${Date.now()}`,
      sellerId: sellerObj.id,
      sellerName: sellerObj.fullName,
      branch: sellerObj.branch,
      period,
      targetValue: Number(targetValue),
      currentValue: 0,
      targetSalesCount: Number(targetSalesCount),
      currentSalesCount: 0,
      targetMultifocalCount: Number(targetMultifocalCount),
      currentMultifocalCount: 0,
      targetTreatmentsCount: Number(targetTreatmentsCount),
      currentTreatmentsCount: 0,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2026-08-31',
      status: 'Em Progresso',
    };

    onSaveGoal(newGoal);
    setShowNewGoalModal(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-black text-[#071D49] uppercase tracking-wider flex items-center gap-2">
            <Target className="w-5 h-5 text-[#C9A96E]" /> Gestão & Acompanhamento de Metas de Vendas
          </h2>
          <p className="text-xs text-slate-500">
            Definição de objetivos Diários, Semanais, Mensais e Anuais por valor e por linhas técnicas
          </p>
        </div>

        {canCreateGoals && (
          <button
            onClick={() => setShowNewGoalModal(true)}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#071D49] hover:bg-[#0B255C] text-[#E8D2A8] font-black text-xs rounded-2xl border-2 border-[#C9A96E] shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4 text-[#C9A96E]" />
            [ CRIAR NOVA META ]
          </button>
        )}
      </div>

      {/* Goals Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {goals.map((goal) => {
          const valuePercent = Math.min(
            Math.round((goal.currentValue / (goal.targetValue || 1)) * 100),
            100
          );
          const multiPercent = Math.min(
            Math.round((goal.currentMultifocalCount / (goal.targetMultifocalCount || 1)) * 100),
            100
          );
          const treatPercent = Math.min(
            Math.round((goal.currentTreatmentsCount / (goal.targetTreatmentsCount || 1)) * 100),
            100
          );

          return (
            <div
              key={goal.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 space-y-4 hover:border-[#071D49] transition-all"
            >
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <span className="text-[10px] font-black bg-[#071D49] text-[#E8D2A8] px-2 py-0.5 rounded-md uppercase">
                    Meta {goal.period}
                  </span>
                  <h3 className="text-sm font-black text-slate-900 mt-1">
                    {goal.sellerName}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">{goal.branch}</p>
                </div>

                <span
                  className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase ${
                    goal.status === 'Superada'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {goal.status}
                </span>
              </div>

              {/* Progress 1: Valor Financial */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-600">Meta Faturamento (R$)</span>
                  <span className="text-[#071D49] font-black">
                    R$ {goal.currentValue.toLocaleString('pt-BR')} / R${' '}
                    {goal.targetValue.toLocaleString('pt-BR')} ({valuePercent}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border">
                  <div
                    className="bg-gradient-to-r from-[#071D49] to-emerald-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${valuePercent}%` }}
                  />
                </div>
              </div>

              {/* Progress 2: Lentes Multifocais */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-600">Multifocais (Varilux / Zeiss)</span>
                  <span className="text-amber-800 font-black">
                    {goal.currentMultifocalCount} / {goal.targetMultifocalCount} un ({multiPercent}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border">
                  <div
                    className="bg-amber-500 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${multiPercent}%` }}
                  />
                </div>
              </div>

              {/* Progress 3: Tratamentos Premium */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-600">Tratamentos (Blue / Antirreflexo)</span>
                  <span className="text-purple-800 font-black">
                    {goal.currentTreatmentsCount} / {goal.targetTreatmentsCount} un ({treatPercent}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border">
                  <div
                    className="bg-purple-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${treatPercent}%` }}
                  />
                </div>
              </div>

              <div className="pt-2 border-t text-[10px] text-slate-400 flex justify-between font-medium">
                <span>Início: {goal.startDate}</span>
                <span>Término: {goal.endDate}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create New Goal Modal */}
      {showNewGoalModal && (
        <div className="fixed inset-0 z-50 bg-[#071D49]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-200 shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-black text-[#071D49] uppercase flex items-center gap-2">
                <Target className="w-5 h-5 text-[#C9A96E]" /> Definir Nova Meta de Vendas
              </h3>
              <button
                onClick={() => setShowNewGoalModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                Fechar
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-3 text-xs">
              <div>
                <label className="font-extrabold text-slate-700 uppercase block mb-1">
                  Selecione o Vendedor
                </label>
                <select
                  value={selectedSellerId}
                  onChange={(e) => setSelectedSellerId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800"
                >
                  {sellers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} ({s.branch})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-extrabold text-slate-700 uppercase block mb-1">
                    Periodicidade
                  </label>
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800"
                  >
                    <option value="Diária">Diária</option>
                    <option value="Semanal">Semanal</option>
                    <option value="Mensal">Mensal</option>
                    <option value="Anual">Anual</option>
                  </select>
                </div>

                <div>
                  <label className="font-extrabold text-slate-700 uppercase block mb-1">
                    Meta Faturamento (R$)
                  </label>
                  <input
                    type="number"
                    step="500"
                    value={targetValue}
                    onChange={(e) => setTargetValue(Number(e.target.value))}
                    className="w-full p-2.5 bg-amber-50 border border-amber-300 font-black text-amber-900 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-extrabold text-slate-700 uppercase block mb-1">
                    Qtd Vendas
                  </label>
                  <input
                    type="number"
                    value={targetSalesCount}
                    onChange={(e) => setTargetSalesCount(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="font-extrabold text-slate-700 uppercase block mb-1">
                    Multifocais
                  </label>
                  <input
                    type="number"
                    value={targetMultifocalCount}
                    onChange={(e) => setTargetMultifocalCount(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="font-extrabold text-slate-700 uppercase block mb-1">
                    Tratamentos
                  </label>
                  <input
                    type="number"
                    value={targetTreatmentsCount}
                    onChange={(e) => setTargetTreatmentsCount(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewGoalModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#071D49] text-[#E8D2A8] font-black rounded-xl border border-[#C9A96E]"
                >
                  Salvar Meta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
