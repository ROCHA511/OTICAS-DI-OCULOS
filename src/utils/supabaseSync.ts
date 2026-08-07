// src/utils/supabaseSync.ts
import { supabase } from './supabaseClient';
import { Client, Frame, Lens, ServiceOrder, CashFlowEntry, CashClosing, Professional } from '../types';

// Função para garantir que os IDs sejam UUIDs válidos no banco
export const ensureUUID = (id: string): string => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(id)) {
    return id;
  }
  
  // Se for UUID fictício ou ID em formato Date.now() / texto, gera um UUID estável ou aleatório
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  
  // Fallback RFC4122
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// -------------------------------------------------------------
// 1. CLIENTES & CRM
// -------------------------------------------------------------

export const loadClientsFromSupabase = async (fallbackData: Client[]): Promise<Client[]> => {
  if (!supabase) return fallbackData;
  try {
    const { data: perfis, error: errPerfis } = await supabase
      .from('perfis')
      .select(`
        id, nome, email, telefone, role, status, criado_em,
        clientes (cpf, data_nascimento, endereco, cidade, estado, cep)
      `)
      .eq('role', 'cliente');

    if (errPerfis) throw errPerfis;
    if (!perfis || perfis.length === 0) return [];

    // Traduz do banco para a interface Client do frontend
    const translated: Client[] = perfis.map((p: any) => {
      const cliDetails = p.clientes?.[0] || {};
      return {
        id: p.id,
        name: p.nome,
        phone: p.telefone || '',
        email: p.email || undefined,
        cpf: cliDetails.cpf || undefined,
        birthDate: cliDetails.data_nascimento || undefined,
        status: p.status === 'ativo' ? 'active' : 'paid',
        isAiHandled: true,
        lastInteraction: p.criado_em,
        unreadCount: 0,
        tags: [],
        notes: cliDetails.endereco || ''
      } as Client;
    });

    return translated;
  } catch (err) {
    console.warn('[Supabase Sync] Falha ao carregar clientes do Supabase. Usando fallback local:', err);
    return fallbackData;
  }
};

export const saveClientToSupabase = async (client: Client): Promise<Client> => {
  if (!supabase) return client;
  try {
    const uuid = ensureUUID(client.id);
    const clientWithUUID = { ...client, id: uuid };

    // 1. Salva na tabela public.perfis
    const { error: errPerfil } = await supabase.from('perfis').upsert({
      id: uuid,
      nome: client.name,
      email: client.email || `${uuid.substring(0, 8)}@otica.com`, // E-mail padrão único
      telefone: client.phone,
      role: 'cliente',
      status: client.status === 'active' ? 'ativo' : 'inativo',
      atualizado_em: new Date().toISOString()
    });
    if (errPerfil) throw errPerfil;

    // 2. Salva na tabela public.clientes
    const { error: errCli } = await supabase.from('clientes').upsert({
      id: uuid,
      cpf: client.cpf || null,
      data_nascimento: client.birthDate || null,
      endereco: client.notes || null
    });
    if (errCli) throw errCli;

    // 3. Se tiver dados de receita, persiste também em receitas
    if (client.prescription) {
      const { error: errRec } = await supabase.from('receitas').insert({
        cliente_id: uuid,
        esferico_od: client.prescription.od?.esferico || 0,
        cilindrico_od: client.prescription.od?.cilindrico || 0,
        eixo_od: client.prescription.od?.eixo || 0,
        adicao_od: client.prescription.adicao || 0,
        esferico_oe: client.prescription.oe?.esferico || 0,
        cilindrico_oe: client.prescription.oe?.cilindrico || 0,
        eixo_oe: client.prescription.oe?.eixo || 0,
        adicao_oe: client.prescription.adicao || 0,
        dnp_od: client.dnp?.dnpOD || 0,
        dnp_oe: client.dnp?.dnpOE || 0,
        altura_od: client.dnp?.alturaCentroOD || 0,
        altura_oe: client.dnp?.alturaCentroOE || 0
      });
      if (errRec) console.warn('[Supabase Sync] Falha ao cadastrar receita do cliente:', errRec);
    }

    return clientWithUUID;
  } catch (err) {
    console.error('[Supabase Sync] Erro ao cadastrar cliente no Supabase:', err);
    throw err;
  }
};

// -------------------------------------------------------------
// 2. CATÁLOGO & PRODUTOS
// -------------------------------------------------------------

