import React, { useState } from 'react';
import {
  FileSpreadsheet,
  FileText,
  Search,
  DollarSign,
  Download,
  Mail,
  Printer,
  CheckCircle2,
  AlertCircle,
  Play,
  TrendingUp,
  Receipt
} from 'lucide-react';
import { BillRecord } from '../types';
import { PageHeader, StatusBadge, EmptyState, Toast, MetricCard } from './common';

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

  const paidCount = safeBillingList.filter((b) => b.billingStatus === 'Paid').length;
  const unpaidCount = safeBillingList.filter((b) => b.billingStatus === 'Unpaid').length;
  const totalReceived = safeBillingList.reduce((acc, b) => acc + (b.receivedAmount || 0), 0);
  const totalDue = safeBillingList.reduce((acc, b) => acc + (b.balanceDue || 0), 0);

  return (
    <div className="p-4 sm:p-5 space-y-4 bg-slate-50 min-h-[calc(100vh-3.5rem)] text-slate-800">
      {/* Toast Notification */}
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}

      {/* Unified Page Header */}
      <PageHeader
        title="Billing Records & Invoicing"
        subtitle="Manage monthly subscription invoices, track payment collections, and issue tax receipts"
        icon={Receipt}
        breadcrumbs={[
          { label: 'Home', onClick: () => {} },
          { label: 'Billing', onClick: () => {} },
          { label: 'Billing List' }
        ]}
        actions={
          <>
            <button
              onClick={() => showToast('Exporting Billing data to Excel (.xlsx)...')}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export Excel</span>
            </button>

            <button
              onClick={() => showToast('Generating billing summary PDF...')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Summary PDF</span>
            </button>

            <button
              onClick={onGenerateMonthlyCycle}
              className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg text-xs shadow-xs flex items-center gap-1.5 transition-colors focus:ring-2 focus:ring-cyan-500"
              title="Automated billing run for current cycle"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run Automated Billing</span>
            </button>
          </>
        }
      />

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard
          label="Paid Invoices"
          value={paidCount}
          subValue={`${Math.round((paidCount / (safeBillingList.length || 1)) * 100)}% collection rate`}
          icon={CheckCircle2}
          color="emerald"
        />

        <MetricCard
          label="Pending Unpaid"
          value={unpaidCount}
          subValue="Awaiting customer settlement"
          icon={AlertCircle}
          color="rose"
        />

        <MetricCard
          label="Total Collected"
          value={`৳${totalReceived.toLocaleString()}`}
          subValue="Current cycle revenue"
          icon={TrendingUp}
          color="cyan"
        />

        <MetricCard
          label="Outstanding Due"
          value={`৳${totalDue.toLocaleString()}`}
          subValue="Actionable collection target"
          icon={DollarSign}
          color="amber"
        />
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-3 rounded-xl shadow-xs border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <input
              type="text"
              placeholder="Search by Code, Username, Mobile, or Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:bg-white transition-colors"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>

          {/* Status Filter Buttons */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setStatusFilter('All')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                statusFilter === 'All'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('Paid')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                statusFilter === 'Paid'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Paid
            </button>
            <button
              onClick={() => setStatusFilter('Unpaid')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                statusFilter === 'Unpaid'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Unpaid
            </button>
          </div>

          {selectedBillIds.length > 0 && (
            <button
              onClick={() => showToast(`Triggered SMS payment reminders for ${selectedBillIds.length} subscribers`)}
              className="px-2.5 py-1 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 rounded-lg font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Remind Selected ({selectedBillIds.length})</span>
            </button>
          )}
        </div>

        <div className="text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-800">{filteredBills.length}</span> invoices
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        {filteredBills.length === 0 ? (
          <EmptyState
            title="No Invoices Found"
            description="No billing records match your search or status criteria. Try selecting 'All' or clearing keywords."
            action={{
              label: 'Reset Filters',
              onClick: () => {
                setSearchTerm('');
                setStatusFilter('All');
              }
            }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 border-collapse">
              <thead className="bg-[#162e3d] text-white uppercase text-[10px] font-semibold tracking-wider">
                <tr>
                  <th className="p-3 text-center w-8">
                    <input
                      type="checkbox"
                      checked={
                        selectedBillIds.length > 0 &&
                        selectedBillIds.length === filteredBills.length
                      }
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                    />
                  </th>
                  <th className="p-3">Client Code</th>
                  <th className="p-3">Username / PPPoE</th>
                  <th className="p-3">Customer Name</th>
                  <th className="p-3">Mobile No</th>
                  <th className="p-3">Zone</th>
                  <th className="p-3">Package</th>
                  <th className="p-3">Expire Day</th>
                  <th className="p-3 text-right">Monthly Bill</th>
                  <th className="p-3 text-right">Received</th>
                  <th className="p-3 text-right">Balance Due</th>
                  <th className="p-3">Payment Date</th>
                  <th className="p-3">Server</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBills.map((bill) => {
                  const isSelected = selectedBillIds.includes(bill.id);

                  return (
                    <tr
                      key={bill.id}
                      className={`hover:bg-cyan-50/50 transition-colors ${
                        isSelected ? 'bg-cyan-50/80' : ''
                      }`}
                    >
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOne(bill.id)}
                          className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                        />
                      </td>

                      <td className="p-3 font-mono font-bold text-cyan-800">{bill.clientCode}</td>
                      <td className="p-3 font-semibold text-slate-900">{bill.username}</td>
                      <td className="p-3 font-medium text-slate-900 whitespace-nowrap">{bill.clientName}</td>
                      <td className="p-3 font-mono text-slate-600">{bill.mobile}</td>
                      <td className="p-3">{bill.zone}</td>
                      <td className="p-3 font-mono text-[11px] text-slate-700">{bill.package}</td>
                      <td className="p-3 font-medium text-slate-600">{bill.expireDay}th of Month</td>
                      <td className="p-3 text-right font-mono font-semibold text-slate-800">
                        ৳{bill.monthlyBill.toFixed(2)}
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-emerald-700">
                        ৳{bill.receivedAmount.toFixed(2)}
                      </td>
                      <td className="p-3 text-right font-mono font-bold">
                        {bill.balanceDue > 0 ? (
                          <span className="text-rose-600">৳{bill.balanceDue.toFixed(2)}</span>
                        ) : (
                          <span className="text-slate-400">৳0.00</span>
                        )}
                      </td>
                      <td className="p-3 text-slate-500 font-medium">
                        {bill.paymentDate || 'Pending'}
                      </td>
                      <td className="p-3 font-semibold text-cyan-800">{bill.server}</td>
                      <td className="p-3 text-center">
                        <StatusBadge status={bill.billingStatus} type="billing" />
                      </td>

                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center space-x-1.5">
                          {/* Collect Bill Button */}
                          <button
                            onClick={() => onOpenBillReceive(bill.clientCode)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shadow-xs ${
                              bill.billingStatus === 'Unpaid'
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
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
                            className="p-1.5 text-slate-500 hover:text-cyan-700 hover:bg-cyan-50 rounded-lg transition-colors"
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
        )}

        {/* Footer info */}
        {filteredBills.length > 0 && (
          <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500">
            <div>
              Showing <span className="font-semibold text-slate-700">1</span> to{' '}
              <span className="font-semibold text-slate-700">{filteredBills.length}</span> of{' '}
              <span className="font-semibold text-slate-700">{filteredBills.length}</span> invoices
            </div>
            <div className="flex items-center space-x-1">
              <button
                disabled
                className="px-2.5 py-1 rounded-lg border border-slate-300 bg-white text-slate-400 cursor-not-allowed opacity-60"
              >
                Previous
              </button>
              <button className="px-2.5 py-1 rounded-lg bg-[#162e3d] text-white font-semibold shadow-xs">
                1
              </button>
              <button
                disabled
                className="px-2.5 py-1 rounded-lg border border-slate-300 bg-white text-slate-400 cursor-not-allowed opacity-60"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
