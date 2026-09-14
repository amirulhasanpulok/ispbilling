import React, { useState } from 'react';
import {
  User,
  ArrowLeft,
  DollarSign,
  Wifi,
  FileText,
  HelpCircle,
  Network,
  Shield,
  Key,
  Calendar,
  Send,
  Printer,
  CheckCircle,
  Clock,
  Activity,
  Layers,
  Phone
} from 'lucide-react';
import { Client, PaymentReceipt, SupportTicket } from '../types';

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
    <div className="p-4 space-y-4 bg-[#f4f7f9] min-h-screen text-slate-800">
      {toast && (
        <div className="fixed top-16 right-6 bg-slate-900 text-white px-4 py-2 rounded shadow-xl text-xs z-50 flex items-center gap-2 border border-cyan-500 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between bg-white p-3 rounded shadow-sm border border-slate-200">
        <div className="flex items-center space-x-2 text-xs">
          <button
            onClick={handleBack}
            className="flex items-center space-x-1 text-cyan-600 hover:text-cyan-800 font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Client List</span>
          </button>
          <span className="text-slate-400">/</span>
          <span className="font-bold text-slate-800">Client 360° Profile: {client.name}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenBillReceive(client.code)}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Collect Bill</span>
          </button>
          <button
            onClick={onSwitchToCustomerPortal}
            className="px-3 py-1.5 bg-[#162e3d] hover:bg-[#203c4f] text-white text-xs font-semibold rounded shadow-sm flex items-center gap-1.5 transition-colors"
            title="Open customer self-service dashboard as this user"
          >
            <User className="w-3.5 h-3.5 text-cyan-400" />
            <span>Login As Client</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Profile Card + Right Tabs matching Screenshot 21 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left Column Profile Card */}
        <div className="bg-white rounded shadow-sm border border-slate-200 p-4 space-y-4">
          {/* Avatar & Identifiers */}
          <div className="flex flex-col items-center text-center pb-3 border-b border-slate-200">
            <div className="w-20 h-20 rounded-full bg-cyan-600 border-4 border-cyan-100 flex items-center justify-center text-white shadow mb-2">
              <User className="w-10 h-10" />
            </div>
            <h3 className="font-bold text-base text-slate-900">{client.name}</h3>
            <p className="text-xs text-slate-500">{client.email}</p>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 font-mono">
                Code: {client.code}
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">
                ID: {client.username}
              </span>
            </div>
          </div>

          {/* Quick Status Attributes */}
          <div className="space-y-2 text-xs divide-y divide-slate-100">
            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-500">Billing Status:</span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {client.billingStatus}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-slate-500">Mikrotik Status:</span>
              <button
                onClick={() => {
                  setMikrotikEnabled(!mikrotikEnabled);
                  showNotification(
                    !mikrotikEnabled
                      ? `Enabled PPPoE session on ${client.server}`
                      : `Disabled PPPoE session on ${client.server}`
                  );
                }}
                className={`relative inline-flex h-4 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  mikrotikEnabled ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    mikrotikEnabled ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-slate-500">Creation Date:</span>
              <span className="font-medium text-slate-800">{client.joiningDate}</span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-slate-500">Registration Date:</span>
              <span className="font-medium text-slate-800">03 Aug 2021</span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-slate-500">Client Login Access:</span>
              <button
                onClick={() => {
                  setClientAccessEnabled(!clientAccessEnabled);
                  showNotification(
                    !clientAccessEnabled
                      ? 'Client Self-Service Portal Access Enabled'
                      : 'Client Self-Service Portal Access Suspended'
                  );
                }}
                className={`relative inline-flex h-4 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  clientAccessEnabled ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    clientAccessEnabled ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Action Buttons matching Screenshot 21 */}
          <div className="space-y-1.5 pt-2 border-t border-slate-200">
            <button
              onClick={() => showNotification('Client Information update modal opened')}
              className="w-full py-1.5 bg-[#00a2d3] hover:bg-[#008cb6] text-white text-xs font-semibold rounded shadow-sm transition-colors"
            >
              Update Information
            </button>
            <button
              onClick={() => showNotification('Status Scheduler configured')}
              className="w-full py-1.5 bg-slate-700 hover:bg-slate-800 text-white text-xs font-medium rounded transition-colors"
            >
              Status Scheduler
            </button>
            <button
              onClick={() => showNotification(`SMS dispatched to ${client.mobile}`)}
              className="w-full py-1.5 bg-slate-700 hover:bg-slate-800 text-white text-xs font-medium rounded transition-colors flex items-center justify-center gap-1"
            >
              <Send className="w-3 h-3" />
              <span>Send Email/Message</span>
            </button>
            <button
              onClick={() => showNotification('Package Scheduler opened')}
              className="w-full py-1.5 bg-slate-700 hover:bg-slate-800 text-white text-xs font-medium rounded transition-colors"
            >
              Package Scheduler
            </button>
            <button
              onClick={() => showNotification('Temporary Password regenerated and sent via SMS')}
              className="w-full py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium rounded transition-colors flex items-center justify-center gap-1"
            >
              <Key className="w-3 h-3" />
              <span>Password Regenerate</span>
            </button>
            <button
              onClick={onSwitchToCustomerPortal}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded transition-colors flex items-center justify-center gap-1 shadow-sm"
            >
              <User className="w-3.5 h-3.5" />
              <span>Login As Client</span>
            </button>
          </div>
        </div>

        {/* Right Column: Tabbed Content matching Screenshot 21 & 22 */}
        <div className="lg:col-span-3 bg-white rounded shadow-sm border border-slate-200 flex flex-col">
          {/* Tabs Bar */}
          <div className="flex flex-wrap border-b border-slate-200 bg-slate-50 px-2 pt-2 gap-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('service')}
              className={`px-3 py-2 rounded-t flex items-center gap-1.5 transition-colors ${
                activeTab === 'service'
                  ? 'bg-white text-cyan-700 border-t-2 border-cyan-600 border-x border-slate-200'
                  : 'text-slate-600 hover:text-cyan-700 hover:bg-slate-100'
              }`}
            >
              <Wifi className="w-3.5 h-3.5" />
              <span>Service Information</span>
            </button>

            <button
              onClick={() => setActiveTab('network')}
              className={`px-3 py-2 rounded-t flex items-center gap-1.5 transition-colors ${
                activeTab === 'network'
                  ? 'bg-white text-cyan-700 border-t-2 border-cyan-600 border-x border-slate-200'
                  : 'text-slate-600 hover:text-cyan-700 hover:bg-slate-100'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>Network &amp; Product</span>
            </button>

            <button
              onClick={() => setActiveTab('personal')}
              className={`px-3 py-2 rounded-t flex items-center gap-1.5 transition-colors ${
                activeTab === 'personal'
                  ? 'bg-white text-cyan-700 border-t-2 border-cyan-600 border-x border-slate-200'
                  : 'text-slate-600 hover:text-cyan-700 hover:bg-slate-100'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Personal Information</span>
            </button>

            <button
              onClick={() => setActiveTab('billing-history')}
              className={`px-3 py-2 rounded-t flex items-center gap-1.5 transition-colors ${
                activeTab === 'billing-history'
                  ? 'bg-white text-cyan-700 border-t-2 border-cyan-600 border-x border-slate-200'
                  : 'text-slate-600 hover:text-cyan-700 hover:bg-slate-100'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Received Bill History ({clientReceipts.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('complain-history')}
              className={`px-3 py-2 rounded-t flex items-center gap-1.5 transition-colors ${
                activeTab === 'complain-history'
                  ? 'bg-white text-cyan-700 border-t-2 border-cyan-600 border-x border-slate-200'
                  : 'text-slate-600 hover:text-cyan-700 hover:bg-slate-100'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Complain History ({clientTickets.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('bandwidth')}
              className={`px-3 py-2 rounded-t flex items-center gap-1.5 transition-colors ${
                activeTab === 'bandwidth'
                  ? 'bg-white text-cyan-700 border-t-2 border-cyan-600 border-x border-slate-200'
                  : 'text-slate-600 hover:text-cyan-700 hover:bg-slate-100'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-emerald-500" />
              <span>Real-Time Bandwidth</span>
            </button>
          </div>

          {/* Tab 1: Service Information matching Screenshot 21 */}
          {activeTab === 'service' && (
            <div className="p-4 space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3 bg-slate-50 p-3 rounded border border-slate-200">
                  <h4 className="font-bold text-slate-800 text-sm border-b pb-1 text-[#162e3d]">
                    Subscription Details
                  </h4>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Package:</span>
                    <span className="font-bold text-slate-900">{client.packageName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Mikrotik Profile:</span>
                    <span className="font-mono font-semibold text-cyan-700">10mb_pkg_500tk</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Billing Start Month:</span>
                    <span className="font-medium text-slate-800">01 Mar 2021</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Billing Expire Date:</span>
                    <span className="font-bold text-red-600">{client.expireDate}th of Month</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Monthly Bill:</span>
                    <span className="font-bold text-slate-900 text-sm">
                      ৳{client.monthlyBill.toFixed(2)} BDT
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Balance Due:</span>
                    <span className="font-bold text-emerald-700">
                      ৳{client.balanceDue.toFixed(2)} BDT
                    </span>
                  </div>
                </div>

                <div className="space-y-3 bg-slate-50 p-3 rounded border border-slate-200">
                  <h4 className="font-bold text-slate-800 text-sm border-b pb-1 text-[#162e3d]">
                    Authentication &amp; Connection
                  </h4>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Joining Date:</span>
                    <span className="font-medium text-slate-800">{client.joiningDate}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Client Type:</span>
                    <span className="font-medium text-slate-800">{client.clientType}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">PPPoE Username:</span>
                    <span className="font-mono font-bold text-slate-900">{client.username}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">PPPoE Password:</span>
                    <span className="font-mono font-semibold text-slate-700">haven123</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Last Login:</span>
                    <span className="font-medium text-slate-800">{client.lastLogin}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Installation Charge:</span>
                    <span className="font-semibold text-slate-800">৳1,000.00 (Fully Paid)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Network & Product */}
          {activeTab === 'network' && (
            <div className="p-4 space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3 bg-slate-50 p-3 rounded border border-slate-200">
                  <h4 className="font-bold text-slate-800 text-sm border-b pb-1 text-[#162e3d]">
                    Core Routing Parameters
                  </h4>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Server:</span>
                    <span className="font-bold text-cyan-800">{client.server}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Protocol:</span>
                    <span className="font-semibold text-slate-800">PPPOE</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Zone:</span>
                    <span className="font-medium text-slate-800">{client.zone}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Sub Zone:</span>
                    <span className="font-medium text-slate-800">{client.subzone}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Distribution Box:</span>
                    <span className="font-semibold text-slate-800">{client.box || 'Box-04'}</span>
                  </div>
                </div>

                <div className="space-y-3 bg-slate-50 p-3 rounded border border-slate-200">
                  <h4 className="font-bold text-slate-800 text-sm border-b pb-1 text-[#162e3d]">
                    Physical &amp; Device Specs
                  </h4>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Connection Medium:</span>
                    <span className="font-semibold text-slate-800">{client.connectionType}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Cable Requirement:</span>
                    <span className="font-medium text-slate-800">250 Meter Drop Cable</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Fiber Code / Core Color:</span>
                    <span className="font-medium text-slate-800">BBN-FIB-092 / Blue</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Customer Device:</span>
                    <span className="font-medium text-slate-800">XPON Gigabit ONU</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Device MAC Address:</span>
                    <span className="font-mono font-bold text-slate-900">{client.macAddress}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Allocated IP:</span>
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
            <div className="p-4 space-y-4 text-xs">
              <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-800 text-sm border-b pb-1 text-[#162e3d]">
                  Client Identity &amp; Contact Records
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between border-b pb-1">
                      <span className="text-slate-500">Full Name:</span>
                      <span className="font-bold text-slate-900">{client.name}</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span className="text-slate-500">National ID (NID):</span>
                      <span className="font-mono font-semibold text-slate-800">
                        {client.nid || '1992491284719283'}
                      </span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span className="text-slate-500">Mobile Phone:</span>
                      <span className="font-mono font-bold text-cyan-700">{client.mobile}</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span className="text-slate-500">Email Address:</span>
                      <span className="font-medium text-slate-800">{client.email}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between border-b pb-1">
                      <span className="text-slate-500">Present Address:</span>
                      <span className="font-medium text-slate-800">{client.address}</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span className="text-slate-500">Permanent Address:</span>
                      <span className="font-medium text-slate-800">
                        {client.permanentAddress || client.address}
                      </span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span className="text-slate-500">Upazila / District:</span>
                      <span className="font-medium text-slate-800">Bhurungamari, Kurigram</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Received Bill History matching Screenshot 22 */}
          {activeTab === 'billing-history' && (
            <div className="p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">
                  Payment Collection Records for {client.name} ({client.code})
                </span>
                <button
                  onClick={() => onOpenBillReceive(client.code)}
                  className="px-2.5 py-1 bg-[#00a2d3] hover:bg-[#008cb6] text-white text-xs font-semibold rounded shadow-sm flex items-center gap-1"
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Receive Bill</span>
                </button>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded">
                <table className="w-full text-left text-slate-700">
                  <thead className="bg-[#162e3d] text-white uppercase text-[10px] font-semibold tracking-wider">
                    <tr>
                      <th className="p-2.5">Received Date</th>
                      <th className="p-2.5">Received By</th>
                      <th className="p-2.5">Created By</th>
                      <th className="p-2.5">Remarks</th>
                      <th className="p-2.5 text-right">Discount</th>
                      <th className="p-2.5 text-right">Received Bill</th>
                      <th className="p-2.5 text-right">Total Bill</th>
                      <th className="p-2.5 text-center">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {clientReceipts.map((receipt) => (
                      <tr key={receipt.id} className="hover:bg-slate-50">
                        <td className="p-2.5 font-medium">{receipt.receivedDate}</td>
                        <td className="p-2.5 font-semibold text-cyan-800">
                          {receipt.receivedBy}
                        </td>
                        <td className="p-2.5 font-mono text-slate-500">{receipt.createdBy}</td>
                        <td className="p-2.5 text-slate-600">{receipt.remarks}</td>
                        <td className="p-2.5 text-right font-mono">{receipt.discount}</td>
                        <td className="p-2.5 text-right font-bold text-emerald-700 font-mono">
                          ৳{receipt.receivedBill.toFixed(2)}
                        </td>
                        <td className="p-2.5 text-right font-bold font-mono">
                          ৳{receipt.totalBill.toFixed(2)}
                        </td>
                        <td className="p-2.5 text-center">
                          <button
                            onClick={() => onPrintReceipt(receipt)}
                            className="p-1 bg-slate-100 hover:bg-cyan-100 text-slate-700 hover:text-cyan-800 rounded transition-colors"
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
            </div>
          )}

          {/* Tab 5: Complain History */}
          {activeTab === 'complain-history' && (
            <div className="p-4 space-y-3 text-xs">
              <h4 className="font-bold text-slate-800">Support Ticket Log</h4>
              {clientTickets.length === 0 ? (
                <div className="p-8 text-center text-slate-400 bg-slate-50 rounded border border-dashed border-slate-300">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
                  No open complaints for this client. Network connection is healthy.
                </div>
              ) : (
                <div className="divide-y divide-slate-200 border border-slate-200 rounded">
                  {clientTickets.map((t) => (
                    <div key={t.ticketNo} className="p-3 hover:bg-slate-50 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          <span>Ticket #{t.ticketNo}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800">
                            {t.problem}
                          </span>
                        </div>
                        <p className="text-slate-600 text-[11px] mt-1">{t.note}</p>
                        <div className="text-[10px] text-slate-400 mt-1">
                          Created: {t.complainTime} | Assigned: {t.assignTo}
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-amber-500 text-white rounded font-bold text-[10px]">
                        {t.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 6: Live Bandwidth */}
          {activeTab === 'bandwidth' && (
            <div className="p-4 space-y-4 text-xs">
              <div className="bg-slate-900 text-white p-4 rounded-lg shadow-inner">
                <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
                  <div>
                    <h4 className="font-bold text-sm text-cyan-400">
                      Live Throughput for PPPoE session: {client.username}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Mikrotik RouterOS 7.14 Queue [10mb_pkg_500tk] - Sampling every 1.5s
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-[10px] text-emerald-400 font-mono">RX: 9.84 Mbps</div>
                      <div className="text-[10px] text-cyan-400 font-mono">TX: 4.12 Mbps</div>
                    </div>
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
                  </div>
                </div>

                {/* Animated SVG line chart */}
                <div className="h-44 w-full relative flex items-end">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150">
                    <defs>
                      <linearGradient id="clientGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {/* Background grid */}
                    <line x1="0" y1="30" x2="500" y2="30" stroke="#1e293b" strokeDasharray="4 4" />
                    <line x1="0" y1="75" x2="500" y2="75" stroke="#1e293b" strokeDasharray="4 4" />
                    <line x1="0" y1="120" x2="500" y2="120" stroke="#1e293b" strokeDasharray="4 4" />

                    {/* Area under curve */}
                    <path
                      d="M0,130 Q50,40 100,70 T200,45 T300,85 T400,25 T500,40 L500,150 L0,150 Z"
                      fill="url(#clientGrad)"
                    />
                    {/* Rx Line (Cyan) */}
                    <path
                      d="M0,130 Q50,40 100,70 T200,45 T300,85 T400,25 T500,40"
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="2.5"
                    />
                    {/* Tx Line (Emerald) */}
                    <path
                      d="M0,140 Q50,90 100,105 T200,80 T300,110 T400,60 T500,80"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2"
                    />
                  </svg>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-800">
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
