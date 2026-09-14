import React, { useState, useEffect } from 'react';
import { X, DollarSign, Printer, Check, Smartphone, Calendar, FileText } from 'lucide-react';
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
  if (!isOpen || !client) return null;

  const [receivedDate, setReceivedDate] = useState('14 Sep 2026');
  const [receivedBy, setReceivedBy] = useState('bbnasad (Admin)');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'bKash' | 'Nagad' | 'Rocket' | 'Bank'>('Cash');
  const [billMonth, setBillMonth] = useState('September 2026');
  const [monthlyBill] = useState(client.monthlyBill);
  const [dueAmount, setDueAmount] = useState(client.balanceDue);
  const [discount, setDiscount] = useState<number>(0);
  const [receivedAmount, setReceivedAmount] = useState<number>(client.monthlyBill + client.balanceDue);
  const [applyVat, setApplyVat] = useState(false);
  const [receiptNo, setReceiptNo] = useState(`REC-${Date.now().toString().slice(-6)}`);
  const [remarks, setRemarks] = useState('Counter monthly bill payment received');
  const [setNextBillingDate, setSetNextBillingDate] = useState(true);
  const [sendSms, setSendSms] = useState(true);

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
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-fade-in my-8">
        {/* Modal Header matching Screenshot 20 */}
        <div className="bg-[#162e3d] text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm">Bill Receive: {client.name} ({client.code})</h3>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
          {/* Row 1: Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-600 font-medium mb-1">Received Date</label>
              <input
                type="text"
                value={receivedDate}
                onChange={(e) => setReceivedDate(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-cyan-500 text-slate-800"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Username / IP</label>
              <input
                type="text"
                disabled
                value={client.username}
                className="w-full px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded font-semibold text-slate-700"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Client Code</label>
              <input
                type="text"
                disabled
                value={client.code}
                className="w-full px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded font-mono font-bold text-cyan-800"
              />
            </div>
          </div>

          {/* Row 2: Customer Contacts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-600 font-medium mb-1">Mobile No</label>
              <input
                type="text"
                value={client.mobile}
                disabled
                className="w-full px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded font-mono text-slate-700"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Package</label>
              <input
                type="text"
                value={client.packageName}
                disabled
                className="w-full px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded font-semibold text-slate-700"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Receive From</label>
              <input
                type="text"
                defaultValue="Client"
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-800"
              />
            </div>
          </div>

          {/* Row 3: Method & Channel */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-600 font-medium mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-medium text-slate-800 focus:ring-1 focus:ring-cyan-500"
              >
                <option value="Cash">Cash (Office Counter)</option>
                <option value="bKash">bKash Merchant</option>
                <option value="Nagad">Nagad Direct</option>
                <option value="Rocket">DBBL Rocket</option>
                <option value="Bank">Bank Deposit / Transfer</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Received By</label>
              <select
                value={receivedBy}
                onChange={(e) => setReceivedBy(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-800 focus:ring-1 focus:ring-cyan-500"
              >
                <option value="bbnasad (Admin)">bbnasad (Admin)</option>
                <option value="bKash PGW">bKash Automated Gateway</option>
                <option value="Field Tech - Sobuj">Field Tech - Sobuj</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Bill Month</label>
              <input
                type="text"
                value={billMonth}
                onChange={(e) => setBillMonth(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-800"
              />
            </div>
          </div>

          {/* Financial Calculation Box matching Screenshot 20 */}
          <div className="bg-slate-50 p-3.5 rounded border border-slate-200 space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-500 text-[11px] mb-0.5">Monthly Bill</label>
                <div className="font-mono font-bold text-slate-800 text-sm">৳{monthlyBill.toFixed(2)}</div>
              </div>
              <div>
                <label className="block text-slate-500 text-[11px] mb-0.5">Existing Due</label>
                <div className="font-mono font-bold text-red-600 text-sm">৳{dueAmount.toFixed(2)}</div>
              </div>
              <div>
                <label className="block text-slate-500 text-[11px] mb-0.5">Discount (৳)</label>
                <input
                  type="number"
                  min="0"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-full px-2 py-1 border border-slate-300 rounded font-mono text-xs text-slate-800 bg-white"
                />
              </div>
              <div>
                <label className="block text-slate-500 text-[11px] mb-0.5">Payable Amount</label>
                <div className="font-mono font-bold text-cyan-800 text-sm">৳{payableAmount.toFixed(2)}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Received Amount (৳) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={receivedAmount}
                  onChange={(e) => setReceivedAmount(Number(e.target.value))}
                  className="w-full px-3 py-1.5 border border-cyan-500 rounded font-mono font-bold text-sm text-slate-900 bg-white shadow-sm"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Receipt / Trx No.</label>
                <input
                  type="text"
                  value={receiptNo}
                  onChange={(e) => setReceiptNo(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono text-slate-800 bg-white"
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
                className="rounded border-slate-300 text-cyan-600 focus:ring-0"
              />
              <label htmlFor="vatCheck" className="text-slate-700 font-medium cursor-pointer">
                Apply VAT on Received Amount (5% = ৳{vatAmount})
              </label>
            </div>

            {/* Summary Highlights */}
            <div className="bg-white p-2.5 rounded border border-slate-200 flex flex-wrap items-center justify-between text-xs">
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
            <label className="block text-slate-600 font-medium mb-1">Remarks / Transaction Note</label>
            <textarea
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-slate-800"
            />
          </div>

          {/* Checkboxes matching Screenshot 20 */}
          <div className="space-y-1.5 pt-1">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={setNextBillingDate}
                onChange={(e) => setSetNextBillingDate(e.target.checked)}
                className="rounded border-slate-300 text-cyan-600 focus:ring-0"
              />
              <span className="text-slate-700">Set Next Billing Date to {client.expireDate} October 2026</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={sendSms}
                onChange={(e) => setSendSms(e.target.checked)}
                className="rounded border-slate-300 text-cyan-600 focus:ring-0"
              />
              <span className="text-slate-700 font-medium">
                Send Instant SMS Money Receipt to client mobile ({client.mobile})
              </span>
            </label>
          </div>
        </div>

        {/* Modal Footer matching Screenshot 20 */}
        <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex flex-wrap items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded hover:bg-slate-100 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => handleSave(false)}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Check className="w-4 h-4" />
            <span>Receive Bill</span>
          </button>
          <button
            onClick={() => handleSave(true)}
            className="px-4 py-1.5 bg-[#00a2d3] hover:bg-[#008cb6] text-white font-bold rounded shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Receive &amp; Print</span>
          </button>
        </div>
      </div>
    </div>
  );
};
