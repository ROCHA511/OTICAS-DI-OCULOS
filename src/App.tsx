import React, { useState } from 'react';
import { ArrowLeft, Home, FileText, MessageSquare, Users, Menu } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { ExecutiveMetricBar } from './components/ExecutiveMetricBar';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { ChatLayout } from './components/chat/ChatLayout';
import { ServiceOrdersView } from './components/os/ServiceOrdersView';
import { LabTrackingView } from './components/lab/LabTrackingView';
import { CatalogView } from './components/catalog/CatalogView';
import { AiSettingsView } from './components/ai/AiSettingsView';
import { ExecutiveDashboardView } from './components/dashboard/ExecutiveDashboardView';
import { EnterpriseNewsView } from './components/dashboard/EnterpriseNewsView';
import { ClientsCrmView } from './components/crm/ClientsCrmView';
import { CameraAiScannerView } from './components/ai/CameraAiScannerView';
import { PriceTableView } from './components/catalog/PriceTableView';
import { NewClientModal } from './components/chat/NewClientModal';
import { AiQuotesSalesView } from './components/ai/AiQuotesSalesView';
import { AiConsultantModal } from './components/ai/AiConsultantModal';
import { CashFlowView } from './components/cashflow/CashFlowView';
import { LoginScreen } from './components/LoginScreen';
import { RegisterProfessionalModal } from './components/crm/RegisterProfessionalModal';
import { ShareTeamModal } from './components/ShareTeamModal';
import { SmartOSWizard } from './components/os/SmartOSWizard';
import { SellersModule } from './components/sellers/SellersModule';
import { QuickSearchModal } from './components/QuickSearchModal';
import { QuickActionBar } from './components/QuickActionBar';
import { SaaSPlanGateModal } from './components/saas/SaaSPlanGateModal';
import { SaaSAdminView } from './components/saas/SaaSAdminView';
import { SaaSOnboardingView } from './components/saas/SaaSOnboardingView';
import { PwaInstallPromptModal } from './components/pwa/PwaInstallPromptModal';
import {
  loadClientsFromSupabase,
  saveClientToSupabase,
  loadProductsFromSupabase,
  saveProductToSupabase,
  loadOrdersFromSupabase,
  saveOrderToSupabase,
  loadCashflowFromSupabase,
  saveTransactionToSupabase,
  ensureUUID
} from './utils/supabaseSync';
import { supabase } from './utils/supabaseClient';

import {
  initialClients,
  initialFrames,
  initialLenses,
  initialServiceOrders,
  initialCashFlow,
  initialCashClosings,
  initialAiSettings,
  initialChatMessages,
  initialAiQuotes,
  initialProfessionals,
} from './data/mockData';

import {
  Client,
  ChatMessage,
  OpticalPrescription,
  DnpMeasurement,
  Frame,
  Lens,
  ServiceOrder,
  CashFlowEntry,
  CashClosing,
  AiSettings,
  AiQuote,
  Professional,
} from './types';

