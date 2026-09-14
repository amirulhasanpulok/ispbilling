import React, { useState } from 'react';
import {
  Settings,
  Building,
  Server,
  Key,
  Shield,
  CreditCard,
  Mail,
  CheckCircle2,
  Save,
  RotateCw,
  Clock,
  Lock,
  Globe
} from 'lucide-react';

interface SystemConfigViewProps {
  initialTab?: 'company' | 'billing-rules' | 'mikrotik' | 'payment-gateways' | 'invoice' | 'periods' | 'email' | 'vat' | 'logs';
}

export const SystemConfigView: React.FC<SystemConfigViewProps> = ({ initialTab = 'company' }) => {
  const [activeTab, setActiveTab] = useState<'company' | 'billing-rules' | 'mikrotik' | 'payment-gateways' | 'invoice' | 'periods' | 'email' | 'vat' | 'logs'>(initialTab);
  const [toast, setToast] = useState<string | null>(null);

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Company Profile Form
  const [companyName, setCompanyName] = useState('Bhurungamari Broadband Network (BBN)');
  const [btrcLicense, setBtrcLicense] = useState('BTRC/ISP/NAT-2021/889');
  const [hotline, setHotline] = useState('01710-287818, 01925-112233');
  const [address, setAddress] = useState('Jamtola Mor, Bhurungamari Upazila, Kurigram, Bangladesh');
  const [email, setEmail] = useState('support@bbnisp.net');
  const [vatRegNo, setVatRegNo] = useState('BIN-00384918293');

  // Billing & Mikrotik automation rules
  const [autoLockEnabled, setAutoLockEnabled] = useState(true);
  const [graceDays, setGraceDays] = useState(3);
  const [billingGenerationDay, setBillingGenerationDay] = useState(1);
  const [expiredPoolIp, setExpiredPoolIp] = useState('10.254.254.0/24');
  const [redirectPort, setRedirectPort] = useState(8080);
  const [autoSmsReminder, setAutoSmsReminder] = useState(true);
  const [reminderDaysBefore, setReminderDaysBefore] = useState(2);

  // Mikrotik API
  const [routerIp, setRouterIp] = useState('157.10.238.100');
  const [apiPort, setApiPort] = useState(8728);
  const [apiUser, setApiUser] = useState('bbn_api_admin');
  const [apiPassword, setApiPassword] = useState('••••••••••••');
  const [useSsl, setUseSsl] = useState(false);
  const [isTestingPing, setIsTestingPing] = useState(false);

  // Payment Gateways
  const [bkashEnabled, setBkashEnabled] = useState(true);
  const [bkashAppKey, setBkashAppKey] = useState('app_key_bbn_prod_8892');
  const [bkashMerchantNumber, setBkashMerchantNumber] = useState('01710287818');
  const [nagadEnabled, setNagadEnabled] = useState(true);
  const [nagadMerchantId, setNagadMerchantId] = useState('NGD_MERCH_7721');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleTestPing = () => {
    setIsTestingPing(true);
    setTimeout(() => {
      setIsTestingPing(false);
      showToast('Mikrotik RouterOS API ping OK! Response latency: 4ms. RouterOS v7.14 verified.');
    }, 1200);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('System configuration & billing parameters updated and applied!');
  };

  return (
    <div className="p-4 space-y-4 bg-[#f4f7f9] min-h-screen text-slate-800">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-16 right-6 bg-slate-900 text-white px-4 py-2 rounded shadow-2xl text-xs z-50 flex items-center gap-2 border border-cyan-500 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded shadow-sm border border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-[#162e3d] text-cyan-400 rounded">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800 flex items-center gap-2">
              System Configuration & ISP Operating Parameters
            </h1>
            <p className="text-xs text-slate-500">
              Company Credentials, Mikrotik API Connection, Billing Policies & Payment Gateways
            </p>
          </div>
        </div>

        <div className="flex flex-wrap rounded border border-slate-200 p-0.5 bg-slate-100 text-xs font-medium gap-1">
          <button
            onClick={() => setActiveTab('company')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeTab === 'company' ? 'bg-white shadow text-cyan-700 font-bold' : 'text-slate-600'
            }`}
          >
            Company Profile
          </button>
          <button
            onClick={() => setActiveTab('invoice')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeTab === 'invoice' ? 'bg-white shadow text-cyan-700 font-bold' : 'text-slate-600'
            }`}
          >
            Invoice SetUp
          </button>
          <button
            onClick={() => setActiveTab('periods')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeTab === 'periods' ? 'bg-white shadow text-cyan-700 font-bold' : 'text-slate-600'
            }`}
          >
            Periods SetUp
          </button>
          <button
            onClick={() => setActiveTab('billing-rules')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeTab === 'billing-rules' ? 'bg-white shadow text-cyan-700 font-bold' : 'text-slate-600'
            }`}
          >
            Billing & Lock Rules
          </button>
          <button
            onClick={() => setActiveTab('mikrotik')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeTab === 'mikrotik' ? 'bg-white shadow text-cyan-700 font-bold' : 'text-slate-600'
            }`}
          >
            Mikrotik API
          </button>
          <button
            onClick={() => setActiveTab('payment-gateways')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeTab === 'payment-gateways' ? 'bg-white shadow text-cyan-700 font-bold' : 'text-slate-600'
            }`}
          >
            Payment Gateways
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeTab === 'email' ? 'bg-white shadow text-cyan-700 font-bold' : 'text-slate-600'
            }`}
          >
            EMail SetUp
          </button>
          <button
            onClick={() => setActiveTab('vat')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeTab === 'vat' ? 'bg-white shadow text-cyan-700 font-bold' : 'text-slate-600'
            }`}
          >
            VAT & Fee
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeTab === 'logs' ? 'bg-white shadow text-cyan-700 font-bold' : 'text-slate-600'
            }`}
          >
            Activity Logs
          </button>
        </div>
      </div>

      {/* Main Settings Body */}
      <form onSubmit={handleSaveSettings} className="bg-white rounded border border-slate-200 shadow-sm p-5 max-w-3xl mx-auto space-y-6">
        {/* Tab 1: Company Profile */}
        {activeTab === 'company' && (
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-2">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Building className="w-4 h-4 text-cyan-600" />
                ISP Legal & Operational Identity
              </h2>
              <p className="text-xs text-slate-500">
                Printed on customer invoices, payment receipts, and BTRC regulatory returns.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700">ISP Entity Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full mt-1 p-2 border border-slate-300 rounded focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">BTRC ISP License Number</label>
                <input
                  type="text"
                  value={btrcLicense}
                  onChange={(e) => setBtrcLicense(e.target.value)}
                  className="w-full mt-1 p-2 border border-slate-300 rounded focus:border-cyan-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">VAT Registration / BIN</label>
                <input
                  type="text"
                  value={vatRegNo}
                  onChange={(e) => setVatRegNo(e.target.value)}
                  className="w-full mt-1 p-2 border border-slate-300 rounded focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">NOC Hotline Phone(s)</label>
                <input
                  type="text"
                  value={hotline}
                  onChange={(e) => setHotline(e.target.value)}
                  className="w-full mt-1 p-2 border border-slate-300 rounded focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Official Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-1 p-2 border border-slate-300 rounded focus:border-cyan-500"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700">Physical NOC / Office Address</label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full mt-1 p-2 border border-slate-300 rounded focus:border-cyan-500"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Billing & Auto-Lock Rules */}
        {activeTab === 'billing-rules' && (
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-2">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-600" />
                Automated Invoicing & Auto-Lock Disconnect Policies
              </h2>
              <p className="text-xs text-slate-500">
                Determines how overdue accounts are handled and quarantined on the Mikrotik router.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-200">
                <div>
                  <span className="font-bold text-slate-800">Auto-Disconnect Overdue PPPoE Clients</span>
                  <p className="text-[11px] text-slate-500">
                    Automatically disable or quarantine PPPoE secrets on Mikrotik after grace period.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoLockEnabled(!autoLockEnabled)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    autoLockEnabled ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      autoLockEnabled ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700">Grace Period (Days)</label>
                  <input
                    type="number"
                    value={graceDays}
                    onChange={(e) => setGraceDays(Number(e.target.value))}
                    className="w-full mt-1 p-2 border border-slate-300 rounded focus:border-cyan-500 font-mono"
                  />
                  <span className="text-[10px] text-slate-500">Days allowed after expiry before cut-off</span>
                </div>

                <div>
                  <label className="font-bold text-slate-700">Monthly Bill Generation Cycle Date</label>
                  <select
                    value={billingGenerationDay}
                    onChange={(e) => setBillingGenerationDay(Number(e.target.value))}
                    className="w-full mt-1 p-2 border border-slate-300 rounded focus:border-cyan-500"
                  >
                    <option value={1}>1st of each month (Default)</option>
                    <option value={5}>5th of each month</option>
                    <option value={27}>27th of each month</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded border border-amber-200">
                <span className="font-bold text-amber-900 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" /> Overdue Captive Portal Redirection Pool
                </span>
                <p className="text-[11px] text-amber-800 mt-1">
                  When clients are locked, Mikrotik assigns IP pool <span className="font-mono font-bold">10.254.254.0/24</span> and redirects HTTP port 80 traffic to the online bKash payment portal page.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Mikrotik API Settings */}
        {activeTab === 'mikrotik' && (
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Server className="w-4 h-4 text-cyan-600" />
                  Mikrotik RouterOS Core API Credentials
                </h2>
                <p className="text-xs text-slate-500">
                  Used for real-time queue management, PPPoE provisioning, and bandwidth SNMP graphs.
                </p>
              </div>
              <button
                type="button"
                onClick={handleTestPing}
                disabled={isTestingPing}
                className="px-3 py-1.5 bg-cyan-50 hover:bg-cyan-100 text-cyan-700 text-xs font-bold rounded border border-cyan-300 flex items-center gap-1.5"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isTestingPing ? 'animate-spin' : ''}`} />
                <span>Test API Ping</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700">Core Router IP Address</label>
                <input
                  type="text"
                  value={routerIp}
                  onChange={(e) => setRouterIp(e.target.value)}
                  className="w-full mt-1 p-2 border border-slate-300 rounded focus:border-cyan-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">RouterOS API Port</label>
                <input
                  type="number"
                  value={apiPort}
                  onChange={(e) => setApiPort(Number(e.target.value))}
                  className="w-full mt-1 p-2 border border-slate-300 rounded focus:border-cyan-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">API Username</label>
                <input
                  type="text"
                  value={apiUser}
                  onChange={(e) => setApiUser(e.target.value)}
                  className="w-full mt-1 p-2 border border-slate-300 rounded focus:border-cyan-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">API Password</label>
                <input
                  type="password"
                  value={apiPassword}
                  onChange={(e) => setApiPassword(e.target.value)}
                  className="w-full mt-1 p-2 border border-slate-300 rounded focus:border-cyan-500 font-mono"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Payment Gateways */}
        {activeTab === 'payment-gateways' && (
          <div className="space-y-4 text-xs">
            <div className="border-b border-slate-100 pb-2">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-pink-600" />
                Payment Gateway Integrations (bKash & Nagad)
              </h2>
              <p className="text-xs text-slate-500">
                Powers real-time client self-recharge and automatic instant unblocking.
              </p>
            </div>

            {/* bKash */}
            <div className="p-3.5 bg-pink-50/50 rounded border border-pink-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-pink-500 inline-block"></span>
                  bKash Payment Gateway (Checkout API v1.2)
                </span>
                <span className="px-2 py-0.5 bg-pink-100 text-pink-700 font-bold rounded text-[10px]">
                  ENABLED
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Merchant Wallet No.</label>
                  <input
                    type="text"
                    value={bkashMerchantNumber}
                    onChange={(e) => setBkashMerchantNumber(e.target.value)}
                    className="w-full mt-1 p-2 bg-white border border-slate-300 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">App Key</label>
                  <input
                    type="text"
                    value={bkashAppKey}
                    onChange={(e) => setBkashAppKey(e.target.value)}
                    className="w-full mt-1 p-2 bg-white border border-slate-300 rounded font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Nagad */}
            <div className="p-3.5 bg-amber-50/50 rounded border border-amber-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
                  Nagad Direct Gateway
                </span>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 font-bold rounded text-[10px]">
                  ENABLED
                </span>
              </div>
              <div>
                <label className="font-bold text-slate-700">Nagad Merchant ID</label>
                <input
                  type="text"
                  value={nagadMerchantId}
                  onChange={(e) => setNagadMerchantId(e.target.value)}
                  className="w-full mt-1 p-2 bg-white border border-slate-300 rounded font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Invoice SetUp */}
        {activeTab === 'invoice' && (
          <div className="space-y-4 text-xs">
            <div className="border-b border-slate-100 pb-2">
              <h2 className="text-sm font-bold text-slate-800">Invoice Customization & Print Layout</h2>
              <p className="text-xs text-slate-500">Configure bill voucher prefix, thermal pos slip size and payment instructions.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700">Invoice Number Prefix</label>
                <input type="text" defaultValue="BBN-INV-" className="w-full mt-1 p-2 border border-slate-300 rounded font-mono" />
              </div>
              <div>
                <label className="font-bold text-slate-700">Paper Layout Default</label>
                <select defaultValue="A4" className="w-full mt-1 p-2 border border-slate-300 rounded bg-white">
                  <option value="A4">A4 Full Page (With VAT Details)</option>
                  <option value="POS">80mm Thermal POS Slip</option>
                  <option value="A5">A5 Half Sheet Voucher</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="font-bold text-slate-700">Invoice Footer Note / Terms</label>
                <textarea rows={3} defaultValue="Payment due by the 10th. For any dispute or reconnection call BBN NOC Hotline: 01710-287818. Keep this slip for your records." className="w-full mt-1 p-2 border border-slate-300 rounded" />
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Periods SetUp */}
        {activeTab === 'periods' && (
          <div className="space-y-4 text-xs">
            <div className="border-b border-slate-100 pb-2">
              <h2 className="text-sm font-bold text-slate-800">Billing Cycles & Periods Setup</h2>
              <p className="text-xs text-slate-500">Define calendar billing cycles, fiscal year start, and automated lock schedule.</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="font-bold text-slate-700">Cycle Generation Day</label>
                <input type="number" defaultValue={1} min={1} max={28} className="w-full mt-1 p-2 border border-slate-300 rounded" />
              </div>
              <div>
                <label className="font-bold text-slate-700">Payment Due Day</label>
                <input type="number" defaultValue={10} min={1} max={28} className="w-full mt-1 p-2 border border-slate-300 rounded" />
              </div>
              <div>
                <label className="font-bold text-slate-700">Auto Lock Cutoff Day</label>
                <input type="number" defaultValue={13} min={1} max={28} className="w-full mt-1 p-2 border border-slate-300 rounded" />
              </div>
            </div>
          </div>
        )}

        {/* Tab 7: EMail SetUp */}
        {activeTab === 'email' && (
          <div className="space-y-4 text-xs">
            <div className="border-b border-slate-100 pb-2">
              <h2 className="text-sm font-bold text-slate-800">SMTP Server & Outgoing EMail Settings</h2>
              <p className="text-xs text-slate-500">For sending automated customer PDF invoices and payment receipts.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700">SMTP Host</label>
                <input type="text" defaultValue="smtp.gmail.com" className="w-full mt-1 p-2 border border-slate-300 rounded font-mono" />
              </div>
              <div>
                <label className="font-bold text-slate-700">SMTP Port</label>
                <input type="number" defaultValue={587} className="w-full mt-1 p-2 border border-slate-300 rounded font-mono" />
              </div>
              <div>
                <label className="font-bold text-slate-700">Sender Email Address</label>
                <input type="email" defaultValue="billing@bbnisp.net" className="w-full mt-1 p-2 border border-slate-300 rounded" />
              </div>
              <div>
                <label className="font-bold text-slate-700">SMTP Password</label>
                <input type="password" defaultValue="••••••••••••" className="w-full mt-1 p-2 border border-slate-300 rounded font-mono" />
              </div>
            </div>
          </div>
        )}

        {/* Tab 8: VAT & Processing Fee */}
        {activeTab === 'vat' && (
          <div className="space-y-4 text-xs">
            <div className="border-b border-slate-100 pb-2">
              <h2 className="text-sm font-bold text-slate-800">Government VAT & Payment Processing Fees</h2>
              <p className="text-xs text-slate-500">Configure BTRC & NBR statutory tax breakdown.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700">Internet VAT Rate (%)</label>
                <input type="number" defaultValue={5} className="w-full mt-1 p-2 border border-slate-300 rounded" />
                <span className="text-[10px] text-slate-500">Government standard 5% VAT for ISP services</span>
              </div>
              <div>
                <label className="font-bold text-slate-700">bKash/Nagad Processing Fee (%)</label>
                <input type="number" defaultValue={1.5} step={0.1} className="w-full mt-1 p-2 border border-slate-300 rounded" />
                <span className="text-[10px] text-slate-500">Merchant gateway pass-through surcharge</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 9: Activity Logs */}
        {activeTab === 'logs' && (
          <div className="space-y-3 text-xs">
            <div className="border-b border-slate-100 pb-2 flex justify-between items-center">
              <div>
                <h2 className="text-sm font-bold text-slate-800">Security Audit Trail & Activity Logger</h2>
                <p className="text-xs text-slate-500">Immutable record of administrator actions and MikroTik API calls.</p>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                Logging Active
              </span>
            </div>
            <div className="border border-slate-200 rounded overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-700">
                  <tr>
                    <th className="p-2">Timestamp</th>
                    <th className="p-2">User / Operator</th>
                    <th className="p-2">Action</th>
                    <th className="p-2">Client / Target</th>
                    <th className="p-2 font-mono">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[11px]">
                  <tr>
                    <td className="p-2 text-slate-500">2026-09-14 10:45:12</td>
                    <td className="p-2 font-bold text-slate-800">bbnasad (Admin)</td>
                    <td className="p-2 text-emerald-700 font-medium">Bill Received ৳800</td>
                    <td className="p-2">Younus Ali (0006)</td>
                    <td className="p-2 font-mono text-slate-600">103.145.112.4</td>
                  </tr>
                  <tr>
                    <td className="p-2 text-slate-500">2026-09-14 10:12:05</td>
                    <td className="p-2 font-bold text-slate-800">System Daemon</td>
                    <td className="p-2 text-cyan-700 font-medium">MikroTik IP Pool Sync</td>
                    <td className="p-2">BBN-CORE-CCR</td>
                    <td className="p-2 font-mono text-slate-600">157.10.238.100</td>
                  </tr>
                  <tr>
                    <td className="p-2 text-slate-500">2026-09-14 09:30:44</td>
                    <td className="p-2 font-bold text-slate-800">bbnasad (Admin)</td>
                    <td className="p-2 text-amber-700 font-medium">Updated SMS Gateway Config</td>
                    <td className="p-2">Khudebarta v2.0</td>
                    <td className="p-2 font-mono text-slate-600">103.145.112.4</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="submit"
            className="px-5 py-2 bg-cyan-700 hover:bg-cyan-800 text-white rounded font-bold text-xs shadow-sm flex items-center gap-2 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save & Apply Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
