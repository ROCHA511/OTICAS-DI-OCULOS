import React, { useState } from 'react';
import {
  X,
  UserPlus,
  Stethoscope,
  Users,
  Building2,
  Phone,
  Mail,
  Award,
  Percent,
  CheckCircle2,
  Search,
  UserCheck,
  UserX,
  Plus,
  Sparkles,
  MessageCircle,
} from 'lucide-react';
import { Professional, ProfessionalRole } from '../../types';

interface RegisterProfessionalModalProps {
  isOpen: boolean;
  onClose: () => void;
  professionals: Professional[];
  onAddProfessional: (newProfessional: Professional) => void;
  onToggleStatus?: (id: string) => void;
  onDeleteProfessional?: (id: string) => void;
}

export const RegisterProfessionalModal: React.FC<RegisterProfessionalModalProps> = ({
  isOpen,
  onClose,
  professionals,
  onAddProfessional,
  onToggleStatus,
  onDeleteProfessional,
}) => {
  const [activeTab, setActiveTab] = useState<'form' | 'list'>('form');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('todos');

  // Form states
  const [name, setName] = useState('');
  const [role, setRole] = useState<ProfessionalRole>('medico_oftalmologista');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [filial, setFilial] = useState('Matriz Centro (Ituberá - BA)');
  const [specialty, setSpecialty] = useState('');
  const [commissionRate, setCommissionRate] = useState<string>('5.0');
  const [avatar, setAvatar] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProf: Professional = {
      id: `p_${Date.now()}`,
      name: name.trim(),
      role,
      registrationNumber: registrationNumber.trim() || undefined,
      phone: phone.trim() || '(73) 99990-0000',
      email: email.trim() || undefined,
      filial,
      specialty: specialty.trim() || undefined,
      commissionRate: commissionRate ? parseFloat(commissionRate) : undefined,
      status: 'ativo',
      avatar: avatar.trim() || undefined,
      createdAt: new Date().toISOString().split('T')[0],
    };

    onAddProfessional(newProf);
    setSuccessMessage(`Profissional "${newProf.name}" cadastrado(a) com sucesso!`);

    // Reset form
    setName('');
    setRegistrationNumber('');
    setPhone('');
    setEmail('');
    setSpecialty('');
    setAvatar('');

    setTimeout(() => {
      setSuccessMessage(null);
      setActiveTab('list');
    }, 1200);
  };

  const getRoleBadge = (role: ProfessionalRole) => {
    switch (role) {
      case 'medico_oftalmologista':
        return { label: 'Oftalmologista', color: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'optometrista':
        return { label: 'Optometrista', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'vendedor':
        return { label: 'Consultor de Vendas', color: 'bg-amber-100 text-amber-800 border-amber-200' };
      case 'gerente':
        return { label: 'Gerente de Loja', color: 'bg-purple-100 text-purple-800 border-purple-200' };
      case 'tecnico_laboratorio':
        return { label: 'Técnico de Laboratório', color: 'bg-cyan-100 text-cyan-800 border-cyan-200' };
      default:
        return { label: 'Profissional', color: 'bg-slate-100 text-slate-800 border-slate-200' };
    }
  };

  const filteredProfessionals = professionals.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.registrationNumber && p.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.phone.includes(searchQuery);

    const matchesRole = roleFilter === 'todos' || p.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border-2 border-[#C9A96E]/40 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col my-auto max-h-[90vh]">
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-[#071D49] via-[#0B255C] to-[#071D49] px-6 py-4 text-white flex items-center justify-between border-b-2 border-[#C9A96E]/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#0B255C] text-[#C9A96E] rounded-2xl border border-[#C9A96E]/40 shadow-sm flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-[#C9A96E]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Cadastro de Profissionais
                </h2>
                <span className="text-[10px] bg-[#C9A96E] text-[#071D49] font-black px-2 py-0.5 rounded-full uppercase">
                  Óticas Dioculos
                </span>
              </div>
              <p className="text-xs text-[#E8D2A8] font-medium">
                Médicos Oftalmologistas, Optometristas, Consultores & Equipe
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            title="Fechar Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="bg-[#F8FAFC] px-6 py-3 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('form')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'form'
                  ? 'bg-[#071D49] text-[#C9A96E] shadow-sm border border-[#C9A96E]/30'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              Novo Cadastro
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'list'
                  ? 'bg-[#071D49] text-[#C9A96E] shadow-sm border border-[#C9A96E]/30'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Users className="w-4 h-4" />
              Profissionais Cadastrados ({professionals.length})
            </button>
          </div>

          <span className="text-[11px] font-semibold text-slate-500 hidden sm:inline-block">
            Ituberá - BA
          </span>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {successMessage && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl flex items-center gap-3 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="text-xs font-bold">{successMessage}</span>
            </div>
          )}

          {activeTab === 'form' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-[#071D49]/5 p-3.5 rounded-2xl border border-[#C9A96E]/20 flex items-center gap-2 text-xs text-[#071D49] font-medium">
                <Sparkles className="w-4 h-4 text-[#C9A96E] shrink-0" />
                <span>
                  Cadastre médicos receitantes para vinculação automática em prescrições ópticas, optometristas ou vendedores da loja.
                </span>
              </div>

              {/* Name & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nome Completo do Profissional <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Dr. Roberto Alencar"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#071D49]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Função / Categoria <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as ProfessionalRole)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#071D49]"
                  >
                    <option value="medico_oftalmologista">👨‍⚕️ Médico Oftalmologista</option>
                    <option value="optometrista">👁️ Optometrista Clínico</option>
                    <option value="vendedor">👓 Consultor(a) de Vendas</option>
                    <option value="gerente">💼 Gerente de Unidade</option>
                    <option value="tecnico_laboratorio">🔬 Técnico de Laboratório / Montador</option>
                  </select>
                </div>
              </div>

              {/* Registration & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Registro Profissional (CRM / CBO / Matrícula)
                  </label>
                  <div className="relative">
                    <Award className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={registrationNumber}
                      onChange={(e) => setRegistrationNumber(e.target.value)}
                      placeholder="Ex: CRM-BA 28.450 ou CBO-BA 1042"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#071D49]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Telefone / WhatsApp <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(73) 98888-0000"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#071D49]"
                    />
                  </div>
                </div>
              </div>

              {/* Email & Filial */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    E-mail de Contato
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="profissional@optica.com.br"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#071D49]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Unidade / Filial
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <select
                      value={filial}
                      onChange={(e) => setFilial(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#071D49]"
                    >
                      <option value="Matriz Centro (Ituberá - BA)">Matriz Centro (Ituberá - BA)</option>
                      <option value="Shopping Prime">Shopping Prime</option>
                      <option value="Laboratório Central">Laboratório Central</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Specialty & Commission */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Especialidade / Foco de Atuação
                  </label>
                  <input
                    type="text"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    placeholder="Ex: Catarata & Refração, Multifocal, etc."
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#071D49]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Taxa de Comissão / Parceria (%)
                  </label>
                  <div className="relative">
                    <Percent className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="100"
                      value={commissionRate}
                      onChange={(e) => setCommissionRate(e.target.value)}
                      placeholder="5.0"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#071D49]"
                    />
                  </div>
                </div>
              </div>

              {/* Avatar URL optional */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Foto de Perfil (URL da Imagem - Opcional)
                </label>
                <input
                  type="url"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#071D49]"
                />
              </div>

              {/* Action Submit */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#071D49] hover:bg-[#0B255C] text-[#C9A96E] font-extrabold text-xs rounded-xl shadow-md transition-all border border-[#C9A96E]/40 flex items-center gap-2 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  Salvar Cadastro de Profissional
                </button>
              </div>
            </form>
          ) : (
            /* LIST OF PROFESSIONALS */
            <div className="space-y-4">
              {/* Search & Filter */}
              <div className="flex flex-col sm:flex-row gap-2.5 items-center justify-between">
                <div className="relative w-full sm:w-auto flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar por nome, CRM ou telefone..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#071D49]"
                  />
                </div>

                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
                >
                  <option value="todos">Todas as Categoria ({professionals.length})</option>
                  <option value="medico_oftalmologista">Médicos Oftalmologistas</option>
                  <option value="optometrista">Optometristas</option>
                  <option value="vendedor">Consultores de Vendas</option>
                  <option value="gerente">Gerentes</option>
                  <option value="tecnico_laboratorio">Técnicos de Laboratório</option>
                </select>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 gap-3">
                {filteredProfessionals.length === 0 ? (
                  <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-slate-500">
                    <Users className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-700">Nenhum profissional encontrado.</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Tente ajustar a busca ou cadastre um novo profissional.</p>
                  </div>
                ) : (
                  filteredProfessionals.map((prof) => {
                    const badge = getRoleBadge(prof.role);
                    return (
                      <div
                        key={prof.id}
                        className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-[#C9A96E]/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          {prof.avatar ? (
                            <img
                              src={prof.avatar}
                              alt={prof.name}
                              className="w-12 h-12 rounded-full object-cover border-2 border-[#C9A96E]/40 shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-[#071D49] text-[#C9A96E] font-bold text-base flex items-center justify-center border-2 border-[#C9A96E]/40 shrink-0">
                              {prof.name.charAt(0)}
                            </div>
                          )}

                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-sm font-bold text-slate-900">{prof.name}</h4>
                              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${badge.color}`}>
                                {badge.label}
                              </span>
                              {prof.status === 'ativo' ? (
                                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                                  <UserCheck className="w-3 h-3 text-emerald-600" /> Ativo
                                </span>
                              ) : (
                                <span className="text-[10px] bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-rose-200">
                                  <UserX className="w-3 h-3 text-rose-600" /> Inativo
                                </span>
                              )}
                            </div>

                            <div className="text-xs text-slate-600 flex items-center gap-3 mt-1 flex-wrap">
                              {prof.registrationNumber && (
                                <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
                                  {prof.registrationNumber}
                                </span>
                              )}
                              <span>{prof.phone}</span>
                              <span className="text-slate-400">•</span>
                              <span>{prof.filial}</span>
                            </div>

                            {prof.specialty && (
                              <p className="text-[11px] text-slate-500 italic mt-0.5">
                                Especialidade: {prof.specialty}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Actions: Edit & Toggle Status */}
                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          {prof.commissionRate !== undefined && (
                            <span className="text-[11px] bg-amber-50 text-amber-900 border border-amber-200 font-bold px-2.5 py-1 rounded-lg">
                              Comissão: {prof.commissionRate}%
                            </span>
                          )}

                          <button
                            onClick={() => {
                              setName(prof.name);
                              setRole(prof.role);
                              setRegistrationNumber(prof.registrationNumber || '');
                              setPhone(prof.phone || '');
                              setEmail(prof.email || '');
                              setFilial(prof.filial);
                              setSpecialty(prof.specialty || '');
                              setCommissionRate(prof.commissionRate ? String(prof.commissionRate) : '5.0');
                              setAvatar(prof.avatar || '');
                              setActiveTab('form');
                            }}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all cursor-pointer"
                          >
                            ⚙️ Editar
                          </button>

                          {onToggleStatus && (
                            <button
                              onClick={() => onToggleStatus(prof.id)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                prof.status === 'ativo'
                                  ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                              }`}
                            >
                              {prof.status === 'ativo' ? 'Desativar' : 'Ativar'}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
