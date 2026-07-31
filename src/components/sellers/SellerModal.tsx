import React, { useState } from 'react';
import {
  X,
  User,
  Shield,
  Building2,
  DollarSign,
  Calendar,
  Lock,
  Mail,
  Phone,
  MessageSquare,
  FileText,
  Target,
  CheckCircle2,
  Upload,
  Plus
} from 'lucide-react';
import { Seller, UserRole, SellerStatus } from '../../types/sellers';

interface SellerModalProps {
  sellerToEdit?: Seller | null;
  onClose: () => void;
  onSave: (sellerData: Seller) => void;
}

export const SellerModal: React.FC<SellerModalProps> = ({
  sellerToEdit,
  onClose,
  onSave,
}) => {
  const [photo, setPhoto] = useState(
    sellerToEdit?.photo ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
  );
  const [fullName, setFullName] = useState(sellerToEdit?.fullName || '');
  const [cpf, setCpf] = useState(sellerToEdit?.cpf || '');
  const [rg, setRg] = useState(sellerToEdit?.rg || '');
  const [phone, setPhone] = useState(sellerToEdit?.phone || '');
  const [whatsapp, setWhatsapp] = useState(sellerToEdit?.whatsapp || '');
  const [email, setEmail] = useState(sellerToEdit?.email || '');
  const [birthDate, setBirthDate] = useState(sellerToEdit?.birthDate || '1995-05-15');
  const [admissionDate, setAdmissionDate] = useState(
    sellerToEdit?.admissionDate || new Date().toISOString().split('T')[0]
  );
  const [roleTitle, setRoleTitle] = useState(
    sellerToEdit?.roleTitle || 'Consultor Óptico'
  );
  const [branch, setBranch] = useState(sellerToEdit?.branch || 'Matriz Ituberá BA');
  const [monthlyGoal, setMonthlyGoal] = useState<number>(sellerToEdit?.monthlyGoal || 30000);
  const [weeklyGoal, setWeeklyGoal] = useState<number>(sellerToEdit?.weeklyGoal || 7500);
  const [dailyGoal, setDailyGoal] = useState<number>(sellerToEdit?.dailyGoal || 1200);
  const [baseSalary, setBaseSalary] = useState<number>(sellerToEdit?.baseSalary || 2000);
  const [status, setStatus] = useState<SellerStatus>(sellerToEdit?.status || 'Ativo');
  const [login, setLogin] = useState(sellerToEdit?.login || '');
  const [password, setPassword] = useState('123456');
  const [role, setRole] = useState<UserRole>(sellerToEdit?.role || 'VENDEDOR');
  const [notes, setNotes] = useState(sellerToEdit?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !cpf) return;

    const newSeller: Seller = {
      id: sellerToEdit ? sellerToEdit.id : `sel_${Date.now()}`,
      photo,
      fullName,
      cpf,
      rg,
      phone,
      whatsapp,
      email,
      birthDate,
      admissionDate,
      roleTitle,
      branch,
      monthlyGoal: Number(monthlyGoal),
      weeklyGoal: Number(weeklyGoal),
      dailyGoal: Number(dailyGoal),
      baseSalary: Number(baseSalary),
      status,
      login: login || fullName.toLowerCase().replace(/\s+/g, '.'),
      role,
      notes,
      createdAt: sellerToEdit ? sellerToEdit.createdAt : new Date().toISOString(),
    };

    onSave(newSeller);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#071D49]/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto font-sans">
      <div className="bg-white w-full max-w-4xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-auto animate-fadeIn">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#071D49] via-[#0B255C] to-[#071D49] p-4 sm:p-5 border-b border-[#C9A96E]/40 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#C9A96E]/20 border border-[#C9A96E]/50 rounded-2xl text-[#E8D2A8]">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#E8D2A8] uppercase tracking-wider flex items-center gap-2">
                {sellerToEdit ? 'Editar Vendedor' : '[ NOVO VENDEDOR ] - Cadastro ERP'}
              </h2>
              <p className="text-xs text-slate-300">
                Lançamento completo de perfil, metas, salários, acessos e permissões de vendas
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-full transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 max-h-[78vh] overflow-y-auto space-y-5">
          
          {/* Avatar / Photo Selection */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
            <img
              src={photo}
              alt={fullName || 'Avatar'}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-[#C9A96E] shadow-md shrink-0"
            />
            <div className="space-y-1.5 flex-1 w-full">
              <label className="text-[11px] font-extrabold text-slate-700 uppercase block">
                URL da Foto do Vendedor
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={photo}
                  onChange={(e) => setPhoto(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#071D49]"
                  placeholder="https://..."
                />
              </div>
              <p className="text-[10px] text-slate-500">
                Insira o link da foto de perfil do funcionário para identificação nos rankings e metas.
              </p>
            </div>
          </div>

          {/* Personal Info Grid */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-[#071D49] uppercase tracking-wider border-b pb-1 flex items-center gap-1.5">
              <User className="w-4 h-4 text-[#C9A96E]" /> Informações Pessoais & Contato
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="text-[11px] font-extrabold text-slate-700 uppercase block mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="Ex: Mariana Oliveira Souza"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#071D49]"
                />
              </div>

              <div>
                <label className="text-[11px] font-extrabold text-slate-700 uppercase block mb-1">
                  CPF *
                </label>
                <input
                  type="text"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  required
                  placeholder="000.000.000-00"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-[11px] font-extrabold text-slate-700 uppercase block mb-1">
                  RG
                </label>
                <input
                  type="text"
                  value={rg}
                  onChange={(e) => setRg(e.target.value)}
                  placeholder="00.000.000-SSP"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-800"
                />
              </div>

              <div>
                <label className="text-[11px] font-extrabold text-slate-700 uppercase block mb-1">
                  Telefone
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(73) 90000-0000"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="text-[11px] font-extrabold text-slate-700 uppercase block mb-1">
                  WhatsApp
                </label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="(73) 90000-0000"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="text-[11px] font-extrabold text-slate-700 uppercase block mb-1">
                  Data de Nascimento
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Professional & Branch Info */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-[#071D49] uppercase tracking-wider border-b pb-1 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-[#C9A96E]" /> Dados Profissionais & Filial
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-[11px] font-extrabold text-slate-700 uppercase block mb-1">
                  Cargo / Função
                </label>
                <input
                  type="text"
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  placeholder="Consultor Óptico"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="text-[11px] font-extrabold text-slate-700 uppercase block mb-1">
                  Filial (Unidade)
                </label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                >
                  <option value="Matriz Ituberá BA">Matriz Ituberá BA</option>
                  <option value="Filial Valença">Filial Valença BA</option>
                  <option value="Filial Gandu">Filial Gandu BA</option>
                  <option value="Todas as Filiais">Todas as Filiais (Rede)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-extrabold text-slate-700 uppercase block mb-1">
                  Data de Admissão
                </label>
                <input
                  type="date"
                  value={admissionDate}
                  onChange={(e) => setAdmissionDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="text-[11px] font-extrabold text-slate-700 uppercase block mb-1">
                  Status do Vendedor
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as SellerStatus)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                >
                  <option value="Ativo">Ativo (Vendendo)</option>
                  <option value="Inativo">Inativo</option>
                  <option value="Férias">Em Férias</option>
                  <option value="Afastado">Afastado</option>
                </select>
              </div>
            </div>
          </div>

          {/* Goals & Base Salary */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-[#071D49] uppercase tracking-wider border-b pb-1 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-[#C9A96E]" /> Metas de Vendas & Salário Base
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-[11px] font-extrabold text-slate-700 uppercase block mb-1">
                  Salário Base (R$)
                </label>
                <input
                  type="number"
                  step="50"
                  value={baseSalary}
                  onChange={(e) => setBaseSalary(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="text-[11px] font-extrabold text-slate-700 uppercase block mb-1">
                  Meta Mensal (R$)
                </label>
                <input
                  type="number"
                  step="500"
                  value={monthlyGoal}
                  onChange={(e) => {
                    const m = Number(e.target.value);
                    setMonthlyGoal(m);
                    setWeeklyGoal(Math.round(m / 4));
                    setDailyGoal(Math.round(m / 25));
                  }}
                  className="w-full p-2.5 bg-amber-50 border border-amber-300 font-black text-amber-900 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-extrabold text-slate-700 uppercase block mb-1">
                  Meta Semanal (R$)
                </label>
                <input
                  type="number"
                  value={weeklyGoal}
                  onChange={(e) => setWeeklyGoal(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="text-[11px] font-extrabold text-slate-700 uppercase block mb-1">
                  Meta Diária (R$)
                </label>
                <input
                  type="number"
                  value={dailyGoal}
                  onChange={(e) => setDailyGoal(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Access Credentials & Role Level */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-[#071D49] uppercase tracking-wider border-b pb-1 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-[#C9A96E]" /> Credenciais de Login & Nível de Acesso (Perfil)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-[11px] font-extrabold text-slate-700 uppercase block mb-1">
                  E-mail do Sistema
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vendedor@dioculos.com.br"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="text-[11px] font-extrabold text-slate-700 uppercase block mb-1">
                  Login de Usuário
                </label>
                <input
                  type="text"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  placeholder="nome.sobrenome"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="text-[11px] font-extrabold text-slate-700 uppercase block mb-1">
                  Senha do Painel
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="text-[11px] font-extrabold text-slate-700 uppercase block mb-1">
                  Perfil de Permissão *
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full p-2.5 bg-[#071D49] text-[#E8D2A8] font-black rounded-xl text-xs border border-[#C9A96E]"
                >
                  <option value="VENDEDOR">VENDEDOR (Ver apenas suas vendas)</option>
                  <option value="GERENTE">GERENTE (Ver equipe e filial)</option>
                  <option value="CEO">CEO (Acesso Total + Comissões)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#071D49] hover:bg-[#0B255C] text-[#E8D2A8] font-black text-xs rounded-xl border border-[#C9A96E] shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4 text-[#C9A96E]" />
              {sellerToEdit ? 'Salvar Alterações' : 'Cadastrar Vendedor no ERP'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
