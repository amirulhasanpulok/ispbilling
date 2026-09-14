import React, { useEffect } from 'react';
import { X, Printer, Wifi, Download, CheckCircle2 } from 'lucide-react';
import { BillRecord, PaymentReceipt } from '../types';

interface PrintInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  bill?: BillRecord | null;
  receipt?: PaymentReceipt | null;
}

export const PrintInvoiceModal: React.FC<PrintInvoiceModalProps> = ({
  isOpen,
  onClose,
  bill,
  receipt
}) => {
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

  if (!isOpen || (!bill && !receipt)) return null;

  const invoiceNumber = receipt ? receipt.receiptNo : `INV-${bill?.clientCode}-${Date.now().toString().slice(-4)}`;
  const dateStr = receipt ? receipt.receivedDate : '14 Sep 2026';
  const clientName = bill ? bill.clientName : 'Younus Ali';
  const clientCode = bill ? bill.clientCode : receipt?.clientCode || '0006';
  const username = bill ? bill.username : 'haven';
  const amount = receipt ? receipt.receivedBill : bill?.monthlyBill || 500;
  const vat = receipt ? receipt.vat : (bill?.vatAmount || 25);
  const total = receipt ? receipt.totalBill : (bill ? bill.monthlyBill + bill.vatAmount : 525);
  const packageName = bill ? bill.package : '10Mbps Optical Fiber';
  const paymentMethod = receipt ? receipt.paymentMethod : 'bKash Merchant';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="invoice-title"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto print:p-0 print:bg-white"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-6 print:border-none print:shadow-none print:m-0 print:max-w-none">
        {/* Header toolbar */}
        <div className="bg-[#162e3d] text-white px-5 py-3.5 flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-600/30 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <h3 id="invoice-title" className="font-bold text-sm leading-tight">
                Official Billing Receipt / Invoice
              </h3>
              <p className="text-[11px] text-slate-300 font-normal">
                Receipt #{invoiceNumber} • Client: {clientName}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors focus:ring-2 focus:ring-cyan-500"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper */}
        <div id="printable-invoice" className="p-6 text-slate-800 text-xs bg-white space-y-5 print:p-4">
          {/* Top Brand & Invoice Title */}
          <div className="flex items-start justify-between border-b-2 border-[#162e3d] pb-4">
            <div>
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#162e3d] text-cyan-400 flex items-center justify-center font-bold">
                  <Wifi className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-base font-bold text-[#162e3d] tracking-tight">
                    Bhurungamari Broadband Network (BBN)
                  </h1>
                  <p className="text-slate-500 text-[11px]">
                    Govt. Approved ISP Licensee | High-Speed Fiber Optical Network
                  </p>
                </div>
              </div>
              <p className="text-slate-500 text-[11px] mt-1.5">
                Upazila Road, Bhurungamari, Kurigram | Helpline: 01710-287818
              </p>
            </div>

            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-800 font-bold rounded-full text-xs tracking-wider border border-emerald-200">
                MONEY RECEIPT
              </span>
              <div className="text-xs font-mono font-bold text-slate-800 mt-1.5">
                #{invoiceNumber}
              </div>
              <div className="text-[11px] text-slate-500">Date: {dateStr}</div>
            </div>
          </div>

          {/* Customer & Billing Metadata */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Bill To Customer</span>
              <div className="font-bold text-sm text-slate-900 mt-0.5">{clientName}</div>
              <div className="text-slate-600 mt-1">Client Code: <span className="font-mono font-bold text-[#162e3d]">{clientCode}</span></div>
              <div className="text-slate-600">Username/IP: <span className="font-mono">{username}</span></div>
              <div className="text-slate-600">Mobile: 01710287818</div>
            </div>

            <div className="text-right space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Payment Details</span>
              <div className="text-slate-700 mt-0.5">Method: <span className="font-bold text-slate-900">{paymentMethod}</span></div>
              <div className="text-slate-700">Billing Cycle: <span className="font-bold">September 2026</span></div>
              <div className="text-slate-700">Package: <span className="font-medium text-cyan-700">{packageName}</span></div>
              <div className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px] mt-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Payment Confirmed</span>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#162e3d] text-white">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">SL</th>
                  <th className="py-2.5 px-3 font-semibold">Description</th>
                  <th className="py-2.5 px-3 font-semibold">Period</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Amount (৳)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-mono">01</td>
                  <td className="py-2.5 px-3 font-medium text-slate-900">
                    Broadband Internet Subscription Fee ({packageName})
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">01 Sep - 30 Sep 2026</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">৳{amount.toFixed(2)}</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-mono">02</td>
                  <td className="py-2.5 px-3 text-slate-600">Govt. Value Added Tax (VAT 5%)</td>
                  <td className="py-2.5 px-3 text-slate-600">September 2026</td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-700">৳{vat.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals Calculation */}
          <div className="flex justify-end">
            <div className="w-64 space-y-1.5 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono font-medium">৳{amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>VAT (5%):</span>
                <span className="font-mono font-medium">৳{vat.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-[#162e3d] pt-1.5 border-t border-slate-200">
                <span>Net Total Paid:</span>
                <span className="font-mono text-emerald-700">৳{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer note & Signatures */}
          <div className="pt-6 border-t border-dashed border-slate-300">
            <div className="flex justify-between items-end text-slate-500 text-[11px]">
              <div>
                <p className="font-semibold text-slate-700">Thank you for choosing BBN!</p>
                <p>Support Helpline: +880 1710-287818 | Email: support@bbn.net</p>
                <p className="text-[10px] text-slate-400 mt-1">This is a system-generated computer receipt.</p>
              </div>

              <div className="text-center space-y-1">
                <div className="font-signature font-script text-slate-700 italic border-b border-slate-400 pb-1 px-4">
                  bbnasad (Admin)
                </div>
                <div className="text-[10px] uppercase font-bold text-slate-500">Authorized Signature</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions for screen */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end space-x-2.5 print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-1.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-200 font-medium transition-colors"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-1.5 bg-[#162e3d] hover:bg-[#203c4f] text-white rounded-lg font-semibold flex items-center space-x-1.5 transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Copy</span>
          </button>
        </div>
      </div>
    </div>
  );
};
