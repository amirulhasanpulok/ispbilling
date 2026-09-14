import React, { useState, useEffect } from 'react';
import {
  Wifi,
  ArrowUp,
  ArrowDown,
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  Printer,
  CreditCard,
  Zap,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Send,
  User,
  ArrowLeft,
  X
} from 'lucide-react';
import { Client, PaymentReceipt, SupportTicket } from '../types';
import { ISP_PACKAGES } from '../mockData';
import { PageHeader, StatusBadge, EmptyState, Toast, MetricCard } from './common';

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

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowPaymentModal(false);
        setShowTicketModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleConfirmUpgrade = (pkg: typeof ISP_PACKAGES[0]) => {
    onUpgradePlan(pkg.speed, pkg.speedRaw, pkg.price);
    showToast(`Successfully upgraded to ${pkg.name} (${pkg.speed})! MikroTik queue updated.`);
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
    <div className="p-4 sm:p-5 space-y-4 bg-slate-50 min-h-[calc(100vh-3.5rem)] text-slate-800">
      {/* Toast Notification */}
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}

      {/* Page Header */}
      <PageHeader
        title={`Customer Portal: ${client.name}`}
        subtitle={`Subscriber Code: ${client.code} | PPPoE: ${client.username} | ${client.zone}`}
        icon={User}
        breadcrumbs={[
          { label: 'Home', onClick: onReturnToAdmin },
          { label: 'Subscriber Portal' }
        ]}
        actions={
          <>
            <button
              onClick={onReturnToAdmin}
              className="px-3 py-1.5 border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium rounded-lg text-xs flex items-center gap-1.5 transition-colors bg-white shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Admin Portal</span>
            </button>

            <button
              onClick={() => setShowTicketModal(true)}
              className="px-3 py-1.5 bg-[#162e3d] hover:bg-[#203c4f] text-white font-medium rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span>Request Support</span>
            </button>

            <button
              onClick={() => setShowPaymentModal(true)}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs shadow-xs flex items-center gap-1.5 transition-colors focus:ring-2 focus:ring-emerald-500"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Pay Bill Online</span>
            </button>
          </>
        }
      />

      {/* Top 3 KPI Cards: Plan, Live Usage, Billing Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Active Subscription */}
        <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold text-slate-500">Current Subscription</span>
              <StatusBadge status="Active" type="connection" />
            </div>
            <div className="text-xl font-bold text-[#162e3d]">
              {client.packageName}{' '}
              <span className="text-xs font-normal text-slate-500">Optical Fiber</span>
            </div>
            <div className="text-xs text-slate-600 mt-1">
              Monthly Charge:{' '}
              <span className="font-bold text-slate-900 font-mono">
                ৳{client.monthlyBill.toFixed(2)}
              </span>{' '}
              / month
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Next Renewal: 27 Sep 2026</span>
            </span>
            <a
              href="#plan-upgrade-section"
              className="text-cyan-700 hover:text-cyan-900 font-bold hover:underline flex items-center gap-0.5"
            >
              <span>Upgrade</span>
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Live Bandwidth Speedometer */}
        <div className="bg-[#162e3d] text-white p-4 rounded-xl shadow-xs border border-[#162e3d] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-300 flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Live Bandwidth Meter
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 font-mono border border-slate-700">
              BBN-CORE Queue
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 my-2 text-center">
            <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/60">
              <div className="text-[10px] text-cyan-400 font-semibold flex items-center justify-center gap-1">
                <ArrowDown className="w-3 h-3" />
                <span>Download</span>
              </div>
              <div className="text-lg font-bold font-mono mt-0.5 text-white">
                {liveDownload}{' '}
                <span className="text-[11px] text-slate-400 font-normal">Mbps</span>
              </div>
            </div>

            <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/60">
              <div className="text-[10px] text-emerald-400 font-semibold flex items-center justify-center gap-1">
                <ArrowUp className="w-3 h-3" />
                <span>Upload</span>
              </div>
              <div className="text-lg font-bold font-mono mt-0.5 text-white">
                {liveUpload}{' '}
                <span className="text-[11px] text-slate-400 font-normal">Mbps</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-300 flex justify-between pt-1 border-t border-slate-700/60">
            <span>
              Consumed: <strong className="text-white font-mono">{dataConsumed} GB</strong>
            </span>
            <span className="text-emerald-400 font-medium">Unlimited FUP</span>
          </div>
        </div>

        {/* Account Balance & Bill Status */}
        <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold text-slate-500">Account Billing Status</span>
              {client.balanceDue === 0 ? (
                <StatusBadge status="Paid" type="billing" />
              ) : (
                <StatusBadge status="Unpaid" type="billing" />
              )}
            </div>
            <div className="text-2xl font-bold text-emerald-700 font-mono">
              ৳{client.balanceDue.toFixed(2)}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {client.balanceDue === 0
                ? 'Your account is fully paid up to date. Thank you!'
                : `Outstanding balance of ৳${client.balanceDue.toFixed(2)} due.`}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Auto-Renew on Due Date</span>
            <button
              onClick={() => setShowPaymentModal(true)}
              className="text-xs bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-300 font-semibold px-2.5 py-1 rounded-lg transition-colors shadow-xs"
            >
              Advance Pay
            </button>
          </div>
        </div>
      </div>

      {/* Plan Upgrades Section */}
      <div id="plan-upgrade-section" className="bg-white p-5 rounded-xl shadow-xs border border-slate-200 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <h3 className="text-sm font-bold text-[#162e3d] flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Easy Plan Upgrades (Instant MikroTik Speed Provisioning)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Select any broadband package below to instantly boost your connection speed
            </p>
          </div>
          <span className="text-xs text-slate-400 font-medium">Zero activation fees for existing customers</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {ISP_PACKAGES.map((pkg) => {
            const isCurrent = client.packageName.toLowerCase().includes(pkg.speed.toLowerCase().replace(' ', ''));

            return (
              <div
                key={pkg.id}
                className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                  isCurrent
                    ? 'border-cyan-500 bg-cyan-50/50 shadow-xs ring-1 ring-cyan-500/20'
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-xs bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-slate-900">{pkg.name}</span>
                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 text-cyan-800">
                        Current Plan
                      </span>
                    )}
                  </div>

                  <div className="text-xl font-bold text-[#162e3d] font-mono mt-1">
                    {pkg.speed}
                  </div>

                  <p className="text-xs text-slate-500 mt-1">{pkg.features[0]}</p>

                  <div className="mt-3 text-lg font-bold text-cyan-800 font-mono">
                    ৳{pkg.price}{' '}
                    <span className="text-xs font-normal text-slate-500">/ mo</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <button
                    disabled={isCurrent}
                    onClick={() => handleConfirmUpgrade(pkg)}
                    className={`w-full py-1.5 rounded-lg text-xs font-semibold transition-colors shadow-xs ${
                      isCurrent
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-[#162e3d] hover:bg-[#203c4f] text-white'
                    }`}
                  >
                    {isCurrent ? 'Active Plan' : `Upgrade to ${pkg.speed}`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Customer Billing & Payment History */}
      <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-200 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <h3 className="text-sm font-bold text-[#162e3d] flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>Official Payment Receipts &amp; Billing History</span>
            </h3>
            <p className="text-xs text-slate-500">
              Download tax receipts and view all verified payments recorded in the system
            </p>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {clientReceipts.length} verified transactions
          </span>
        </div>

        {clientReceipts.length === 0 ? (
          <EmptyState
            title="No Payment Receipts Found"
            description="You do not have any historical payment receipts yet. Once payments are recorded, they will appear here."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 border-collapse">
              <thead className="bg-[#162e3d] text-white uppercase text-[10px] font-semibold tracking-wider">
                <tr>
                  <th className="p-3">Receipt No</th>
                  <th className="p-3">Billing Month</th>
                  <th className="p-3">Payment Date</th>
                  <th className="p-3">Received By</th>
                  <th className="p-3">Payment Info</th>
                  <th className="p-3 text-right">Amount (৳)</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {clientReceipts.map((rc) => (
                  <tr key={rc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-mono font-bold text-cyan-800">{rc.receiptNo}</td>
                    <td className="p-3 font-medium text-slate-800">{rc.month}</td>
                    <td className="p-3 text-slate-600">{rc.receivedDate}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-pink-50 text-pink-700 border border-pink-200">
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
                        className="px-2.5 py-1 bg-slate-100 hover:bg-cyan-50 text-cyan-800 rounded-lg font-semibold text-[11px] inline-flex items-center gap-1 transition-colors border border-slate-200"
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

      {/* Support Requests Section */}
      <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-200 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <h3 className="text-sm font-bold text-[#162e3d] flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-cyan-600" />
              <span>Your Support Requests &amp; Line Maintenance</span>
            </h3>
            <p className="text-xs text-slate-500">
              Need assistance? Our local technical team is on standby 24/7
            </p>
          </div>

          <button
            onClick={() => setShowTicketModal(true)}
            className="px-3.5 py-1.5 bg-[#162e3d] hover:bg-[#203c4f] text-white font-semibold text-xs rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Open Support Request</span>
          </button>
        </div>

        {clientTickets.length === 0 ? (
          <EmptyState
            title="No Support Tickets"
            description="Your optical fiber connection is healthy and you have no active trouble tickets."
          />
        ) : (
          <div className="space-y-2">
            {clientTickets.map((t) => (
              <div
                key={t.ticketNo}
                className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <span>Ticket #{t.ticketNo}: {t.problem}</span>
                    <StatusBadge status={t.status} type="ticket" />
                  </div>
                  <p className="text-slate-600 text-[11px] mt-1">{t.note}</p>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Logged: {t.complainTime} | Assigned: {t.assignTo}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-semibold text-cyan-700 block">
                    Under Inspection
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Online Bill Payment Modal */}
      {showPaymentModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="payment-modal-title"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowPaymentModal(false);
          }}
        >
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#162e3d] text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                <h3 id="payment-modal-title" className="font-bold text-sm">
                  BBN Instant Payment Gateway
                </h3>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
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
                <div className="flex justify-between text-slate-900 font-bold text-sm pt-1.5 border-t border-slate-200">
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
                  {(['bKash', 'Nagad', 'Rocket'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`p-2.5 rounded-lg border text-center font-medium transition-all ${
                        paymentMethod === method
                          ? 'border-cyan-500 bg-cyan-50 text-cyan-800 font-bold shadow-xs'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Number Input */}
              <div>
                <label htmlFor="mfs-mobile-input" className="block text-slate-700 font-semibold mb-1">
                  {paymentMethod} Account Mobile Number
                </label>
                <input
                  id="mfs-mobile-input"
                  type="tel"
                  defaultValue={client.mobile}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-slate-800 focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="text-[11px] bg-emerald-50 text-emerald-800 p-2.5 rounded-lg border border-emerald-200 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero gateway surcharge. Instant activation via MikroTik API.</span>
              </div>
            </div>

            <div className="bg-slate-50 px-5 py-3.5 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="px-3.5 py-1.5 border border-slate-300 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmPayment}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
              >
                Confirm ৳{payAmount} Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Support Ticket Modal */}
      {showTicketModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="ticket-modal-title"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowTicketModal(false);
          }}
        >
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#162e3d] text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <HelpCircle className="w-5 h-5 text-cyan-400" />
                <h3 id="ticket-modal-title" className="font-bold text-sm">
                  Request Technical Support
                </h3>
              </div>
              <button
                onClick={() => setShowTicketModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleTicketSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label htmlFor="issue-category-select" className="block text-slate-700 font-semibold mb-1">
                  Issue Category
                </label>
                <select
                  id="issue-category-select"
                  value={ticketProblem}
                  onChange={(e) => setTicketProblem(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="Speed Issue">Speed Issue / High Latency</option>
                  <option value="No Internet">No Internet / Optical Red Light (LOS)</option>
                  <option value="Forget Password">Forget PPPoE / Wi-Fi Password</option>
                  <option value="Fiber Cut">Physical Wire / Fiber Cut</option>
                  <option value="Billing Query">Billing Query</option>
                </select>
              </div>

              <div>
                <label htmlFor="ticket-details-input" className="block text-slate-700 font-semibold mb-1">
                  Details / Note
                </label>
                <textarea
                  id="ticket-details-input"
                  rows={3}
                  required
                  placeholder="Describe your issue or preferred visit time..."
                  value={ticketDetails}
                  onChange={(e) => setTicketDetails(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-slate-500 text-[11px]">
                Support Helpline: <strong className="text-slate-800">01710-287818</strong> (9:00 AM - 11:00 PM)
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowTicketModal(false)}
                  className="px-3.5 py-1.5 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-bold shadow-xs transition-colors"
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
