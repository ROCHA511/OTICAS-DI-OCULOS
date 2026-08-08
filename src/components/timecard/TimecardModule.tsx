import React, { useState, useEffect } from 'react';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  User,
  Lock,
  Calendar,
  DollarSign,
  TrendingUp,
  Plus,
  Printer,
  Download,
  Filter,
  Search,
  Coffee,
  LogOut,
  LogIn,
  Sun,
  ShieldCheck,
  Award,
  ArrowUpRight,
  FileText,
  Trash2,
  Check,
  X
} from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  role: string;
  avatar: string;
  pin: string;
  workloadDaily: number; // ex: 8h
  extraHoursBalance: number; // ex: 14.5 horas
}

interface TimePunch {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  clockIn: string;
  lunchStart?: string;
  lunchEnd?: string;
  clockOut?: string;
  totalHoursWorked: number;
  extraHours: number; // positivo se trabalhou mais que 8h
  status: 'completo' | 'em_andamento' | 'incompleto';
}

interface ExtraHoursWithdrawal {
  id: string;
  employeeId: string;
  employeeName: string;
  dateRequested: string;
  hoursAmount: number;
  type: 'folga_dia' | 'saida_antecipada' | 'pagamento_holerite';
  reason: string;
  status: 'pendente' | 'aprovado' | 'rejeitado';
}

