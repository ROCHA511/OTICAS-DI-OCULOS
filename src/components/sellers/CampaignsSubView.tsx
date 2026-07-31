import React, { useState } from 'react';
import {
  Gift,
  Award,
  Sparkles,
  Plus,
  Calendar,
  Building2,
  CheckCircle2,
  Trophy,
  Target
} from 'lucide-react';
import { AwardCampaign, UserRole, Seller } from '../../types/sellers';

interface CampaignsSubViewProps {
  currentRole: UserRole;
  campaigns: AwardCampaign[];
  sellers: Seller[];
  onSaveCampaign: (campaign: AwardCampaign) => void;
}

export const CampaignsSubView: React.FC<CampaignsSubViewProps> = ({
  currentRole,
  campaigns,
  sellers,
  onSaveCampaign,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [prize, setPrize] = useState('');
  const [targetMetric, setTargetMetric] = useState<
    'Valor Total' | 'Qtd Multifocais' | 'Maior Ticket Médio' | 'Qtd Tratamentos'
  >('Valor Total');
  const [targetValue, setTargetValue] = useState<number>(30000);

  const canCreate = currentRole === 'CEO';

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !prize) return;

    const newCampaign: AwardCampaign = {
      id: `camp_${Date.now()}`,
      title,
      description,
      prize,
      targetMetric,
      targetValue: Number(targetValue),
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2026-08-31',
      status: 'Ativa',
      branch: 'Todas as Filiais',
    };

    onSaveCampaign(newCampaign);
    setShowModal(false);
    setTitle('');
    setDescription('');
    setPrize('');
  };

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-black text-[#071D49] uppercase tracking-wider flex items-center gap-2">
            <Gift className="w-5 h-5 text-[#C9A96E]" /> Premiações & Campanhas de Incentivo de Vendas
          </h2>
          <p className="text-xs text-slate-500">
            Campanhas comerciais com prêmios em dinheiro, viagens, smartphones e troféus de destaque
          </p>
        </div>

        {canCreate && (
          <button
            onClick={() => setShowModal(true)}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#071D49] hover:bg-[#0B255C] text-[#E8D2A8] font-black text-xs rounded-2xl border-2 border-[#C9A96E] shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4 text-[#C9A96E]" />
            [ CRIAR NOVA CAMPANHA ]
          </button>
        )}
      </div>

      {/* Campaign Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {campaigns.map((camp) => (
          <div
            key={camp.id}
            className="bg-white rounded-3xl border-2 border-[#C9A96E]/50 shadow-md p-5 space-y-4 relative overflow-hidden flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black bg-[#071D49] text-[#E8D2A8] px-2.5 py-0.5 rounded-full uppercase">
                  {camp.status}
                </span>
                <span className="text-[11px] font-extrabold text-slate-500 flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-[#C9A96E]" /> {camp.branch}
                </span>
              </div>

              <h3 className="text-sm font-black text-slate-900 leading-snug">
                {camp.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {camp.description}
              </p>
            </div>

            {/* Prize Highlight Box */}
            <div className="bg-gradient-to-r from-[#071D49] to-[#0B255C] p-3 rounded-2xl text-white space-y-1 border border-[#C9A96E]/40">
              <span className="text-[10px] font-extrabold text-[#E8D2A8] uppercase tracking-wider block">
                🎁 Prêmio do Campeão:
              </span>
              <p className="text-xs font-black text-white">{camp.prize}</p>
            </div>

            <div className="pt-2 border-t text-[10px] text-slate-400 flex justify-between font-medium">
              <span>Período: {camp.startDate} a {camp.endDate}</span>
              <span className="text-emerald-600 font-bold">Cálculo Automático</span>
            </div>
          </div>
        ))}
      </div>

      {/* New Campaign Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-[#071D49]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-200 shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-black text-[#071D49] uppercase flex items-center gap-2">
                <Gift className="w-5 h-5 text-[#C9A96E]" /> Criar Nova Campanha de Premiação
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                Fechar
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="font-extrabold text-slate-700 uppercase block mb-1">
                  Título da Campanha
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: 🏆 Campeão de Lentes Multifocais do Mês"
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="font-extrabold text-slate-700 uppercase block mb-1">
                  Descrição das Regras
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explique os critérios de participação..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="font-extrabold text-slate-700 uppercase block mb-1">
                  Prêmio Oferecido
                </label>
                <input
                  type="text"
                  value={prize}
                  onChange={(e) => setPrize(e.target.value)}
                  placeholder="Ex: R$ 500,00 no Pix + Troféu Ouro ou Viagem"
                  required
                  className="w-full p-2.5 bg-amber-50 border border-amber-300 font-black text-amber-900 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-extrabold text-slate-700 uppercase block mb-1">
                    Métrica de Avaliação
                  </label>
                  <select
                    value={targetMetric}
                    onChange={(e) => setTargetMetric(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  >
                    <option value="Valor Total">Faturamento Valor Total</option>
                    <option value="Qtd Multifocais">Qtd Multifocais</option>
                    <option value="Maior Ticket Médio">Maior Ticket Médio</option>
                    <option value="Qtd Tratamentos">Qtd Tratamentos</option>
                  </select>
                </div>

                <div>
                  <label className="font-extrabold text-slate-700 uppercase block mb-1">
                    Meta para Qualificação
                  </label>
                  <input
                    type="number"
                    value={targetValue}
                    onChange={(e) => setTargetValue(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#071D49] text-[#E8D2A8] font-black rounded-xl border border-[#C9A96E]"
                >
                  Lançar Campanha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
