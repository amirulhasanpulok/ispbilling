import React, { useState } from 'react';
import {
  User,
  ArrowLeft,
  DollarSign,
  Wifi,
  HelpCircle,
  Network,
  Key,
  Send,
  Printer,
  Activity,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { Client, PaymentReceipt, SupportTicket } from '../types';
import { PageHeader, StatusBadge, EmptyState, Toast } from './common';

interface ClientProfileViewProps {
  client: Client;
  receipts?: PaymentReceipt[];
  tickets?: SupportTicket[];
  onBack?: () => void;
  onBackToList?: () => void;
  onOpenBillReceive: (clientCode: string) => void;
  onPrintReceipt: (receipt: PaymentReceipt) => void;
  onSwitchToCustomerPortal?: () => void;
  onToggleStatus?: () => void;
}

export const ClientProfileView: React.FC<ClientProfileViewProps> = ({
  client,
  receipts = [],
  tickets = [],
  onBack,
  onBackToList,
  onOpenBillReceive,
  onPrintReceipt,
  onSwitchToCustomerPortal,
  onToggleStatus
}) => {
  const [activeTab, setActiveTab] = useState<
    'service' | 'network' | 'personal' | 'billing-history' | 'complain-history' | 'bandwidth'
  >('service');
  const [mikrotikEnabled, setMikrotikEnabled] = useState(client?.mikrotikStatus ?? true);
  const [clientAccessEnabled, setClientAccessEnabled] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const handleBack = () => {
    if (onBack) onBack();
    else if (onBackToList) onBackToList();
  };

  const showNotification = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const safeReceipts = Array.isArray(receipts) ? receipts : [];
  const safeTickets = Array.isArray(tickets) ? tickets : [];
  const clientCode = client?.code || '';
  const clientUsername = client?.username || '';

  const clientReceipts = safeReceipts.filter((r) => r.clientCode === clientCode);
  const clientTickets = safeTickets.filter(
    (t) => (clientCode && t.clientCode === clientCode) || (clientUsername && t.username === clientUsername)
  );

  return (
    <div className="p-4 sm:p-5 space-y-4 bg-slate-50 min-h-[calc(100vh-3.5rem)] text-slate-800">
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {/* Unified Page Header */}
      <PageHeader
        title={`Subscriber Profile: ${client.name}`}
        subtitle={`Subscriber Code: ${client.code} | PPPoE: ${client.username} | ${client.zone} - ${client.subzone}`}
        icon={User}
        breadcrumbs={[
          { label: 'Home', onClick: handleBack },
          { label: 'Clients', onClick: handleBack },
          { label: client.name }
        ]}
        actions={
          <>
            <button
              onClick={handleBack}
              className="px-3 py-1.5 border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium rounded-lg text-xs flex items-center gap-1.5 transition-colors bg-white shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Clients</span>
            </button>

            <button
              onClick={() => onOpenBillReceive(client.code)}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors focus:ring-2 focus:ring-emerald-500"
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Collect Bill</span>
            </button>

            {onSwitchToCustomerPortal && (
              <button
                onClick={onSwitchToCustomerPortal}
                className="px-3.5 py-1.5 bg-[#162e3d] hover:bg-[#203c4f] text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
                title="Open customer self-service dashboard as this user"
              >
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span>Login As Client</span>
              </button>
            )}
          </>
        }
      />

      {/* Main Grid: Left Profile Card + Right Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left Column Profile Card */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 space-y-4">
          {/* Avatar & Identifiers */}
          <div className="flex flex-col items-center text-center pb-3 border-b border-slate-100">
            <div className="w-20 h-20 rounded-full bg-cyan-700 border-4 border-cyan-100 flex items-center justify-center text-white shadow-xs mb-2">
              <User className="w-10 h-10" />
            </div>
            <h3 className="font-bold text-base text-slate-900">{client.name}</h3>
            <p className="text-xs text-slate-500">{client.email}</p>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-cyan-50 text-cyan-800 border border-cyan-200 font-mono">
                Code: {client.code}
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono">
                PPPoE: {client.username}
              </span>
            </div>
          </div>

          {/* Quick Status Attributes */}
          <div className="space-y-2.5 text-xs divide-y divide-slate-100">
            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-500 font-medium">Billing Status:</span>
              <StatusBadge status={client.billingStatus} type="billing" />
            </div>

            <div className="flex items-center justify-between pt-2.5">
              <span className="text-slate-500 font-medium">MikroTik Active:</span>
              <button
                type="button"
                onClick={() => {
                  setMikrotikEnabled(!mikrotikEnabled);
                  if (onToggleStatus) onToggleStatus();
                  showNotification(
                    !mikrotikEnabled
                      ? `Enabled PPPoE session on ${client.server}`
                      : `Disabled PPPoE session on ${client.server}`
                  );
                }}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  mikrotikEnabled ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
                aria-label="Toggle MikroTik status"
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    mikrotikEnabled ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between pt-2.5">
              <span className="text-slate-500 font-medium">Joining Date:</span>
              <span className="font-semibold text-slate-800">{client.joiningDate}</span>
            </div>

            <div className="flex items-center justify-between pt-2.5">
              <span className="text-slate-500 font-medium">Monthly Bill:</span>
              <span className="font-bold text-slate-900 font-mono">৳{client.monthlyBill.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between pt-2.5">
              <span className="text-slate-500 font-medium">Client Portal Access:</span>
              <button
                type="button"
                onClick={() => {
                  setClientAccessEnabled(!clientAccessEnabled);
                  showNotification(
                    !clientAccessEnabled
                      ? 'Client Self-Service Portal Access Enabled'
                      : 'Client Self-Service Portal Access Suspended'
                  );
                }}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  clientAccessEnabled ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
                aria-label="Toggle Client Portal access"
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    clientAccessEnabled ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => showNotification('Client Information modal ready')}
              className="w-full py-2 bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              Update Information
            </button>
            <button
              onClick={() => showNotification(`SMS dispatched to ${client.mobile}`)}
              className="w-full py-2 bg-[#162e3d] hover:bg-[#203c4f] text-white text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send SMS / Notice</span>
            </button>
            <button
              onClick={() => showNotification('Temporary Password regenerated and sent via SMS')}
              className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Password Regenerate</span>
            </button>
            {onSwitchToCustomerPortal && (
              <button
                onClick={onSwitchToCustomerPortal}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <User className="w-3.5 h-3.5" />
                <span>Login As Client</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Tabbed Content */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow-xs border border-slate-200 flex flex-col overflow-hidden">
          {/* Tabs Bar */}
          <div className="flex flex-wrap border-b border-slate-200 bg-slate-50 px-2 pt-2 gap-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('service')}
              className={`px-3.5 py-2 rounded-t-lg flex items-center gap-1.5 transition-colors ${
                activeTab === 'service'
                  ? 'bg-white text-cyan-800 border-t-2 border-cyan-600 border-x border-slate-200 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-cyan-800 hover:bg-slate-100'
              }`}
            >
              <Wifi className="w-3.5 h-3.5" />
              <span>Service Details</span>
            </button>

            <button
              onClick={() => setActiveTab('network')}
              className={`px-3.5 py-2 rounded-t-lg flex items-center gap-1.5 transition-colors ${
                activeTab === 'network'
                  ? 'bg-white text-cyan-800 border-t-2 border-cyan-600 border-x border-slate-200 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-cyan-800 hover:bg-slate-100'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>Network &amp; PON</span>
            </button>

            <button
              onClick={() => setActiveTab('personal')}
              className={`px-3.5 py-2 rounded-t-lg flex items-center gap-1.5 transition-colors ${
                activeTab === 'personal'
                  ? 'bg-white text-cyan-800 border-t-2 border-cyan-600 border-x border-slate-200 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-cyan-800 hover:bg-slate-100'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Subscriber Info</span>
            </button>

            <button
              onClick={() => setActiveTab('billing-history')}
              className={`px-3.5 py-2 rounded-t-lg flex items-center gap-1.5 transition-colors ${
                activeTab === 'billing-history'
                  ? 'bg-white text-cyan-800 border-t-2 border-cyan-600 border-x border-slate-200 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-cyan-800 hover:bg-slate-100'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Payments ({clientReceipts.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('complain-history')}
              className={`px-3.5 py-2 rounded-t-lg flex items-center gap-1.5 transition-colors ${
                activeTab === 'complain-history'
                  ? 'bg-white text-cyan-800 border-t-2 border-cyan-600 border-x border-slate-200 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-cyan-800 hover:bg-slate-100'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Complaints ({clientTickets.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('bandwidth')}
              className={`px-3.5 py-2 rounded-t-lg flex items-center gap-1.5 transition-colors ${
                activeTab === 'bandwidth'
                  ? 'bg-white text-cyan-800 border-t-2 border-cyan-600 border-x border-slate-200 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-cyan-800 hover:bg-slate-100'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-emerald-600" />
              <span>Real-Time Traffic</span>
            </button>
          </div>

          {/* Tab 1: Service Details */}
          {activeTab === 'service' && (
            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-slate-800 text-sm border-b border-slate-200 pb-2 text-[#162e3d]">
                    Subscription Details
                  </h4>
                  <div className="flex justify-between py-1.5 border-b border-slate-200/60">
                    <span className="text-slate-500 font-medium">Package Name:</span>
                    <span className="font-bold text-slate-900">{client.packageName}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-200/60">
                    <span className="text-slate-500 font-medium">Bandwidth Speed:</span>
                    <span className="font-bold text-cyan-800 font-mono">{client.packageSpeed}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-200/60">
                    <span className="text-slate-500 font-medium">MikroTik Profile:</span>
                    <span className="font-mono font-semibold text-cyan-700">10mb_pkg_500tk</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-200/60">
                    <span className="text-slate-500 font-medium">Monthly Charge:</span>
                    <span className="font-bold text-slate-900 text-sm font-mono">
                      ৳{client.monthlyBill.toFixed(2)} BDT
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-200/60">
                    <span className="text-slate-500 font-medium">Billing Renewal Day:</span>
                    <span className="font-bold text-red-600">{client.expireDate}th of each month</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-500 font-medium">Current Balance Due:</span>
                    <span className="font-bold text-emerald-700 font-mono text-sm">
                      ৳{client.balanceDue.toFixed(2)} BDT
                    </span>
                  </div>
                </div>

                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-slate-800 text-sm border-b border-slate-200 pb-2 text-[#162e3d]">
                    Authentication &amp; Access
                  </h4>
                  <div className="flex justify-between py-1.5 border-b border-slate-200/60">
                    <span className="text-slate-500 font-medium">Joining Date:</span>
                    <span className="font-semibold text-slate-800">{client.joiningDate}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-200/60">
                    <span className="text-slate-500 font-medium">Subscriber Type:</span>
                    <span className="font-semibold text-slate-800">{client.clientType}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-200/60">
                    <span className="text-slate-500 font-medium">PPPoE Username:</span>
                    <span className="font-mono font-bold text-slate-900">{client.username}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-200/60">
                    <span className="text-slate-500 font-medium">PPPoE Password:</span>
                    <span className="font-mono font-semibold text-slate-700">haven123</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-200/60">
                    <span className="text-slate-500 font-medium">Last Known Login:</span>
                    <span className="font-medium text-slate-800">{client.lastLogin}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-500 font-medium">Installation Status:</span>
                    <span className="font-semibold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      ৳1,000.00 (Fully Cleared)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Network & PON */}
          {activeTab === 'network' && (
            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-slate-800 text-sm border-b border-slate-200 pb-2 text-[#162e3d]">
                    Core Routing Parameters
                  </h4>
                  <div className="flex justify-between py-1.5 border-b border-slate-200/60">
                    <span className="text-slate-500 font-medium">NAS / Server:</span>
                    <span className="font-bold text-cyan-800">{client.server}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-200/60">
                    <span className="text-slate-500 font-medium">Protocol:</span>
                    <span className="font-semibold text-slate-800">PPPoE (PAP/CHAP)</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-200/60">
                    <span className="text-slate-500 font-medium">Distribution Zone:</span>
                    <span className="font-medium text-slate-800">{client.zone}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-200/60">
                    <span className="text-slate-500 font-medium">Sub Zone:</span>
                    <span className="font-medium text-slate-800">{client.subzone}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-500 font-medium">Distribution Box:</span>
                    <span className="font-semibold text-slate-800">{client.box || 'Box-04'}</span>
                  </div>
                </div>

                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-slate-800 text-sm border-b border-slate-200 pb-2 text-[#162e3d]">
                    Physical &amp; Device Specs
                  </h4>
                  <div className="flex justify-between py-1.5 border-b border-slate-200/60">
                    <span className="text-slate-500 font-medium">Connection Medium:</span>
                    <span className="font-semibold text-slate-800">{client.connectionType}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-200/60">
                    <span className="text-slate-500 font-medium">Cable Requirement:</span>
                    <span className="font-medium text-slate-800">250 Meter Drop Cable</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-200/60">
                    <span className="text-slate-500 font-medium">Fiber Code:</span>
                    <span className="font-medium text-slate-800">BBN-FIB-092 / Blue</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-200/60">
                    <span className="text-slate-500 font-medium">Customer ONU / ONT:</span>
                    <span className="font-medium text-slate-800">XPON Gigabit ONU</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-200/60">
                    <span className="text-slate-500 font-medium">Device MAC Address:</span>
                    <span className="font-mono font-bold text-slate-900">{client.macAddress}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-500 font-medium">Allocated IP:</span>
                    <span className="font-mono font-semibold text-slate-800">
                      {client.allocatedIp || '10.10.2.197'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Personal Information */}
          {activeTab === 'personal' && (
            <div className="p-5 space-y-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-800 text-sm border-b border-slate-200 pb-2 text-[#162e3d]">
                  Client Identity &amp; Contact Records
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2.5">
                    <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                      <span className="text-slate-500 font-medium">Full Name:</span>
                      <span className="font-bold text-slate-900">{client.name}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                      <span className="text-slate-500 font-medium">National ID (NID):</span>
                      <span className="font-mono font-semibold text-slate-800">
                        {client.nid || '1992491284719283'}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                      <span className="text-slate-500 font-medium">Mobile Phone:</span>
                      <span className="font-mono font-bold text-cyan-800">{client.mobile}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                      <span className="text-slate-500 font-medium">Email Address:</span>
                      <span className="font-medium text-slate-800">{client.email}</span>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                      <span className="text-slate-500 font-medium">Present Address:</span>
                      <span className="font-medium text-slate-800">{client.address}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                      <span className="text-slate-500 font-medium">Permanent Address:</span>
                      <span className="font-medium text-slate-800">
                        {client.permanentAddress || client.address}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                      <span className="text-slate-500 font-medium">Upazila / District:</span>
                      <span className="font-medium text-slate-800">Bhurungamari, Kurigram</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Received Bill History */}
          {activeTab === 'billing-history' && (
            <div className="p-5 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">
                  Payment Collection Records for {client.name} ({client.code})
                </span>
                <button
                  onClick={() => onOpenBillReceive(client.code)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Receive Bill</span>
                </button>
              </div>

              {clientReceipts.length === 0 ? (
                <EmptyState
                  title="No Payment History"
                  description="No payment records have been registered for this subscriber yet."
                />
              ) : (
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-slate-700 border-collapse">
                    <thead className="bg-[#162e3d] text-white uppercase text-[10px] font-semibold tracking-wider">
                      <tr>
                        <th className="p-3">Received Date</th>
                        <th className="p-3">Received By</th>
                        <th className="p-3">Created By</th>
                        <th className="p-3">Remarks</th>
                        <th className="p-3 text-right">Discount</th>
                        <th className="p-3 text-right">Received Bill</th>
                        <th className="p-3 text-right">Total Bill</th>
                        <th className="p-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {clientReceipts.map((receipt) => (
                        <tr key={receipt.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3 font-medium text-slate-800">{receipt.receivedDate}</td>
                          <td className="p-3 font-semibold text-cyan-800">
                            {receipt.receivedBy}
                          </td>
                          <td className="p-3 font-mono text-slate-500">{receipt.createdBy}</td>
                          <td className="p-3 text-slate-600">{receipt.remarks}</td>
                          <td className="p-3 text-right font-mono">৳{receipt.discount}</td>
                          <td className="p-3 text-right font-bold text-emerald-700 font-mono">
                            ৳{receipt.receivedBill.toFixed(2)}
                          </td>
                          <td className="p-3 text-right font-bold font-mono">
                            ৳{receipt.totalBill.toFixed(2)}
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => onPrintReceipt(receipt)}
                              className="p-1.5 bg-slate-100 hover:bg-cyan-50 text-slate-700 hover:text-cyan-800 rounded-lg transition-colors border border-slate-200"
                              title="Print Money Receipt / Invoice"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Tab 5: Complain History */}
          {activeTab === 'complain-history' && (
            <div className="p-5 space-y-3 text-xs">
              <h4 className="font-bold text-slate-800">Support Ticket Log</h4>
              {clientTickets.length === 0 ? (
                <EmptyState
                  title="No Active Support Tickets"
                  description="No trouble tickets have been logged for this client. Network connection is in optimal health."
                />
              ) : (
                <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden">
                  {clientTickets.map((t) => (
                    <div key={t.ticketNo} className="p-3.5 hover:bg-slate-50 flex items-center justify-between transition-colors">
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          <span>Ticket #{t.ticketNo}</span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                            {t.problem}
                          </span>
                        </div>
                        <p className="text-slate-600 text-[11px] mt-1">{t.note}</p>
                        <div className="text-[10px] text-slate-400 mt-1">
                          Created: {t.complainTime} | Assigned: {t.assignTo}
                        </div>
                      </div>
                      <StatusBadge status={t.status} type="ticket" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 6: Live Bandwidth */}
          {activeTab === 'bandwidth' && (
            <div className="p-5 space-y-4 text-xs">
              <div className="bg-[#162e3d] text-white p-5 rounded-xl shadow-xs">
                <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-2">
                  <div>
                    <h4 className="font-bold text-sm text-cyan-300">
                      Live Throughput for PPPoE session: {client.username}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      MikroTik RouterOS 7.14 Queue [10mb_pkg_500tk] - Sampling every 1.5s
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-[10px] text-emerald-400 font-mono">RX: 9.84 Mbps</div>
                      <div className="text-[10px] text-cyan-400 font-mono">TX: 4.12 Mbps</div>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                  </div>
                </div>

                {/* SVG line chart */}
                <div className="h-44 w-full relative flex items-end">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150">
                    <defs>
                      <linearGradient id="clientGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <line x1="0" y1="30" x2="500" y2="30" stroke="#1e293b" strokeDasharray="4 4" />
                    <line x1="0" y1="75" x2="500" y2="75" stroke="#1e293b" strokeDasharray="4 4" />
                    <line x1="0" y1="120" x2="500" y2="120" stroke="#1e293b" strokeDasharray="4 4" />

                    <path
                      d="M0,130 Q50,40 100,70 T200,45 T300,85 T400,25 T500,40 L500,150 L0,150 Z"
                      fill="url(#clientGrad)"
                    />
                    <path
                      d="M0,130 Q50,40 100,70 T200,45 T300,85 T400,25 T500,40"
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="2.5"
                    />
                    <path
                      d="M0,140 Q50,90 100,105 T200,80 T300,110 T400,60 T500,80"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2"
                    />
                  </svg>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-300 mt-3 pt-2 border-t border-slate-700">
                  <span>Target Rate Limit: 10M/10M</span>
                  <span>Session Uptime: 4 days, 11:24:05</span>
                  <span>IP: {client.allocatedIp || '10.10.2.197'}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
