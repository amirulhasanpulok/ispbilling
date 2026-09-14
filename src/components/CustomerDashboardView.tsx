import React, { useState, useEffect } from 'react';
import {
  Wifi,
  ArrowUp,
  ArrowDown,
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Printer,
  CreditCard,
  Zap,
  HelpCircle,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Layers,
  Send,
  UserCheck
} from 'lucide-react';
import { Client, PaymentReceipt, SupportTicket } from '../types';
import { ISP_PACKAGES } from '../mockData';

interface CustomerDashboardViewProps {
  client: Client;
  receipts?: PaymentReceipt[];
  tickets?: SupportTicket[];
  onUpgradePlan: (pkgName: string, pkgSpeed: string, monthlyBill: number) => void;
  onPayBillOnline: (amount: number, method: string) => void;
  onPrintReceipt: (receipt: PaymentReceipt) => void;
  onSubmitSupportTicket: (problem: string, description: string) => void;
  onReturnToAdmin: () => void;
}

export const CustomerDashboardView: React.FC<CustomerDashboardViewProps> = ({
  client,
  receipts = [],
  tickets = [],
  onUpgradePlan,
  onPayBillOnline,
  onPrintReceipt,
  onSubmitSupportTicket,
  onReturnToAdmin
}) => {
  // Real-time live client speed simulation
  const [liveDownload, setLiveDownload] = useState(9.6);
  const [liveUpload, setLiveUpload] = useState(3.8);
  const [dataConsumed, setDataConsumed] = useState(142.6);
  const [selectedPlanToUpgrade, setSelectedPlanToUpgrade] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad' | 'Rocket' | 'Card'>('bKash');
  const [payAmount, setPayAmount] = useState(client?.monthlyBill || 500);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketProblem, setTicketProblem] = useState('Speed Issue');
  const [ticketDetails, setTicketDetails] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveDownload(+(8.8 + Math.random() * 1.6).toFixed(1));
      setLiveUpload(+(3.2 + Math.random() * 1.2).toFixed(1));
      setDataConsumed((prev) => +(prev + 0.01).toFixed(2));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleConfirmUpgrade = (pkg: typeof ISP_PACKAGES[0]) => {
    onUpgradePlan(pkg.speed, pkg.speedRaw, pkg.price);
    showToast(`Successfully upgraded to ${pkg.name} (${pkg.speed})! Mikrotik queue updated.`);
    setSelectedPlanToUpgrade(null);
  };

  const handleConfirmPayment = () => {
    onPayBillOnline(payAmount, paymentMethod);
    setShowPaymentModal(false);
    showToast(`৳${payAmount} payment successful via ${paymentMethod}! Receipt generated.`);
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitSupportTicket(ticketProblem, ticketDetails || 'Customer portal request');
    setShowTicketModal(false);
    setTicketDetails('');
    showToast('Support ticket lodged! Our field technician is reviewing.');
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
    <div className="p-4 sm:p-6 space-y-6 bg-[#f4f7f9] min-h-screen text-slate-800">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-6 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-2xl text-xs z-50 flex items-center gap-2 border border-emerald-500 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#162e3d] to-[#1f4760] text-white p-5 rounded-xl shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-black text-[10px] uppercase tracking-wider">
              Online &amp; Active
            </span>
            <span className="text-xs text-cyan-300 font-mono">PPPoE Session: {client.username}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Welcome back, {client.name}!
          </h2>
          <p className="text-xs text-slate-300">
            Client Code: <span className="font-mono font-bold text-cyan-300">{client.code}</span> | Optical Fiber Connection ({client.zone} - {client.subzone})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowPaymentModal(true)}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-lg shadow transition-all flex items-center gap-1.5"
          >
            <CreditCard className="w-4 h-4" />
            <span>Pay Bill Online</span>
          </button>

          <button
            onClick={() => setShowTicketModal(true)}
            className="px-3.5 py-2 bg-[#2d5c7c] hover:bg-[#396e94] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
          >
            <HelpCircle className="w-4 h-4 text-cyan-300" />
            <span>Request Support</span>
          </button>

          <button
            onClick={onReturnToAdmin}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-600 transition-colors"
          >
            Back to Operator View
          </button>
        </div>
      </div>

      {/* Top 3 KPI Cards: Plan, Live Usage, Billing Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Active Subscription */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span>Current Subscription</span>
              <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-cyan-100 text-cyan-800">
                Active Plan
              </span>
            </div>
            <div className="text-2xl font-black text-[#162e3d]">
              {client.packageName} <span className="text-sm font-normal text-slate-500">Optical Fiber</span>
            </div>
            <div className="text-xs text-slate-600 mt-1">
              Monthly Charge: <span className="font-bold text-slate-900 font-mono">৳{client.monthlyBill.toFixed(2)}</span> / month
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Next Renewal: 27 Sep 2026</span>
            </span>
            <a
              href="#plan-upgrade-section"
              className="text-cyan-600 hover:text-cyan-800 font-bold hover:underline flex items-center gap-0.5"
            >
              <span>Upgrade</span>
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Live Bandwidth Speedometer */}
        <div className="bg-slate-900 text-white p-4 rounded-xl shadow-sm border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Live Bandwidth Meter
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono">
              BBN-CORE Queue
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 my-2 text-center">
            <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700/60">
              <div className="text-[10px] text-cyan-400 font-semibold flex items-center justify-center gap-1">
                <ArrowDown className="w-3 h-3" />
                <span>Download</span>
              </div>
              <div className="text-xl font-black font-mono mt-0.5 text-white">
                {liveDownload} <span className="text-[11px] text-slate-400 font-normal">Mbps</span>
              </div>
            </div>

            <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700/60">
              <div className="text-[10px] text-emerald-400 font-semibold flex items-center justify-center gap-1">
                <ArrowUp className="w-3 h-3" />
                <span>Upload</span>
              </div>
              <div className="text-xl font-black font-mono mt-0.5 text-white">
                {liveUpload} <span className="text-[11px] text-slate-400 font-normal">Mbps</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 flex justify-between pt-1 border-t border-slate-800">
            <span>Consumed: <strong className="text-white font-mono">{dataConsumed} GB</strong></span>
            <span className="text-emerald-400 font-medium">Unlimited FUP</span>
          </div>
        </div>

        {/* Account Balance & Bill Status */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span>Account Billing Status</span>
              <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Zero Due</span>
              </span>
            </div>
            <div className="text-2xl font-black text-emerald-700 font-mono">
              ৳{client.balanceDue.toFixed(2)}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Your account is fully paid up to date. Thank you!
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Auto-Renew on Due Date</span>
            <button
              onClick={() => setShowPaymentModal(true)}
              className="text-xs bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-300 font-semibold px-2.5 py-1 rounded transition-colors"
            >
              Advance Pay
            </button>
          </div>
        </div>
      </div>

      {/* Plan Upgrades Section (Explicitly requested by user) */}
      <div id="plan-upgrade-section" className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <h3 className="text-base font-bold text-[#162e3d] flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Easy Plan Upgrades (Instant Mikrotik Speed Provisioning)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Select any broadband package below to instantly boost your connection speed
            </p>
          </div>
          <span className="text-xs text-slate-400">Zero activation fees for existing customers</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ISP_PACKAGES.map((pkg) => {
            const isCurrent = client.packageName.toLowerCase().includes(pkg.speed.toLowerCase().replace(' ', ''));

            return (
              <div
                key={pkg.id}
                className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                  isCurrent
                    ? 'border-cyan-500 bg-cyan-50/40 shadow-sm ring-1 ring-cyan-500'
                    : pkg.popular
                    ? 'border-amber-400 bg-amber-50/20 hover:shadow-md'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-slate-900">{pkg.name}</span>
                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-600 text-white">
                        Current
                      </span>
                    )}
                    {pkg.popular && !isCurrent && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-white">
                        Popular
                      </span>
                    )}
                  </div>

                  <div className="text-2xl font-black text-[#162e3d] font-mono">
                    {pkg.speed}
                  </div>
                  <div className="text-sm font-bold text-slate-700 mt-1">
                    ৳{pkg.price} <span className="text-xs font-normal text-slate-500">/ month</span>
                  </div>

                  <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
                    {pkg.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200">
                  {isCurrent ? (
                    <button
                      disabled
                      className="w-full py-1.5 bg-slate-200 text-slate-600 font-semibold rounded text-xs cursor-default"
                    >
                      Active Plan
                    </button>
                  ) : (
                    <button
                      onClick={() => handleConfirmUpgrade(pkg)}
                      className="w-full py-1.5 bg-[#162e3d] hover:bg-[#203c4f] text-white font-bold rounded text-xs shadow-sm transition-colors flex items-center justify-center gap-1"
                    >
                      <span>Upgrade to {pkg.speed}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment History & Invoices (Explicitly requested by user) */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <h3 className="text-base font-bold text-[#162e3d] flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>Payment History &amp; Official Receipts</span>
            </h3>
            <p className="text-xs text-slate-500">
              Track all your past bill collections and download printable tax receipts
            </p>
          </div>

          <button
            onClick={() => setShowPaymentModal(true)}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-sm flex items-center gap-1"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Make Payment</span>
          </button>
        </div>

        {clientReceipts.length === 0 ? (
          <div className="p-8 text-center text-slate-400">No payment history records found.</div>
        ) : (
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-[#162e3d] text-white uppercase text-[10px] font-semibold tracking-wider">
                <tr>
                  <th className="p-3">Receipt / Trx No</th>
                  <th className="p-3">Billing Month</th>
                  <th className="p-3">Payment Date</th>
                  <th className="p-3">Method</th>
                  <th className="p-3">Payment Details</th>
                  <th className="p-3 text-right">Amount (BDT)</th>
                  <th className="p-3 text-center">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {clientReceipts.map((rc) => (
                  <tr key={rc.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-cyan-800">{rc.receiptNo}</td>
                    <td className="p-3 font-medium">{rc.month}</td>
                    <td className="p-3 text-slate-600">{rc.receivedDate}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-pink-100 text-pink-800">
                        {rc.receivedBy}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600">{rc.paymentInfo}</td>
                    <td className="p-3 text-right font-mono font-bold text-emerald-700 text-sm">
                      ৳{rc.totalBill.toFixed(2)}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => onPrintReceipt(rc)}
                        className="px-2 py-1 bg-slate-100 hover:bg-cyan-100 text-cyan-800 rounded font-semibold text-[11px] flex items-center gap-1 mx-auto transition-colors"
                        title="View and Print Money Receipt"
                      >
                        <Printer className="w-3 h-3" />
                        <span>Print</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer Support Tickets Desk */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <h3 className="text-base font-bold text-[#162e3d] flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-cyan-600" />
              <span>Your Support Requests &amp; Line Maintenance</span>
            </h3>
            <p className="text-xs text-slate-500">
              Need assistance? Our local technical team is on standby 24/7
            </p>
          </div>

          <button
            onClick={() => setShowTicketModal(true)}
            className="px-3.5 py-1.5 bg-[#162e3d] hover:bg-[#203c4f] text-white font-semibold text-xs rounded-lg shadow-sm flex items-center gap-1"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Open Support Request</span>
          </button>
        </div>

        {clientTickets.length === 0 ? (
          <div className="p-6 text-center text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-300 text-xs">
            <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
            No open trouble tickets. Your optical connection is in optimal health.
          </div>
        ) : (
          <div className="space-y-2">
            {clientTickets.map((t) => (
              <div
                key={t.ticketNo}
                className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <span>Ticket #{t.ticketNo}: {t.problem}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                      {t.status}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-0.5">{t.note}</p>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Logged: {t.complainTime} | Assigned: {t.assignTo}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-medium text-cyan-700 block">
                    Under Inspection
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Online Bill Payment Modal (bKash, Nagad, Rocket) */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-fade-in">
            <div className="bg-[#162e3d] text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm">BBN Instant Payment Gateway</h3>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-slate-300 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-4 space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="flex justify-between text-slate-600 mb-1">
                  <span>Client Code / Username:</span>
                  <span className="font-mono font-bold text-slate-800">
                    {client.code} ({client.username})
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 mb-1">
                  <span>Current Package:</span>
                  <span className="font-semibold text-slate-800">{client.packageName}</span>
                </div>
                <div className="flex justify-between text-slate-900 font-bold text-sm pt-1 border-t border-slate-200">
                  <span>Payable Amount:</span>
                  <span className="font-mono text-emerald-700">৳{payAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">
                  Select Mobile Financial Service (MFS)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bKash')}
                    className={`p-2.5 rounded-lg border text-center transition-all ${
                      paymentMethod === 'bKash'
                        ? 'border-pink-500 bg-pink-50 text-pink-700 font-bold shadow-sm'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    bKash
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Nagad')}
                    className={`p-2.5 rounded-lg border text-center transition-all ${
                      paymentMethod === 'Nagad'
                        ? 'border-orange-500 bg-orange-50 text-orange-700 font-bold shadow-sm'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Nagad
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Rocket')}
                    className={`p-2.5 rounded-lg border text-center transition-all ${
                      paymentMethod === 'Rocket'
                        ? 'border-purple-500 bg-purple-50 text-purple-700 font-bold shadow-sm'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Rocket
                  </button>
                </div>
              </div>

              {/* Mobile Number Input */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  {paymentMethod} Account Mobile Number
                </label>
                <input
                  type="tel"
                  defaultValue={client.mobile}
                  className="w-full px-3 py-2 border border-slate-300 rounded font-mono text-slate-800"
                />
              </div>

              <div className="text-[11px] text-slate-500 bg-emerald-50 text-emerald-800 p-2.5 rounded border border-emerald-200 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero gateway surcharge. Instant activation via API.</span>
              </div>
            </div>

            <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPayment}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold shadow-sm"
              >
                Confirm ৳{payAmount} Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Support Ticket Modal */}
      {showTicketModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-fade-in">
            <div className="bg-[#162e3d] text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <HelpCircle className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-sm">Request Technical Support</h3>
              </div>
              <button
                onClick={() => setShowTicketModal(false)}
                className="text-slate-300 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleTicketSubmit} className="p-4 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Issue Category</label>
                <select
                  value={ticketProblem}
                  onChange={(e) => setTicketProblem(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded text-slate-800"
                >
                  <option value="Speed Issue">Speed Issue / High Latency</option>
                  <option value="No Internet">No Internet / Optical Red Light (LOS)</option>
                  <option value="Forget Password">Forget PPPoE / Wi-Fi Password</option>
                  <option value="Fiber Cut">Physical Wire / Fiber Cut</option>
                  <option value="Billing Query">Billing Query</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Details / Note</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe your issue or preferred visit time..."
                  value={ticketDetails}
                  onChange={(e) => setTicketDetails(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded text-slate-800"
                />
              </div>

              <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-slate-500 text-[11px]">
                Support Helpline: <strong>01710-287818</strong> (9:00 AM - 11:00 PM)
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowTicketModal(false)}
                  className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#00a2d3] hover:bg-[#008cb6] text-white rounded font-bold"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
