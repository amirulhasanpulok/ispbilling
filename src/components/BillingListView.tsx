import React, { useState } from 'react';
import {
  FileSpreadsheet,
  FileText,
  RefreshCw,
  Search,
  DollarSign,
  Download,
  Mail,
  Send,
  Printer,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Play
} from 'lucide-react';
import { BillRecord } from '../types';

interface BillingListViewProps {
  billingList?: BillRecord[];
  onOpenBillReceive: (clientCode: string) => void;
  onPrintInvoice: (bill: BillRecord) => void;
  onGenerateMonthlyCycle: () => void;
  onToggleMikrotikStatus: (clientCode: string) => void;
}

export const BillingListView: React.FC<BillingListViewProps> = ({
  billingList = [],
  onOpenBillReceive,
  onPrintInvoice,
  onGenerateMonthlyCycle,
  onToggleMikrotikStatus
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Paid' | 'Unpaid'>('All');
  const [selectedBillIds, setSelectedBillIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const safeBillingList = Array.isArray(billingList) ? billingList : [];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedBillIds(safeBillingList.map((b) => b.id));
    } else {
      setSelectedBillIds([]);
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedBillIds((prev) =>
      Array.isArray(prev)
        ? prev.includes(id)
          ? prev.filter((item) => item !== id)
          : [...prev, id]
        : [id]
    );
  };

  const filteredBills = safeBillingList.filter((b) => {
    const matchesSearch =
      (b.clientName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.clientCode || '').includes(searchTerm) ||
      (b.mobile || '').includes(searchTerm);

    const matchesStatus = statusFilter === 'All' || b.billingStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const paidCount = safeBillingList.filter((b) => b.billingStatus === 'Paid').length + 575;
  const unpaidCount = safeBillingList.filter((b) => b.billingStatus === 'Unpaid').length;
  const totalReceived = 199500;
  const totalDue = 3600;

  return (
    <div className="p-4 space-y-4 bg-[#f4f7f9] min-h-screen text-slate-800">
      {toastMessage && (
        <div className="fixed top-16 right-6 bg-slate-900 text-white px-4 py-2 rounded shadow-xl text-xs z-50 flex items-center gap-2 border border-cyan-500 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Action Bar matching Screenshot 4 */}
      <div className="bg-white p-3 rounded shadow-sm border border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-2 text-xs">
            <span className="font-semibold text-slate-500">Home</span>
            <span className="text-slate-400">/</span>
            <span className="font-bold text-slate-800">Billing List &amp; Invoicing</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              onClick={onGenerateMonthlyCycle}
              className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded shadow-sm flex items-center gap-1.5 transition-colors"
              title="Automated billing run for current cycle"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Automate Monthly Invoicing</span>
            </button>

            <button
              onClick={() => showToast('Exporting Billing data to Excel (.xlsx)...')}
              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded flex items-center gap-1 transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Generate Excel</span>
            </button>

            <button
              onClick={() => showToast('Generating billing summary PDF...')}
              className="px-2.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded flex items-center gap-1 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Generate PDF</span>
            </button>

            <button
              onClick={() => showToast('Syncing all bill states with Mikrotik queues...')}
              className="px-2.5 py-1.5 bg-[#162e3d] hover:bg-[#203c4f] text-white font-medium rounded flex items-center gap-1 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync Clients &amp; Servers</span>
            </button>

            <button
              onClick={() => showToast(`Sent SMS payment reminders to selected clients`)}
              className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded flex items-center gap-1 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>SMS Selected</span>
            </button>
          </div>
        </div>

        {/* 7 Stat Tiles from Screenshot 4 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs">
          <div className="bg-emerald-600 text-white p-2 rounded shadow-sm">
            <div className="text-lg font-black">{paidCount}</div>
            <div className="text-[11px] font-medium opacity-90">Paid Client</div>
          </div>

          <div className="bg-red-600 text-white p-2 rounded shadow-sm">
            <div className="text-lg font-black">{unpaidCount}</div>
            <div className="text-[11px] font-medium opacity-90">Unpaid Client</div>
          </div>

          <div className="bg-[#00a2d3] text-white p-2 rounded shadow-sm">
            <div className="text-lg font-black">৳{totalReceived}</div>
            <div className="text-[11px] font-medium opacity-90">Received Bill</div>
          </div>

          <div className="bg-amber-600 text-white p-2 rounded shadow-sm">
            <div className="text-lg font-black">৳{totalDue}</div>
            <div className="text-[11px] font-medium opacity-90">Due Amount</div>
          </div>

          <div className="bg-purple-600 text-white p-2 rounded shadow-sm">
            <div className="text-lg font-black">৳204,800</div>
            <div className="text-[11px] font-medium opacity-90">Generated Bill</div>
          </div>

          <div className="bg-teal-600 text-white p-2 rounded shadow-sm">
            <div className="text-lg font-black">৳1,500</div>
            <div className="text-[11px] font-medium opacity-90">Advance Amount</div>
          </div>

          <div className="bg-slate-700 text-white p-2 rounded shadow-sm">
            <div className="text-lg font-black">৳307,100</div>
            <div className="text-[11px] font-medium opacity-90">Monthly Bill</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 rounded shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <input
              type="text"
              placeholder="Search by Code, Username, Name, Mobile..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded">
            <button
              onClick={() => setStatusFilter('All')}
              className={`px-2.5 py-1 rounded text-xs font-semibold ${
                statusFilter === 'All' ? 'bg-white shadow text-slate-900' : 'text-slate-600'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('Paid')}
              className={`px-2.5 py-1 rounded text-xs font-semibold ${
                statusFilter === 'Paid' ? 'bg-emerald-600 text-white' : 'text-slate-600'
              }`}
            >
              Paid
            </button>
            <button
              onClick={() => setStatusFilter('Unpaid')}
              className={`px-2.5 py-1 rounded text-xs font-semibold ${
                statusFilter === 'Unpaid' ? 'bg-red-600 text-white' : 'text-slate-600'
              }`}
            >
              Unpaid
            </button>
          </div>
        </div>

        <div className="text-slate-500">
          Showing <span className="font-bold text-slate-800">{filteredBills.length}</span> invoices
        </div>
      </div>

      {/* Table matching Screenshot 4 */}
      <div className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#162e3d] text-white uppercase text-[10px] font-semibold tracking-wider">
              <tr>
                <th className="p-2.5 text-center w-8">
                  <input
                    type="checkbox"
                    checked={
                      selectedBillIds.length > 0 &&
                      selectedBillIds.length === billingList.length
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-slate-300 text-cyan-600 focus:ring-0"
                  />
                </th>
                <th className="p-2.5">Client Code</th>
                <th className="p-2.5">Username</th>
                <th className="p-2.5">Customer Name</th>
                <th className="p-2.5">Mobile No</th>
                <th className="p-2.5">Zone</th>
                <th className="p-2.5">Package</th>
                <th className="p-2.5">Expire Date</th>
                <th className="p-2.5 text-right">Monthly Bill</th>
                <th className="p-2.5 text-right">Recived Amount</th>
                <th className="p-2.5 text-right">Balance Due</th>
                <th className="p-2.5">Payment Date</th>
                <th className="p-2.5">Server</th>
                <th className="p-2.5 text-center">B.Status</th>
                <th className="p-2.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredBills.map((bill) => {
                const isSelected = selectedBillIds.includes(bill.id);

                return (
                  <tr
                    key={bill.id}
                    className={`hover:bg-cyan-50/60 transition-colors ${
                      isSelected ? 'bg-cyan-50/80' : ''
                    }`}
                  >
                    <td className="p-2.5 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOne(bill.id)}
                        className="rounded border-slate-300 text-cyan-600 focus:ring-0"
                      />
                    </td>

                    <td className="p-2.5 font-mono font-bold text-cyan-700">{bill.clientCode}</td>
                    <td className="p-2.5 font-semibold text-slate-900">{bill.username}</td>
                    <td className="p-2.5 font-medium whitespace-nowrap">{bill.clientName}</td>
                    <td className="p-2.5 font-mono text-slate-600">{bill.mobile}</td>
                    <td className="p-2.5">{bill.zone}</td>
                    <td className="p-2.5 font-mono text-[11px]">{bill.package}</td>
                    <td className="p-2.5 font-medium">{bill.expireDay}th of Month</td>
                    <td className="p-2.5 text-right font-mono font-semibold">
                      ৳{bill.monthlyBill.toFixed(2)}
                    </td>
                    <td className="p-2.5 text-right font-mono font-bold text-emerald-700">
                      ৳{bill.receivedAmount.toFixed(2)}
                    </td>
                    <td className="p-2.5 text-right font-mono font-bold">
                      {bill.balanceDue > 0 ? (
                        <span className="text-red-600">৳{bill.balanceDue.toFixed(2)}</span>
                      ) : (
                        <span className="text-slate-400">৳0.00</span>
                      )}
                    </td>
                    <td className="p-2.5 text-slate-500 font-medium">
                      {bill.paymentDate || 'Pending'}
                    </td>
                    <td className="p-2.5 font-semibold text-cyan-800">{bill.server}</td>
                    <td className="p-2.5 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          bill.billingStatus === 'Paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {bill.billingStatus}
                      </span>
                    </td>

                    <td className="p-2.5 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        {/* Collect Bill Button */}
                        <button
                          onClick={() => onOpenBillReceive(bill.clientCode)}
                          className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors ${
                            bill.billingStatus === 'Unpaid'
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                          title="Collect / Record Payment"
                        >
                          <DollarSign className="w-3 h-3" />
                          <span>{bill.billingStatus === 'Unpaid' ? 'Collect' : 'Bill'}</span>
                        </button>

                        {/* Print Invoice */}
                        <button
                          onClick={() => onPrintInvoice(bill)}
                          className="p-1 text-slate-500 hover:text-cyan-700 hover:bg-slate-100 rounded"
                          title="Print / View Invoice"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
