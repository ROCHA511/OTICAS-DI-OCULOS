import React, { useState } from 'react';
import { Printer, Download, Scissors, QrCode, Check, FileText, Lock } from 'lucide-react';
import { ServiceOrder } from '../../types';
import { OticasLogo } from '../brand/OticasLogo';

interface ServiceOrderDocumentProps {
  order: ServiceOrder;
  onPrint?: () => void;
  onClose?: () => void;
}

export const ServiceOrderDocument: React.FC<ServiceOrderDocumentProps> = ({
  order,
  onPrint,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'todas' | 'laboratorio' | 'otica' | 'cliente'>('todas');

  // Fallbacks based on order details or sample image 1882 data
  const vendedor = order.vendedor || 'John Rocha';
  const cnpj = order.cnpj || '12.348.411/0001-51';
  const lojaEndereco = order.lojaEndereco || 'Rua 23 de Abril, 51, Otica DI Oculos, Centro';
  const lojaCidade = 'Ituberá - BA';
  const lojaTelefone = order.lojaTelefone || '(73) 3256-1599';
  const dataEntrada = order.dataEntrada || order.createdAt || '11/07/2026';
  const prevEntrega = order.prevEntrega || order.labEstimatedCompletion || '31/07/2026';
  const tipoOS = order.tipoOS || 'Otica';

  // Items formatting
  const frameName = `${order.frame.brand} - ${order.frame.model}`.toUpperCase();
  const lensName = `${order.lens.brand} ${order.lens.name}`.toUpperCase();

  const frameValUnit = order.framePrice || 290.00;
  const frameDesc = order.discount ? order.discount * 0.1 : 92.67;
  const frameTotal = frameValUnit - frameDesc;

  const lensValUnit = order.lensPrice || 3678.00;
  const lensDesc = order.discount ? order.discount * 0.9 : 1175.33;
  const lensTotal = lensValUnit - lensDesc;

  const items = order.itemsList || [
    {
      ref: `ARMACAO - ${order.frame.brand} ${order.frame.model}`,
      qtde: 1,
      valUnit: frameValUnit,
      acrescimo: 0,
      desconto: frameDesc,
      total: frameTotal,
    },
    {
      ref: `${order.lens.brand} ${order.lens.name}`,
      qtde: 1,
      valUnit: lensValUnit,
      acrescimo: 0,
      desconto: lensDesc,
      total: lensTotal,
    },
  ];

  const totalQtde = items.reduce((acc, item) => acc + item.qtde, 0);

  const subtotal = order.subtotal || (frameValUnit + lensValUnit);
  const totalDesconto = order.discount || (frameDesc + lensDesc);
  const totalFinal = order.totalValue || (subtotal - totalDesconto);
  const adiantamento = order.adiantamento !== undefined ? order.adiantamento : 500.00;
  const aReceber = order.aReceber !== undefined ? order.aReceber : (totalFinal - adiantamento);

  const adiantamentosList = order.adiantamentoHistory || [
    {
      data: dataEntrada,
      formaPagamento: order.paymentMethod ? order.paymentMethod.toUpperCase() : 'Pix',
      valor: adiantamento,
      responsavel: 'Oticas DI Oculos',
    },
  ];

  const handlePrintClick = () => {
    if (order.status === 'aguardando_pagamento' || order.status === 'orcamento') {
      alert("⚠️ Ação Bloqueada: Não é possível imprimir ordens de serviço pendentes de pagamento. Por favor, registre o recebimento financeiro.");
      return;
    }
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  // Helper Barcode SVG / CSS Graphic representation
  const renderBarcode = () => (
    <div className="flex flex-col items-center">
      <div className="flex items-end h-8 gap-[1px] px-1 bg-white border border-slate-300 rounded-xs">
        <div className="w-[2px] h-full bg-black"></div>
        <div className="w-[1px] h-full bg-black"></div>
        <div className="w-[3px] h-full bg-black"></div>
        <div className="w-[1px] h-full bg-white"></div>
        <div className="w-[2px] h-full bg-black"></div>
        <div className="w-[1px] h-full bg-black"></div>
        <div className="w-[2px] h-full bg-black"></div>
        <div className="w-[3px] h-full bg-black"></div>
        <div className="w-[1px] h-full bg-white"></div>
        <div className="w-[2px] h-full bg-black"></div>
        <div className="w-[1px] h-full bg-black"></div>
        <div className="w-[3px] h-full bg-black"></div>
        <div className="w-[2px] h-full bg-black"></div>
        <div className="w-[1px] h-full bg-black"></div>
        <div className="w-[2px] h-full bg-black"></div>
        <div className="w-[3px] h-full bg-black"></div>
        <div className="w-[1px] h-full bg-white"></div>
        <div className="w-[2px] h-full bg-black"></div>
        <div className="w-[1px] h-full bg-black"></div>
        <div className="w-[2px] h-full bg-black"></div>
      </div>
      <span className="text-[8px] font-mono font-bold tracking-widest text-slate-800 mt-0.5">
        *{order.osNumber.replace(/\D/g, '') || '1882'}*
      </span>
    </div>
  );

  // Helper Rx Prescription Sub-Table
  const renderRxTable = () => (
    <div className="text-[10px] border border-slate-400 relative">
      {/* Overlay de Bloqueio Financeiro de Segurança (Módulo 14) */}
      {(order.status === 'aguardando_pagamento' || order.status === 'orcamento') && (
        <div className="absolute inset-0 bg-red-950/90 backdrop-blur-[2px] flex flex-col items-center justify-center p-2 text-center z-10 border border-red-500/30">
          <Lock className="w-6 h-6 text-red-400 animate-pulse mb-1" />
          <span className="text-[9px] font-black text-red-300 uppercase tracking-widest">DADOS BLOQUEADOS</span>
          <span className="text-[7px] text-red-400 mt-0.5 font-bold">PAGAMENTO PENDENTE</span>
        </div>
      )}

      <div className={`bg-slate-100 font-bold border-b border-slate-400 text-center py-0.5 ${(order.status === 'aguardando_pagamento' || order.status === 'orcamento') ? 'filter blur-[3px] pointer-events-none' : ''}`}>
        RECEITA
      </div>
      <table className={`w-full text-center border-collapse text-[9px] ${(order.status === 'aguardando_pagamento' || order.status === 'orcamento') ? 'filter blur-[3px] pointer-events-none' : ''}`}>
        <thead>
          <tr className="border-b border-slate-300 font-bold bg-slate-50">
            <th className="p-0.5 border-r border-slate-300"></th>
            <th className="p-0.5 border-r border-slate-300"></th>
            <th className="p-0.5 border-r border-slate-300">Esférico</th>
            <th className="p-0.5 border-r border-slate-300">Cilíndrico</th>
            <th className="p-0.5 border-r border-slate-300">Eixo</th>
            <th className="p-0.5 border-r border-slate-300">Altura</th>
            <th className="p-0.5">DNP</th>
          </tr>
        </thead>
        <tbody>
          {/* Longe OD */}
          <tr className="border-b border-slate-200">
            <td className="p-0.5 font-bold border-r border-slate-300 bg-slate-50" rowSpan={2}>
              Longe
            </td>
            <td className="p-0.5 font-bold border-r border-slate-300 bg-slate-50">OD</td>
            <td className="p-0.5 border-r border-slate-300 font-semibold">
              {order.prescription.od.esferico > 0 ? `+${order.prescription.od.esferico.toFixed(2)}` : order.prescription.od.esferico.toFixed(2)}
            </td>
            <td className="p-0.5 border-r border-slate-300 font-semibold">
              {order.prescription.od.cilindrico.toFixed(2)}
            </td>
            <td className="p-0.5 border-r border-slate-300 font-semibold">
              {order.prescription.od.eixo}°
            </td>
            <td className="p-0.5 border-r border-slate-300 font-semibold">
              {order.dnp.alturaCentroOD ? order.dnp.alturaCentroOD.toFixed(2) : '29,00'}
            </td>
            <td className="p-0.5 font-semibold">
              {order.dnp.dnpOD ? order.dnp.dnpOD.toFixed(2) : '32,00'}
            </td>
          </tr>
          {/* Longe OE */}
          <tr className="border-b border-slate-300">
            <td className="p-0.5 font-bold border-r border-slate-300 bg-slate-50">OE</td>
            <td className="p-0.5 border-r border-slate-300 font-semibold">
              {order.prescription.oe.esferico > 0 ? `+${order.prescription.oe.esferico.toFixed(2)}` : order.prescription.oe.esferico.toFixed(2)}
            </td>
            <td className="p-0.5 border-r border-slate-300 font-semibold">
              {order.prescription.oe.cilindrico.toFixed(2)}
            </td>
            <td className="p-0.5 border-r border-slate-300 font-semibold">
              {order.prescription.oe.eixo}°
            </td>
            <td className="p-0.5 border-r border-slate-300 font-semibold">
              {order.dnp.alturaCentroOE ? order.dnp.alturaCentroOE.toFixed(2) : '29,00'}
            </td>
            <td className="p-0.5 font-semibold">
              {order.dnp.dnpOE ? order.dnp.dnpOE.toFixed(2) : '32,00'}
            </td>
          </tr>
          {/* Perto OD */}
          <tr className="border-b border-slate-200">
            <td className="p-0.5 font-bold border-r border-slate-300 bg-slate-50" rowSpan={2}>
              Perto
            </td>
            <td className="p-0.5 font-bold border-r border-slate-300 bg-slate-50">OD</td>
            <td className="p-0.5 border-r border-slate-300 font-semibold">
              {((order.prescription.od.esferico) + (order.prescription.adicao || 0)).toFixed(2)}
            </td>
            <td className="p-0.5 border-r border-slate-300 font-semibold">
              {order.prescription.od.cilindrico.toFixed(2)}
            </td>
            <td className="p-0.5 border-r border-slate-300 font-semibold">
              {order.prescription.od.eixo}°
            </td>
            <td className="p-0.5 border-r border-slate-300"></td>
            <td className="p-0.5"></td>
          </tr>
          {/* Perto OE */}
          <tr className="border-b border-slate-300">
            <td className="p-0.5 font-bold border-r border-slate-300 bg-slate-50">OE</td>
            <td className="p-0.5 border-r border-slate-300 font-semibold">
              {((order.prescription.oe.esferico) + (order.prescription.adicao || 0)).toFixed(2)}
            </td>
            <td className="p-0.5 border-r border-slate-300 font-semibold">
              {order.prescription.oe.cilindrico.toFixed(2)}
            </td>
            <td className="p-0.5 border-r border-slate-300 font-semibold">
              {order.prescription.oe.eixo}°
            </td>
            <td className="p-0.5 border-r border-slate-300"></td>
            <td className="p-0.5"></td>
          </tr>
          {/* Adição */}
          <tr>
            <td className="p-0.5 font-bold border-r border-slate-300 bg-slate-50" colSpan={2}>
              Adição
            </td>
            <td className="p-0.5 border-r border-slate-300 font-extrabold text-blue-900">
              +{order.prescription.adicao ? order.prescription.adicao.toFixed(2) : '2,50'}
            </td>
            <td className="p-0.5 border-r border-slate-300" colSpan={4}></td>
          </tr>
        </tbody>
      </table>
      <div className={`p-1 text-[9px] font-medium border-t border-slate-300 flex justify-between bg-slate-50 ${(order.status === 'aguardando_pagamento' || order.status === 'orcamento') ? 'filter blur-[3px] pointer-events-none' : ''}`}>
        <span>Médico/Optom: <strong>{order.medicoName || order.prescription.medicoName || 'Lauro / Dr. Roberto'}</strong></span>
        <span>Possui receita: <strong>{order.possuiReceita ? 'Sim' : 'Não'}</strong></span>
      </div>
    </div>
  );

  /* Render Via do Laboratório (Image 1 Model) */
  const renderViaLaboratorio = () => (
    <div className="bg-white p-4 border-2 border-slate-800 rounded-lg text-slate-900 font-sans space-y-3 print:border-black print:p-2">
      {/* Top Header */}
      <div className="border border-slate-800 p-2 rounded-xs flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <OticasLogo size="sm" variant="dark-text" />
          <div>
            <h2 className="text-sm font-black uppercase tracking-tight">DI Óticas</h2>
            <div className="text-[10px] text-slate-700">CNPJ: {cnpj}</div>
            <div className="text-[10px] font-bold text-slate-800">Vendedor: {vendedor}</div>
          </div>
        </div>

        <div className="text-right flex items-center gap-4">
          <div>
            <div className="text-xs font-black text-slate-900">
              Ordem de Serviço: <span className="text-sm underline">{order.osNumber.replace('OS-', '')}</span>
            </div>
            <div className="text-[10px] text-slate-700 font-medium">
              Entrada: <strong>{dataEntrada}</strong> - Prev. Entrega: <strong>{prevEntrega}</strong>
            </div>
            <div className="text-[10px] font-bold text-slate-800">Tipo: {tipoOS}</div>
          </div>
          {renderBarcode()}
        </div>
      </div>

      {/* Customer Header */}
      <div className="border border-slate-800 p-1.5 text-xs font-bold uppercase bg-slate-50">
        Cliente: <span className="font-extrabold text-slate-900">{order.clientName}</span>
      </div>

      {/* Products Table (Ref - Produto) */}
      <div className="border border-slate-800 text-xs">
        <table className="w-full text-left border-collapse text-[10px]">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-100 font-bold uppercase">
              <th className="p-1 border-r border-slate-800">Ref. - Produto</th>
              <th className="p-1 w-16 text-right">Qtde</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx} className="border-b border-slate-300">
                <td className="p-1 border-r border-slate-800 font-semibold">{item.ref}</td>
                <td className="p-1 text-right font-bold">{item.qtde}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-slate-100 font-bold border-t border-slate-800 text-[10px]">
              <td className="p-1 text-right pr-2">Quantidade total:</td>
              <td className="p-1 text-right">{totalQtde}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* 3-Column Grid: RECEITA | LENTE | ARMAÇÃO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
        {/* Column 1: RECEITA */}
        {renderRxTable()}

        {/* Column 2: LENTE */}
        <div className="border border-slate-400 text-[10px] flex flex-col justify-between">
          <div className="bg-slate-100 font-bold border-b border-slate-400 text-center py-0.5">
            LENTE
          </div>
          <div className="p-2 space-y-1 text-[9px] text-slate-800">
            <div><strong>Modelo:</strong> {order.lens.name}</div>
            <div><strong>Marca/Lab:</strong> {order.lens.brand}</div>
            <div><strong>Índice Refração:</strong> {order.lens.indexRefraction}</div>
            <div><strong>Tipo:</strong> {order.lens.type}</div>
            <div className="border-t border-slate-200 pt-1 mt-1 text-slate-600">
              {order.lens.description || 'Lentes de surfaçagem digital de alta precisão.'}
            </div>
          </div>
        </div>

        {/* Column 3: ARMAÇÃO */}
        <div className="border border-slate-400 text-[10px] flex flex-col justify-between">
          <div className="bg-slate-100 font-bold border-b border-slate-400 text-center py-0.5">
            ARMAÇÃO
          </div>
          <div className="p-2 space-y-1 text-[9px]">
            <div>Dist. Pup.: <strong>{order.distPupilar ? order.distPupilar.toFixed(2) : '0.00'}</strong></div>
            <div>Própria: <strong>{order.armacaoPropria ? 'Sim' : 'Não'}</strong></div>
            <div>Segue: <strong>{order.armacaoSegue ? 'Sim' : 'Não'}</strong></div>
            <div className="border-t border-slate-200 pt-1 mt-1 text-slate-700 font-semibold">
              {order.frame.brand} {order.frame.model} ({order.frame.code})
            </div>
          </div>
        </div>
      </div>

      <div className="text-right text-[9px] font-extrabold uppercase text-slate-700 pt-1">
        Via do Laboratorio
      </div>
    </div>
  );

  /* Render Via da Ótica (Image 2 Top Model) */
  const renderViaOtica = () => (
    <div className="bg-white p-4 border-2 border-slate-800 rounded-lg text-slate-900 font-sans space-y-3 print:border-black print:p-2">
      {/* Top Header */}
      <div className="border border-slate-800 p-2 rounded-xs flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <OticasLogo size="sm" variant="dark-text" />
          <div>
            <h2 className="text-sm font-black uppercase tracking-tight">DI Óticas</h2>
            <div className="text-[10px] text-slate-700">CNPJ: {cnpj}</div>
            <div className="text-[10px] font-bold text-slate-800">Vendedor: {vendedor}</div>
          </div>
        </div>

        <div className="text-right flex items-center gap-4">
          <div>
            <div className="text-xs font-black text-slate-900">
              Ordem de Serviço: <span className="text-sm underline">{order.osNumber.replace('OS-', '')}</span>
            </div>
            <div className="text-[10px] text-slate-700 font-medium">
              Entrada: <strong>{dataEntrada}</strong> - Prev. Entrega: <strong>{prevEntrega}</strong>
            </div>
            <div className="text-[10px] font-bold text-slate-800">Tipo: {tipoOS}</div>
          </div>
          {renderBarcode()}
        </div>
      </div>

      {/* Customer Row */}
      <div className="border border-slate-800 p-1.5 text-xs font-bold uppercase bg-slate-50 flex justify-between">
        <span>Cliente: <strong className="text-slate-900">{order.clientName}</strong></span>
        <span>Telefone: <strong>{order.clientPhone || '(73) 98112-8923'}</strong></span>
      </div>

      {/* Products Table with Financial Breakdown */}
      <div className="border border-slate-800 text-xs">
        <table className="w-full text-left border-collapse text-[9px]">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-100 font-bold uppercase">
              <th className="p-1 border-r border-slate-800">Ref. - Produto</th>
              <th className="p-1 w-10 text-center border-r border-slate-800">Qtde</th>
              <th className="p-1 w-20 text-right border-r border-slate-800">Val. Un.(R$)</th>
              <th className="p-1 w-16 text-right border-r border-slate-800">Acrés.(R$)</th>
              <th className="p-1 w-16 text-right border-r border-slate-800">Desc.(R$)</th>
              <th className="p-1 w-20 text-right">Valor Total(R$)</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx} className="border-b border-slate-300">
                <td className="p-1 border-r border-slate-800 font-semibold">{item.ref}</td>
                <td className="p-1 text-center border-r border-slate-800 font-bold">{item.qtde}</td>
                <td className="p-1 text-right border-r border-slate-800">{item.valUnit.toFixed(2)}</td>
                <td className="p-1 text-right border-r border-slate-800">{item.acrescimo ? item.acrescimo.toFixed(2) : '-'}</td>
                <td className="p-1 text-right border-r border-slate-800 text-emerald-700 font-medium">{item.desconto.toFixed(2)}</td>
                <td className="p-1 text-right font-bold text-slate-900">{item.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Quantidade total & Summary Bar */}
        <div className="p-1 border-t border-slate-800 font-bold text-[9px] bg-slate-50 flex justify-between items-center">
          <span>Quantidade total: {totalQtde}</span>
        </div>

        <div className="p-1.5 border-t border-slate-800 font-bold text-[9.5px] bg-slate-100 grid grid-cols-2 gap-2">
          <div className="space-y-0.5">
            <div>Subtotal: R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <div className="text-emerald-800">(-) Desconto: R$ {totalDesconto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <div>Adiantamento: R$ {adiantamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
          </div>
          <div className="text-right space-y-0.5">
            <div className="text-slate-900 text-[10px] font-black">(=) Total: R$ {totalFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <div className="text-rose-700 text-[10px] font-black underline">A Receber: R$ {aReceber.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
          </div>
        </div>
      </div>

      {/* 3-Column Grid: RECEITA | LENTE | ARMAÇÃO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
        {renderRxTable()}

        {/* Column 2: LENTE */}
        <div className="border border-slate-400 text-[10px] flex flex-col justify-between">
          <div className="bg-slate-100 font-bold border-b border-slate-400 text-center py-0.5">
            LENTE
          </div>
          <div className="p-2 space-y-1 text-[9px]">
            <div><strong>Modelo:</strong> {order.lens.name}</div>
            <div><strong>Marca:</strong> {order.lens.brand}</div>
            <div><strong>Índice:</strong> {order.lens.indexRefraction}</div>
          </div>
        </div>

        {/* Column 3: ARMAÇÃO */}
        <div className="border border-slate-400 text-[10px] flex flex-col justify-between">
          <div className="bg-slate-100 font-bold border-b border-slate-400 text-center py-0.5">
            ARMAÇÃO
          </div>
          <div className="p-2 space-y-1 text-[9px]">
            <div>Dist. Pup.: <strong>{order.distPupilar ? order.distPupilar.toFixed(2) : '0.00'}</strong></div>
            <div>Própria: <strong>{order.armacaoPropria ? 'Sim' : 'Não'}</strong></div>
            <div>Segue: <strong>{order.armacaoSegue ? 'Sim' : 'Não'}</strong></div>
          </div>
        </div>
      </div>

      <div className="text-right text-[9px] font-extrabold uppercase text-slate-700 pt-1">
        Via da Ótica
      </div>
    </div>
  );

  /* Render Via do Cliente (Image 2 Bottom Model) */
  const renderViaCliente = () => (
    <div className="bg-white p-4 border-2 border-slate-800 rounded-lg text-slate-900 font-sans space-y-3 print:border-black print:p-2">
      {/* Top Header */}
      <div className="border border-slate-800 p-2 rounded-xs flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <OticasLogo size="sm" variant="dark-text" />
          <div>
            <h2 className="text-sm font-black uppercase tracking-tight">DI Óticas</h2>
            <div className="text-[9.5px] text-slate-700 font-bold">CNPJ: {cnpj}</div>
            <div className="text-[9px] text-slate-600">{lojaEndereco}</div>
            <div className="text-[9px] text-slate-600">{lojaCidade}</div>
            <div className="text-[9px] font-bold text-slate-800">{lojaTelefone}</div>
          </div>
        </div>

        <div className="text-right flex items-center gap-3">
          <div>
            <div className="text-xs font-black text-slate-900">
              Ordem de Serviço: <span className="text-sm underline">{order.osNumber.replace('OS-', '')}</span>
            </div>
          </div>

          {/* QR Code + Barcode Graphics */}
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 bg-slate-100 border border-slate-800 p-1 flex items-center justify-center">
              <QrCode className="w-10 h-10 text-slate-900" />
            </div>
            {renderBarcode()}
          </div>
        </div>
      </div>

      {/* Customer Header */}
      <div className="border border-slate-800 p-1.5 text-xs font-bold uppercase bg-slate-50 flex justify-between">
        <span>Cliente: <strong className="text-slate-900">{order.clientName}</strong></span>
        <span>Prev. Entrega: <strong className="text-slate-900">{prevEntrega}</strong></span>
      </div>

      {/* Products Table */}
      <div className="border border-slate-800 text-xs">
        <table className="w-full text-left border-collapse text-[9px]">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-100 font-bold uppercase">
              <th className="p-1 border-r border-slate-800">Ref. - Produto</th>
              <th className="p-1 w-10 text-center border-r border-slate-800">Qtde</th>
              <th className="p-1 w-20 text-right border-r border-slate-800">Val. Un.(R$)</th>
              <th className="p-1 w-16 text-right border-r border-slate-800">Acrés.(R$)</th>
              <th className="p-1 w-16 text-right border-r border-slate-800">Desc.(R$)</th>
              <th className="p-1 w-20 text-right">Valor Total(R$)</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx} className="border-b border-slate-300">
                <td className="p-1 border-r border-slate-800 font-semibold">{item.ref}</td>
                <td className="p-1 text-center border-r border-slate-800 font-bold">{item.qtde}</td>
                <td className="p-1 text-right border-r border-slate-800">{item.valUnit.toFixed(2)}</td>
                <td className="p-1 text-right border-r border-slate-800">{item.acrescimo ? item.acrescimo.toFixed(2) : '-'}</td>
                <td className="p-1 text-right border-r border-slate-800 text-emerald-700">{item.desconto.toFixed(2)}</td>
                <td className="p-1 text-right font-bold">{item.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-slate-100 font-bold border-t border-slate-800 text-[9px]">
              <td className="p-1 text-right pr-2" colSpan={5}>Quantidade total:</td>
              <td className="p-1 text-right">{totalQtde}</td>
            </tr>
          </tfoot>
        </table>

        {/* Totals Row */}
        <div className="p-1.5 border-t border-slate-800 font-bold text-[9px] bg-slate-100 flex justify-between flex-wrap gap-2">
          <span>Subtotal: R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          <span>Desconto: R$ {totalDesconto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          <span className="text-slate-900 font-black">Total: R$ {totalFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          <span className="text-emerald-800">Adiant.: R$ {adiantamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          <span className="text-rose-800 font-extrabold underline">Restam: R$ {aReceber.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
        </div>
      </div>

      {/* Adiantamento Section Box */}
      <div className="border border-slate-800 text-[9px]">
        <div className="bg-slate-200 font-black text-center py-0.5 tracking-widest border-b border-slate-800 uppercase">
          *** ADIANTAMENTO ***
        </div>
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="border-b border-slate-300 bg-slate-50 font-bold">
              <th className="p-1 border-r border-slate-300">Data</th>
              <th className="p-1 border-r border-slate-300">Forma de Pagamento</th>
              <th className="p-1 border-r border-slate-300">Valor (R$)</th>
              <th className="p-1">Responsável</th>
            </tr>
          </thead>
          <tbody>
            {adiantamentosList.map((ad, idx) => (
              <tr key={idx} className="border-b border-slate-200 font-medium">
                <td className="p-1 border-r border-slate-300">{ad.data}</td>
                <td className="p-1 border-r border-slate-300 font-semibold">{ad.formaPagamento}</td>
                <td className="p-1 border-r border-slate-300 font-bold text-emerald-800">{ad.valor.toFixed(2)}</td>
                <td className="p-1">{ad.responsavel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Signature Area */}
      <div className="pt-6 pb-2 text-center space-y-1">
        <div className="w-64 mx-auto border-b border-slate-800"></div>
        <div className="text-[9px] font-bold uppercase text-slate-800">Responsável</div>
      </div>

      <div className="text-right text-[9px] font-extrabold uppercase text-slate-700 pt-1">
        Via do Cliente
      </div>
    </div>
  );

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Top Action Bar & Tab Switcher (Hidden in Print) */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('todas')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'todas'
                ? 'bg-[#071D49] text-[#E8D2A8] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📄 Todas as Vias
          </button>
          <button
            onClick={() => setActiveTab('laboratorio')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'laboratorio'
                ? 'bg-[#071D49] text-[#E8D2A8] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🔬 Via do Laboratório
          </button>
          <button
            onClick={() => setActiveTab('otica')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'otica'
                ? 'bg-[#071D49] text-[#E8D2A8] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🏪 Via da Ótica
          </button>
          <button
            onClick={() => setActiveTab('cliente')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'cliente'
                ? 'bg-[#071D49] text-[#E8D2A8] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            👤 Via do Cliente
          </button>
        </div>

        <div className="flex items-center gap-2">
          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
            >
              Fechar
            </button>
          )}

          <button
            onClick={handlePrintClick}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Printer className="w-4 h-4" /> Imprimir Modelo Oficial OS
          </button>
        </div>
      </div>

      {/* Printable Container Body */}
      <div className="bg-slate-100 p-4 rounded-2xl print:p-0 print:bg-white print:m-0 space-y-6">
        <div className={`space-y-2 ${activeTab !== 'todas' && activeTab !== 'laboratorio' ? 'hidden print:block' : 'block'}`}>
          {renderViaLaboratorio()}
        </div>

        <div className={`my-6 border-b-2 border-dashed border-slate-400 flex items-center justify-center relative print:my-4 ${activeTab !== 'todas' ? 'hidden print:flex' : 'flex'}`}>
          <span className="bg-slate-100 print:bg-white px-3 py-0.5 text-[10px] font-mono text-slate-500 font-bold flex items-center gap-1">
            <Scissors className="w-3.5 h-3.5 text-slate-700" /> CORTE AQUI (VIAS DA ÓTICA E DO CLIENTE)
          </span>
        </div>

        <div className={`space-y-2 ${activeTab !== 'todas' && activeTab !== 'otica' ? 'hidden print:block' : 'block'}`}>
          {renderViaOtica()}
        </div>

        <div className={`my-6 border-b-2 border-dashed border-slate-400 flex items-center justify-center relative print:my-4 ${activeTab !== 'todas' ? 'hidden print:flex' : 'flex'}`}>
          <span className="bg-slate-100 print:bg-white px-3 py-0.5 text-[10px] font-mono text-slate-500 font-bold flex items-center gap-1">
            <Scissors className="w-3.5 h-3.5 text-slate-700" /> CORTE AQUI (VIA DO CLIENTE)
          </span>
        </div>

        <div className={`space-y-2 ${activeTab !== 'todas' && activeTab !== 'cliente' ? 'hidden print:block' : 'block'}`}>
          {renderViaCliente()}
        </div>
      </div>
    </div>
  );
};