export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    role: 'ceo' | 'admin' | 'attendant';
    phone: string;
  } | null>({
    name: 'Dioenne Rocha',
    role: 'ceo',
    phone: '(73) 99990-4727',
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('chat');
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [selectedClientId, setSelectedClientId] = useState<string>('c1');
  const [messagesMap, setMessagesMap] = useState<Record<string, ChatMessage[]>>(initialChatMessages);
  const [frames, setFrames] = useState<Frame[]>(initialFrames);
  const [lenses, setLenses] = useState<Lens[]>(initialLenses);
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>(initialServiceOrders);
  const [aiQuotes, setAiQuotes] = useState<AiQuote[]>(initialAiQuotes);
  const [cashFlow, setCashFlow] = useState<CashFlowEntry[]>(initialCashFlow);
  const [closings, setClosings] = useState<CashClosing[]>(initialCashClosings);
  const [aiSettings, setAiSettings] = useState<AiSettings>(initialAiSettings);
  const [professionals, setProfessionals] = useState<Professional[]>(initialProfessionals);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  const [isAiConsultantOpen, setIsAiConsultantOpen] = useState(false);
  const [isProfessionalsModalOpen, setIsProfessionalsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSmartOSWizardOpen, setIsSmartOSWizardOpen] = useState(false);
  const [isQuickSearchOpen, setIsQuickSearchOpen] = useState(false);
  const [subscription, setSubscription] = useState<{
    plan: 'trial' | 'basico' | 'promax';
    status: string;
    daysRemainingInTrial: number;
    isExpired: boolean;
  } | null>(null);
  const [isPlanGateOpen, setIsPlanGateOpen] = useState(false);

  // Hook de sincronização de dados com as APIs reais do backend (Supabase)
  React.useEffect(() => {
    async function loadData() {
      // 1. Carrega Clientes
      const cliData = await loadClientsFromSupabase(initialClients);
      setClients(cliData);

      // 2. Carrega Catálogo (Produtos & Lentes)
      const prodData = await loadProductsFromSupabase(initialFrames, initialLenses);
      setFrames(prodData.frames);
      setLenses(prodData.lenses);

      // 3. Carrega Ordens de Serviço (Vendas)
      const ordersData = await loadOrdersFromSupabase(initialServiceOrders);
      setServiceOrders(ordersData);

      // 4. Carrega Fluxo de Caixa
      const flowData = await loadCashflowFromSupabase(initialCashFlow);
      setCashFlow(flowData);
    }
    loadData();
  }, []);

  // Sincronização do status de assinatura SaaS com Mercado Pago
  React.useEffect(() => {
    if (currentUser) {
      const userEmail = currentUser.role === 'ceo' ? 'dioenne@otica.com' : 'contato@otica.com';
      fetch(`/api/payments/subscription?email=${encodeURIComponent(userEmail)}`)
        .then(res => {
          if (!res.ok) throw new Error('Erro na API de Assinatura');
          return res.json();
        })
        .then(data => {
          setSubscription(data);
          if (data.isExpired) {
            setIsPlanGateOpen(true);
          }
        })
        .catch(err => {
          console.warn("Erro ao buscar plano SaaS (Vite server offline):", err);
          // Fallback seguro em desenvolvimento caso offline
          setSubscription({
            plan: 'trial',
            status: 'trialing',
            daysRemainingInTrial: 3,
            isExpired: false
          });
        });
    }
  }, [currentUser]);

  const handleTabChange = (tab: ActiveTab) => {
    if (tab === 'saas-admin') {
      setActiveTab(tab);
      return;
    }

    if (subscription?.isExpired) {
      setIsPlanGateOpen(true);
      return;
    }

    if (subscription?.plan === 'basico') {
      const proTabs: ActiveTab[] = ['chat', 'camera', 'ai-settings'];
      if (proTabs.includes(tab)) {
        alert("O Agente de Atendimento IA no WhatsApp e as ferramentas avançadas são exclusivos do Plano Pro Max.");
        setIsPlanGateOpen(true);
        return;
      }
    }

    setActiveTab(tab);
  };

  const handleOpenSmartOSWizard = () => {
    if (subscription?.isExpired) {
      setIsPlanGateOpen(true);
      return;
    }
    if (subscription?.plan === 'basico') {
      alert("O Laboratório Inteligente (Smart OS 12 Etapas) é exclusivo do Plano Pro Max.");
      setIsPlanGateOpen(true);
      return;
    }
    setIsSmartOSWizardOpen(true);
  };

  const handleAddProfessional = (newProf: Professional) => {
    setProfessionals((prev) => [newProf, ...prev]);
  };

  const handleToggleProfessionalStatus = (id: string) => {
    setProfessionals((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: p.status === 'ativo' ? 'inativo' : 'ativo' } : p))
    );
  };

  const currentClient = clients.find((c) => c.id === selectedClientId) || clients[0];
  const currentMessages = (messagesMap[selectedClientId] && messagesMap[selectedClientId].length > 0)
    ? messagesMap[selectedClientId]
    : [
        {
          id: `default_${selectedClientId}`,
          clientId: selectedClientId,
          sender: 'customer' as const,
          text: currentClient?.notes || 'Olá! Gostaria de ajuda com meu orçamento e lentes.',
          timestamp: currentClient?.lastInteraction || '10:32 AM',
        },
      ];
  const currentOS = serviceOrders.find((os) => os.clientId === selectedClientId);

  // Total sales calculation for Navbar & Metrics
  const totalTodaySales = cashFlow
    .filter((c) => c.type === 'entrada')
    .reduce((sum, c) => sum + c.amount, 0);

  const unreadCountTotal = clients.reduce((sum, c) => sum + c.unreadCount, 0);
  const inLabCount = serviceOrders.filter((os) => os.status === 'no_laboratorio').length;

  // 1. Send Message Handler with AI Integration
  const handleSendMessage = async (
    text: string,
    mediaUrl?: string,
    mediaType?: 'image' | 'pdf'
  ) => {
    const newMsg: ChatMessage = {
      id: `m_${Date.now()}`,
      clientId: selectedClientId,
      sender: 'operator',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mediaUrl,
      mediaType,
    };

    setMessagesMap((prev) => ({
      ...prev,
      [selectedClientId]: [...(prev[selectedClientId] || []), newMsg],
    }));

    // If AI is active for this client, trigger Gemini Chat Endpoint
    if (currentClient.isAiHandled) {
      setIsGeneratingAi(true);
      try {
        const response = await fetch('/api/gemini/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            clientInfo: currentClient,
            history: messagesMap[selectedClientId] || [],
            catalog: { frames, lenses },
          }),
        });
        const data = await response.json();

        const aiMsg: ChatMessage = {
          id: `m_ai_${Date.now()}`,
          clientId: selectedClientId,
          sender: 'ai',
          text: data.text || 'Olá! Sou Mary da Óticas Di Óculos. Como posso ajudar com suas lentes e armação? 👓',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessagesMap((prev) => ({
          ...prev,
          [selectedClientId]: [...(prev[selectedClientId] || []), aiMsg],
        }));
      } catch (error) {
        console.error('Error fetching AI response:', error);
      } finally {
        setIsGeneratingAi(false);
      }
    }
  };

  // 2. Toggle AI Control
  const handleToggleAiControl = (clientId: string) => {
    setClients((prev) =>
      prev.map((c) => (c.id === clientId ? { ...c, isAiHandled: !c.isAiHandled } : c))
    );
  };

  // 3. Generate AI Suggestion
  const handleGenerateAiSuggestion = async () => {
    setIsGeneratingAi(true);
    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Por favor sugira uma resposta educada dando as boas vindas e tirando dúvidas de orçamentos e DNP.',
          clientInfo: currentClient,
          history: currentMessages,
          catalog: { frames, lenses },
        }),
      });
      const data = await response.json();

      const aiMsg: ChatMessage = {
        id: `m_ai_${Date.now()}`,
        clientId: selectedClientId,
        sender: 'ai',
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessagesMap((prev) => ({
        ...prev,
        [selectedClientId]: [...(prev[selectedClientId] || []), aiMsg],
      }));
    } catch (err) {
      console.error('Error generating AI suggestion:', err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // 4. Quick Action Shortcuts Handler
  const handleSelectQuickAction = async (actionType: 'pix' | 'dnp_request' | 'recipe_request' | 'catalog') => {
    if (actionType === 'recipe_request') {
      handleSendMessage(
        '📄 Por favor, nos envie uma foto clara da sua receita médica de óculos para que nossa Inteligência Artificial possa extrair os graus e indicar as melhores lentes!'
      );
    } else if (actionType === 'dnp_request') {
      handleSendMessage(
        '📏 Para medir a Distância Naso-Pupilar (DNP) e centro óptico com precisão, envie uma foto do seu rosto segurando um cartão de crédito padrão (85.6mm) abaixo do nariz ou na testa!'
      );
    } else if (actionType === 'pix') {
      const selectedFrame = frames.find((f) => f.id === (currentClient.selectedFrameId || 'f1')) || frames[0];
      const selectedLens = lenses.find((l) => l.id === (currentClient.selectedLensId || 'l1')) || lenses[0];
      const total = (selectedFrame.price + selectedLens.price) * 0.9;

      try {
        const res = await fetch('/api/payment/generate-pix', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            osId: currentOS?.osNumber || 'OS-2026-999',
            amount: total,
            clientName: currentClient.name,
          }),
        });
        const pixData = await res.json();

        handleSendMessage(
          `💳 **CHAVE PIX PARA PAGAMENTO**\n• **Valor Total:** R$ ${total.toFixed(2)}\n• **Chave Pix CNPJ:** ${
            aiSettings.pixKey
          }\n• **Copia e Cola:** \`${pixData.pixCode}\`\n\nAssim que efetuar o pagamento, conferimos na hora e geramos sua Nota de Serviço NFC-e!`
        );
      } catch (err) {
        handleSendMessage(`💳 **Chave Pix CNPJ:** ${aiSettings.pixKey}`);
      }
    } else if (actionType === 'catalog') {
      handleSendMessage(
        `👓 **Modelos de Armações em Destaque:**\n1. Ray-Ban Clubmaster Classic (R$ 680,00)\n2. Oakley Pitchman Titânio (R$ 890,00)\n3. Vogue Cat-Eye Elegance (R$ 450,00)\n4. TR90 Clip-On 2em1 (R$ 380,00)\n\nQual delas combina mais com o seu estilo?`
      );
    }
  };

  // 5. Update Client Optical Prescription
  const handleUpdateClientPrescription = (clientId: string, rx: OpticalPrescription) => {
    setClients((prev) =>
      prev.map((c) => (c.id === clientId ? { ...c, prescription: rx } : c))
    );
  };

  // 6. Update Client DNP
  const handleUpdateClientDnp = (clientId: string, dnp: DnpMeasurement) => {
    setClients((prev) =>
      prev.map((c) => (c.id === clientId ? { ...c, dnp } : c))
    );
  };

  // 7. Select Frame and Lens
  const handleSelectFrameAndLens = (clientId: string, frameId: string, lensId: string) => {
    setClients((prev) =>
      prev.map((c) =>
        c.id === clientId ? { ...c, selectedFrameId: frameId, selectedLensId: lensId } : c
      )
    );
  };

  // 8. Create Service Order
  const handleCreateServiceOrder = async (client: Client) => {
    const selectedFrame = frames.find((f) => f.id === (client.selectedFrameId || 'f1')) || frames[0];
    const selectedLens = lenses.find((l) => l.id === (client.selectedLensId || 'l1')) || lenses[0];

    const framePrice = selectedFrame.price;
    const lensPrice = selectedLens.price;
    const discount = (framePrice + lensPrice) * 0.10;
    const totalValue = framePrice + lensPrice - discount;
    const osNumber = `OS-2026-${Math.floor(100 + Math.random() * 900)}`;

    try {
      const res = await fetch('/api/payment/generate-pix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          osId: osNumber,
          amount: totalValue,
          clientName: client.name,
        }),
      });
      const pixData = await res.json();

      const newOS: ServiceOrder = {
        id: `os_${Date.now()}`,
        osNumber,
        clientId: client.id,
        clientName: client.name,
        clientCPF: client.cpf || '000.000.000-00',
        clientPhone: client.phone,
        prescription: client.prescription || {
          od: { esferico: -2.0, cilindrico: 0, eixo: 0 },
          oe: { esferico: -2.0, cilindrico: 0, eixo: 0 },
        },
        dnp: client.dnp || {
          dnpOD: 31.0,
          dnpOE: 31.0,
          dpTotal: 62.0,
          alturaCentroOD: 20,
          alturaCentroOE: 20,
          cardDetected: true,
          confidenceScore: 90,
        },
        frame: selectedFrame,
        lens: selectedLens,
        framePrice,
        lensPrice,
        discount,
        totalValue,
        status: 'aguardando_pagamento',
        pixCode: pixData.pixCode,
        createdAt: new Date().toLocaleString('pt-BR'),
        ceoNotified: false,
        ceoApprovalNeeded: totalValue > aiSettings.ceoApprovalThreshold,
      };

      let savedOS = newOS;
      try {
        savedOS = await saveOrderToSupabase(newOS);
      } catch (err) {
        console.warn('Erro ao salvar OS no Supabase:', err);
      }

      setServiceOrders((prev) => [savedOS, ...prev]);

      handleSendMessage(
        `📝 **ORDEM DE SERVIÇO ${osNumber} GERADA COM SUCESSO!**\n• **Armação:** ${selectedFrame.brand} ${selectedFrame.model}\n• **Lente:** ${selectedLens.brand} ${selectedLens.name}\n• **Valor Total:** R$ ${totalValue.toFixed(
          2
        )}\n\nAguardando pagamento via Pix para envio imediato ao laboratório!`
      );
    } catch (err) {
      console.error('Error creating OS:', err);
    }
  };

  // 9. Confirm Pix Payment
  const handleConfirmPixPayment = async (osId: string) => {
    const os = serviceOrders.find((o) => o.id === osId || o.osNumber === osId);
    if (!os) return;

    try {
      const res = await fetch('/api/payment/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          osId: os.osNumber,
          amount: os.totalValue,
          clientName: os.clientName,
        }),
      });
      const data = await res.json();

      const updatedOS = { 
        ...os, 
        status: 'no_laboratorio' as const, 
        nfceNumber: data.nfceNumber, 
        ceoNotified: true 
      };

      try {
        await saveOrderToSupabase(updatedOS);
      } catch (err) {
        console.warn('Erro ao atualizar OS no Supabase:', err);
      }

      setServiceOrders((prev) =>
        prev.map((o) => o.id === os.id ? updatedOS : o)
      );

      let newCashFlow: CashFlowEntry = {
        id: `cf_${Date.now()}`,
        empresa: 'Óticas Di Óculos Prime',
        filial: 'Matriz Centro',
        usuario: 'Julia Martins',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('pt-BR', { hour12: false }),
        type: 'entrada',
        category: 'Recebimento OS',
        description: `Pagamento Pix recebido para ${os.osNumber} - ${os.clientName}`,
        paymentMethod: 'Pix',
        entrada: os.totalValue,
        saida: 0,
        amount: os.totalValue,
        saldo: 0,
        status: 'confirmado',
        osId: os.osNumber,
        clientName: os.clientName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      try {
        newCashFlow = await saveTransactionToSupabase(newCashFlow);
      } catch (err) {
        console.warn('Erro ao salvar transação no Supabase:', err);
      }

      setCashFlow((prev) => [newCashFlow, ...prev]);

      handleSendMessage(
        `✅ **PAGAMENTO PIX CONFIRMADO!**\nNFC-e ${data.nfceNumber} emitida com sucesso. CEO Dioenne Rocha foi notificado e os óculos foram encaminhados ao laboratório.`
      );
    } catch (err) {
      console.error('Failed to confirm payment:', err);
    }
  };

  // 10. Add New Client Modal Trigger
  const handleAddNewClient = () => {
    setIsNewClientModalOpen(true);
  };

  const handleSaveNewClient = async (clientData: Partial<Client>) => {
    const newId = `c_${Date.now()}`;
    let newClient: Client = {
      id: newId,
      name: clientData.name || 'Novo Cliente',
      phone: clientData.phone || '(73) 98112-8923',
      cpf: clientData.cpf || '123.456.789-00',
      birthDate: clientData.birthDate || '1992-05-14',
      status: 'active',
      isAiHandled: true,
      lastInteraction: 'Agora',
      unreadCount: 0,
      tags: clientData.tags || ['Novo Atendimento', 'Cadastro Presencial'],
      avatar: clientData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      prescription: clientData.prescription,
      dnp: clientData.dnp,
      notes: clientData.notes,
    };

    try {
      newClient = await saveClientToSupabase(newClient);
    } catch (err) {
      console.warn('Erro ao salvar no Supabase, mantendo dados locais:', err);
    }

    setClients((prev) => [newClient, ...prev]);
    setMessagesMap((prev) => ({
      ...prev,
      [newClient.id]: [
        {
          id: `m_welcome_${Date.now()}`,
          clientId: newClient.id,
          sender: 'assistant',
          text: `Olá ${newClient.name}! Seu cadastro foi realizado com sucesso nas Óticas Di Óculos. Como posso te ajudar hoje?`,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    }));
    setSelectedClientId(newClient.id);
  };

  // Intercepta convite exclusivo de auto-onboarding SaaS do cliente final
  const queryParams = new URLSearchParams(window.location.search);
  const isAutoOnboarding = queryParams.get('saas') === 'true' && queryParams.get('onboarding') === 'true';

  if (isAutoOnboarding) {
    return <SaaSOnboardingView />;
  }

  if (!currentUser) {
    return (
      <LoginScreen
        onLoginSuccess={(user) => {
          setCurrentUser(user);
        }}
      />
    );
  }

  return (
    <div className="h-screen h-[100dvh] max-h-screen w-screen max-w-full bg-[#FDFBF7] flex flex-col font-sans antialiased text-slate-800 overflow-hidden box-border relative">
      {/* Top Header Group - Guaranteed to never collapse on mobile viewports */}
      <div className="shrink-0 w-full flex flex-col z-50">
        <Navbar
          aiSettings={aiSettings}
          setAiSettings={setAiSettings}
          totalTodaySales={totalTodaySales}
          activeChatsCount={clients.length}
          currentUser={currentUser}
          onLogout={() => setCurrentUser(null)}
          onOpenProfessionalsModal={() => setIsProfessionalsModalOpen(true)}
          onOpenShareModal={() => setIsShareModalOpen(true)}
          onNavigateTab={handleTabChange}
          onOpenQuickSearch={() => setIsQuickSearchOpen(true)}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

        <ExecutiveMetricBar
          orders={serviceOrders}
          cashFlow={cashFlow}
          clients={clients}
          onOpenNews={() => handleTabChange('news')}
        />
      </div>

      {/* Main Body with Sidebar + Active View */}
      <div className="flex-1 flex flex-row overflow-hidden min-h-0 min-w-0 w-full max-w-full box-border">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          unreadCountTotal={unreadCountTotal}
          inLabCount={inLabCount}
          onLogout={() => setCurrentUser(null)}
          onOpenSmartOSWizard={handleOpenSmartOSWizard}
          isMobileOpen={isMobileMenuOpen}
          setIsMobileOpen={setIsMobileMenuOpen}
          userRole={currentUser?.role}
        />

        <main className="flex-1 min-w-0 h-full overflow-hidden flex flex-col box-border pb-14 sm:pb-0">
          {activeTab !== 'dashboard' && (
            <div className="bg-gradient-to-r from-[#071D49] via-[#0B255C] to-[#071D49] px-3 sm:px-4 py-2 border-b-2 border-[#C9A96E] flex items-center justify-between shrink-0 text-white shadow-md z-30">
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 bg-[#C9A96E] hover:bg-[#E8D2A8] text-[#071D49] font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer border border-white/30 active:scale-95 shrink-0"
                  title="Voltar para o Dashboard Executivo / Início"
                >
                  <ArrowLeft className="w-4 h-4 text-[#071D49]" />
                  <span>← Voltar ao Início (Dashboard)</span>
                </button>

                <div className="h-4 w-px bg-[#C9A96E]/40 hidden sm:block" />

                <div
                  onClick={() => setActiveTab('dashboard')}
                  className="hidden sm:flex items-center gap-2 cursor-pointer hover:text-white transition-colors group"
                  title="Voltar para a Página Inicial (Dashboard)"
                >
                  <Home className="w-3.5 h-3.5 text-[#C9A96E] group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-[#E8D2A8] group-hover:text-white">
                    Óticas Di Óculos • Módulo Ativo
                  </span>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('dashboard')}
                className="px-2.5 sm:px-3 py-1 bg-[#0B255C] hover:bg-[#153270] text-[#C9A96E] rounded-xl border border-[#C9A96E]/60 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                title="Ir para o Painel Principal"
              >
                <Home className="w-3.5 h-3.5 text-[#C9A96E]" />
                <span className="hidden md:inline">Painel Início</span>
              </button>
            </div>
          )}
          {activeTab === 'dashboard' && (
            <ExecutiveDashboardView
              cashFlow={cashFlow}
              serviceOrders={serviceOrders}
              onOpenProfessionalsModal={() => setIsProfessionalsModalOpen(true)}
            />
          )}

          {activeTab === 'news' && (
            <EnterpriseNewsView
              onOpenShareModal={() => setIsShareModalOpen(true)}
              onNavigateTab={handleTabChange}
              orders={serviceOrders}
              cashFlow={cashFlow}
              clients={clients}
            />
          )}

          {activeTab === 'cashflow' && (
            <CashFlowView
              cashFlow={cashFlow}
              setCashFlow={async (value) => {
                if (typeof value === 'function') {
                  setCashFlow((prev) => {
                    const next = value(prev);
                    if (next.length > prev.length) {
                      const addedEntry = next[0];
                      saveTransactionToSupabase(addedEntry).catch(err => {
                        console.error('Erro ao salvar movimentação no Supabase:', err);
                      });
                    } else if (next.length < prev.length) {
                      const deleted = prev.find(p => !next.some(n => n.id === p.id));
                      if (deleted && supabase) {
                        supabase.from('transacoes_financeiras').delete().eq('id', deleted.id).catch(err => {
                          console.error('Erro ao excluir do Supabase:', err);
                        });
                      }
                    }
                    return next;
                  });
                } else {
                  setCashFlow(value);
                }
              }}
              serviceOrders={serviceOrders}
              closings={closings}
              setClosings={async (value) => {
                if (typeof value === 'function') {
                  setClosings((prev) => {
                    const next = value(prev);
                    if (next.length > prev.length) {
                      const added = next[0];
                      if (supabase) {
                        supabase.from('caixa').insert({
                          id: ensureUUID(added.id),
                          status: added.status,
                          saldo_final: added.saldoFinal,
                          criado_em: added.createdAt
                        }).catch(err => {
                          console.error('Erro ao fechar caixa no Supabase:', err);
                        });
                      }
                    }
                    return next;
                  });
                } else {
                  setClosings(value);
                }
              }}
            />
          )}

          {activeTab === 'chat' && (
            <ChatLayout
              clients={clients}
              selectedClientId={selectedClientId}
              onSelectClient={setSelectedClientId}
              onAddNewClient={handleAddNewClient}
              messages={currentMessages}
              onSendMessage={handleSendMessage}
              onToggleAiControl={handleToggleAiControl}
              onGenerateAiSuggestion={handleGenerateAiSuggestion}
              isGeneratingAi={isGeneratingAi}
              onSelectQuickAction={handleSelectQuickAction}
              frames={frames}
              lenses={lenses}
              aiSettings={aiSettings}
              onUpdateClientPrescription={handleUpdateClientPrescription}
              onUpdateClientDnp={handleUpdateClientDnp}
              onSelectFrameAndLens={handleSelectFrameAndLens}
              onCreateServiceOrder={handleCreateServiceOrder}
              onConfirmPixPayment={handleConfirmPixPayment}
              currentOS={currentOS}
            />
          )}

          {activeTab === 'clients' && (
            <ClientsCrmView
              clients={clients}
              onAddNewClient={handleAddNewClient}
              onSelectClientForChat={(cId) => {
                setSelectedClientId(cId);
                setActiveTab('chat');
              }}
              onOpenProfessionalsModal={() => setIsProfessionalsModalOpen(true)}
            />
          )}

          {activeTab === 'sellers' && <SellersModule />}

          {activeTab === 'ai-quotes' && (
            <AiQuotesSalesView
              quotes={aiQuotes}
              onUpdateQuoteStatus={(qId, newStatus) => {
                setAiQuotes((prev) =>
                  prev.map((q) => (q.id === qId ? { ...q, status: newStatus } : q))
                );
              }}
              onConvertToOS={async (quote) => {
                const newOs: ServiceOrder = {
                  id: `os_ai_${Date.now()}`,
                  osNumber: `OS-2026-${Math.floor(100 + Math.random() * 900)}`,
                  clientId: quote.clientId,
                  clientName: quote.clientName,
                  clientCPF: '123.456.789-00',
                  clientPhone: quote.clientPhone,
                  prescription: quote.prescription,
                  dnp: quote.dnp || {
                    dnpOD: 31.5,
                    dnpOE: 32.0,
                    dpTotal: 63.5,
                    alturaCentroOD: 21.0,
                    alturaCentroOE: 21.5,
                    cardDetected: true,
                    confidenceScore: 98,
                  },
                  frame: frames[0],
                  lens: lenses[0],
                  framePrice: quote.framePrice,
                  lensPrice: quote.lensPrice,
                  discount: quote.totalValue - quote.pixDiscountValue,
                  totalValue: quote.pixDiscountValue,
                  status: 'no_laboratorio',
                  createdAt: new Date().toISOString().split('T')[0],
                  ceoNotified: true,
                  ceoApprovalNeeded: quote.ceoApprovalNeeded,
                  ceoApproved: true,
                };

                let saved = newOs;
                try {
                  saved = await saveOrderToSupabase(newOs);
                } catch (err) {
                  console.error('Erro ao converter OS no Supabase:', err);
                }

                setServiceOrders((prev) => [saved, ...prev]);
                setAiQuotes((prev) =>
                  prev.map((q) => (q.id === quote.id ? { ...q, status: 'convertido_os' } : q))
                );
                alert(`✨ Orçamento ${quote.id} convertido com sucesso na OS ${saved.osNumber}! Enviado para o Laboratório.`);
                setActiveTab('lab');
              }}
              onOpenAiConsultantModal={() => setIsAiConsultantOpen(true)}
            />
          )}

          {activeTab === 'os' && (
            <ServiceOrdersView
              orders={serviceOrders}
              cashFlow={cashFlow}
              clients={clients}
              frames={frames}
              lenses={lenses}
              onCreateNewOS={(cId, fId, lId) => {
                const targetClient = clients.find((c) => c.id === cId) || currentClient;
                handleSelectFrameAndLens(cId, fId, lId);
                handleCreateServiceOrder(targetClient);
              }}
              onConfirmPixPayment={handleConfirmPixPayment}
              onOpenSmartOSWizard={() => setIsSmartOSWizardOpen(true)}
            />
          )}

          {activeTab === 'lab' && (
            <LabTrackingView
              orders={serviceOrders}
              onUpdateOSStatus={async (osId, newStatus) => {
                const targetOS = serviceOrders.find(o => o.id === osId);
                if (targetOS) {
                  const updatedOS = { ...targetOS, status: newStatus };
                  try {
                    await saveOrderToSupabase(updatedOS);
                  } catch (err) {
                    console.warn('Erro ao atualizar status da OS no Supabase:', err);
                  }
                }
                setServiceOrders((prev) =>
                  prev.map((o) => (o.id === osId ? { ...o, status: newStatus } : o))
                );
              }}
              onSendWhatsAppNotification={(phone, msg) => {
                handleSendMessage(msg);
              }}
            />
          )}

          {activeTab === 'catalog' && (
            <CatalogView
              frames={frames}
              lenses={lenses}
              onAddFrame={async (f) => {
                try {
                  const saved = await saveProductToSupabase(f, 'armacao');
                  setFrames((prev) => [{ ...saved }, ...prev]);
                } catch (err) {
                  console.error('Erro ao salvar armacao no Supabase:', err);
                  setFrames((prev) => [{ ...f, id: `f_${Date.now()}` }, ...prev]);
                }
              }}
              onAddLens={async (l) => {
                try {
                  const saved = await saveProductToSupabase(l, 'lentes');
                  setLenses((prev) => [{ ...saved }, ...prev]);
                } catch (err) {
                  console.error('Erro ao salvar lentes no Supabase:', err);
                  setLenses((prev) => [{ ...l, id: `l_${Date.now()}` }, ...prev]);
                }
              }}
            />
          )}

          {activeTab === 'camera' && <CameraAiScannerView />}

          {activeTab === 'pricetable' && <PriceTableView />}

          {activeTab === 'ai-settings' && (
            <AiSettingsView settings={aiSettings} onSaveSettings={setAiSettings} />
          )}

          {activeTab === 'saas-admin' && <SaaSAdminView />}
        </main>
      </div>

      {/* Complete Client Registration Modal */}
      <NewClientModal
        isOpen={isNewClientModalOpen}
        onClose={() => setIsNewClientModalOpen(false)}
        onSaveClient={handleSaveNewClient}
      />

      {/* AI Consultant & Optical Recommendation Modal */}
      <AiConsultantModal
        isOpen={isAiConsultantOpen}
        onClose={() => setIsAiConsultantOpen(false)}
        onSaveQuote={(newQuote, newOnlineClient) => {
          setAiQuotes((prev) => [newQuote, ...prev]);
          setClients((prev) => [newOnlineClient, ...prev]);
          setMessagesMap((prev) => ({
            ...prev,
            [newOnlineClient.id]: [
              {
                id: `msg_ai_${Date.now()}`,
                clientId: newOnlineClient.id,
                sender: 'ai',
                text: `Olá ${newOnlineClient.name}! Seu orçamento ${newQuote.id} de R$ ${newQuote.totalValue.toFixed(2)} foi gerado com sucesso via Agente de IA da Óticas Di Óculos (Ituberá - BA)!`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              },
            ],
          }));
        }}
      />
      {/* Cadastro de Profissionais Modal */}
      <RegisterProfessionalModal
        isOpen={isProfessionalsModalOpen}
        onClose={() => setIsProfessionalsModalOpen(false)}
        professionals={professionals}
        onAddProfessional={handleAddProfessional}
        onToggleStatus={handleToggleProfessionalStatus}
      />
      {/* Compartilhar com Equipe Modal */}
      <ShareTeamModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      {/* Módulo Ordem de Serviço (OS) Inteligente - Fullscreen Wizard 12 Etapas */}
      {isSmartOSWizardOpen && (
        <SmartOSWizard
          clients={clients}
          frames={frames}
          lenses={lenses}
          onAddClient={(newClient) => setClients((prev) => [newClient, ...prev])}
          onSaveOS={async (newOS) => {
            let savedOS = newOS;
            try {
              savedOS = await saveOrderToSupabase(newOS);
            } catch (err) {
              console.error('Erro ao salvar OS no Supabase:', err);
            }

            setServiceOrders((prev) => [savedOS, ...prev]);
            
            // Automatically record in cashflow if advance payment made
            if (newOS.adiantamento && newOS.adiantamento > 0) {
              let newCashEntry: CashFlowEntry = {
                id: `cash_os_${Date.now()}`,
                empresa: 'Óticas DI Óculos',
                filial: 'Matriz Ituberá BA',
                usuario: 'John Rocha',
                date: new Date().toISOString().split('T')[0],
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                type: 'entrada',
                category: 'Recebimento OS',
                description: `Adiantamento OS ${newOS.osNumber} - Cliente ${newOS.clientName}`,
                paymentMethod: newOS.paymentMethod === 'pix' ? 'Pix' : newOS.paymentMethod === 'cartao_credito' ? 'Cartão Crédito' : 'Dinheiro',
                entrada: newOS.adiantamento,
                saida: 0,
                amount: newOS.adiantamento,
                saldo: totalTodaySales + newOS.adiantamento,
                status: 'confirmado',
                osId: newOS.id,
                clientName: newOS.clientName,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };

              try {
                newCashEntry = await saveTransactionToSupabase(newCashEntry);
              } catch (err) {
                console.error('Erro ao salvar transação no Supabase:', err);
              }

              setCashFlow((prev) => [newCashEntry, ...prev]);
            }
            setIsSmartOSWizardOpen(false);
            setActiveTab('os');
          }}
          onClose={() => setIsSmartOSWizardOpen(false)}
        />
      )}

      {/* Global Quick Search Modal (Command Palette Ctrl + K) */}
      <QuickSearchModal
        isOpen={isQuickSearchOpen}
        onClose={() => setIsQuickSearchOpen(false)}
        clients={clients}
        serviceOrders={serviceOrders}
        frames={frames}
        lenses={lenses}
        onSelectClient={(cId) => setSelectedClientId(cId)}
        onNavigateTab={handleTabChange}
        onOpenSmartOS={handleOpenSmartOSWizard}
        onOpenNewClient={() => {
          if (subscription?.isExpired) {
            setIsPlanGateOpen(true);
          } else {
            setIsNewClientModalOpen(true);
          }
        }}
      />

      {/* Speed Dial Floating Quick Action Bar */}
      <QuickActionBar
        onOpenSmartOS={handleOpenSmartOSWizard}
        onOpenNewClient={() => {
          if (subscription?.isExpired) {
            setIsPlanGateOpen(true);
          } else {
            setIsNewClientModalOpen(true);
          }
        }}
        onOpenAiConsultant={() => {
          if (subscription?.isExpired) {
            setIsPlanGateOpen(true);
          } else if (subscription?.plan === 'basico') {
            alert("O Consultor IA é exclusivo do Plano Pro Max.");
            setIsPlanGateOpen(true);
          } else {
            setIsAiConsultantOpen(true);
          }
        }}
        onNavigateTab={handleTabChange}
        onOpenQuickSearch={() => {
          if (subscription?.isExpired) {
            setIsPlanGateOpen(true);
          } else {
            setIsQuickSearchOpen(true);
          }
        }}
      />

      {/* SaaS Subscription Block / Plan Selector Modal */}
      <SaaSPlanGateModal
        isOpen={isPlanGateOpen}
        userEmail={currentUser?.role === 'ceo' ? 'dioenne@otica.com' : 'contato@otica.com'}
        daysRemainingInTrial={subscription?.daysRemainingInTrial ?? 3}
        currentPlan={subscription?.plan ?? 'trial'}
        onClose={() => {
          if (subscription && !subscription.isExpired) {
            setIsPlanGateOpen(false);
          } else {
            alert("Acesso restrito. Selecione um plano para continuar.");
          }
        }}
      />

      {/* Barra de Navegação Inferior Fixa para Mobile (Exibida apenas em telas < 640px via `sm:hidden`) */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-[100] bg-[#071D49]/98 backdrop-blur-xl border-t-2 border-[#C9A96E]/70 px-2 py-1 flex items-center justify-around text-white shadow-[0_-5px_25px_rgba(0,0,0,0.5)]">
        <button
          onClick={() => handleTabChange('dashboard')}
          className={`flex flex-col items-center justify-center p-1 rounded-xl transition-all ${
            activeTab === 'dashboard' ? 'text-[#C9A96E] font-black scale-105' : 'text-slate-300 font-medium'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Início</span>
        </button>

        <button
          onClick={() => handleTabChange('os')}
          className={`flex flex-col items-center justify-center p-1 rounded-xl transition-all ${
            activeTab === 'os' ? 'text-[#C9A96E] font-black scale-105' : 'text-slate-300 font-medium'
          }`}
        >
          <FileText className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Ordens</span>
        </button>

        <button
          onClick={() => handleTabChange('chat')}
          className={`flex flex-col items-center justify-center p-1 rounded-xl transition-all relative ${
            activeTab === 'chat' ? 'text-[#25D366] font-black scale-105' : 'text-slate-300 font-medium'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Chat IA</span>
          {unreadCountTotal > 0 && (
            <span className="absolute top-0 right-1 w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
          )}
        </button>

        <button
          onClick={() => handleTabChange('clients')}
          className={`flex flex-col items-center justify-center p-1 rounded-xl transition-all ${
            activeTab === 'clients' ? 'text-[#C9A96E] font-black scale-105' : 'text-slate-300 font-medium'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Clientes</span>
        </button>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`flex flex-col items-center justify-center p-1 rounded-xl transition-all ${
            isMobileMenuOpen ? 'text-[#C9A96E] font-black scale-105' : 'text-slate-300 font-medium'
          }`}
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Menu</span>
        </button>
      </nav>

      {/* PWA Install Promo / Auto-Prompt Modal */}
      <PwaInstallPromptModal />
    </div>
  );
}
