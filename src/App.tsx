/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { ClientListView } from './components/ClientListView';
import { ClientProfileView } from './components/ClientProfileView';
import { BillingListView } from './components/BillingListView';
import { BillReceiveModal } from './components/BillReceiveModal';
import { PrintInvoiceModal } from './components/PrintInvoiceModal';
import { ClientAddModal } from './components/ClientAddModal';
import { MikrotikServerView } from './components/MikrotikServerView';
import { SupportTicketingView } from './components/SupportTicketingView';
import { CustomerDashboardView } from './components/CustomerDashboardView';
import { ResellerPopView } from './components/ResellerPopView';
import { AutomatedSettingsView } from './components/AutomatedSettingsView';
import { AutomaticProcessView } from './components/AutomaticProcessView';
import { NetworkMonitorView } from './components/NetworkMonitorView';
import { AccountingView } from './components/AccountingView';
import { ReportsView } from './components/ReportsView';
import { SystemConfigView } from './components/SystemConfigView';
import { DeduplicationView } from './components/DeduplicationView';
import { VasBdixView } from './components/VasBdixView';
import { ApplicationUsersView } from './components/ApplicationUsersView';
import { SmsGatewayView } from './components/SmsGatewayView';
import { OperationsView } from './components/OperationsView';

import {
  INITIAL_CLIENTS,
  INITIAL_BILLING_LIST,
  INITIAL_RECEIPTS,
  INITIAL_TICKETS,
  INITIAL_SERVERS,
  INITIAL_POP_RESELLERS,
  INITIAL_AUTOMATED_PROCESSES,
  INITIAL_SMS_TEMPLATES
} from './mockData';

import { Client, BillRecord, PaymentReceipt, SupportTicket } from './types';
import { Toast } from './components/common';

