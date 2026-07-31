import React, { useState } from 'react';
import { Lock, User, ShieldCheck, Sparkles, KeyRound, Building2, Phone } from 'lucide-react';
import { OticasLogo } from './brand/OticasLogo';
import { supabase } from '../utils/supabaseClient';

interface LoginScreenProps {
  onLoginSuccess: (user: { name: string; role: 'ceo' | 'admin' | 'attendant'; phone: string }) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('Dioenne Rocha');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'ceo' | 'admin' | 'attendant'>('ceo');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Integração Real com Supabase se configurado
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: username.includes('@') ? username : `${username.toLowerCase().replace(/\s+/g, '')}@otica.com`,
          password: password,
        });

        if (error) {
          setErrorMsg(`Erro: ${error.message}`);
          return;
        }

        if (data?.user) {
          const { data: perfil } = await supabase
            .from('perfis')
            .select('nome, role, telefone')
            .eq('id', data.user.id)
            .single();

          if (perfil) {
            onLoginSuccess({
              name: perfil.nome,
              role: perfil.role === 'ceo' ? 'ceo' : perfil.role === 'lider' ? 'admin' : 'attendant',
              phone: perfil.telefone || '',
            });
            return;
          }
        }
      } catch (err: any) {
        console.warn("Falha ao comunicar com Supabase Auth. Ativando login simulado.", err);
      }
    }

    // CEO validation (Mock Fallback)
    if (selectedRole === 'ceo') {
      if (password.trim() === 'John Rocha' || password.trim() === 'john rocha') {
        onLoginSuccess({
          name: 'Dioenne Rocha',
          role: 'ceo',
          phone: '(73) 99990-4727',
        });
      } else {
        setErrorMsg('Senha do CEO incorreta. Dica: Digite "John Rocha"');
      }
      return;
    }

    // Default Attendant/Admin login (Mock Fallback)
    if (selectedRole === 'admin') {
      onLoginSuccess({
        name: 'Julia Martins',
        role: 'admin',
        phone: '(73) 98112-8923',
      });
      return;
    }

    if (selectedRole === 'attendant') {
      onLoginSuccess({
        name: username || 'Atendente Óticas Di Óculos',
        role: 'attendant',
        phone: '(73) 98112-8923',
      });
      return;
    }
  };

  const setCeoQuickFill = () => {
    setSelectedRole('ceo');
    setUsername('Dioenne Rocha');
    setPassword('John Rocha');
    setErrorMsg('');
  };

  const setAttendantQuickFill = () => {
    setSelectedRole('admin');
    setUsername('Julia Martins');
    setPassword('123456');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen w-screen bg-[#FDFBF7] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Gold Ambient Lighting */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#C5A880]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#8C6E47]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-white rounded-3xl border-2 border-[#D6C2A5] shadow-[0_20px_50px_rgba(28,24,21,0.15)] overflow-hidden relative z-10 flex flex-col">
        {/* Header Header Banner */}
        <div className="bg-gradient-to-r from-[#071D49] via-[#0B255C] to-[#071D49] p-6 text-center text-white border-b-2 border-[#C9A96E] relative">
          <div className="flex justify-center mb-2">
            <OticasLogo size="xl" variant="light-text" />
          </div>

          <span className="bg-[#C9A96E] text-[#071D49] text-[10px] font-black uppercase px-3 py-0.5 rounded-full tracking-widest inline-block mt-1">
            Sistema Executivo Óptico
          </span>

          <p className="text-[11px] text-[#E8D2A8] font-bold tracking-wide mt-1.5">
            Rua 23 de Abril, 51, Centro • Ituberá - BA
          </p>
        </div>

        {/* Login Form Body */}
        <form onSubmit={handleLogin} className="p-6 space-y-4">
          <div className="text-center">
            <h2 className="text-base font-extrabold text-slate-900">Acesso Restrito ao Sistema</h2>
            <p className="text-xs text-slate-500">Escolha o seu perfil de acesso e insira suas credenciais</p>
          </div>

          {/* Role Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#FAF6F0] rounded-xl border border-[#EAE2D8]">
            <button
              type="button"
              onClick={() => {
                setSelectedRole('ceo');
                setUsername('Dioenne Rocha');
                setPassword('');
                setErrorMsg('');
              }}
              className={`py-2 text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                selectedRole === 'ceo'
                  ? 'bg-[#1C1815] text-[#C5A880] shadow-sm border border-[#C5A880]'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" /> CEO / Direção
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedRole('admin');
                setUsername('Julia Martins');
                setPassword('');
                setErrorMsg('');
              }}
              className={`py-2 text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                selectedRole !== 'ceo'
                  ? 'bg-[#1C1815] text-[#C5A880] shadow-sm border border-[#C5A880]'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5 text-[#C5A880]" /> Atendente / Loja
            </button>
          </div>

          {/* Quick Demo Fill Buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={setCeoQuickFill}
              className="flex-1 py-1.5 px-2 bg-[#F4ECE1] hover:bg-[#EAE2D8] text-[#8C6E47] text-[11px] font-black rounded-xl border border-[#D6C2A5] transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-[#C5A880]" /> Preencher CEO (John Rocha)
            </button>

            <button
              type="button"
              onClick={setAttendantQuickFill}
              className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-xl border border-slate-300 transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <User className="w-3 h-3" /> Preencher Atendente
            </button>
          </div>

          {/* User Input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-[#C5A880]" /> Usuário / Operador:
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-2.5 bg-[#FAF6F0] border border-[#D6C2A5] rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#C5A880]"
              placeholder="Digite seu nome ou usuário"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-[#C5A880]" /> Senha de Acesso:
              </label>
              {selectedRole === 'ceo' && (
                <span className="text-[10px] text-[#8C6E47] font-black">
                  Senha CEO: <code className="bg-[#F4ECE1] px-1 py-0.5 rounded border border-[#D6C2A5]">John Rocha</code>
                </span>
              )}
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={selectedRole === 'ceo'}
                className="w-full p-2.5 bg-[#FAF6F0] border border-[#D6C2A5] rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#C5A880] pr-10"
                placeholder={selectedRole === 'ceo' ? 'Digite: John Rocha' : 'Insira qualquer senha'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <KeyRound className="w-4 h-4 text-[#C5A880]" />
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl text-center">
              {errorMsg}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-[#1C1815] via-[#2A231E] to-[#120F0D] hover:from-[#2A231E] hover:to-[#1C1815] text-[#C5A880] font-black text-sm rounded-xl shadow-lg border border-[#C5A880] transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
          >
            <ShieldCheck className="w-4 h-4 text-[#C5A880]" /> entrar no sistema óticas dióculos
          </button>
        </form>

        {/* Footer info */}
        <div className="p-4 bg-[#FAF6F0] border-t border-[#EAE2D8] text-center text-[10px] text-slate-500 space-y-0.5">
          <div className="flex items-center justify-center gap-1 font-bold text-slate-700">
            <Building2 className="w-3 h-3 text-[#C5A880]" /> Óticas Di Óculos - Matriz (Ituberá - BA)
          </div>
          <div className="flex items-center justify-center gap-1 text-slate-500">
            <Phone className="w-3 h-3 text-[#C5A880]" /> Suporte & CEO WhatsApp: (73) 99990-4727
          </div>
        </div>
      </div>
    </div>
  );
};
