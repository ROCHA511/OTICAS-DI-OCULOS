import React, { useState } from 'react';
import { X, UserPlus, Phone, Calendar, CreditCard, MapPin, Glasses, FileText, CheckCircle2, Sparkles } from 'lucide-react';
import { Client, OpticalPrescription, DnpMeasurement } from '../../types';
import { isFictitiousPhone, formatBrazilianPhone } from '../../utils/phoneValidator';

interface NewClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveClient: (clientData: Partial<Client>) => void;
}

export const NewClientModal: React.FC<NewClientModalProps> = ({
  isOpen,
  onClose,
  onSaveClient,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [cpf, setCpf] = useState('');
  const [address, setAddress] = useState('Rua 23 de Abril, 51, Centro');
  const [city, setCity] = useState('Ituberá - BA');
  const [cep, setCep] = useState('45435-000');
  
  // Optical details
  const [odEsf, setOdEsf] = useState('-2.00');
  const [odCil, setOdCil] = useState('-0.50');
  const [odEixo, setOdEixo] = useState('180');
  const [oeEsf, setOeEsf] = useState('-2.00');
  const [oeCil, setOeCil] = useState('-0.50');
  const [oeEixo, setOeEixo] = useState('175');
  const [dnpOD, setDnpOD] = useState('31.5');
  const [dnpOE, setDnpOE] = useState('31.5');
  const [notes, setNotes] = useState('Cliente cadastrado via balcão / recepção. Prefere armação de acetato leve.');
  const [statusTag, setStatusTag] = useState('Novo Atendimento');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Por favor, informe o nome do cliente.');
      return;
    }

    if (isFictitiousPhone(phone)) {
      alert('Número de telefone fictício, de teste ou inválido. Por favor, insira um número real com DDD brasileiro válido para cadastrar o cliente.');
      return;
    }

    const prescription: OpticalPrescription = {
      od: {
        esferico: parseFloat(odEsf) || 0,
        cilindrico: parseFloat(odCil) || 0,
        eixo: parseInt(odEixo, 10) || 0,
      },
      oe: {
        esferico: parseFloat(oeEsf) || 0,
        cilindrico: parseFloat(oeCil) || 0,
        eixo: parseInt(oeEixo, 10) || 0,
      },
      medicoName: 'Dr. Roberto Rocha (CRM 12847)',
    };

    const dnp: DnpMeasurement = {
      dnpOD: parseFloat(dnpOD) || 31.0,
      dnpOE: parseFloat(dnpOE) || 31.0,
      dpTotal: (parseFloat(dnpOD) || 31.0) + (parseFloat(dnpOE) || 31.0),
      alturaCentroOD: 20,
      alturaCentroOE: 20,
      cardDetected: true,
      confidenceScore: 98,
    };

    const newClientData: Partial<Client> = {
      name,
      phone,
      cpf: cpf || '123.456.789-00',
      birthDate: birthDate || '1992-05-14',
      status: 'active',
      tags: [statusTag, 'Cadastro Presencial'],
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      prescription,
      dnp,
      lastInteraction: 'Agora',
      isAiHandled: true,
      notes: `${notes} | Endereço: ${address}, ${city} - CEP: ${cep}`,
    };

    onSaveClient(newClientData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#FAF8F5] border-2 border-[#C5A059] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[90vh]">
        {/* Header - Azul Celeste & Dourado Elegante */}
        <div className="bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0F2027] text-white p-4 flex items-center justify-between border-b-2 border-[#C5A059]/80 shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#C5A059] text-slate-950 rounded-xl shadow-xs font-bold">
              <UserPlus className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight text-white flex items-center gap-2">
                Novo Cadastro de Cliente
                <span className="bg-[#C5A059] text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  Óticas Di Óculos
                </span>
              </h2>
              <p className="text-[11px] text-sky-100 font-medium">
                Preencha os dados completos do cliente para iniciar o atendimento e gerar orçamentos
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-200 hover:text-white hover:bg-white/10 rounded-full transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* Section 1: Dados Pessoais & Contato */}
          <div className="bg-white p-4 rounded-xl border border-[#C5A059]/30 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-2">
              <UserPlus className="w-4 h-4 text-[#0284C7]" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                1. Dados Pessoais & Contato
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Maria das Graças Silva"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0284C7] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-emerald-600" /> WhatsApp / Telefone *
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(formatBrazilianPhone(e.target.value))}
                  placeholder="(73) 98112-8923"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0284C7] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1 flex items-center gap-1">
                  <CreditCard className="w-3 h-3 text-blue-600" /> CPF do Cliente
                </label>
                <input
                  type="text"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  placeholder="123.456.789-00"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0284C7] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-amber-600" /> Data de Nascimento
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0284C7] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Endereço do Cliente */}
          <div className="bg-white p-4 rounded-xl border border-[#C5A059]/30 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-2">
              <MapPin className="w-4 h-4 text-[#0284C7]" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                2. Endereço e Localização
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">Rua / Logradouro / Número</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Rua 23 de Abril, 51, Centro"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0284C7] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Cidade / UF</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Ituberá - BA"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0284C7] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">CEP</label>
                <input
                  type="text"
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  placeholder="45435-000"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0284C7] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">Status Inicial do Atendimento</label>
                <select
                  value={statusTag}
                  onChange={(e) => setStatusTag(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0284C7] focus:outline-none"
                >
                  <option value="Novo Atendimento">Novo Atendimento (Balcão / Whats)</option>
                  <option value="Orçamento">Orçamento Solicitado</option>
                  <option value="Aguardando Receita">Aguardando Foto de Receita</option>
                  <option value="Em Laboratório">Lentes em Laboratório</option>
                  <option value="Pronto">Óculos Pronto para Retirada</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Grau & DNP Iniciais (Opcional) */}
          <div className="bg-white p-4 rounded-xl border border-[#C5A059]/30 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-2">
              <Glasses className="w-4 h-4 text-[#0284C7]" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                3. Receita Óptica Inicial & DNP
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              {/* OD */}
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200/80 space-y-2">
                <div className="font-black text-blue-900 text-[11px] uppercase tracking-wider border-b border-blue-200 pb-1">
                  Olho Direito (OD)
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <div>
                    <label className="text-[10px] font-bold text-slate-600">Esférico</label>
                    <input
                      type="text"
                      value={odEsf}
                      onChange={(e) => setOdEsf(e.target.value)}
                      className="w-full p-1.5 bg-white border border-slate-300 rounded-lg text-center font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600">Cilíndrico</label>
                    <input
                      type="text"
                      value={odCil}
                      onChange={(e) => setOdCil(e.target.value)}
                      className="w-full p-1.5 bg-white border border-slate-300 rounded-lg text-center font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600">Eixoº</label>
                    <input
                      type="text"
                      value={odEixo}
                      onChange={(e) => setOdEixo(e.target.value)}
                      className="w-full p-1.5 bg-white border border-slate-300 rounded-lg text-center font-mono font-bold"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600">DNP OD (mm)</label>
                  <input
                    type="text"
                    value={dnpOD}
                    onChange={(e) => setDnpOD(e.target.value)}
                    className="w-full p-1.5 bg-white border border-slate-300 rounded-lg text-center font-mono font-bold"
                  />
                </div>
              </div>

              {/* OE */}
              <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-200/80 space-y-2">
                <div className="font-black text-indigo-900 text-[11px] uppercase tracking-wider border-b border-indigo-200 pb-1">
                  Olho Esquerdo (OE)
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <div>
                    <label className="text-[10px] font-bold text-slate-600">Esférico</label>
                    <input
                      type="text"
                      value={oeEsf}
                      onChange={(e) => setOeEsf(e.target.value)}
                      className="w-full p-1.5 bg-white border border-slate-300 rounded-lg text-center font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600">Cilíndrico</label>
                    <input
                      type="text"
                      value={oeCil}
                      onChange={(e) => setOeCil(e.target.value)}
                      className="w-full p-1.5 bg-white border border-slate-300 rounded-lg text-center font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600">Eixoº</label>
                    <input
                      type="text"
                      value={oeEixo}
                      onChange={(e) => setOeEixo(e.target.value)}
                      className="w-full p-1.5 bg-white border border-slate-300 rounded-lg text-center font-mono font-bold"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600">DNP OE (mm)</label>
                  <input
                    type="text"
                    value={dnpOE}
                    onChange={(e) => setDnpOE(e.target.value)}
                    className="w-full p-1.5 bg-white border border-slate-300 rounded-lg text-center font-mono font-bold"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Observações */}
          <div className="bg-white p-4 rounded-xl border border-[#C5A059]/30 shadow-2xs space-y-2">
            <label className="font-bold text-slate-700 block text-xs flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-[#0284C7]" /> Observações do Cliente e Preferências
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Cliente prefere lentes antirreflexo Crizal e armação leve..."
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#0284C7] focus:outline-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0A192F] hover:from-[#0369A1] hover:to-[#0F2027] text-white rounded-xl text-xs font-black shadow-md border border-[#C5A059] flex items-center gap-2 cursor-pointer transition-all"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-300" />
              <span>Cadastrar Cliente Óticas Di Óculos</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