export const TimecardModule: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'terminal' | 'history' | 'extra_hours'>('terminal');

  // Relógio em tempo real
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Lista de Colaboradores com Senhas / PINs de Ponto
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: 'emp_tailane',
      name: 'TAILANE BRITO',
      role: 'Gerente de Unidade',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      pin: '3256',
      workloadDaily: 8,
      extraHoursBalance: 18.0,
    },
    {
      id: 'emp_1',
      name: 'Julia Martins',
      role: 'Vendedora Sênior',
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
      pin: '1234',
      workloadDaily: 8,
      extraHoursBalance: 14.5,
    },
    {
      id: 'emp_2',
      name: 'Carlos Eduardo',
      role: 'Optometrista / Consultor',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
      pin: '2024',
      workloadDaily: 8,
      extraHoursBalance: 8.0,
    },
    {
      id: 'emp_3',
      name: 'Mariana Souza',
      role: 'Atendente Óptica',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      pin: '5555',
      workloadDaily: 8,
      extraHoursBalance: 4.25,
    },
    {
      id: 'emp_4',
      name: 'Dioenne Rocha',
      role: 'Gerente Geral / CEO',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      pin: '9999',
      workloadDaily: 8,
      extraHoursBalance: 22.0,
    },
  ]);

  // Modal Edição de Senha PIN
  const [showEditPinModal, setShowEditPinModal] = useState<boolean>(false);
  const [editingEmpPin, setEditingEmpPin] = useState<{ id: string; name: string; currentPin: string; newPin: string }>({
    id: '',
    name: '',
    currentPin: '',
    newPin: '',
  });

  // Estado do Terminal de Ponto
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>(employees[0].id);
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [pinError, setPinError] = useState<boolean>(false);
  const [punchSuccessMessage, setPunchSuccessMessage] = useState<string | null>(null);

  // Registros de Ponto
  const [punchRecords, setPunchRecords] = useState<TimePunch[]>([
    {
      id: 'p_1',
      employeeId: 'emp_1',
      employeeName: 'Julia Martins',
      date: new Date().toLocaleDateString('pt-BR'),
      clockIn: '08:00:15',
      lunchStart: '12:05:00',
      lunchEnd: '13:02:10',
      clockOut: '18:15:30',
      totalHoursWorked: 9.15,
      extraHours: 1.15,
      status: 'completo',
    },
    {
      id: 'p_2',
      employeeId: 'emp_2',
      employeeName: 'Carlos Eduardo',
      date: new Date().toLocaleDateString('pt-BR'),
      clockIn: '08:10:00',
      lunchStart: '12:00:00',
      lunchEnd: '13:00:00',
      clockOut: undefined,
      totalHoursWorked: 4.8,
      extraHours: 0,
      status: 'em_andamento',
    },
    {
      id: 'p_3',
      employeeId: 'emp_3',
      employeeName: 'Mariana Souza',
      date: new Date().toLocaleDateString('pt-BR'),
      clockIn: '08:02:00',
      lunchStart: '12:10:00',
      lunchEnd: '13:10:00',
      clockOut: '17:02:00',
      totalHoursWorked: 8.0,
      extraHours: 0,
      status: 'completo',
    },
  ]);

  // Retiradas de Horas Extras
  const [withdrawals, setWithdrawals] = useState<ExtraHoursWithdrawal[]>([
    {
      id: 'w_1',
      employeeId: 'emp_1',
      employeeName: 'Julia Martins',
      dateRequested: '05/08/2026',
      hoursAmount: 4.0,
      type: 'saida_antecipada',
      reason: 'Consulta médica à tarde',
      status: 'aprovado',
    },
    {
      id: 'w_2',
      employeeId: 'emp_2',
      employeeName: 'Carlos Eduardo',
      dateRequested: '06/08/2026',
      hoursAmount: 8.0,
      type: 'folga_dia',
      reason: 'Compensação de banco de horas (Sexta-feira)',
      status: 'pendente',
    },
  ]);

  // Modal para Solicitar Retirada
  const [showWithdrawalModal, setShowWithdrawalModal] = useState<boolean>(false);
  const [newWithdrawal, setNewWithdrawal] = useState({
    employeeId: employees[0].id,
    hoursAmount: 4.0,
    type: 'folga_dia' as 'folga_dia' | 'saida_antecipada' | 'pagamento_holerite',
    reason: '',
  });

  const selectedEmployee = employees.find((e) => e.id === selectedEmployeeId) || employees[0];

  // Trata digitação de PIN
  const handleKeypadPress = (digit: string) => {
    if (enteredPin.length < 6) {
      setEnteredPin((prev) => prev + digit);
      setPinError(false);
    }
  };

  const handleKeypadBackspace = () => {
    setEnteredPin((prev) => prev.slice(0, -1));
    setPinError(false);
  };

  const handleKeypadClear = () => {
    setEnteredPin('');
    setPinError(false);
  };

  // Executa Marcação de Ponto
  const handleExecutePunch = (type: 'clockIn' | 'lunchStart' | 'lunchEnd' | 'clockOut') => {
    if (enteredPin !== selectedEmployee.pin) {
      setPinError(true);
      return;
    }

    const nowStr = currentTime.toLocaleTimeString('pt-BR');
    const todayStr = currentTime.toLocaleDateString('pt-BR');

    let existingIndex = punchRecords.findIndex(
      (p) => p.employeeId === selectedEmployee.id && p.date === todayStr
    );

    let updatedRecords = [...punchRecords];
    let typeName = '';

    if (existingIndex >= 0) {
      const currentPunch = { ...updatedRecords[existingIndex] };
      if (type === 'clockIn') {
        currentPunch.clockIn = nowStr;
        typeName = 'Entrada (Início)';
      } else if (type === 'lunchStart') {
        currentPunch.lunchStart = nowStr;
        typeName = 'Saída para Almoço';
      } else if (type === 'lunchEnd') {
        currentPunch.lunchEnd = nowStr;
        typeName = 'Retorno do Almoço';
      } else if (type === 'clockOut') {
        currentPunch.clockOut = nowStr;
        currentPunch.status = 'completo';
        currentPunch.totalHoursWorked = 9.0;
        currentPunch.extraHours = 1.0;
        typeName = 'Saída (Fim de Expediente)';
      }
      updatedRecords[existingIndex] = currentPunch;
    } else {
      const newPunch: TimePunch = {
        id: `p_${Date.now()}`,
        employeeId: selectedEmployee.id,
        employeeName: selectedEmployee.name,
        date: todayStr,
        clockIn: type === 'clockIn' ? nowStr : '08:00:00',
        lunchStart: type === 'lunchStart' ? nowStr : undefined,
        lunchEnd: type === 'lunchEnd' ? nowStr : undefined,
        clockOut: type === 'clockOut' ? nowStr : undefined,
        totalHoursWorked: type === 'clockOut' ? 8.0 : 4.0,
        extraHours: 0,
        status: type === 'clockOut' ? 'completo' : 'em_andamento',
      };
      updatedRecords.unshift(newPunch);
      typeName = type === 'clockIn' ? 'Entrada (Início)' : 'Marcação de Ponto';
    }

    setPunchRecords(updatedRecords);
    setEnteredPin('');
    setPunchSuccessMessage(`✅ Ponto registrado com sucesso! (${selectedEmployee.name} - ${typeName} às ${nowStr})`);

    setTimeout(() => {
      setPunchSuccessMessage(null);
    }, 4500);
  };

  // Trata envio da solicitação de retirada
  const handleCreateWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find((e) => e.id === newWithdrawal.employeeId) || employees[0];
    
    if (newWithdrawal.hoursAmount > emp.extraHoursBalance) {
      alert(`O colaborador ${emp.name} possui apenas ${emp.extraHoursBalance}h acumuladas no Banco de Horas.`);
      return;
    }

    const created: ExtraHoursWithdrawal = {
      id: `w_${Date.now()}`,
      employeeId: emp.id,
      employeeName: emp.name,
      dateRequested: new Date().toLocaleDateString('pt-BR'),
      hoursAmount: Number(newWithdrawal.hoursAmount),
      type: newWithdrawal.type,
      reason: newWithdrawal.reason || 'Compensação de Banco de Horas',
      status: 'pendente',
    };

    setWithdrawals((prev) => [created, ...prev]);
    setShowWithdrawalModal(false);
    setNewWithdrawal({ employeeId: employees[0].id, hoursAmount: 4.0, type: 'folga_dia', reason: '' });
    alert('Solicitação de retirada registrada com sucesso!');
  };

  const handleApproveWithdrawal = (id: string) => {
    setWithdrawals((prev) =>
      prev.map((w) => (w.id === id ? { ...w, status: 'aprovado' } : w))
    );
  };

  const handleRejectWithdrawal = (id: string) => {
    setWithdrawals((prev) =>
      prev.map((w) => (w.id === id ? { ...w, status: 'rejeitado' } : w))
    );
  };

  return (
    <div className="w-full h-full min-h-0 overflow-y-auto bg-[#F0F7FF] p-3 sm:p-6 space-y-6 text-slate-800 font-sans">
      
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-[#071D49] via-[#0B255C] to-[#071D49] p-5 sm:p-6 rounded-3xl border-2 border-[#C9A96E]/50 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-[#C9A96E]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest bg-[#C9A96E] text-[#071D49] px-2.5 py-0.5 rounded-full border border-white/20">
              PONTO ELETRÔNICO & HORAS EXTRAS VIP
            </span>
            <span className="text-xs text-emerald-300 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Controle por Senha Individual
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#E8D2A8] tracking-tight">
            Terminal de Frequência & Banco de Horas
          </h1>
          <p className="text-xs text-slate-200 font-medium">
            Registro com validação por PIN, cálculo de horas extras e módulo de compensação/folgas.
          </p>
        </div>

        {/* Sub-tabs Selection */}
        <div className="relative z-10 flex items-center gap-2 bg-white/10 p-1.5 rounded-2xl border border-white/20 shrink-0">
          <button
            onClick={() => setActiveSubTab('terminal')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeSubTab === 'terminal'
                ? 'bg-[#C9A96E] text-[#071D49] shadow-md'
                : 'text-slate-200 hover:bg-white/10'
            }`}
          >
            Terminal de Ponto
          </button>
          <button
            onClick={() => setActiveSubTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeSubTab === 'history'
                ? 'bg-[#C9A96E] text-[#071D49] shadow-md'
                : 'text-slate-200 hover:bg-white/10'
            }`}
          >
            Espelho de Ponto
          </button>
          <button
            onClick={() => setActiveSubTab('extra_hours')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeSubTab === 'extra_hours'
                ? 'bg-[#C9A96E] text-[#071D49] shadow-md'
                : 'text-slate-200 hover:bg-white/10'
            }`}
          >
            Banco de Extras
          </button>
        </div>
      </div>

      {/* SUCCESS TOAST MESSAGE */}
      {punchSuccessMessage && (
        <div className="bg-emerald-600 text-white p-4 rounded-2xl shadow-xl flex items-center justify-between font-bold text-xs animate-bounce">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>{punchSuccessMessage}</span>
          </div>
          <button onClick={() => setPunchSuccessMessage(null)} className="text-white hover:text-slate-200 font-black">
            ✕
          </button>
        </div>
      )}

      {/* SUBTAB 1: TERMINAL DE REGISTRO DE PONTO */}
      {activeSubTab === 'terminal' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Column Left: Live Clock & Employee Selector */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Live Clock Card */}
            <div className="bg-gradient-to-br from-[#071D49] to-[#0B255C] text-white p-6 rounded-3xl border border-[#C9A96E]/30 shadow-lg text-center space-y-2 relative overflow-hidden">
              <div className="text-xs font-black text-[#C9A96E] uppercase tracking-widest">Hora Oficial de Brasília</div>
              <div className="text-4xl sm:text-5xl font-black text-white font-mono tracking-wider py-1">
                {currentTime.toLocaleTimeString('pt-BR')}
              </div>
              <div className="text-xs font-bold text-slate-300">
                {currentTime.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
              </div>
            </div>

            {/* Select Employee Card */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-xs font-black text-[#071D49] uppercase tracking-wider">
                  1. Selecione o Colaborador
                </h3>
                <button
                  onClick={() => {
                    setEditingEmpPin({
                      id: selectedEmployee.id,
                      name: selectedEmployee.name,
                      currentPin: selectedEmployee.pin,
                      newPin: '',
                    });
                    setShowEditPinModal(true);
                  }}
                  className="px-2.5 py-1 bg-[#F0F7FF] hover:bg-blue-100 text-[#0055A5] font-bold text-[11px] rounded-xl border border-[#0055A5]/30 cursor-pointer transition-all flex items-center gap-1"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Editar Senha ({selectedEmployee.name.split(' ')[0]})</span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {employees.map((emp) => {
                  const isSelected = emp.id === selectedEmployeeId;
                  return (
                    <div
                      key={emp.id}
                      onClick={() => {
                        setSelectedEmployeeId(emp.id);
                        setEnteredPin('');
                        setPinError(false);
                      }}
                      className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-[#0055A5] bg-[#F0F7FF] shadow-md ring-1 ring-[#0055A5]/30'
                          : 'border-slate-200/80 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={emp.avatar}
                          alt={emp.name}
                          className="w-11 h-11 rounded-xl object-cover border-2 border-slate-200"
                        />
                        <div>
                          <h4 className="text-xs font-black text-slate-900">{emp.name}</h4>
                          <p className="text-[11px] text-slate-500 font-semibold">{emp.role}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Banco de Horas</span>
                        <span className="text-xs font-black text-[#0055A5]">+{emp.extraHoursBalance}h</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Column Right: PIN Keypad & Punch Buttons */}
          <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div>
                  <h3 className="text-sm font-black text-[#071D49] uppercase tracking-wider">
                    2. Digite sua Senha Individual de Ponto
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Colaborador Selecionado: <span className="font-bold text-slate-900">{selectedEmployee.name}</span>
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0055A5] flex items-center justify-center font-black">
                  <Lock className="w-5 h-5" />
                </div>
              </div>

              {/* PIN Display */}
              <div className="flex items-center justify-center gap-3 my-4">
                {[0, 1, 2, 3].map((idx) => (
                  <div
                    key={idx}
                    className={`w-12 h-14 rounded-2xl border-2 flex items-center justify-center text-2xl font-black transition-all ${
                      pinError
                        ? 'border-rose-500 bg-rose-50 text-rose-600 animate-shake'
                        : enteredPin.length > idx
                        ? 'border-[#0055A5] bg-[#F0F7FF] text-[#0055A5]'
                        : 'border-slate-200 bg-slate-50 text-slate-400'
                    }`}
                  >
                    {enteredPin.length > idx ? '•' : ''}
                  </div>
                ))}
              </div>

              {pinError && (
                <div className="text-center text-xs font-bold text-rose-600 bg-rose-50 p-2 rounded-xl border border-rose-200">
                  ⚠️ Senha incorreta. Digite o PIN correto do colaborador.
                </div>
              )}

              {/* Numeric Keypad */}
              <div className="grid grid-cols-3 gap-2.5 max-w-xs mx-auto my-4">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                  <button
                    key={digit}
                    onClick={() => handleKeypadPress(digit)}
                    className="h-12 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-900 font-black text-lg rounded-xl transition-all shadow-xs cursor-pointer"
                  >
                    {digit}
                  </button>
                ))}
                <button
                  onClick={handleKeypadClear}
                  className="h-12 bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Limpar
                </button>
                <button
                  onClick={() => handleKeypadPress('0')}
                  className="h-12 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-900 font-black text-lg rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  0
                </button>
                <button
                  onClick={handleKeypadBackspace}
                  className="h-12 bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  ⌫ Apagar
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-4 border-t border-slate-100">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest block text-center">
                3. Selecione o Tipo de Registro
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <button
                  onClick={() => handleExecutePunch('clockIn')}
                  className="py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-2xl shadow-md transition-all flex flex-col items-center justify-center gap-1 active:scale-95 cursor-pointer"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Entrada</span>
                </button>

                <button
                  onClick={() => handleExecutePunch('lunchStart')}
                  className="py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-2xl shadow-md transition-all flex flex-col items-center justify-center gap-1 active:scale-95 cursor-pointer"
                >
                  <Coffee className="w-5 h-5" />
                  <span>Saída Almoço</span>
                </button>

                <button
                  onClick={() => handleExecutePunch('lunchEnd')}
                  className="py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-2xl shadow-md transition-all flex flex-col items-center justify-center gap-1 active:scale-95 cursor-pointer"
                >
                  <Sun className="w-5 h-5" />
                  <span>Volta Almoço</span>
                </button>

                <button
                  onClick={() => handleExecutePunch('clockOut')}
                  className="py-3 bg-[#071D49] hover:bg-[#0B255C] text-[#E8D2A8] font-black text-xs rounded-2xl shadow-md transition-all flex flex-col items-center justify-center gap-1 active:scale-95 cursor-pointer border border-[#C9A96E]/30"
                >
                  <LogOut className="w-5 h-5 text-[#C9A96E]" />
                  <span>Saída</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* SUBTAB 2: ESPELHO DE PONTO ELETRÔNICO */}
      {activeSubTab === 'history' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-black text-[#071D49]">Espelho de Ponto Eletrônico & Frequência</h2>
              <p className="text-xs text-slate-500">
                Histórico detalhado de marcações, cálculo de horas diárias trabalhadas e banco de extras.
              </p>
            </div>

            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-[#0055A5] hover:bg-[#004080] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Espelho de Ponto</span>
            </button>
          </div>

          {/* Records Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-black uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <th className="p-3">Colaborador</th>
                  <th className="p-3">Data</th>
                  <th className="p-3">Entrada</th>
                  <th className="p-3">Almoço (Saída/Volta)</th>
                  <th className="p-3">Saída</th>
                  <th className="p-3 text-center">Horas Trabalhadas</th>
                  <th className="p-3 text-center">Horas Extras</th>
                  <th className="p-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                {punchRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50 transition-all">
                    <td className="p-3 font-black text-slate-900">{rec.employeeName}</td>
                    <td className="p-3 text-slate-600">{rec.date}</td>
                    <td className="p-3 text-emerald-700 font-bold">{rec.clockIn}</td>
                    <td className="p-3 text-amber-700">
                      {rec.lunchStart ? `${rec.lunchStart} - ${rec.lunchEnd || '...'}` : 'Não registrado'}
                    </td>
                    <td className="p-3 text-[#0055A5] font-bold">{rec.clockOut || 'Em andamento...'}</td>
                    <td className="p-3 text-center font-bold">{rec.totalHoursWorked.toFixed(2)}h</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full">
                        +{rec.extraHours.toFixed(2)}h
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          rec.status === 'completo'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {rec.status === 'completo' ? 'Concluído' : 'Em Aberto'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 3: BANCO DE HORAS & RETIRADA DE EXTRAS */}
      {activeSubTab === 'extra_hours' && (
        <div className="space-y-6">
          
          {/* Header Action Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <div>
              <h2 className="text-base font-black text-[#071D49]">Gerenciamento & Solicitador de Horas Extras</h2>
              <p className="text-xs text-slate-500 font-medium">
                Consulte o saldo de banco de horas e registre solicitações de folgas e saídas antecipadas.
              </p>
            </div>

            <button
              onClick={() => setShowWithdrawalModal(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-[#D4AF37] to-amber-500 hover:from-[#E5C158] hover:to-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Solicitar Retirada / Folga</span>
            </button>
          </div>

          {/* Cards for Employees Extra Hours Balances */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {employees.map((emp) => (
              <div key={emp.id} className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center gap-3">
                  <img src={emp.avatar} alt={emp.name} className="w-10 h-10 rounded-xl object-cover border border-slate-200" />
                  <div>
                    <h4 className="text-xs font-black text-slate-900">{emp.name}</h4>
                    <p className="text-[10px] text-slate-500 font-semibold">{emp.role}</p>
                  </div>
                </div>

                <div className="bg-[#F0F7FF] p-3 rounded-2xl border border-[#0055A5]/20 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#0055A5] uppercase">Saldo de Banco</span>
                  <span className="text-base font-black text-[#071D49]">+{emp.extraHoursBalance} horas</span>
                </div>
              </div>
            ))}
          </div>

          {/* Withdrawals List */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
            <h3 className="text-xs font-black text-[#071D49] uppercase tracking-wider border-b border-slate-100 pb-3">
              Histórico de Solicitações de Retiradas / Folgas
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-black uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <th className="p-3">Colaborador</th>
                    <th className="p-3">Data</th>
                    <th className="p-3">Quantidade de Horas</th>
                    <th className="p-3">Tipo de Retirada</th>
                    <th className="p-3">Motivo / Observação</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-right">Ações Gerenciais</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                  {withdrawals.map((w) => (
                    <tr key={w.id} className="hover:bg-slate-50 transition-all">
                      <td className="p-3 font-black text-slate-900">{w.employeeName}</td>
                      <td className="p-3 text-slate-600">{w.dateRequested}</td>
                      <td className="p-3 font-black text-amber-700">{w.hoursAmount} horas</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-full">
                          {w.type === 'folga_dia' ? 'Folga de Dia Inteiro' : w.type === 'saida_antecipada' ? 'Saída Antecipada' : 'Pagamento em Folha'}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600">{w.reason}</td>
                      <td className="p-3 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            w.status === 'aprovado'
                              ? 'bg-emerald-100 text-emerald-800'
                              : w.status === 'rejeitado'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {w.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {w.status === 'pendente' && (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleApproveWithdrawal(w.id)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg cursor-pointer"
                            >
                              Aprovar
                            </button>
                            <button
                              onClick={() => handleRejectWithdrawal(w.id)}
                              className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg cursor-pointer"
                            >
                              Rejeitar
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* WITHDRAWAL MODAL */}
      {showWithdrawalModal && (
        <div className="fixed inset-0 z-[200] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-[#071D49]">Solicitar Retirada de Horas Extras</h3>
              <button
                onClick={() => setShowWithdrawalModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateWithdrawal} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Colaborador</label>
                <select
                  value={newWithdrawal.employeeId}
                  onChange={(e) => setNewWithdrawal({ ...newWithdrawal, employeeId: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
                >
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name} (Saldo: {e.extraHoursBalance}h)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Quantidade de Horas (ex: 4.0)</label>
                <input
                  type="number"
                  step="0.5"
                  required
                  min="0.5"
                  value={newWithdrawal.hoursAmount}
                  onChange={(e) => setNewWithdrawal({ ...newWithdrawal, hoursAmount: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Tipo de Compensação</label>
                <select
                  value={newWithdrawal.type}
                  onChange={(e) => setNewWithdrawal({ ...newWithdrawal, type: e.target.value as any })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
                >
                  <option value="folga_dia">Folga de Dia Inteiro</option>
                  <option value="saida_antecipada">Saída Antecipada / Entrada Tarde</option>
                  <option value="pagamento_holerite">Pagamento em Holerite</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Motivo / Justificativa</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Ex: Saída médica ou folga referente ao trabalho no sábado"
                  value={newWithdrawal.reason}
                  onChange={(e) => setNewWithdrawal({ ...newWithdrawal, reason: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowWithdrawalModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0055A5] text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  Registrar Solicitação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PIN MODAL */}
      {showEditPinModal && (
        <div className="fixed inset-0 z-[200] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-[#071D49]">Alterar Senha do Ponto</h3>
              <button
                onClick={() => setShowEditPinModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!editingEmpPin.newPin || editingEmpPin.newPin.length < 4) {
                  alert('A nova senha deve ter no mínimo 4 dígitos numéricos.');
                  return;
                }
                setEmployees((prev) =>
                  prev.map((emp) =>
                    emp.id === editingEmpPin.id ? { ...emp, pin: editingEmpPin.newPin } : emp
                  )
                );
                setShowEditPinModal(false);
                alert(`Senha de ponto do colaborador "${editingEmpPin.name}" alterada com sucesso! Nova senha: ${editingEmpPin.newPin}`);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-bold text-slate-700 block mb-1">Colaborador</label>
                <input
                  type="text"
                  disabled
                  value={editingEmpPin.name}
                  className="w-full p-2.5 bg-slate-100 border border-slate-300 rounded-xl font-bold text-slate-700"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nova Senha / PIN (4 a 6 dígitos)</label>
                <input
                  type="password"
                  maxLength={6}
                  required
                  placeholder="Ex: 3256"
                  value={editingEmpPin.newPin}
                  onChange={(e) => setEditingEmpPin({ ...editingEmpPin, newPin: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono font-black text-slate-900 text-lg tracking-widest"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditPinModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0055A5] text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  Salvar Nova Senha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