export const loadProductsFromSupabase = async (
  fallbackFrames: Frame[],
  fallbackLenses: Lens[]
): Promise<{ frames: Frame[]; lenses: Lens[] }> => {
  if (!supabase) return { frames: fallbackFrames, lenses: fallbackLenses };
  try {
    const { data: produtos, error: errProd } = await supabase
      .from('produtos')
      .select('*');

    if (errProd) throw errProd;
    if (!produtos || produtos.length === 0) return { frames: fallbackFrames, lenses: fallbackLenses };

    const frames: Frame[] = [];
    const lenses: Lens[] = [];

    produtos.forEach((p: any) => {
      if (p.categoria === 'armacao' || p.categoria === 'armações') {
        frames.push({
          id: p.id,
          brand: p.nome.split(' ')?.[0] || 'Geral',
          model: p.nome,
          code: p.descricao || p.id.substring(0, 8),
          color: 'Preto',
          material: 'Acetato',
          eyeSize: 52,
          bridge: 18,
          temple: 140,
          image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80',
          price: Number(p.preco_venda),
          stock: p.estoque_current || p.estoque_atual || 0
        });
      } else {
        lenses.push({
          id: p.id,
          name: p.nome,
          brand: p.descricao || 'Geral',
          type: 'visao_simples',
          indexRefraction: 1.56,
          description: p.descricao || 'Lente Óptica',
          price: Number(p.preco_venda),
        });
      }
    });

    return {
      frames: frames.length > 0 ? frames : fallbackFrames,
      lenses: lenses.length > 0 ? lenses : fallbackLenses
    };
  } catch (err) {
    console.warn('[Supabase Sync] Falha ao carregar catálogo de produtos. Usando fallback:', err);
    return { frames: fallbackFrames, lenses: fallbackLenses };
  }
};

export const saveProductToSupabase = async (product: any, categoria: 'armacao' | 'lentes'): Promise<any> => {
  if (!supabase) return product;
  try {
    const uuid = ensureUUID(product.id);
    const cleanProd = { ...product, id: uuid };

    const { error } = await supabase.from('produtos').upsert({
      id: uuid,
      nome: product.model || product.name || 'Produto Ótico',
      descricao: product.code || product.brand || '',
      preco_venda: product.price || 0,
      preco_custo: (product.price || 0) * 0.4, // Custos fictícios baseados em 40% do valor final
      estoque_atual: product.stock || 10,
      estoque_minimo: 2,
      categoria: categoria
    });

    if (error) throw error;
    return cleanProd;
  } catch (err) {
    console.error('[Supabase Sync] Erro ao cadastrar produto:', err);
    throw err;
  }
};

// -------------------------------------------------------------
// 3. ORDENS DE SERVIÇO & VENDAS
// -------------------------------------------------------------

export const loadOrdersFromSupabase = async (fallbackOrders: ServiceOrder[]): Promise<ServiceOrder[]> => {
  if (!supabase) return fallbackOrders;
  try {
    const { data: vendas, error: errVendas } = await supabase
      .from('vendas')
      .select(`
        id, cliente_id, profissional_id, receita_id, status, valor_total, desconto, criado_em,
        perfis (nome, telefone),
        vendas_itens (id, produto_id, quantidade)
      `);

    if (errVendas) throw errVendas;
    if (!vendas || vendas.length === 0) return [];

    const translated: ServiceOrder[] = vendas.map((v: any) => {
      const cliProfile = v.perfis || {};
      const statusMap: any = {
        'aberto': 'orcamento',
        'confirmado': 'pago',
        'cancelado': 'orcamento',
        'entregue': 'entregue'
      };

      return {
        id: v.id,
        osNumber: v.id.substring(0, 6).toUpperCase(),
        clientId: v.cliente_id,
        clientName: cliProfile.nome || 'Cliente Geral',
        clientCPF: '',
        clientPhone: cliProfile.telefone || '',
        prescription: {
          odSph: 0, odCyl: 0, odAxis: 0,
          oeSph: 0, oeCyl: 0, oeAxis: 0
        },
        dnp: { od: 31.5, oe: 32.0, height: 20 },
        frame: { id: '1', brand: 'Geral', model: 'Armação Padrão', code: '', color: '', price: 0, stock: 1 },
        lens: { id: '1', name: 'Lente Padrão', brand: '', type: '', material: '', treatments: [], price: 0, stock: 1 },
        framePrice: 0,
        lensPrice: 0,
        discount: Number(v.desconto || 0),
        totalValue: Number(v.valor_total || 0),
        status: statusMap[v.status] || 'orcamento',
        createdAt: v.criado_em,
        ceoNotified: false,
        ceoApprovalNeeded: false
      } as unknown as ServiceOrder;
    });

    return translated;
  } catch (err) {
    console.warn('[Supabase Sync] Falha ao carregar Ordens de Serviço do Supabase:', err);
    return fallbackOrders;
  }
};

