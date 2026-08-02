import React, { useState } from 'react';
import {
  Megaphone,
  Sparkles,
  TrendingUp,
  Target,
  DollarSign,
  Users,
  Clock,
  CheckCircle2,
  PackageCheck,
  AlertCircle,
  Bell,
  Search,
  Filter,
  Plus,
  ArrowRight,
  Share2,
  ShieldCheck,
  Building2,
  Send,
  MessageCircle,
  Award,
  Pin,
  RefreshCw,
  Eye,
  Check,
} from 'lucide-react';

import { Client, ServiceOrder, CashFlowEntry } from '../../types';

interface EnterpriseNewsViewProps {
  onOpenShareModal?: () => void;
  onNavigateTab?: (tab: any) => void;
  orders: ServiceOrder[];
  cashFlow: CashFlowEntry[];
  clients: Client[];
}

interface NoticeItem {
  id: string;
  title: string;
  category: 'comunicado_ceo' | 'atendimentos' | 'laboratorio' | 'lentes_ofertas' | 'convenios';
  priority: 'alta' | 'normal' | 'informativa';
  author: string;
  role: string;
  date: string;
  time: string;
  content: string;
  pinned?: boolean;
  tags: string[];
  metrics?: { label: string; value: string }[];
}

export const EnterpriseNewsView: React.FC<EnterpriseNewsViewProps> = ({
  onOpenShareModal,
  onNavigateTab,
  orders,
  cashFlow,
  clients,
}) => {
  const hoje = new Date().toISOString().split('T')[0];

  const totalTodaySales = cashFlow
    .filter((c) => c.type === 'entrada' && c.date === hoje)
    .reduce((sum, c) => sum + c.amount, 0);

  const activeChatsCount = clients.length;
  const inLabCount = orders.filter((os) => os.status === 'no_laboratorio').length;
  const retiradasCount = orders.filter((os) => os.status === 'pronto').length;
  const percentMetaDia = Math.min(Math.round((totalTodaySales / 10000) * 100), 100);

  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingNews, setIsAddingNews] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<NoticeItem['category']>('comunicado_ceo');
  const [newPriority, setNewPriority] = useState<NoticeItem['priority']>('normal');

  const [notices, setNotices] = useState<NoticeItem[]>([
    {
      id: 'n1',
      title: 'Ativação do Agente de IA Gemini (Mary) no WhatsApp para Orçamentos Automáticos',
      category: 'comunicado_ceo',
      priority: 'alta',
      author: 'John Rocha',
      role: 'CEO & Direção Geral',
      date: '2026-07-29',
      time: '14:30',
      pinned: true,
      content:
        'A partir de hoje, todos os orçamentos solicitados via WhatsApp serão processados de forma autônoma pelo Agente de IA Gemini (Mary). O cliente recebe recomendação técnica de lentes, cálculo DNP e desconto automático de 5% no PIX. Atendentes devem acompanhar os alertas de aprovação no painel.',
      tags: ['IA Gemini', 'WhatsApp', 'Desconto PIX', 'Automação'],
      metrics: [
        { label: 'Conversão Estimada', value: '+35%' },
        { label: 'Tempo de Resposta', value: '< 10 Segundos' },
      ],
    },
    {
      id: 'n2',
      title: 'Aviso de Balcão: 5 Óculos Prontos para Retirada na Matriz Ituberá',
      category: 'atendimentos',
      priority: 'alta',
      author: 'Gerência de Atendimento',
      role: 'Matriz Centro',
      date: '2026-07-29',
      time: '12:15',
      pinned: true,
      content:
        'O Laboratório Central finalizou a montagem de 5 óculos multifocais de clientes da Matriz Centro (Rua 23 de Abril, 51 - Ituberá). As consultoras de vendas já podem emitir o comprovante de entrega e enviar aviso automático via WhatsApp com um clique.',
      tags: ['Retiradas', 'Ituberá', 'Balcão', 'Óculos Prontos'],
      metrics: [
        { label: 'Pacientes Notificados', value: '5/5 Clientes' },
        { label: 'Status Laboratório', value: '0 Atrasos' },
      ],
    },
    {
      id: 'n3',
      title: 'Atualização das Margens de Comissão em Lentes Multifocais Varilux & Zeiss',
      category: 'lentes_ofertas',
      priority: 'normal',
      author: 'Coordenação Comercial',
      role: 'Óticas Dioculos',
      date: '2026-07-28',
      time: '09:00',
      content:
        'Tabela de lentes atualizada para o mês vigente! Vendas de lentes Varilux Physio, Zeiss SmartLife e Kodak Network passam a contabilizar comissão bônus de 5,0% para consultores de vendas em todas as filiais.',
      tags: ['Comissão', 'Varilux', 'Zeiss', 'Multifocal'],
      metrics: [
        { label: 'Bônus Consultor', value: '5,0%' },
        { label: 'Meta Mensal', value: 'R$ 180.000,00' },
      ],
    },
    {
      id: 'n4',
      title: 'Relatório do Laboratório Braslab: Surfaçagem Digital sem Fila de Espera',
      category: 'laboratorio',
      priority: 'normal',
      author: 'Marcos Vinícius',
      role: 'Técnico Responsável do Laboratório',
      date: '2026-07-27',
      time: '16:45',
      content:
        'Todas as 12 ordens de serviço enviadas ao laboratório nesta manhã estão em fase final de tratamento antirreflexo e controle de qualidade óptico. Estimativa de entrega na loja em até 24 horas.',
      tags: ['Surfaçagem', 'Braslab', 'Garantia OS', 'Controle Qualidade'],
      metrics: [
        { label: 'OS em Processo', value: '12 Peças' },
        { label: 'Índice de Retrabalho', value: '0.0%' },
      ],
    },
    {
      id: 'n5',
      title: 'Novos Convênios e Parcerias com Clínicas Oftalmológicas de Ituberá & Região',
      category: 'convenios',
      priority: 'informativa',
      author: 'Dra. Camila Vasconcelos',
      role: 'Optometria & Parcerias Clínicas',
      date: '2026-07-26',
      time: '11:20',
      content:
        'Firmado acordo de encaminhamento e laudo de acuidade visual com clínicas parceiras do Baixo Sul da Bahia. Clientes encaminhados possuem cupom exclusivo de 10% de desconto na compra da armação completa.',
      tags: ['Parcerias', 'Optometria', 'Exames', 'Desconto'],
    },
  ]);

  const handleAddNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newItem: NoticeItem = {
      id: `n_${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      priority: newPriority,
      author: 'Operador Operacional',
      role: 'Sistema Óticas Dioculos',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      content: newContent.trim(),
      tags: ['Comunicado Interno', 'Equipe'],
    };

    setNotices([newItem, ...notices]);
    setNewTitle('');
    setNewContent('');
    setIsAddingNews(false);
  };

  const getPriorityBadge = (p: NoticeItem['priority']) => {
    switch (p) {
      case 'alta':
        return { label: 'Prioridade Alta', class: 'bg-rose-100 text-rose-800 border-rose-300' };
      case 'normal':
        return { label: 'Informativo Importante', class: 'bg-amber-100 text-amber-800 border-amber-300' };
      default:
        return { label: 'Nota Geral', class: 'bg-blue-100 text-blue-800 border-blue-300' };
    }
  };

  const filteredNotices = notices.filter((n) => {
    const matchesCat = selectedCategory === 'todos' || n.category === selectedCategory;
    const matchesQuery =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  return (
    <div className="flex-1 bg-slate-100/90 overflow-y-auto p-3 sm:p-6 space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-[#071D49] via-[#0B255C] to-[#071D49] rounded-3xl p-5 sm:p-6 text-white border-2 border-[#C9A96E] shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#C9A96E]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="p-2 bg-[#0B255C] text-[#C9A96E] rounded-2xl border border-[#C9A96E]/50 shadow-sm flex items-center justify-center">
                <Megaphone className="w-6 h-6 text-[#C9A96E]" />
              </span>
              <div>
                <h1 className="text-lg sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
                  Informativos & Mural Enterprise
                  <span className="text-[10px] bg-[#C9A96E] text-[#071D49] font-black px-2.5 py-0.5 rounded-full uppercase">
                    Óticas Dioculos
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-[#E8D2A8] font-medium">
                  Central unificada de transmissões, avisos do balcão, estatísticas e KPIs em tempo real
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap self-stretch sm:self-auto">
            <button
              onClick={() => setIsAddingNews(!isAddingNews)}
              className="px-4 py-2.5 bg-[#C9A96E] hover:bg-[#E8D2A8] text-[#071D49] font-extrabold text-xs rounded-2xl shadow-md transition-all border border-white/30 flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4 text-[#071D49]" />
              Novo Comunicado
            </button>

            {onOpenShareModal && (
              <button
                onClick={onOpenShareModal}
                className="px-4 py-2.5 bg-[#0B255C] hover:bg-[#153270] text-[#C9A96E] font-bold text-xs rounded-2xl transition-all border border-[#C9A96E] flex items-center gap-2 cursor-pointer active:scale-95 shadow-xs"
              >
                <Share2 className="w-4 h-4" />
                Compartilhar Link
              </button>
            )}
          </div>
        </div>

        {/* Live Ticker Bar Inside Banner */}
        <div className="mt-5 pt-4 border-t border-[#C9A96E]/30 flex items-center gap-3 overflow-hidden">
          <div className="bg-[#C9A96E] text-[#071D49] text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0 flex items-center gap-1.5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
            Transmissão Ao Vivo
          </div>
          <div className="text-xs text-[#E8D2A8] font-semibold truncate animate-pulse">
            📢 Vendas Hoje: R$ {totalTodaySales.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} • {retiradasCount} Clientes Aguardando Retirada de Óculos • IA Mary Respondendo {activeChatsCount} Atendimentos • 0 Atrasos na Garantia OS
          </div>
        </div>
      </div>

      {/* Grid of Enterprise KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm hover:border-[#C9A96E] transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Vendas do Dia & Meta</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-200">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-extrabold text-slate-900">
              R$ {totalTodaySales.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-600 mt-1">
              <span>Meta do Dia: R$ 10.000,00</span>
              <span className="font-extrabold text-emerald-600">{percentMetaDia}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${percentMetaDia}%` }} />
            </div>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm hover:border-[#C9A96E] transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Atendimentos Ativos</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-200">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-extrabold text-slate-900">
              {activeChatsCount} Clientes
            </div>
            <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
              <Sparkles className="w-3 h-3 text-[#C9A96E]" /> IA Mary operando com 100% autonomia
            </p>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm hover:border-[#C9A96E] transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Laboratório & Surfaçagem</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl border border-purple-200">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-extrabold text-slate-900">
              {inLabCount} OSs Ativas
            </div>
            <p className="text-[11px] text-slate-600 font-semibold mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Garantia: 0 atrasos no prazo
            </p>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm hover:border-[#C9A96E] transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Retiradas Balcão Ituberá</span>
            <div className="p-2 bg-amber-50 text-amber-700 rounded-xl border border-amber-200">
              <PackageCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-extrabold text-slate-900">
              {retiradasCount} Óculos Prontos
            </div>
            <p className="text-[11px] text-amber-800 font-bold mt-1">
              Clientes avisados via WhatsApp
            </p>
          </div>
        </div>
      </div>

      {/* Form Add News Collapse */}
      {isAddingNews && (
        <form
          onSubmit={handleAddNotice}
          className="bg-white p-5 rounded-3xl border-2 border-[#C9A96E]/50 shadow-lg space-y-4 animate-in fade-in"
        >
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-sm font-bold text-[#071D49] flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-[#C9A96E]" /> Publicar Novo Comunicado na Rede
            </h3>
            <button
              type="button"
              onClick={() => setIsAddingNews(false)}
              className="text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              Cancelar
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Título do Comunicado *
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Ex: Chegada da Nova Coleção de Armações Victor Hugo em Ituberá"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#071D49]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Categoria</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:outline-none"
              >
                <option value="comunicado_ceo">👑 Comunicado CEO</option>
                <option value="atendimentos">💬 Atendimentos & Balcão</option>
                <option value="laboratorio">🔬 Laboratório & Surfaçagem</option>
                <option value="lentes_ofertas">👓 Lentes & Ofertas</option>
                <option value="convenios">🤝 Convênios & Saúde</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Conteúdo Detalhado *
            </label>
            <textarea
              required
              rows={3}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Digite as orientações para a equipe de consultoras de vendas e atendimento..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#071D49]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="submit"
              className="px-5 py-2 bg-[#071D49] hover:bg-[#0B255C] text-[#C9A96E] font-bold text-xs rounded-xl shadow-md transition-all border border-[#C9A96E] flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" /> Publicar Transmissão
            </button>
          </div>
        </form>
      )}

      {/* Main Content Area: Search & Filter Tabs */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-5 space-y-4">
        {/* Filter Navigation */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {[
              { id: 'todos', label: 'Todos os Avisos' },
              { id: 'comunicado_ceo', label: 'Direção CEO' },
              { id: 'atendimentos', label: 'Atendimentos & Balcão' },
              { id: 'laboratorio', label: 'Laboratório' },
              { id: 'lentes_ofertas', label: 'Lentes & Comissões' },
              { id: 'convenios', label: 'Convênios' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === tab.id
                    ? 'bg-[#071D49] text-[#C9A96E] border border-[#C9A96E]/50 shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar comunicados..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#071D49]"
            />
          </div>
        </div>

        {/* List of Notices */}
        <div className="space-y-3">
          {filteredNotices.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
              <Megaphone className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700">Nenhum informativo encontrado nesta categoria.</p>
            </div>
          ) : (
            filteredNotices.map((item) => {
              const priority = getPriorityBadge(item.priority);
              return (
                <div
                  key={item.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-3 ${
                    item.pinned
                      ? 'bg-gradient-to-r from-amber-50/50 via-white to-amber-50/30 border-[#C9A96E] shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      {item.pinned && (
                        <span className="p-1 bg-[#C9A96E] text-[#071D49] rounded-lg text-[10px] font-black uppercase flex items-center gap-1 shadow-xs">
                          <Pin className="w-3 h-3" /> Fixado
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${priority.class}`}
                      >
                        {priority.label}
                      </span>
                      <span className="text-[11px] text-slate-500 font-semibold">
                        {item.author} ({item.role})
                      </span>
                    </div>

                    <span className="text-[11px] text-slate-400 font-mono">
                      {item.date} às {item.time}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-[#071D49] leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-700 mt-1.5 leading-relaxed">
                      {item.content}
                    </p>
                  </div>

                  {item.metrics && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                      {item.metrics.map((m, idx) => (
                        <div key={idx} className="bg-slate-50 border border-slate-200 p-2 rounded-xl">
                          <div className="text-[10px] text-slate-500 font-semibold">{m.label}</div>
                          <div className="text-xs font-extrabold text-[#071D49]">{m.value}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {item.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>

                    {onNavigateTab && item.category === 'atendimentos' && (
                      <button
                        onClick={() => onNavigateTab('chat')}
                        className="text-xs font-bold text-[#071D49] hover:text-[#0B255C] flex items-center gap-1 cursor-pointer"
                      >
                        Ver Atendimentos no Chat <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {onNavigateTab && item.category === 'laboratorio' && (
                      <button
                        onClick={() => onNavigateTab('lab')}
                        className="text-xs font-bold text-[#071D49] hover:text-[#0B255C] flex items-center gap-1 cursor-pointer"
                      >
                        Ver Fila do Laboratório <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