export default function App() {
  // Navigation & Portal Mode
  const [activeNav, setActiveNav] = useState('dashboard');
  const [portalMode, setPortalMode] = useState<'admin' | 'customer'>('admin');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Core Data
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
  const [selectedClientCode, setSelectedClientCode] = useState<string>('0006'); // Younus Ali
  const [billingList, setBillingList] = useState<BillRecord[]>(INITIAL_BILLING_LIST);
  const [receipts, setReceipts] = useState<PaymentReceipt[]>(INITIAL_RECEIPTS);
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);
  const [servers, setServers] = useState(INITIAL_SERVERS);
  const [resellers, setResellers] = useState(INITIAL_POP_RESELLERS);
  const [automatedProcesses, setAutomatedProcesses] = useState(INITIAL_AUTOMATED_PROCESSES);
  const [smsTemplates, setSmsTemplates] = useState(INITIAL_SMS_TEMPLATES);

  // Modals
  const [isBillReceiveModalOpen, setIsBillReceiveModalOpen] = useState(false);
  const [billReceiveTargetClient, setBillReceiveTargetClient] = useState<Client | null>(null);

  const [isPrintInvoiceOpen, setIsPrintInvoiceOpen] = useState(false);
  const [printTargetBill, setPrintTargetBill] = useState<BillRecord | null>(null);
  const [printTargetReceipt, setPrintTargetReceipt] = useState<PaymentReceipt | null>(null);

  const [isClientAddOpen, setIsClientAddOpen] = useState(false);
  const [toastNotification, setToastNotification] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastNotification(msg);
    setTimeout(() => setToastNotification(null), 3500);
  };

  // Find currently viewed client
  const activeClient = clients.find((c) => c.code === selectedClientCode) || clients[0];

  // Actions
  const handleSelectClient = (clientCode: string) => {
    setSelectedClientCode(clientCode);
    setActiveNav('clientProfile');
  };

  const handleOpenBillReceive = (clientCode: string) => {
    const target = clients.find((c) => c.code === clientCode) || activeClient;
    setBillReceiveTargetClient(target);
    setIsBillReceiveModalOpen(true);
  };

  const handleConfirmPayment = (receipt: PaymentReceipt) => {
    // Add to receipts
    setReceipts((prev) => [receipt, ...prev]);

    // Update client balance and status
    setClients((prev) =>
      prev.map((c) => {
        if (c.code === receipt.clientCode) {
          return {
            ...c,
            balanceDue: receipt.balanceDue,
            billingStatus: 'Active',
            mikrotikStatus: true
          };
        }
        return c;
      })
    );

    // Update billing list
    setBillingList((prev) =>
      prev.map((b) => {
        if (b.clientCode === receipt.clientCode) {
          return {
            ...b,
            receivedAmount: b.receivedAmount + receipt.receivedBill,
            balanceDue: receipt.balanceDue,
            billingStatus: receipt.balanceDue === 0 ? 'Paid' : 'Unpaid',
            paymentDate: receipt.receivedDate
          };
        }
        return b;
      })
    );

    setIsBillReceiveModalOpen(false);
    triggerToast(`Payment of ৳${receipt.totalBill} received for client ${receipt.clientCode}!`);

    // Open print receipt option
    setPrintTargetReceipt(receipt);
    setPrintTargetBill(null);
    setIsPrintInvoiceOpen(true);
  };

  const handlePrintInvoice = (bill: BillRecord) => {
    setPrintTargetBill(bill);
    setPrintTargetReceipt(null);
    setIsPrintInvoiceOpen(true);
  };

  const handlePrintReceipt = (receipt: PaymentReceipt) => {
    setPrintTargetReceipt(receipt);
    setPrintTargetBill(null);
    setIsPrintInvoiceOpen(true);
  };

  const handleAddClient = (newClient: Client) => {
    setClients((prev) => [newClient, ...prev]);
    // Also create initial bill record
    const newBill: BillRecord = {
      id: `bill-${newClient.id}`,
      clientCode: newClient.code,
      username: newClient.username,
      clientName: newClient.name,
      mobile: newClient.mobile,
      zone: newClient.zone,
      clientType: newClient.clientType,
      connectionType: newClient.connectionType,
      address: newClient.address,
      package: newClient.packageName,
      speed: newClient.packageSpeed,
      expireDay: newClient.expireDate,
      monthlyBill: newClient.monthlyBill,
      receivedAmount: 0,
      vatAmount: Math.round(newClient.monthlyBill * 0.05),
      balanceDue: newClient.monthlyBill,
      advanceAmount: 0,
      paymentDate: '',
      server: newClient.server,
      mikrotikStatus: true,
      billingStatus: 'Unpaid'
    };
    setBillingList((prev) => [newBill, ...prev]);
    setSelectedClientCode(newClient.code);
    setActiveNav('clientProfile');
    triggerToast(`Client ${newClient.name} (${newClient.code}) successfully added and provisioned!`);
  };

  const handleToggleMikrotikStatus = (clientCode: string) => {
    setClients((prev) =>
      prev.map((c) => {
        if (c.code === clientCode) {
          const nextStatus = !c.mikrotikStatus;
          triggerToast(`Client ${c.code} MikroTik state switched to: ${nextStatus ? 'ACTIVE' : 'DISABLED'}`);
          return {
            ...c,
            mikrotikStatus: nextStatus,
            billingStatus: nextStatus ? 'Active' : 'Disabled'
          };
        }
        return c;
      })
    );
  };

  const handleGenerateMonthlyCycle = () => {
    triggerToast('Automated Monthly Invoicing run complete: 587 invoices processed.');
  };

  // Support Ticket Actions
  const handleResolveTicket = (ticketNo: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.ticketNo === ticketNo ? { ...t, status: 'Solved' } : t))
    );
    triggerToast(`Ticket #${ticketNo} marked as Solved!`);
  };

  const handleReassignTicket = (ticketNo: string, newTech: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.ticketNo === ticketNo ? { ...t, assignTo: newTech } : t))
    );
    triggerToast(`Ticket #${ticketNo} reassigned to ${newTech}!`);
  };

  const handleCustomerPlanUpgrade = (pkgName: string, pkgSpeed: string, monthlyBill: number) => {
    setClients((prev) =>
      prev.map((c) => {
        if (c.code === activeClient.code) {
          return {
            ...c,
            packageName: pkgName,
            packageSpeed: pkgSpeed,
            monthlyBill
          };
        }
        return c;
      })
    );

    setBillingList((prev) =>
      prev.map((b) => {
        if (b.clientCode === activeClient.code) {
          return {
            ...b,
            package: pkgName,
            speed: pkgSpeed,
            monthlyBill
          };
        }
        return b;
      })
    );
  };

  const handleCustomerOnlinePayment = (amount: number, method: string) => {
    const newReceipt: PaymentReceipt = {
      id: `rc-online-${Date.now()}`,
      clientCode: activeClient.code,
      receivedDate: '14 Sep 2026',
      receivedBy: `${method} PGW`,
      paymentMethod: method as any,
      paymentInfo: `Customer Portal self-pay via ${method}`,
      createdBy: 'Customer (Online)',
      remarks: 'Automated digital payment confirmation',
      discount: 0,
      receivedBill: amount,
      totalBill: amount,
      vat: Math.round(amount * 0.05),
      balanceDue: 0,
      receiptNo: `PGW-${Date.now().toString().slice(-6)}`,
      month: 'September 2026'
    };

    setReceipts((prev) => [newReceipt, ...prev]);
    setClients((prev) =>
      prev.map((c) =>
        c.code === activeClient.code
          ? { ...c, balanceDue: 0, billingStatus: 'Active', mikrotikStatus: true }
          : c
      )
    );
  };

  const handleCustomerSubmitTicket = (problem: string, description: string) => {
    const newTicket: SupportTicket = {
      ticketNo: (649 + tickets.length).toString(),
      clientCode: activeClient.code,
      username: activeClient.username,
      customerName: activeClient.name,
      mobile: activeClient.mobile,
      complainNo: `CMP-${Date.now().toString().slice(-4)}`,
      zone: activeClient.zone,
      subzone: activeClient.subzone,
      box: activeClient.box || 'Box-04',
      problem: problem as any,
      priority: 'High',
      complainTime: 'Just now',
      createdBy: 'Customer Portal',
      status: 'Processing',
      assignTo: 'Sobuj Biplob (Fiber Tech)',
      duration: '0d:0h:1m',
      note: description
    };
    setTickets((prev) => [newTicket, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#f4f7f9] flex flex-col font-sans text-slate-800 antialiased selection:bg-cyan-500 selection:text-white">
      {/* Toast Notification */}
      {toastNotification && (
        <Toast
          message={toastNotification}
          onClose={() => setToastNotification(null)}
        />
      )}

      {/* Global Header */}
      <Header
        activeNav={activeNav}
        onNavigate={(nav) => setActiveNav(nav)}
        portalMode={portalMode}
        onTogglePortalMode={(mode) => {
          setPortalMode(mode);
          if (mode === 'customer') {
            setActiveNav('customerPortal');
          } else if (activeNav === 'customerPortal') {
            setActiveNav('dashboard');
          }
        }}
        clients={clients}
        onSelectClient={(client) => handleSelectClient(client.code)}
        onQuickSearchSelect={(code) => handleSelectClient(code)}
        onOpenAddClient={() => setIsClientAddOpen(true)}
        onOpenNewTicketModal={() => setActiveNav('support')}
        onOpenLiveMonitorModal={() => setActiveNav('mikrotik')}
      />

      {/* Main Layout Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (shown in admin mode, hidden in full customer self-service mode) */}
        {portalMode === 'admin' && (
          <Sidebar
            activeNav={activeNav}
            onNavigate={(nav) => setActiveNav(nav)}
            collapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            badgeCounts={{
              clients: (clients || []).length,
              billingDue: (billingList || []).filter((b) => b.billingStatus === 'Unpaid').length,
              tickets: (tickets || []).filter((t) => t.status !== 'Solved').length
            }}
          />
        )}

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto max-h-[calc(100vh-3.5rem)]">
          {/* View Routing */}
          {portalMode === 'customer' || activeNav === 'customerPortal' ? (
            <CustomerDashboardView
              client={activeClient}
              receipts={receipts}
              tickets={tickets}
              onUpgradePlan={handleCustomerPlanUpgrade}
              onPayBillOnline={handleCustomerOnlinePayment}
              onPrintReceipt={handlePrintReceipt}
              onSubmitSupportTicket={handleCustomerSubmitTicket}
              onReturnToAdmin={() => {
                setPortalMode('admin');
                setActiveNav('dashboard');
              }}
            />
          ) : activeNav === 'dashboard' ? (
            <DashboardView
              clients={clients}
              billingList={billingList}
              onNavigate={(nav) => setActiveNav(nav)}
              onSelectClientByCode={(code) => handleSelectClient(code)}
              onSelectClient={(code) => handleSelectClient(code)}
              onOpenBillReceiveModalForClient={(code) => handleOpenBillReceive(code)}
            />
          ) : activeNav === 'clients' || activeNav === 'client-list' || activeNav === 'client-new-req' || activeNav === 'client-left' ? (
            <ClientListView
              clients={clients}
              onSelectClient={(c) => (typeof c === 'string' ? handleSelectClient(c) : handleSelectClient(c.code))}
              onOpenAddClient={() => setIsClientAddOpen(true)}
              onOpenBillReceive={(code) => handleOpenBillReceive(code)}
              onCollectBill={(code) => handleOpenBillReceive(code)}
              onToggleMikrotikStatus={handleToggleMikrotikStatus}
              onToggleStatus={handleToggleMikrotikStatus}
            />
          ) : activeNav === 'clientProfile' ? (
            <ClientProfileView
              client={activeClient}
              receipts={receipts}
              tickets={tickets}
              onBack={() => setActiveNav('clients')}
              onBackToList={() => setActiveNav('clients')}
              onOpenBillReceive={() => handleOpenBillReceive(activeClient.code)}
              onToggleStatus={() => handleToggleMikrotikStatus(activeClient.code)}
              onPrintReceipt={handlePrintReceipt}
              onSwitchToCustomerPortal={() => {
                setPortalMode('customer');
                setActiveNav('customerPortal');
              }}
            />
          ) : activeNav === 'billing' ? (
            <BillingListView
              billingList={billingList}
              onOpenBillReceive={(code) => handleOpenBillReceive(code)}
              onPrintInvoice={handlePrintInvoice}
              onGenerateMonthlyCycle={handleGenerateMonthlyCycle}
              onToggleMikrotikStatus={handleToggleMikrotikStatus}
            />
          ) : activeNav === 'mikrotik' || activeNav === 'mikrotik-server' ? (
            <MikrotikServerView
              servers={servers}
              onToggleServer={(id) => {
                setServers((prev) =>
                  prev.map((s) => (s.id === id ? { ...s, status: !s.status } : s))
                );
                triggerToast('Mikrotik Server status updated!');
              }}
              onImportClients={() => {
                triggerToast('Imported and reconciled 12 PPPoE accounts from BBN-CORE router!');
              }}
            />
          ) : activeNav === 'mikrotik-monitor' || activeNav === 'network-monitor' || activeNav === 'olt' || activeNav === 'network' ? (
            <NetworkMonitorView
              clients={clients}
              onDisconnectSession={(username) => {
                triggerToast(`PPPoE session for ${username} disconnected.`);
              }}
              onSelectClient={(c) => handleSelectClient(c.code)}
            />
          ) : activeNav === 'income' ? (
            <AccountingView
              receipts={receipts}
              onOpenReceipt={handlePrintReceipt}
              initialTab="daily"
            />
          ) : activeNav === 'expense' ? (
            <AccountingView
              receipts={receipts}
              onOpenReceipt={handlePrintReceipt}
              initialTab="expenses"
            />
          ) : activeNav === 'daily-account' ? (
            <AccountingView
              receipts={receipts}
              onOpenReceipt={handlePrintReceipt}
              initialTab="cashbook"
            />
          ) : activeNav === 'accounting' || activeNav === 'accounting-dash' || activeNav === 'daily-collection' ? (
            <AccountingView
              receipts={receipts}
              onOpenReceipt={handlePrintReceipt}
              initialTab="daily"
            />
          ) : activeNav === 'operations' || activeNav === 'task-manager' || activeNav === 'bw-buy-sale' || activeNav === 'inventory' || activeNav === 'assets' || activeNav === 'sales-service' || activeNav === 'affiliation' || activeNav === 'tutorials' || activeNav === 'release-notes' || activeNav === 'hr-payslip' ? (
            <OperationsView
              initialTab={
                activeNav === 'task-manager'
                  ? 'tasks'
                  : activeNav === 'bw-buy-sale'
                  ? 'bandwidth'
                  : activeNav === 'inventory'
                  ? 'inventory'
                  : activeNav === 'assets'
                  ? 'assets'
                  : activeNav === 'sales-service'
                  ? 'sales'
                  : activeNav === 'affiliation'
                  ? 'affiliation'
                  : activeNav === 'tutorials'
                  ? 'tutorials'
                  : activeNav === 'release-notes'
                  ? 'release'
                  : activeNav === 'hr-payslip'
                  ? 'hr'
                  : 'tasks'
              }
              onShowToast={triggerToast}
            />
          ) : activeNav === 'reports' || activeNav === 'btrc-report' ? (
            <ReportsView
              clients={clients}
              billingList={billingList}
            />
          ) : activeNav === 'app-users' || activeNav === 'application-users' ? (
            <ApplicationUsersView onShowToast={triggerToast} />
          ) : activeNav === 'deduplication' || activeNav === 'system-deduplication' ? (
            <DeduplicationView onShowToast={triggerToast} />
          ) : activeNav === 'system-config' || activeNav === 'settings' || activeNav === 'system-setup' || activeNav === 'company-settings' || activeNav === 'configuration' || activeNav === 'setting' || activeNav === 'system' ? (
            <SystemConfigView
              initialTab={
                activeNav === 'company-settings'
                  ? 'company'
                  : activeNav === 'settings' || activeNav === 'setting'
                  ? 'billing-rules'
                  : activeNav === 'system-setup'
                  ? 'payment-gateways'
                  : 'company'
              }
              onShowToast={triggerToast}
            />
          ) : activeNav === 'vas' ? (
            <VasBdixView />
            ) : activeNav === 'support' ? (
            <SupportTicketingView
              tickets={tickets}
              onOpenNewTicket={() => {
                const newTNo = (650 + tickets.length).toString();
                const newT: SupportTicket = {
                  ticketNo: newTNo,
                  clientCode: '0006',
                  username: 'haven',
                  customerName: 'Younus Ali',
                  mobile: '01710287818',
                  complainNo: `CMP-${Date.now().toString().slice(-4)}`,
                  zone: 'Jamtola',
                  subzone: 'Bot Tola',
                  box: 'Box-01',
                  problem: 'Speed Issue',
                  priority: 'High',
                  complainTime: 'Just now',
                  createdBy: 'bbnasad',
                  status: 'Processing',
                  assignTo: 'Sobuj Biplob (Fiber Tech)',
                  duration: '0d:0h:1m',
                  note: 'Fiber power check requested at Jamtola node'
                };
                setTickets((prev) => [newT, ...prev]);
                triggerToast(`New support ticket #${newTNo} created!`);
              }}
              onResolveTicket={handleResolveTicket}
              onReassignTicket={handleReassignTicket}
            />
          ) : activeNav === 'resellers' || activeNav === 'pop-list' ? (
            <ResellerPopView
              resellers={resellers}
              onAddReseller={(newPop) => {
                setResellers((prev) => [...prev, newPop]);
                triggerToast(`POP Reseller ${newPop.name} added!`);
              }}
              onRechargeReseller={(id, amount) => {
                setResellers((prev) =>
                  prev.map((r) => (r.id === id ? { ...r, balanceDue: 0 } : r))
                );
                triggerToast('POP Reseller bill collected successfully!');
              }}
            />
          ) : activeNav === 'automatic-process' ? (
            <AutomaticProcessView
              processes={automatedProcesses}
              onUpdateProcess={(updated) => {
                setAutomatedProcesses((prev) =>
                  prev.map((p) => (p.id === updated.id ? updated : p))
                );
              }}
              onRunProcess={(id) => {
                const proc = automatedProcesses.find((p) => p.id === id);
                triggerToast(`Dispatched cron job: ${proc?.processName || id}`);
              }}
              onShowToast={triggerToast}
            />
          ) : activeNav === 'sms-gateway' ? (
            <SmsGatewayView onShowToast={triggerToast} />
          ) : activeNav === 'sms-individual' || activeNav === 'sms-group' || activeNav === 'sms-send' || activeNav === 'automation' || activeNav === 'sms' || activeNav === 'sms-templates' ? (
            <AutomatedSettingsView
              automatedProcesses={automatedProcesses}
              smsTemplates={smsTemplates}
              initialTab={
                activeNav === 'sms-individual' || activeNav === 'sms-send'
                  ? 'individual'
                  : activeNav === 'sms-group'
                  ? 'group'
                  : activeNav === 'sms' || activeNav === 'sms-templates'
                  ? 'sms'
                  : 'automation'
              }
              onToggleProcess={(id) => {
                setAutomatedProcesses((prev) =>
                  prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p))
                );
                triggerToast('Automated scheduled process updated!');
              }}
              onRunProcessManually={(id) => {
                triggerToast('Process manually triggered and executed successfully!');
              }}
              onSaveSmsTemplate={(id, text) => {
                setSmsTemplates((prev) =>
                  prev.map((t) => (t.id === id ? { ...t, template: text } : t))
                );
                triggerToast('SMS template saved and deployed to gateway!');
              }}
            />
          ) : (
            <DashboardView
              clients={clients}
              billingList={billingList}
              onNavigate={(nav) => setActiveNav(nav)}
              onSelectClient={(code) => handleSelectClient(code)}
            />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <BillReceiveModal
        isOpen={isBillReceiveModalOpen}
        client={billReceiveTargetClient}
        onClose={() => setIsBillReceiveModalOpen(false)}
        onConfirmPayment={handleConfirmPayment}
      />

      <PrintInvoiceModal
        isOpen={isPrintInvoiceOpen}
        bill={printTargetBill}
        receipt={printTargetReceipt}
        onClose={() => setIsPrintInvoiceOpen(false)}
      />

      <ClientAddModal
        isOpen={isClientAddOpen}
        onClose={() => setIsClientAddOpen(false)}
        onAddClient={handleAddClient}
      />
    </div>
  );
}