export const saveOrderToSupabase = async (order: ServiceOrder): Promise<ServiceOrder> => {
  if (!supabase) return order;
  try {
    const uuid = ensureUUID(order.id);
    const cliUUID = ensureUUID(order.clientId);

    // Ajuste de chaves para o retorno
    const orderWithUUID = { ...order, id: uuid, clientId: cliUUID };

    // 1. Cria a venda no banco de dados
    const statusMap: any = {
      'orcamento': 'aberto',
      'aguardando_pagamento': 'aberto',
      'pago': 'confirmado',
      'no_laboratorio': 'confirmado',
      'pronto': 'confirmado',
      'entregue': 'entregue'
    };

    // Pega o ID de algum profissional cadastrado para não dar violação de FK
    const { data: profs } = await supabase.from('profissionais').select('id').limit(1);
    const profID = profs?.[0]?.id || cliUUID; // Fallback se não houver profissionais

    const { error: errVenda } = await supabase.from('vendas').upsert({
      id: uuid,
      cliente_id: cliUUID,
      profissional_id: profID,
      status: statusMap[order.status] || 'aberto',
      valor_total: order.totalValue || 0,
      desconto: order.discount || 0
    });

    if (errVenda) throw errVenda;

    // 2. Registra o item da venda se houver armação ou lente associada
    if (order.frame && order.frame.id) {
      const frameUUID = ensureUUID(order.frame.id);
      await supabase.from('vendas_itens').insert({
        venda_id: uuid,
        produto_id: frameUUID,
        quantidade: 1
      });
    }

    return orderWithUUID;
  } catch (err) {
    console.error('[Supabase Sync] Erro ao cadastrar OS/Venda no Supabase:', err);
    throw err;
  }
};

// -------------------------------------------------------------
// 4. FINANCEIRO / FLUXO DE CAIXA
// -------------------------------------------------------------

export const loadCashflowFromSupabase = async (fallbackEntries: CashFlowEntry[]): Promise<CashFlowEntry[]> => {
  if (!supabase) return fallbackEntries;
  try {
    const { data: transacoes, error: errTrans } = await supabase
      .from('transacoes_financeiras')
      .select('*')
      .order('criado_em', { ascending: false });

    if (errTrans) throw errTrans;
    if (!transacoes || transacoes.length === 0) return [];

    const translated: CashFlowEntry[] = transacoes.map((t: any) => {
      const typeMap: any = {
        'receita': 'entrada',
        'despesa': 'saida'
      };

      const dateStr = t.criado_em.split('T')?.[0] || new Date().toISOString().split('T')[0];
      const timeStr = t.criado_em.split('T')?.[1]?.substring(0, 8) || '00:00:00';

      return {
        id: t.id,
        empresa: 'Óticas Di Óculos',
        filial: 'Matriz Centro',
        usuario: 'Dioenne Rocha',
        date: dateStr,
        time: timeStr,
        type: typeMap[t.tipo] || 'entrada',
        category: t.categoria || 'Geral',
        description: t.descricao || '',
        paymentMethod: t.forma_pagamento || 'Pix',
        entrada: t.tipo === 'receita' ? Number(t.valor) : 0,
        saida: t.tipo === 'despesa' ? Number(t.valor) : 0,
        amount: Number(t.valor),
        saldo: 0, // calculado pelo front
        status: 'confirmado',
        createdAt: t.criado_em,
        updatedAt: t.criado_em
      };
    });

    return translated;
  } catch (err) {
    console.warn('[Supabase Sync] Erro ao buscar fluxo de caixa do Supabase:', err);
    return fallbackEntries;
  }
};

export const saveTransactionToSupabase = async (entry: CashFlowEntry): Promise<CashFlowEntry> => {
  if (!supabase) return entry;
  try {
    const uuid = ensureUUID(entry.id);
    const cleanEntry = { ...entry, id: uuid };

    // Pega o ID de algum caixa aberto para vincular
    const { data: caixas } = await supabase.from('caixa').select('id').eq('status', 'aberto').limit(1);
    const caixaID = caixas?.[0]?.id || null;

    const { error } = await supabase.from('transacoes_financeiras').insert({
      id: uuid,
      caixa_id: caixaID,
      valor: entry.entrada > 0 ? entry.entrada : entry.saida,
      tipo: entry.type === 'entrada' ? 'receita' : 'despesa',
      categoria: entry.category,
      descricao: entry.description,
      forma_pagamento: entry.paymentMethod
    });

    if (error) throw error;
    return cleanEntry;
  } catch (err) {
    console.error('[Supabase Sync] Erro ao cadastrar movimentação financeira:', err);
    throw err;
  }
};
