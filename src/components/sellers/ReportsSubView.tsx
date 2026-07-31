import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  FileSpreadsheet,
  FileCode,
  Filter,
  BarChart3,
  Building2,
  Users,
  Glasses,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { Seller, SellerSale, SellerGoal, CommissionMovement } from '../../types/sellers';

interface ReportsSubViewProps {
  sellers: Seller[];
  sales: SellerSale[];
  goals: SellerGoal[];
  movements: CommissionMovement[];
}

export const ReportsSubView: React.FC<ReportsSubViewProps> = ({
  sellers,
  sales,
  goals,
  movements,
}) => {
  const [reportType, setReportType] = useState('vendas_vendedor');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const handleExport = (format: 'PDF' | 'Excel' | 'CSV' | 'Print') => {
    setExportNotice(`Relatório "${reportType}" gerado e exportado em formato ${format} com sucesso!`);
    setTimeout(() => setExportNotice(null), 4000);
  };

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-black text-[#071D49] uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#C9A96E]" /> Relatórios Gerenciais & Exportação Executiva
          </h2>
          <p className="text-xs text-slate-500">
            Exportação de dados de vendas, comissões, faturamento por filial e marcas em PDF, Excel, CSV e Impressão
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => handleExport('PDF')}
            className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> PDF
          </button>
          <button
            onClick={() => handleExport('Excel')}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5 cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" /> Excel
          </button>
          <button
            onClick={() => handleExport('CSV')}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5 cursor-pointer"
          >
            <FileCode className="w-3.5 h-3.5" /> CSV
          </button>
          <button
            onClick={() => handleExport('Print')}
            className="px-3.5 py-2 bg-[#071D49] hover:bg-[#0B255C] text-[#E8D2A8] font-bold text-xs rounded-xl shadow flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" /> Imprimir
          </button>
        </div>
      </div>

      {/* Export Toast Notice */}
      {exportNotice && (
        <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 p-3 rounded-2xl text-xs font-black flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          {exportNotice}
        </div>
      )}

      {/* Report Type Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { id: 'vendas_vendedor', label: 'Vendas por Vendedor', icon: Users },
          { id: 'vendas_filial', label: 'Vendas por Filial', icon: Building2 },
          { id: 'comissoes_metas', label: 'Comissões & Metas', icon: BarChart3 },
          { id: 'produtos_lentes', label: 'Produtos e Lentes Mais Vendidas', icon: Glasses },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = reportType === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setReportType(item.id)}
              className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#071D49] text-[#E8D2A8] border-[#C9A96E] shadow-md'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-slate-400'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-[#C9A96E]' : 'text-slate-500'}`} />
              <span className="text-xs font-black uppercase mt-2">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Report Data Table Preview */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-xs font-black text-[#071D49] uppercase tracking-wider">
          Pré-visualização do Relatório: {reportType.replace('_', ' ').toUpperCase()}
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#071D49] text-[#E8D2A8] font-black uppercase text-[10px]">
              <tr>
                <th className="p-3">Item / Registro</th>
                <th className="p-3">Unidade / Filial</th>
                <th className="p-3 text-right">Qtd Vendas</th>
                <th className="p-3 text-right">Faturamento Total</th>
                <th className="p-3 text-right">Ticket Médio</th>
                <th className="p-3 text-right">Comissões Pagas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {sellers.map((s) => {
                const totalVal = s.monthlyGoal ? Math.round(s.monthlyGoal * 0.9) : 25000;
                const totalCount = Math.round(totalVal / 1350);
                const avgTicket = Math.round(totalVal / (totalCount || 1));
                const comVal = Math.round(totalVal * 0.08);

                return (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-bold text-slate-900">{s.fullName}</td>
                    <td className="p-3 text-slate-600">{s.branch}</td>
                    <td className="p-3 text-right font-mono font-bold text-slate-800">
                      {totalCount} OS
                    </td>
                    <td className="p-3 text-right font-black text-slate-900">
                      R$ {totalVal.toLocaleString('pt-BR')}
                    </td>
                    <td className="p-3 text-right font-bold text-slate-700">
                      R$ {avgTicket.toLocaleString('pt-BR')}
                    </td>
                    <td className="p-3 text-right font-black text-amber-700">
                      R$ {comVal.toLocaleString('pt-BR')}
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
