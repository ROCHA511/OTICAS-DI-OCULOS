import React, { useState } from 'react';
import {
  UserPlus,
  Search,
  Filter,
  Shield,
  Building2,
  Phone,
  Mail,
  Edit2,
  Trash2,
  Lock,
  Unlock,
  Target,
  CheckCircle2,
  XCircle,
  MoreVertical,
  DollarSign
} from 'lucide-react';
import { Seller, UserRole, SellerStatus } from '../../types/sellers';

interface SellersListSubViewProps {
  currentRole: UserRole;
  sellers: Seller[];
  onOpenNewSellerModal: () => void;
  onEditSeller: (seller: Seller) => void;
  onDeleteSeller: (sellerId: string) => void;
  onToggleBlockSeller: (sellerId: string) => void;
}

export const SellersListSubView: React.FC<SellersListSubViewProps> = ({
  currentRole,
  sellers,
  onOpenNewSellerModal,
  onEditSeller,
  onDeleteSeller,
  onToggleBlockSeller,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('TODAS');
  const [selectedStatus, setSelectedStatus] = useState('TODOS');

  const filteredSellers = sellers.filter((seller) => {
    const matchesSearch =
      seller.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.cpf.includes(searchTerm) ||
      seller.roleTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBranch =
      selectedBranch === 'TODAS' || seller.branch === selectedBranch;

    const matchesStatus =
      selectedStatus === 'TODOS' || seller.status === selectedStatus;

    return matchesSearch && matchesBranch && matchesStatus;
  });

  const canManageSellers = currentRole === 'CEO';

  return (
    <div className="space-y-5 animate-fadeIn">
      
      {/* Top Action & Filter Header */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-black text-[#071D49] uppercase tracking-wider flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#C9A96E]" /> Equipe de Vendedores & Consultores Ópticos
          </h2>
          <p className="text-xs text-slate-500">
            Gerenciamento de cadastros, comissões, salários e permissões por filial
          </p>
        </div>

        {canManageSellers && (
          <button
            onClick={onOpenNewSellerModal}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#071D49] hover:bg-[#0B255C] text-[#E8D2A8] font-black text-xs rounded-2xl border-2 border-[#C9A96E] shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shrink-0"
          >
            <UserPlus className="w-4 h-4 text-[#C9A96E]" />
            [ NOVO VENDEDOR ]
          </button>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome, CPF ou cargo..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#071D49]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
            <Filter className="w-3.5 h-3.5" /> Filial:
          </div>
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="p-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
          >
            <option value="TODAS">Todas as Filiais</option>
            <option value="Matriz Ituberá BA">Matriz Ituberá BA</option>
            <option value="Filial Valença">Filial Valença BA</option>
            <option value="Filial Gandu">Filial Gandu BA</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="p-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
          >
            <option value="TODOS">Todos os Status</option>
            <option value="Ativo">Ativo</option>
            <option value="Inativo">Inativo</option>
            <option value="Férias">Férias</option>
            <option value="Afastado">Afastado</option>
          </select>
        </div>
      </div>

      {/* Sellers Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSellers.map((seller) => {
          const isBlocked = seller.status === 'Inativo';
          return (
            <div
              key={seller.id}
              className={`bg-white rounded-3xl border ${
                isBlocked ? 'border-red-200 opacity-75' : 'border-slate-200 hover:border-[#071D49]'
              } shadow-sm p-4 space-y-3 transition-all relative overflow-hidden flex flex-col justify-between`}
            >
              {/* Card Header */}
              <div className="flex items-start gap-3">
                <img
                  src={seller.photo}
                  alt={seller.fullName}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-[#C9A96E] shadow-sm shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md uppercase bg-[#071D49] text-[#E8D2A8]">
                      {seller.role}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        seller.status === 'Ativo'
                          ? 'bg-emerald-100 text-emerald-800'
                          : seller.status === 'Férias'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {seller.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-slate-900 mt-1 truncate">
                    {seller.fullName}
                  </h3>
                  <p className="text-xs font-medium text-slate-500 truncate">
                    {seller.roleTitle}
                  </p>
                  <p className="text-[11px] font-bold text-[#071D49] flex items-center gap-1 mt-0.5">
                    <Building2 className="w-3 h-3 text-[#C9A96E]" /> {seller.branch}
                  </p>
                </div>
              </div>

              {/* Goals & Salary Info */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Meta Mensal:</span>
                  <span className="font-black text-[#071D49]">
                    R$ {seller.monthlyGoal.toLocaleString('pt-BR')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Meta Diária:</span>
                  <span className="font-bold text-slate-800">
                    R$ {seller.dailyGoal.toLocaleString('pt-BR')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Salário Base:</span>
                  <span className="font-bold text-slate-800">
                    R$ {seller.baseSalary.toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-1 text-xs text-slate-600">
                <div className="flex items-center gap-2 truncate">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{seller.whatsapp || seller.phone}</span>
                </div>
                <div className="flex items-center gap-2 truncate">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{seller.email}</span>
                </div>
              </div>

              {/* Actions for CEO */}
              {canManageSellers && (
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onToggleBlockSeller(seller.id)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 cursor-pointer ${
                      isBlocked
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-red-50 text-red-700 hover:bg-red-100'
                    }`}
                  >
                    {isBlocked ? (
                      <>
                        <Unlock className="w-3.5 h-3.5" /> Desbloquear
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" /> Bloquear
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditSeller(seller)}
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all cursor-pointer"
                      title="Editar Vendedor"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteSeller(seller.id)}
                      className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all cursor-pointer"
                      title="Excluir Registro"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
