import React, { useState } from 'react';
import {
  DollarSign,
  Scale,
  TrendingUp,
  TrendingDown,
  Calendar,
  Filter,
  Download,
  Plus,
  CheckCircle2,
  CreditCard,
  Building,
  ArrowUpRight,
  ArrowDownLeft,
  FileText,
  Search
} from 'lucide-react';
import { PaymentReceipt } from '../types';

interface AccountingViewProps {
  receipts?: PaymentReceipt[];
  onOpenReceipt?: (receipt: PaymentReceipt) => void;
  initialTab?: 'daily' | 'cashbook' | 'expenses' | 'pl';
}

interface ExpenseRecord {
  id: string;
  voucherNo: string;
  date: string;
  category: string;
  description: string;
  paidTo: string;
  amount: number;
  paymentMethod: 'Cash' | 'Bank' | 'bKash';
}

export const AccountingView: React.FC<AccountingViewProps> = ({
  receipts = [],
  onOpenReceipt,
  initialTab = 'daily'
}) => {
  const [activeTab, setActiveTab] = useState<'daily' | 'cashbook' | 'expenses' | 'pl'>(initialTab);
  const [dateFilter, setDateFilter] = useState('Today');

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Expense form state
  const [expCategory, setExpCategory] = useState('Upstream Bandwidth');
  const [expDesc, setExpDesc] = useState('');
  const [expPaidTo, setExpPaidTo] = useState('');
  const [expAmount, setExpAmount] = useState<number>(15000);
  const [expMethod, setExpMethod] = useState<'Cash' | 'Bank' | 'bKash'>('Bank');

  const [expenses, setExpenses] = useState<ExpenseRecord[]>([
    {
      id: 'exp-1',
      voucherNo: 'VCH-2026-001',
      date: '2026-09-14',
      category: 'Upstream Bandwidth',
      description: 'IIG Bandwidth bill payment (1 Gbps link)',
      paidTo: 'Summit Communications Ltd',
      amount: 65000,
      paymentMethod: 'Bank'
    },
    {
      id: 'exp-2',
      voucherNo: 'VCH-2026-002',
      date: '2026-09-13',
      category: 'Fiber Maintenance',
      description: 'Splice machine electrodes and optical sleeves',
      paidTo: 'Micro Technology Dhaka',
      amount: 4500,
      paymentMethod: 'Cash'
    },
    {
      id: 'exp-3',
      voucherNo: 'VCH-2026-003',
      date: '2026-09-12',
      category: 'Office & Utilities',
      description: 'Electricity bill (Bhurungamari Server Room)',
      paidTo: 'NESCO Ltd',
      amount: 12800,
      paymentMethod: 'bKash'
    },
    {
      id: 'exp-4',
      voucherNo: 'VCH-2026-004',
      date: '2026-09-10',
      category: 'Staff Salary & Fuel',
      description: 'Field technicians motorbike fuel allowance',
      paidTo: 'Sobuj & Rasel',
      amount: 3200,
      paymentMethod: 'Cash'
    }
  ]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expDesc || expAmount <= 0) {
      showToast('Please fill all expense voucher details');
      return;
    }
    const newExp: ExpenseRecord = {
      id: `exp-${Date.now()}`,
      voucherNo: `VCH-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      category: expCategory,
      description: expDesc,
      paidTo: expPaidTo || 'Vendor',
      amount: Number(expAmount),
      paymentMethod: expMethod
    };
    setExpenses([newExp, ...expenses]);
    setShowAddExpenseModal(false);
    setExpDesc('');
    setExpPaidTo('');
    showToast(`Expense voucher ${newExp.voucherNo} recorded successfully!`);
  };

  const safeReceipts = Array.isArray(receipts) ? receipts : [];

  // Summary calculations
  const totalReceived = safeReceipts.reduce((acc, r) => acc + (r.receivedBill || 0), 0) + 195000;
  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
  const netProfit = totalReceived - totalExpenses;
  const cashBalance = 48500;
  const bankBalance = 124600;
  const bkashBalance = 32800;

  return (
    <div className="p-4 space-y-4 bg-[#f4f7f9] min-h-screen text-slate-800">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-16 right-6 bg-slate-900 text-white px-4 py-2 rounded shadow-2xl text-xs z-50 flex items-center gap-2 border border-emerald-500 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded shadow-sm border border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-[#162e3d] text-emerald-400 rounded">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800 flex items-center gap-2">
              Accounting Ledger & Daily Collection Register
            </h1>
            <p className="text-xs text-slate-500">
              Bhurungamari Broadband Network (BBN) Accounts & Cash Book
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddExpenseModal(true)}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Expense Voucher</span>
          </button>

          <div className="flex rounded border border-slate-200 p-0.5 bg-slate-100 text-xs font-medium">
            <button
              onClick={() => setActiveTab('daily')}
              className={`px-3 py-1 rounded transition-colors ${
                activeTab === 'daily' ? 'bg-white shadow text-cyan-700 font-bold' : 'text-slate-600'
              }`}
            >
              Daily Collections
            </button>
            <button
              onClick={() => setActiveTab('cashbook')}
              className={`px-3 py-1 rounded transition-colors ${
                activeTab === 'cashbook' ? 'bg-white shadow text-cyan-700 font-bold' : 'text-slate-600'
              }`}
            >
              Cash & Bank Book
            </button>
            <button
              onClick={() => setActiveTab('expenses')}
              className={`px-3 py-1 rounded transition-colors ${
                activeTab === 'expenses' ? 'bg-white shadow text-cyan-700 font-bold' : 'text-slate-600'
              }`}
            >
              Expenses
            </button>
            <button
              onClick={() => setActiveTab('pl')}
              className={`px-3 py-1 rounded transition-colors ${
                activeTab === 'pl' ? 'bg-white shadow text-cyan-700 font-bold' : 'text-slate-600'
              }`}
            >
              P&L Overview
            </button>
          </div>
        </div>
      </div>

      {/* Accounting Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Gross Billing Collected</span>
            <div className="text-xl font-black text-emerald-700 font-mono mt-0.5">
              ৳ {totalReceived.toLocaleString()}
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
              <TrendingUp className="w-3 h-3" /> Retail + POP Subscriptions
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Operating Expenses</span>
            <div className="text-xl font-black text-rose-700 font-mono mt-0.5">
              ৳ {totalExpenses.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
              <TrendingDown className="w-3 h-3 text-rose-500" /> Bandwidth, fiber & payroll
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Net Operating Profit</span>
            <div className="text-xl font-black text-cyan-700 font-mono mt-0.5">
              ৳ {netProfit.toLocaleString()}
            </div>
            <span className="text-[10px] text-cyan-600 font-semibold flex items-center gap-1 mt-0.5">
              Profit Margin: {((netProfit / totalReceived) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-cyan-50 flex items-center justify-center text-cyan-600">
            <Scale className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Cash in Drawer (Petty)</span>
            <div className="text-xl font-black text-slate-800 font-mono mt-0.5">
              ৳ {cashBalance.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
              Bank: ৳ {bankBalance.toLocaleString()}
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
            <Building className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tab 1: Daily Collections Register */}
      {activeTab === 'daily' && (
        <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-3 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                Daily Bill Collection Ledger (Showing today's receipts)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Filter client, MR No..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-7 pr-2.5 py-1 text-xs rounded border border-slate-300 w-48 focus:outline-none focus:border-cyan-500"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                  <th className="p-2.5">MR Number</th>
                  <th className="p-2.5">Date & Time</th>
                  <th className="p-2.5">Client Code</th>
                  <th className="p-2.5">Collector</th>
                  <th className="p-2.5">Payment Method</th>
                  <th className="p-2.5">Remarks</th>
                  <th className="p-2.5 text-right">Amount (৳)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {safeReceipts.map((r, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-2.5 font-bold font-mono text-cyan-700">
                      {r.receiptNo || `MR-00${idx + 1}`}
                    </td>
                    <td className="p-2.5 text-slate-600">{r.receivedDate}</td>
                    <td className="p-2.5 font-mono font-bold text-slate-800">{r.clientCode}</td>
                    <td className="p-2.5 text-slate-600">{r.createdBy || 'bbnasad (Counter)'}</td>
                    <td className="p-2.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          r.receivedBy === 'bKash'
                            ? 'bg-pink-100 text-pink-700'
                            : r.receivedBy === 'Nagad'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {r.receivedBy}
                      </span>
                    </td>
                    <td className="p-2.5 text-slate-500">{r.remarks || 'Monthly Internet Bill'}</td>
                    <td className="p-2.5 font-mono font-bold text-slate-800 text-right">
                      ৳ {r.receivedBill.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Cash & Bank Book */}
      {activeTab === 'cashbook' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-bold text-xs text-slate-700 flex items-center gap-1.5">
                <Building className="w-4 h-4 text-emerald-600" /> Cash in Hand (Counter)
              </span>
              <span className="font-mono font-bold text-emerald-700">৳ 48,500</span>
            </div>
            <div className="text-xs text-slate-500 space-y-1.5">
              <div className="flex justify-between">
                <span>Opening Cash:</span>
                <span className="font-mono">৳ 22,000</span>
              </div>
              <div className="flex justify-between text-emerald-600">
                <span>Today's Cash Inflow:</span>
                <span className="font-mono font-bold">+ ৳ 34,200</span>
              </div>
              <div className="flex justify-between text-rose-600">
                <span>Today's Cash Expenses:</span>
                <span className="font-mono font-bold">- ৳ 7,700</span>
              </div>
              <div className="border-t pt-1 flex justify-between font-bold text-slate-800">
                <span>Closing Balance:</span>
                <span className="font-mono">৳ 48,500</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-bold text-xs text-slate-700 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-cyan-600" /> Islami Bank (Bhurungamari Br.)
              </span>
              <span className="font-mono font-bold text-cyan-700">৳ 124,600</span>
            </div>
            <div className="text-xs text-slate-500 space-y-1.5">
              <div className="flex justify-between">
                <span>A/C No:</span>
                <span className="font-mono font-bold">2050212010048291</span>
              </div>
              <div className="flex justify-between">
                <span>Routing:</span>
                <span className="font-mono">125490184</span>
              </div>
              <div className="flex justify-between text-emerald-600">
                <span>Corporate Collections:</span>
                <span className="font-mono">+ ৳ 75,000</span>
              </div>
              <div className="border-t pt-1 flex justify-between font-bold text-slate-800">
                <span>Cleared Balance:</span>
                <span className="font-mono">৳ 124,600</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-bold text-xs text-slate-700 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-pink-600" /> bKash Merchant Wallet
              </span>
              <span className="font-mono font-bold text-pink-700">৳ 32,800</span>
            </div>
            <div className="text-xs text-slate-500 space-y-1.5">
              <div className="flex justify-between">
                <span>Merchant No:</span>
                <span className="font-mono font-bold">01710-287818</span>
              </div>
              <div className="flex justify-between">
                <span>PGW Status:</span>
                <span className="text-emerald-600 font-bold">Live API</span>
              </div>
              <div className="flex justify-between">
                <span>Auto-Settlement:</span>
                <span>Daily 11:59 PM</span>
              </div>
              <div className="border-t pt-1 flex justify-between font-bold text-slate-800">
                <span>Available to Payout:</span>
                <span className="font-mono">৳ 32,800</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Operating Expenses List */}
      {activeTab === 'expenses' && (
        <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <span className="font-bold text-xs text-slate-800 uppercase tracking-wider">
              Expense Vouchers & Operational Outflow
            </span>
            <button
              onClick={() => setShowAddExpenseModal(true)}
              className="px-2.5 py-1 bg-rose-600 text-white text-xs rounded hover:bg-rose-700"
            >
              + Add Expense
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-600 border-b border-slate-200">
                  <th className="p-2.5">Voucher #</th>
                  <th className="p-2.5">Date</th>
                  <th className="p-2.5">Category</th>
                  <th className="p-2.5">Description</th>
                  <th className="p-2.5">Paid To</th>
                  <th className="p-2.5">Method</th>
                  <th className="p-2.5 text-right">Amount (৳)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {expenses.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50">
                    <td className="p-2.5 font-bold font-mono text-rose-700">{e.voucherNo}</td>
                    <td className="p-2.5 text-slate-500">{e.date}</td>
                    <td className="p-2.5 font-semibold text-slate-800">{e.category}</td>
                    <td className="p-2.5 text-slate-600">{e.description}</td>
                    <td className="p-2.5 text-slate-800 font-medium">{e.paidTo}</td>
                    <td className="p-2.5">
                      <span className="px-1.5 py-0.5 bg-slate-100 rounded text-[11px] font-mono border border-slate-200">
                        {e.paymentMethod}
                      </span>
                    </td>
                    <td className="p-2.5 font-mono font-bold text-rose-700 text-right">
                      ৳ {e.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Profit & Loss Statement */}
      {activeTab === 'pl' && (
        <div className="bg-white p-5 rounded border border-slate-200 shadow-sm max-w-3xl mx-auto space-y-4">
          <div className="text-center border-b pb-3">
            <h2 className="text-sm font-bold text-slate-900">BHURUNGAMARI BROADBAND NETWORK (BBN)</h2>
            <p className="text-xs text-slate-500">Monthly Profit & Loss Statement (September 2026)</p>
          </div>

          <div className="space-y-4 text-xs">
            {/* Revenue */}
            <div>
              <div className="font-bold text-slate-800 bg-slate-100 p-2 rounded">A. OPERATING REVENUE</div>
              <div className="divide-y divide-slate-100 mt-1">
                <div className="flex justify-between py-1.5 px-2">
                  <span>Retail Home Broadband Subscriptions (580 Users)</span>
                  <span className="font-mono font-bold">৳ 165,000</span>
                </div>
                <div className="flex justify-between py-1.5 px-2">
                  <span>Corporate Lease Links (Bank & Landport)</span>
                  <span className="font-mono font-bold">৳ 34,500</span>
                </div>
                <div className="flex justify-between py-1.5 px-2">
                  <span>POP Reseller Invoiced Bandwidth (Joymonirhat)</span>
                  <span className="font-mono font-bold">৳ 35,000</span>
                </div>
                <div className="flex justify-between py-1.5 px-2 font-bold text-emerald-700 bg-emerald-50">
                  <span>TOTAL OPERATING REVENUE (A)</span>
                  <span className="font-mono">৳ 234,500</span>
                </div>
              </div>
            </div>

            {/* Expenses */}
            <div>
              <div className="font-bold text-slate-800 bg-slate-100 p-2 rounded">B. OPERATING EXPENSES</div>
              <div className="divide-y divide-slate-100 mt-1">
                <div className="flex justify-between py-1.5 px-2">
                  <span>Upstream IIG Bandwidth (Summit Communications 1 Gbps)</span>
                  <span className="font-mono text-rose-700">৳ 65,000</span>
                </div>
                <div className="flex justify-between py-1.5 px-2">
                  <span>NTTN Fiber Core Transmission Rent (Fiber@Home)</span>
                  <span className="font-mono text-rose-700">৳ 18,000</span>
                </div>
                <div className="flex justify-between py-1.5 px-2">
                  <span>Staff Payroll (Linemen & Helpdesk 4 Persons)</span>
                  <span className="font-mono text-rose-700">৳ 38,000</span>
                </div>
                <div className="flex justify-between py-1.5 px-2">
                  <span>NESCO Electricity & Core Server UPS Power</span>
                  <span className="font-mono text-rose-700">৳ 12,800</span>
                </div>
                <div className="flex justify-between py-1.5 px-2 font-bold text-rose-700 bg-rose-50">
                  <span>TOTAL OPERATING EXPENSES (B)</span>
                  <span className="font-mono">৳ 133,800</span>
                </div>
              </div>
            </div>

            {/* Net Income */}
            <div className="p-3 bg-cyan-900 text-white rounded flex items-center justify-between text-sm font-bold">
              <span>NET MONTHLY PROFIT (A - B)</span>
              <span className="font-mono text-cyan-300 text-base">৳ 100,700</span>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Expense Voucher */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden animate-scale-up">
            <div className="p-3.5 bg-[#162e3d] text-white flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                <Scale className="w-4 h-4 text-rose-400" />
                Record New Expense Voucher
              </h3>
              <button
                onClick={() => setShowAddExpenseModal(false)}
                className="text-slate-300 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="p-4 space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700">Expense Category</label>
                <select
                  value={expCategory}
                  onChange={(e) => setExpCategory(e.target.value)}
                  className="w-full mt-1 p-2 border border-slate-300 rounded focus:border-rose-500"
                >
                  <option value="Upstream Bandwidth">Upstream Bandwidth (IIG/NTTN)</option>
                  <option value="Fiber Maintenance">Fiber & Optical Hardware</option>
                  <option value="Office & Utilities">Office & Electricity (NESCO)</option>
                  <option value="Staff Salary & Fuel">Staff Salary, Conveyance & Fuel</option>
                  <option value="BTRC License & Tax">BTRC Revenue Share & VAT</option>
                  <option value="Miscellaneous">Miscellaneous Petty Expense</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700">Description / Note</label>
                <input
                  type="text"
                  placeholder="e.g. Fiber splice patch cords & alcohol"
                  value={expDesc}
                  onChange={(e) => setExpDesc(e.target.value)}
                  className="w-full mt-1 p-2 border border-slate-300 rounded focus:border-rose-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Paid To</label>
                  <input
                    type="text"
                    placeholder="Recipient or Vendor"
                    value={expPaidTo}
                    onChange={(e) => setExpPaidTo(e.target.value)}
                    className="w-full mt-1 p-2 border border-slate-300 rounded focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Amount (৳)</label>
                  <input
                    type="number"
                    value={expAmount}
                    onChange={(e) => setExpAmount(Number(e.target.value))}
                    className="w-full mt-1 p-2 border border-slate-300 rounded focus:border-rose-500 font-mono font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700">Payment Channel</label>
                <div className="flex gap-4 mt-1">
                  {(['Cash', 'Bank', 'bKash'] as const).map((method) => (
                    <label key={method} className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="payMethod"
                        checked={expMethod === method}
                        onChange={() => setExpMethod(method)}
                      />
                      <span>{method}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddExpenseModal(false)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded font-bold shadow-sm"
                >
                  Post Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
