import React, { useState } from 'react';
import {
  Award,
  Trophy,
  Filter,
  Building2,
  TrendingUp,
  Target,
  DollarSign,
  Medal,
  ChevronUp,
  Sparkles
} from 'lucide-react';
import { SellerRanking, Seller } from '../../types/sellers';

interface RankingSubViewProps {
  sellers: Seller[];
}

export const RankingSubView: React.FC<RankingSubViewProps> = ({ sellers }) => {
  const [selectedBranch, setSelectedBranch] = useState('TODAS');

  // Compute rankings dynamically from sellers list
  const rankings: SellerRanking[] = sellers.map((seller, index) => {
    const totalSales = seller.monthlyGoal
      ? Math.round(seller.monthlyGoal * (0.85 + (index === 0 ? 0.2 : index === 1 ? 0.13 : 0.02)))
      : 25000;
    const goalPercent = Math.round((totalSales / (seller.monthlyGoal || 1)) * 100);
    const totalCommission = Math.round(totalSales * 0.08);

    return {
      position: index + 1,
      sellerId: seller.id,
      sellerName: seller.fullName,
      photo: seller.photo,
      branch: seller.branch,
      totalSales,
      salesCount: Math.round(totalSales / 1400),
      monthlyGoal: seller.monthlyGoal,
      goalPercent,
      totalCommission,
      avgTicket: Math.round(totalSales / (Math.round(totalSales / 1400) || 1)),
      badge: index === 0 ? 'GOLD' : index === 1 ? 'SILVER' : index === 2 ? 'BRONZE' : 'TOP_SELLER',
    };
  });

  // Sort rankings by totalSales descending
  rankings.sort((a, b) => b.totalSales - a.totalSales);
  rankings.forEach((r, idx) => {
    r.position = idx + 1;
  });

  const filteredRankings = rankings.filter(
    (r) => selectedBranch === 'TODAS' || r.branch === selectedBranch
  );

  const top1 = filteredRankings[0];
  const top2 = filteredRankings[1];
  const top3 = filteredRankings[2];

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      
      {/* Header & Filter */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-black text-[#071D49] uppercase tracking-wider flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#C9A96E]" /> Ranking Geral de Vendedores & Campeões de Vendas
          </h2>
          <p className="text-xs text-slate-500">
            Classificação em tempo real por faturamento, atingimento de metas e comissões acumuladas
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="w-full sm:w-auto p-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-bold text-slate-800"
          >
            <option value="TODAS">Ranking Geral (Todas as Filiais)</option>
            <option value="Matriz Ituberá BA">Filial Matriz Ituberá BA</option>
            <option value="Filial Valença">Filial Valença BA</option>
            <option value="Filial Gandu">Filial Gandu BA</option>
          </select>
        </div>
      </div>

      {/* Podium Display (1st, 2nd, 3rd Place) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        
        {/* 2nd Place Silver */}
        {top2 && (
          <div className="bg-gradient-to-b from-slate-100 to-slate-200 p-5 rounded-3xl border-2 border-slate-300 shadow-lg text-center space-y-3 relative overflow-hidden order-2 md:order-1">
            <div className="text-3xl">🥈</div>
            <img
              src={top2.photo}
              alt={top2.sellerName}
              className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-slate-300 shadow-md"
            />
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest bg-slate-300 text-slate-800 px-2 py-0.5 rounded-full">
                2º LUGAR SEGUNDO
              </span>
              <h3 className="text-sm font-black text-slate-900 mt-1">{top2.sellerName}</h3>
              <p className="text-xs text-slate-600 font-medium">{top2.branch}</p>
            </div>

            <div className="bg-white/80 p-3 rounded-2xl border border-slate-300 space-y-1">
              <div className="text-xs font-black text-slate-900">
                R$ {top2.totalSales.toLocaleString('pt-BR')}
              </div>
              <div className="text-[10px] text-emerald-700 font-bold">
                {top2.goalPercent}% da Meta Atingida
              </div>
            </div>
          </div>
        )}

        {/* 1st Place Gold (Center & Elevated) */}
        {top1 && (
          <div className="bg-gradient-to-b from-[#071D49] via-[#0B255C] to-[#071D49] p-6 rounded-3xl border-4 border-[#C9A96E] shadow-2xl text-center space-y-3 relative overflow-hidden text-white order-1 md:order-2 transform md:-translate-y-2">
            <div className="absolute right-0 top-0 w-32 h-32 bg-[#C9A96E]/20 rounded-full blur-2xl pointer-events-none" />
            <div className="text-4xl animate-bounce">🥇</div>
            <img
              src={top1.photo}
              alt={top1.sellerName}
              className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-[#C9A96E] shadow-xl"
            />
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest bg-[#C9A96E] text-[#071D49] px-3 py-1 rounded-full shadow-md">
                🏆 CAMPEÃO PRIMEIRO LUGAR
              </span>
              <h3 className="text-base font-black text-[#E8D2A8] mt-2">{top1.sellerName}</h3>
              <p className="text-xs text-slate-300 font-medium">{top1.branch}</p>
            </div>

            <div className="bg-white/10 p-3 rounded-2xl border border-[#C9A96E]/40 space-y-1">
              <div className="text-base font-black text-[#E8D2A8]">
                R$ {top1.totalSales.toLocaleString('pt-BR')}
              </div>
              <div className="text-xs text-emerald-400 font-bold">
                {top1.goalPercent}% da Meta Atingida
              </div>
            </div>
          </div>
        )}

        {/* 3rd Place Bronze */}
        {top3 && (
          <div className="bg-gradient-to-b from-amber-50 to-amber-100 p-5 rounded-3xl border-2 border-amber-300 shadow-lg text-center space-y-3 relative overflow-hidden order-3">
            <div className="text-3xl">🥉</div>
            <img
              src={top3.photo}
              alt={top3.sellerName}
              className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-amber-400 shadow-md"
            />
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest bg-amber-300 text-amber-900 px-2 py-0.5 rounded-full">
                3º LUGAR TERCEIRO
              </span>
              <h3 className="text-sm font-black text-slate-900 mt-1">{top3.sellerName}</h3>
              <p className="text-xs text-slate-600 font-medium">{top3.branch}</p>
            </div>

            <div className="bg-white/80 p-3 rounded-2xl border border-amber-200 space-y-1">
              <div className="text-xs font-black text-slate-900">
                R$ {top3.totalSales.toLocaleString('pt-BR')}
              </div>
              <div className="text-[10px] text-emerald-700 font-bold">
                {top3.goalPercent}% da Meta Atingida
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Leaderboard Table */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-xs font-black text-[#071D49] uppercase tracking-wider flex items-center gap-2">
          <Award className="w-4 h-4 text-[#C9A96E]" /> Tabela Completa do Ranking de Desempenho
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#071D49] text-[#E8D2A8] font-black uppercase text-[10px]">
              <tr>
                <th className="p-3 text-center">Posição</th>
                <th className="p-3">Vendedor</th>
                <th className="p-3">Filial</th>
                <th className="p-3 text-right">Faturamento Total</th>
                <th className="p-3 text-right">Meta Mensal</th>
                <th className="p-3 text-center">% Atingido</th>
                <th className="p-3 text-right">Comissão Gerada</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredRankings.map((r) => {
                const medals = ['🥇 1º', '🥈 2º', '🥉 3º'];
                return (
                  <tr key={r.sellerId} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 text-center font-black text-slate-900">
                      {medals[r.position - 1] || `#${r.position}`}
                    </td>
                    <td className="p-3 font-bold text-slate-900 flex items-center gap-2.5">
                      <img
                        src={r.photo}
                        alt={r.sellerName}
                        className="w-8 h-8 rounded-xl object-cover border border-[#C9A96E]"
                      />
                      <span>{r.sellerName}</span>
                    </td>
                    <td className="p-3 text-slate-600">{r.branch}</td>
                    <td className="p-3 text-right font-black text-slate-900">
                      R$ {r.totalSales.toLocaleString('pt-BR')}
                    </td>
                    <td className="p-3 text-right font-bold text-slate-600">
                      R$ {r.monthlyGoal.toLocaleString('pt-BR')}
                    </td>
                    <td className="p-3 text-center font-black">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] ${
                          r.goalPercent >= 100
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {r.goalPercent}%
                      </span>
                    </td>
                    <td className="p-3 text-right font-black text-amber-700">
                      R$ {r.totalCommission.toLocaleString('pt-BR')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
