import React, { useState, useEffect } from 'react';
import { X, DollarSign, Printer, Check, Smartphone, Calendar, FileText, CheckCircle2 } from 'lucide-react';
import { Client, PaymentReceipt } from '../types';

interface BillReceiveModalProps {
  isOpen: boolean;
  client: Client | null;
  onClose: () => void;
  onConfirmPayment: (receipt: PaymentReceipt) => void;
}

export const BillReceiveModal: React.FC<BillReceiveModalProps> = ({
  isOpen,
  client,
  onClose,
  onConfirmPayment
}) => {
  const [receivedDate, setReceivedDate] = useState('14 Sep 2026');
  const [receivedBy, setReceivedBy] = useState('bbnasad (Admin)');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'bKash' | 'Nagad' | 'Rocket' | 'Bank'>('Cash');
  const [billMonth, setBillMonth] = useState('September 2026');
  const [monthlyBill] = useState(client?.monthlyBill || 500);
  const [dueAmount, setDueAmount] = useState(client?.balanceDue || 0);
  const [discount, setDiscount] = useState<number>(0);
  const [receivedAmount, setReceivedAmount] = useState<number>((client?.monthlyBill || 500) + (client?.balanceDue || 0));
  const [applyVat, setApplyVat] = useState(false);
  const [receiptNo, setReceiptNo] = useState(`REC-${Date.now().toString().slice(-6)}`);
  const [remarks, setRemarks] = useState('Counter monthly bill payment received');
  const [setNextBillingDate, setSetNextBillingDate] = useState(true);
  const [sendSms, setSendSms] = useState(true);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !client) return null;

  // Recalculate VAT and total
  const vatRate = applyVat ? 0.05 : 0;
  const vatAmount = Math.round(receivedAmount * vatRate);
  const totalReceivedAmount = receivedAmount + vatAmount;
  const payableAmount = monthlyBill + dueAmount - discount;
  const newBalanceDue = Math.max(0, payableAmount - receivedAmount);

  const handleSave = (shouldPrint: boolean = false) => {
    const newReceipt: PaymentReceipt = {
      id: `rc-${Date.now()}`,
      clientCode: client.code,
      receivedDate,
      receivedBy,
      paymentMethod,
      paymentInfo: `Payment by ${paymentMethod} (${receiptNo})`,
      createdBy: 'bbnasad',
      remarks,
      discount,
      receivedBill: receivedAmount,
      totalBill: totalReceivedAmount,
      vat: vatAmount,
      balanceDue: newBalanceDue,
      receiptNo,
      month: billMonth
    };

    onConfirmPayment(newReceipt);
    if (shouldPrint) {
      setTimeout(() => window.print(), 200);
    }
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="bill-receive-title"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-6">
        {/* Modal Header */}
        <div className="bg-[#162e3d] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <h3 id="bill-receive-title" className="font-bold text-sm leading-tight">
                Bill Collection: {client.name}
              </h3>
              <p className="text-[11px] text-slate-300 font-normal">
                Code: {client.code} | PPPoE: {client.username} | Package: {client.packageName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
          {/* Row 1: Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="received-date-input" className="block text-slate-600 font-semibold mb-1">
                Received Date
              </label>
              <input
                id="received-date-input"
                type="text"
                value={receivedDate}
                onChange={(e) => setReceivedDate(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 text-slate-800"
              />
            </div>
            <div>
              <label htmlFor="client-username-disp" className="block text-slate-600 font-semibold mb-1">
                Username / IP
              </label>
              <input
                id="client-username-disp"
                type="text"
                disabled
                value={client.username}
                className="w-full px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg font-semibold text-slate-700"
              />
            </div>
            <div>
              <label htmlFor="client-code-disp" className="block text-slate-600 font-semibold mb-1">
                Client Code
              </label>
              <input
                id="client-code-disp"
                type="text"
                disabled
                value={client.code}
                className="w-full px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg font-mono font-bold text-cyan-800"
              />
            </div>
          </div>

          {/* Row 2: Customer Contacts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="client-mobile-disp" className="block text-slate-600 font-semibold mb-1">
                Mobile No
              </label>
              <input
                id="client-mobile-disp"
                type="text"
                value={client.mobile}
                disabled
                className="w-full px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg font-mono text-slate-700"
              />
            </div>
            <div>
              <label htmlFor="client-zone-disp" className="block text-slate-600 font-semibold mb-1">
                Zone / Area
              </label>
              <input
                id="client-zone-disp"
                type="text"
                value={`${client.zone || 'Jamtola'} - ${client.subzone || 'Bot Tola'}`}
                disabled
                className="w-full px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-700"
              />
            </div>
            <div>
              <label htmlFor="client-status-disp" className="block text-slate-600 font-semibold mb-1">
                Current Status
              </label>
              <input
                id="client-status-disp"
                type="text"
                value={`${client.billingStatus} (${client.mikrotikStatus ? 'Online' : 'Disabled'})`}
                disabled
                className="w-full px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg font-semibold text-emerald-700"
              />
            </div>
          </div>

          {/* Row 3: Payment Method & Collector */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="payment-method-select" className="block text-slate-600 font-semibold mb-1">
                Payment Method
              </label>
              <select
                id="payment-method-select"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-cyan-500 bg-white"
              >
                <option value="Cash">Cash Counter</option>
                <option value="bKash">bKash Merchant</option>
                <option value="Nagad">Nagad Direct</option>
                <option value="Rocket">DBBL Rocket</option>
                <option value="Bank">Bank Deposit / Transfer</option>
              </select>
            </div>
            <div>
              <label htmlFor="received-by-select" className="block text-slate-600 font-semibold mb-1">
                Received By
              </label>
              <select
                id="received-by-select"
                value={receivedBy}
                onChange={(e) => setReceivedBy(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-cyan-500 bg-white"
              >
                <option value="bbnasad (Admin)">bbnasad (Admin)</option>
                <option value="bKash PGW">bKash Automated Gateway</option>
                <option value="Field Tech - Sobuj">Field Tech - Sobuj</option>
              </select>
            </div>
            <div>
              <label htmlFor="bill-month-input" className="block text-slate-600 font-semibold mb-1">
                Bill Month
              </label>
              <input
                id="bill-month-input"
                type="text"
                value={billMonth}
                onChange={(e) => setBillMonth(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-800"
              />
            </div>
          </div>

          {/* Financial Calculation Box */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 shadow-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <span className="block text-slate-500 text-[11px] mb-0.5">Monthly Bill</span>
                <div className="font-mono font-bold text-slate-900 text-sm">৳{monthlyBill.toFixed(2)}</div>
              </div>
              <div>
                <span className="block text-slate-500 text-[11px] mb-0.5">Existing Due</span>
                <div className="font-mono font-bold text-rose-600 text-sm">৳{dueAmount.toFixed(2)}</div>
              </div>
              <div>
                <label htmlFor="discount-input" className="block text-slate-500 text-[11px] mb-0.5">
                  Discount (৳)
                </label>
                <input
                  id="discount-input"
                  type="number"
                  min="0"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-full px-2.5 py-1 border border-slate-300 rounded-md font-mono text-xs text-slate-800 bg-white"
                />
              </div>
              <div>
                <span className="block text-slate-500 text-[11px] mb-0.5">Payable Amount</span>
                <div className="font-mono font-bold text-cyan-800 text-sm">৳{payableAmount.toFixed(2)}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2.5 border-t border-slate-200">
              <div>
                <label htmlFor="received-amount-input" className="block text-slate-700 font-semibold mb-1">
                  Received Amount (৳) <span className="text-rose-500">*</span>
                </label>
                <input
                  id="received-amount-input"
                  type="number"
                  min="0"
                  value={receivedAmount}
                  onChange={(e) => setReceivedAmount(Number(e.target.value))}
                  className="w-full px-3 py-1.5 border border-cyan-500 rounded-lg font-mono font-bold text-sm text-slate-900 bg-white shadow-xs focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label htmlFor="receipt-no-input" className="block text-slate-700 font-semibold mb-1">
                  Receipt / Trx No.
                </label>
                <input
                  id="receipt-no-input"
                  type="text"
                  value={receiptNo}
                  onChange={(e) => setReceiptNo(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono text-slate-800 bg-white"
                />
              </div>
            </div>

            {/* VAT Checkbox */}
            <div className="flex items-center space-x-2 pt-1">
              <input
                type="checkbox"
                id="vatCheck"
                checked={applyVat}
                onChange={(e) => setApplyVat(e.target.checked)}
                className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
              />
              <label htmlFor="vatCheck" className="text-slate-700 font-medium cursor-pointer">
                Apply VAT on Received Amount (5% = ৳{vatAmount})
              </label>
            </div>

            {/* Summary Highlights */}
            <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-wrap items-center justify-between text-xs">
              <div>
                <span className="text-slate-500">Total Received: </span>
                <span className="font-mono font-bold text-emerald-700 text-sm">৳{totalReceivedAmount.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-slate-500">Remaining Due: </span>
                <span className="font-mono font-bold text-slate-800">৳{newBalanceDue.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label htmlFor="remarks-input" className="block text-slate-600 font-semibold mb-1">
              Remarks / Transaction Note
            </label>
            <input
              id="remarks-input"
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-800"
            />
          </div>

          {/* Post Actions */}
          <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={setNextBillingDate}
                onChange={(e) => setSetNextBillingDate(e.target.checked)}
                className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
              />
              <span className="text-slate-700 font-medium">
                Update next expiration cycle to next month (29 Oct 2026)
              </span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={sendSms}
                onChange={(e) => setSendSms(e.target.checked)}
                className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
              />
              <span className="text-slate-700 font-medium">
                Send automatic SMS payment confirmation receipt to customer
              </span>
            </label>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-200 font-medium transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => handleSave(true)}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-semibold flex items-center space-x-1.5 transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Save &amp; Print</span>
            </button>

            <button
              type="button"
              onClick={() => handleSave(false)}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center space-x-1.5 transition-colors shadow-xs"
            >
              <Check className="w-4 h-4" />
              <span>Confirm &amp; Receive</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
