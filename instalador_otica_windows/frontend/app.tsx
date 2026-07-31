import React, { useState, useEffect } from 'react';

// Estilo de interface moderna e rica para a Ótica Inteligente 2.0
export default function App() {
  const [role, setRole] = useState<'ceo' | 'lider' | 'profissional' | 'cliente'>('ceo');
  const [view, setView] = useState<'dashboard' | 'financeiro' | 'estoque' | 'agenda' | 'ocr'>('dashboard');
  const [clientes, setClientes] = useState<any[]>([]);
  const [produtos, setProdutos] = useState<any[]>([]);

  // Carrega dados iniciais via API (Simulado para resiliência offline)
  useEffect(() => {
    // Em produção, isso bateria em http://localhost:8000/clientes e /produtos
    setClientes([
      { id: '1', nome: 'Mariana Costa', email: 'mariana@email.com', cpf: '123.456.789-00', telefone: '(81) 99876-5432' },
      { id: '2', nome: 'Dioenne Silva', email: 'dioenne@email.com', cpf: '987.654.321-11', telefone: '(81) 99123-4567' }
    ]);
    setProdutos([
      { id: '1', nome: 'Lente Multifocal Varilux Comfort', preco_venda: 890.0, estoque_atual: 15, categoria: 'Lentes' },
      { id: '2', nome: 'Armação Ray-Ban Aviador', preco_venda: 540.0, estoque_atual: 8, categoria: 'Armações' }
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Header Premium com Efeitos Neon */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <span className="text-white font-extrabold text-xl">OI</span>
          </div>
          <div>
            <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Ótica Inteligente</h1>
            <p className="text-xs text-slate-500">Painel de Gestão Integrada v2.0</p>
          </div>
        </div>

        {/* Simulador de Nível de Acesso RLS */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-lg border border-slate-800">
          <span className="text-xs text-slate-400 px-2 font-medium">Nível de Acesso (RLS):</span>
          {(['ceo', 'lider', 'profissional', 'cliente'] as const).map((r) => (
            <button
              key={r}
              onClick={() => {
                setRole(r);
                setView('dashboard');
              }}
              className={`px-3 py-1 text-xs rounded-md font-semibold transition-all ${
                role === r
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/10'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar Lateral */}
        <aside className="w-64 bg-slate-900/20 border-r border-slate-800/80 p-4 flex flex-col gap-2">
          <nav className="flex flex-col gap-1">
            <button
              onClick={() => setView('dashboard')}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${
                view === 'dashboard' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'hover:bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              📊 Geral & Dashboard
            </button>
            {role !== 'cliente' && (
              <>
                <button
                  onClick={() => setView('financeiro')}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${
                    view === 'financeiro' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'hover:bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  💵 Fluxo de Caixa / Vendas
                </button>
                <button
                  onClick={() => setView('estoque')}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${
                    view === 'estoque' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'hover:bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  📦 Controle de Estoque
                </button>
              </>
            )}
            <button
              onClick={() => setView('agenda')}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${
                view === 'agenda' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'hover:bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              📅 Agenda de Consultas
            </button>
            <button
              onClick={() => setView('ocr')}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${
                view === 'ocr' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'hover:bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              🔍 Digitalizar Receita (OCR)
            </button>
          </nav>
          <div className="mt-auto p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-500">
            Logado como: <strong className="text-slate-300">{role.toUpperCase()}</strong>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-8 overflow-y-auto">
          {view === 'dashboard' && (
            <div className="flex flex-col gap-6">
              <h2 className="text-2xl font-bold">Resumo da Ótica</h2>
              
              {/* Cards Informativos Estilizados */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800/80 hover:border-cyan-500/30 transition-all">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Vendas Hoje</p>
                  <p className="text-3xl font-black text-white mt-2">R$ 1.430,00</p>
                  <p className="text-xs text-emerald-400 mt-2">▲ +12% em relação a ontem</p>
                </div>
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800/80 hover:border-cyan-500/30 transition-all">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Consultas Agendadas</p>
                  <p className="text-3xl font-black text-white mt-2">4 Agendamentos</p>
                  <p className="text-xs text-slate-400 mt-2">Hoje: Dra. Mariana Costa</p>
                </div>
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800/80 hover:border-cyan-500/30 transition-all">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Status do Estoque</p>
                  <p className="text-3xl font-black text-white mt-2">120 Itens</p>
                  <p className="text-xs text-amber-500 mt-2">⚠️ 3 itens abaixo do mínimo</p>
                </div>
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800/80 hover:border-cyan-500/30 transition-all">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Comissões Pendentes</p>
                  <p className="text-3xl font-black text-white mt-2">R$ 215,00</p>
                  <p className="text-xs text-cyan-400 mt-2">Profissional logado</p>
                </div>
              </div>

              {/* Tabela de Clientes Auditados */}
              <div className="mt-4 p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
                <h3 className="text-lg font-bold mb-4">Clientes Registrados</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="py-3 px-4">Nome</th>
                        <th className="py-3 px-4">E-mail</th>
                        <th className="py-3 px-4">CPF</th>
                        <th className="py-3 px-4">Telefone</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clientes.map((c) => (
                        <tr key={c.id} className="border-b border-slate-800/50 hover:bg-slate-900/30">
                          <td className="py-3 px-4 font-semibold text-white">{c.nome}</td>
                          <td className="py-3 px-4 text-slate-400">{c.email}</td>
                          <td className="py-3 px-4">{c.cpf}</td>
                          <td className="py-3 px-4 text-slate-400">{c.telefone}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {view === 'financeiro' && role !== 'cliente' && (
            <div className="flex flex-col gap-6">
              <h2 className="text-2xl font-bold">Livro Caixa & Lançamentos</h2>
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-bold text-lg">Caixa Diário: Aberto</h3>
                    <p className="text-xs text-slate-500">Operador: Mariana Costa</p>
                  </div>
                  <button className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 px-4 py-2 rounded-xl text-xs font-bold transition-all">
                    Fechar Caixa do Dia
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <h4 className="font-semibold text-sm mb-3">Registrar Nova Venda</h4>
                    <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
                      <input type="text" placeholder="ID do Cliente" className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500" />
                      <input type="text" placeholder="Valor Total (R$)" className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500" />
                      <button className="bg-cyan-500 text-slate-950 font-bold p-2.5 rounded-lg text-sm transition-all hover:bg-cyan-400">
                        Confirmar Venda e Registrar OS
                      </button>
                    </form>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <h4 className="font-semibold text-sm mb-3">Histórico de Transações</h4>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between text-xs p-2.5 rounded bg-slate-900/50 border border-slate-800/50">
                        <span className="text-emerald-400">🟢 Entrada - Venda OS #1002</span>
                        <strong className="text-slate-200">+ R$ 890,00</strong>
                      </div>
                      <div className="flex items-center justify-between text-xs p-2.5 rounded bg-slate-900/50 border border-slate-800/50">
                        <span className="text-emerald-400">🟢 Entrada - Venda OS #1001</span>
                        <strong className="text-slate-200">+ R$ 540,00</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {view === 'estoque' && role !== 'cliente' && (
            <div className="flex flex-col gap-6">
              <h2 className="text-2xl font-bold">Estoque de Armações e Lentes</h2>
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="py-3 px-4">Nome do Produto</th>
                        <th className="py-3 px-4">Categoria</th>
                        <th className="py-3 px-4">Preço Venda</th>
                        <th className="py-3 px-4">Estoque Atual</th>
                        <th className="py-3 px-4">Ação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {produtos.map((p) => (
                        <tr key={p.id} className="border-b border-slate-800/50 hover:bg-slate-900/30">
                          <td className="py-3 px-4 font-semibold text-white">{p.nome}</td>
                          <td className="py-3 px-4 text-slate-400">{p.categoria}</td>
                          <td className="py-3 px-4">R$ {p.preco_venda.toFixed(2)}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${p.estoque_atual < 10 ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                              {p.estoque_atual} un
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <button className="text-cyan-400 hover:text-cyan-300 text-xs font-bold">Adicionar</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {view === 'agenda' && (
            <div className="flex flex-col gap-6">
              <h2 className="text-2xl font-bold">Consultas e Exames Visuais</h2>
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex flex-col gap-4">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-white">Exame de Refração - Mariana Costa</h4>
                      <p className="text-xs text-slate-500">Data: 31/07/2026 às 14:00 - Dr. Dione</p>
                    </div>
                    <span className="bg-emerald-500/10 text-emerald-400 text-xs px-3 py-1 rounded-full border border-emerald-500/20 font-bold">
                      Confirmado
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-white">Retorno Adaptativo de Lentes - Dioenne Silva</h4>
                      <p className="text-xs text-slate-500">Data: 02/08/2026 às 16:30 - Dr. Dione</p>
                    </div>
                    <span className="bg-cyan-500/10 text-cyan-400 text-xs px-3 py-1 rounded-full border border-cyan-500/20 font-bold">
                      Agendado
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {view === 'ocr' && (
            <div className="flex flex-col gap-6">
              <h2 className="text-2xl font-bold">Processamento de Receitas por OCR</h2>
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800/80">
                <p className="text-sm text-slate-400 mb-4">Escolha a imagem da receita médica do cliente para digitalização dos dados óticos automáticos.</p>
                <div className="p-8 border-2 border-dashed border-slate-800 hover:border-cyan-500/40 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all cursor-pointer">
                  <span className="text-3xl">📷</span>
                  <span className="text-sm font-semibold text-slate-300">Arraste a foto ou clique para fazer upload</span>
                  <span className="text-xs text-slate-500">Formatos aceitos: JPG, PNG, PDF</span>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
